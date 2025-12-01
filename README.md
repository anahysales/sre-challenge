# SRE Challenge - Observabilidade Completa

## 📋 Visão Geral

Stack completa de observabilidade para serviço de pagamentos com:
- **Métricas**: Prometheus + OpenTelemetry
- **Traces**: Jaeger + OpenTelemetry
- **Logs**: Grafana Loki (correlacionados com traces)
- **Visualização**: Grafana com dashboards

## 🚀 Quick Start

```bash
# 1. Iniciar stack
make up

# 2. Aguardar 30 segundos

# 3. Verificar status
make status

# 4. Gerar tráfego
make quick-load

# 5. Acessar Grafana
open http://localhost:3001
```

**Login Grafana:** admin / admin123

## 🌐 Serviços

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Aplicação | http://localhost:3000 | API REST de pagamentos |
| Grafana | http://localhost:3001 | Dashboards e visualização |
| Prometheus | http://localhost:9090 | Métricas |
| Jaeger | http://localhost:16686 | Traces distribuídos |

## 📊 Dashboards

1. **Service Health Overview** - Métricas RED, latência, recursos
2. **Payment Journey** - Métricas de negócio
3. **Logs & Traces** - Correlação visual

## 🔧 Comandos

```bash
make up          # Iniciar stack
make down        # Parar stack
make logs        # Ver logs
make status      # Verificar status
make test        # Testar API
make load-test   # Teste de carga (5 min)
make quick-load  # Teste rápido (1 min)
make help        # Ver todos os comandos
```

## 📖 Documentação

- `QUICKSTART.md` - Guia de 5 minutos
- `EXECUTIVE_SUMMARY.md` - Resumo executivo
- `CHEATSHEET.md` - Comandos úteis
- `docs/ARCHITECTURE.md` - Arquitetura detalhada
- `docs/SLO_DEFINITIONS.md` - SLOs e error budgets

## 🎯 Highlights

- ✅ Instrumentação OpenTelemetry completa
- ✅ Correlação automática logs ↔ traces
- ✅ Dashboards em tempo real
- ✅ SLOs definidos (99.9% availability)
- ✅ Scripts de automação
- ✅ Production-ready

## 📞 Contato

Projeto criado para SRE Challenge - Hous3 Digital
