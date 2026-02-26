# API Gateway

Welcome to the API Gateway documentation!

## Overview

The API Gateway is the central entry point for all API requests in the platform. It provides:

- **Request Routing** - Routes requests to appropriate backend services
- **Rate Limiting** - Protects backend services from overload
- **Authentication** - Validates JWT tokens and API keys
- **Load Balancing** - Distributes traffic across service instances

## Quick Start

```bash
# Clone the repository
git clone https://github.com/onebhoomi/api-gateway.git

# Install dependencies
npm install

# Start the gateway
npm run start
```

## Key Features

| Feature | Description |
|---------|-------------|
| Rate Limiting | Configurable per-endpoint limits |
| Circuit Breaker | Automatic failure detection |
| Request Logging | Structured JSON logging |
| Health Checks | Kubernetes-ready probes |

## Related Services

- [User Service](../user-service/) - Handles authentication
- [Payment Service](../payment-service/) - Processes transactions
- [Notification Service](../notification-service/) - Sends alerts
