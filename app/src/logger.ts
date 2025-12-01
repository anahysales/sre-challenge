import winston from 'winston';
import { trace, context } from '@opentelemetry/api';

const traceFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanContext = span.spanContext();
    info.trace_id = spanContext.traceId;
    info.span_id = spanContext.spanId;
  }
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    traceFormat(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
