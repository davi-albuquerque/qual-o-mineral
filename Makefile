# One-word commands so Davi never has to remember details.
.PHONY: help install dev build extract validate parity test typecheck lint deploy clean

help:
	@echo "make install    — install all deps (Node + Python)"
	@echo "make dev        — run Next.js dev server (http://localhost:3000)"
	@echo "make build      — production build"
	@echo "make extract    — run pipeline: .xlsm + .XLS → JSON in data/"
	@echo "make validate   — run all schema + integrity checks"
	@echo "make parity     — run filter parity tests against recorded .xlsm baselines"
	@echo "make test       — run all tests"
	@echo "make typecheck  — TypeScript check"
	@echo "make lint       — ESLint"
	@echo "make deploy     — push to main (triggers Vercel)"
	@echo "make clean      — remove .next/ and generated data"

install:
	npm install
	pip3 install -r scripts/requirements.txt

dev:
	npx next dev

build:
	npx next build

extract:
	python3 scripts/extract_xlsm.py
	python3 scripts/extract_xls.py
	python3 scripts/reconcile.py

validate:
	python3 scripts/validate.py

parity:
	npm test -- parity

test:
	npm test

typecheck:
	npx tsc --noEmit

lint:
	npx next lint

deploy:
	git push origin main

clean:
	rm -rf .next/ node_modules/.cache
