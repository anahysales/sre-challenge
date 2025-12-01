.PHONY: help up down restart logs status test load-test clean

help:
	@echo "SRE Challenge - Payment Service"
	@echo "================================"
	@echo ""
	@echo "Comandos disponíveis:"
	@echo "  up          - Inicia toda a stack"
	@echo "  down        - Para toda a stack"
	@echo "  restart     - Reinicia toda a stack"
	@echo "  logs        - Mostra logs de todos os serviços"
	@echo "  status      - Verifica status dos serviços"
	@echo "  test        - Executa testes básicos da API"
	@echo "  load-test   - Executa teste de carga (5 minutos)"
	@echo "  quick-load  - Teste de carga rápido (1 minuto)"
	@echo "  clean       - Remove volumes e para a stack"

up:
	@echo "🚀 Iniciando stack..."
	docker-compose up -d
	@echo "✅ Stack iniciada!"
	@echo ""
	@echo "Aguarde ~30 segundos para todos os serviços iniciarem"
	@echo ""
	@echo "Acesse:"
	@echo "  • Grafana:    http://localhost:3001 (admin/admin123)"
	@echo "  • Prometheus: http://localhost:9090"
	@echo "  • Jaeger:     http://localhost:16686"

down:
	@echo "🛑 Parando stack..."
	docker-compose down

restart: down up

logs:
	docker-compose logs -f

status:
	@docker-compose ps

test:
	@echo "🧪 Testando API..."
	@curl -s http://localhost:3000/health | jq '.'

quick-load:
	@echo "⚡ Teste de carga rápido (1 minuto)..."
	@for i in {1..60}; do \
		curl -s -X POST http://localhost:3000/api/payments \
			-H "Content-Type: application/json" \
			-d "{\"amount\": $$((RANDOM % 1000)), \"currency\": \"BRL\", \"customer_id\": \"load-$$i\"}" > /dev/null; \
		sleep 1; \
	done
	@echo "✅ Teste concluído!"

load-test:
	@bash scripts/load-test.sh

clean:
	@echo "🧹 Limpando ambiente..."
	docker-compose down -v
	@echo "✅ Ambiente limpo!"
