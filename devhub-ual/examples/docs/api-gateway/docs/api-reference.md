# API Reference

## Endpoints

### Health Check

```http
GET /health
```

Returns the health status of the gateway.

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 86400
}
```

### Metrics

```http
GET /metrics
```

Returns Prometheus-compatible metrics.

## Rate Limits

| Tier | Requests/min | Burst |
|------|--------------|-------|
| Free | 60 | 10 |
| Pro | 600 | 100 |
| Enterprise | 6000 | 1000 |

## Error Codes

| Code | Description |
|------|-------------|
| 429 | Rate limit exceeded |
| 502 | Backend service unavailable |
| 503 | Circuit breaker open |
