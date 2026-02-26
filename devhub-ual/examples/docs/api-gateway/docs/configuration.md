# Configuration

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `LOG_LEVEL` | Logging level | `info` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms) | `60000` |

## Example Configuration

```yaml
server:
  port: 8080
  host: 0.0.0.0

rateLimit:
  enabled: true
  windowMs: 60000
  max: 100

circuitBreaker:
  enabled: true
  threshold: 5
  timeout: 30000

backends:
  userService:
    url: http://user-service:3000
    timeout: 5000
  paymentService:
    url: http://payment-service:3000
    timeout: 10000
```

## Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api-gateway
          image: onebhoomi/api-gateway:latest
          ports:
            - containerPort: 8080
          env:
            - name: PORT
              value: "8080"
```
