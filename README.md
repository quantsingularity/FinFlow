# FinFlow

![CI/CD Status](https://img.shields.io/github/actions/workflow/status/quantsingularity/FinFlow/cicd.yml?branch=main&label=CI%2FCD&logo=github)

## Financial Operations and Workflow Platform

FinFlow is a financial operations platform: 8 independent Node.js and TypeScript services (auth, payments, accounting, analytics, integration, multi-tenant, performance, and real-time analytics) sharing a Prisma/PostgreSQL data layer and a common Express-based server module, paired with a React web dashboard and a React Native mobile app. A separate set of 5 Python services (credit scoring, AI features, compliance, tax automation, and transaction processing) rounds out the platform.

<div align="center">
  <img src="docs/images/homepage.bmp" alt="FinFlow HomePage" width="100%">
</div>

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Feature Status](#feature-status)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation and Setup](#installation-and-setup)
- [Running the Stack](#running-the-stack)
- [API Surface](#api-surface)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

FinFlow demonstrates a financial operations workflow across a real, runnable set of services, with substantial test suites throughout. The Node.js side is a genuine npm-workspaces monorepo built on Express (a Fastify dependency is declared but never instantiated), with real multi-processor payment support (Stripe, PayPal, and Square each have their own client and a factory that selects between them). The API Gateway defined in Docker Compose points at a `services/api-gateway` directory that doesn't exist anywhere in this repository, so as currently wired that container can't be built from source.

## Project Structure

```
FinFlow/
├── code/
│   ├── backend/                          # Node.js/TypeScript monorepo (npm workspaces)
│   │   ├── common/                       # Shared Express app, Prisma client, Kafka client
│   │   ├── auth-service/                 # Authentication, MFA, OAuth
│   │   ├── payments-service/             # Stripe, PayPal, and Square processors
│   │   ├── accounting-service/           # Double-entry ledger, financial reports
│   │   ├── analytics-service/            # Metrics and dashboards
│   │   ├── integration-service/          # Third-party integrations (not in the default
│   │   │                                 # Docker Compose stack)
│   │   ├── multi-tenant-service/         # Multi-tenancy (not in the default stack)
│   │   ├── performance-service/          # Performance monitoring (not in the default stack)
│   │   ├── realtime-analytics-service/   # Streaming analytics; the one service that
│   │   │                                 # genuinely uses MongoDB alongside Postgres
│   │   └── prisma/                       # Prisma schema (PostgreSQL)
│   └── ml-services/                      # 5 independent Python services
│       ├── credit-engine/                # Credit scoring (trained on synthetic data)
│       ├── ai-features-service/
│       ├── compliance-service/
│       ├── tax_automation/
│       └── transaction-service/
├── web-frontend/                         # React (Vite) dashboard, TypeScript
├── mobile-frontend/                      # React Native (Expo) app, TypeScript
├── infrastructure/                       # Docker, Kubernetes, Terraform, Ansible, monitoring
├── scripts/                              # finflow-setup.sh, finflow-dev.sh, finflow-build.sh,
│                                         # finflow-test-runner.sh, and more
├── docs/                                 # Documentation (this directory)
└── README.md
```

## Feature Status

### Application tier (wired and tested)

| Component                                               | Details                                                                                                                                                                                           |
| :------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Auth service**                                        | Registration, login, and session management, with its own test suite.                                                                                                                             |
| **Payments service**                                    | Genuine multi-processor support: separate Stripe, PayPal, and Square client classes behind a factory that picks between them at request time.                                                     |
| **Accounting service**                                  | Double-entry ledger and financial reporting logic, with its own test suite.                                                                                                                       |
| **Analytics service**                                   | Metrics and dashboard data, with its own test suite.                                                                                                                                              |
| **Real-time analytics service**                         | Streaming analytics and anomaly detection; the one service in this codebase that genuinely reads and writes MongoDB, alongside the shared Postgres database.                                      |
| **Integration, multi-tenant, and performance services** | All three exist as real, tested TypeScript services, but none of them are included in the default Docker Compose stack.                                                                           |
| **Messaging**                                           | A real Kafka producer and consumer (kafkajs) in the shared `common` module, and Kafka itself runs as a container in Docker Compose.                                                               |
| **Credit engine**                                       | A Python/FastAPI service with a scikit-learn `RandomForestRegressor`, currently trained entirely on synthetic data generated by `sklearn.datasets.make_classification`, not real credit outcomes. |
| **Web dashboard**                                       | React and TypeScript app (Vite, Redux Toolkit, Tailwind CSS, shadcn/ui, Recharts).                                                                                                                |
| **Mobile app**                                          | React Native (Expo) and TypeScript app, with Redux Toolkit for state and React Native Paper for UI components.                                                                                    |

### Not currently buildable as wired

| Component       | Details                                                                                                                                                                                                               |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API Gateway** | Docker Compose points its build context at `services/api-gateway`, a directory that doesn't exist anywhere in this repository; only a Dockerfile and Kubernetes manifests exist for it, with no source to build from. |

## Technology Stack

| Area                 | Technology                                                                                                                       |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| Backend services     | Node.js 20, TypeScript, Express (a Fastify dependency is declared but unused)                                                    |
| ORM / data layer     | Prisma, PostgreSQL (one database per containerized service), MongoDB (real-time analytics service only), Redis (via Bull/BullMQ) |
| Messaging            | Kafka (kafkajs)                                                                                                                  |
| Payments             | Stripe, PayPal, and Square SDKs behind a processor factory                                                                       |
| Python / ML services | Python, FastAPI, scikit-learn                                                                                                    |
| Web frontend         | React 18, TypeScript, Vite, Redux Toolkit, Tailwind CSS, shadcn/ui, Recharts                                                     |
| Mobile frontend      | React Native, Expo, TypeScript, Redux Toolkit, React Native Paper                                                                |
| Infrastructure       | Docker, Docker Compose, Kubernetes, Terraform, Ansible                                                                           |
| Monitoring           | Prometheus, Grafana, Alertmanager                                                                                                |
| CI/CD                | GitHub Actions                                                                                                                   |
| Testing              | Jest (Node.js services, web, and mobile), pytest (Python services)                                                               |

## Architecture

```
Clients
  ├── web-frontend (React, TypeScript)     ── HTTP/JSON ──┐
  └── mobile-frontend (React Native)      ── HTTP/JSON ──┤
                                                         ▼
API Gateway (defined in Docker Compose; not buildable, no source in this repo)
                                                         ▼
Node.js services (Express, npm workspaces monorepo)
  auth-service · payments-service (Stripe/PayPal/Square) · accounting-service
  analytics-service · realtime-analytics-service (Postgres + MongoDB)
  integration-service · multi-tenant-service · performance-service
  (the last three aren't in the default Docker Compose stack)
  Shared: common (Express app, Prisma client, Kafka client)
  Data layer: PostgreSQL (per service), MongoDB, Redis, Kafka

Python services (FastAPI)
  credit-engine (scikit-learn, trained on synthetic data)
  ai-features-service · compliance-service · tax_automation · transaction-service
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detail.

## Installation and Setup

Prerequisites: Node.js 20+, Python 3.11+, and Docker.

```bash
git clone https://github.com/quantsingularity/FinFlow.git
cd FinFlow

# Node.js backend (installs all workspaces from the root manifest)
cd code/backend
npm install

# Python services (each has its own requirements.txt)
cd ../ml-services
for svc in */; do
  if [ -f "${svc}requirements.txt" ]; then
    pip install -r "${svc}requirements.txt"
  fi
done
cd ../..

# Web frontend
cd web-frontend && npm install && cd ..

# Mobile frontend
cd mobile-frontend && npm install && cd ..
```

For an automated setup:

```bash
git clone https://github.com/quantsingularity/FinFlow.git
cd FinFlow
./scripts/finflow-setup.sh
./scripts/finflow-dev.sh
```

Full, environment-specific instructions are in [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Running the Stack

```bash
# Auth, payments, accounting, and analytics services, their databases, Kafka,
# credit-engine, and the web frontend (from infrastructure/, Docker required;
# the api-gateway container will fail to build, since its source isn't in this repo)
cd infrastructure
docker compose up -d

# Or run a single Node.js service directly (from code/backend/<service-name>)
npm run start:dev

# A Python service (from its own directory under code/ml-services)
uvicorn src.main:app --reload --port 8005

# Web dashboard (from web-frontend)
npm run dev

# Mobile app (from mobile-frontend)
npm start
```

See [docs/USAGE.md](docs/USAGE.md) and [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## API Surface

Each Node.js service runs its own Express app; there is no unified gateway prefix currently working. Reach each service on its own port directly.

| Service                      | What it's for                                                     |
| :--------------------------- | :---------------------------------------------------------------- |
| auth-service                 | Registration, login, session management                           |
| payments-service             | Payment creation and processing across Stripe, PayPal, and Square |
| accounting-service           | Double-entry ledger, journal entries, financial reports           |
| analytics-service            | Metrics and dashboard data                                        |
| realtime-analytics-service   | Streaming analytics, anomaly detection                            |
| integration-service          | Third-party integrations                                          |
| multi-tenant-service         | Tenant management                                                 |
| performance-service          | Performance monitoring                                            |
| credit-engine (Python)       | Credit scoring                                                    |
| ai-features-service (Python) | AI-driven features                                                |
| compliance-service (Python)  | Compliance checks                                                 |
| tax_automation (Python)      | Tax calculation and reporting                                     |
| transaction-service (Python) | Transaction processing                                            |

Full request and response shapes are in [docs/API.md](docs/API.md).

## Testing

```bash
# All Node.js workspaces (from code/backend)
npm test

# A single Node.js service (from code/backend)
npm run test:auth
npm run test:payments
npm run test:accounting
# and so on, per the scripts in code/backend/package.json

# A Python service (from its own directory under code/ml-services)
pytest

# Web (from web-frontend)
npm test

# Mobile (from mobile-frontend)
npm test
```

Across the 8 Node.js services there are 15 test files (payments-service and accounting-service have the most, at 3 and 4 respectively). The 5 Python services have 9 test files between them, with transaction-service having the most at 4. The web dashboard has 6 test files; the mobile app has 12.

## CI/CD Pipeline

GitHub Actions (`.github/workflows/cicd.yml`) runs three jobs on push, pull request, and manual dispatch:

| Job                 | Depends on          | What it does                                                                                      |
| :------------------ | :------------------ | :------------------------------------------------------------------------------------------------ |
| Code Quality Checks | -                   | Formatter checks across the repository                                                            |
| Backend Tests       | Code Quality Checks | Runs `npm run test --workspaces` across all Node.js services with coverage and uploads the report |
| Web Build           | Code Quality Checks | Builds the web frontend and uploads the build artifact (no test step)                             |

There is currently no CI job for the Python services or the mobile app.

## Documentation

| Document                                           | Contents                               |
| :------------------------------------------------- | :------------------------------------- |
| [docs/README.md](docs/README.md)                   | Documentation index                    |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)       | System architecture                    |
| [docs/API.md](docs/API.md)                         | REST API reference                     |
| [docs/INSTALLATION.md](docs/INSTALLATION.md)       | Setup for all components               |
| [docs/CONFIGURATION.md](docs/CONFIGURATION.md)     | Environment variables and config       |
| [docs/USAGE.md](docs/USAGE.md)                     | Running and using the platform         |
| [docs/CLI.md](docs/CLI.md)                         | Helper scripts reference               |
| [docs/FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md)   | Feature status, implemented vs planned |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues and fixes                |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)       | Contribution guide                     |
| [docs/examples/](docs/examples/)                   | Worked examples                        |

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
