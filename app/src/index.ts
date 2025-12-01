import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { trace, SpanStatusCode, metrics } from '@opentelemetry/api';
import logger from './logger';
import { register } from 'prom-client';

const app = express();
const PORT = 3000;

app.use(express.json());

const tracer = trace.getTracer('payment-service');
const meter = metrics.getMeter('payment-service');

const paymentCounter = meter.createCounter('payment_operations_total');
const paymentDuration = meter.createHistogram('payment_processing_duration_seconds');

interface Payment {
  id: string;
  amount: number;
  currency: string;
  customer_id: string;
  status: string;
  created_at: string;
}

const payments = new Map<string, Payment>();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.post('/api/payments', (req, res) => {
  const span = tracer.startSpan('create_payment');
  
  try {
    const { amount, currency, customer_id } = req.body;
    
    const payment: Payment = {
      id: uuidv4(),
      amount,
      currency,
      customer_id,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    
    payments.set(payment.id, payment);
    paymentCounter.add(1, { operation: 'create' });
    
    logger.info('Payment created', { payment_id: payment.id });
    span.setStatus({ code: SpanStatusCode.OK });
    
    res.status(201).json(payment);
  } catch (error) {
    span.recordException(error as Error);
    logger.error('Error creating payment', { error });
    res.status(500).json({ error: 'Internal error' });
  } finally {
    span.end();
  }
});

app.get('/api/payments', (req, res) => {
  const allPayments = Array.from(payments.values());
  res.json({ payments: allPayments, total: allPayments.length });
});

app.get('/api/payments/:id', (req, res) => {
  const payment = payments.get(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(payment);
});

app.post('/api/payments/:id/process', async (req, res) => {
  const span = tracer.startSpan('process_payment');
  const start = Date.now();
  
  try {
    const payment = payments.get(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    payment.status = Math.random() > 0.1 ? 'completed' : 'failed';
    payments.set(payment.id, payment);
    
    const duration = (Date.now() - start) / 1000;
    paymentDuration.record(duration);
    paymentCounter.add(1, { operation: 'process', status: payment.status });
    
    logger.info('Payment processed', { payment_id: payment.id, status: payment.status });
    span.setStatus({ code: SpanStatusCode.OK });
    
    res.json(payment);
  } catch (error) {
    span.recordException(error as Error);
    logger.error('Error processing payment', { error });
    res.status(500).json({ error: 'Internal error' });
  } finally {
    span.end();
  }
});

app.listen(PORT, () => {
  logger.info('Payment service started', { port: PORT });
  console.log(`Server running on port ${PORT}`);
});
