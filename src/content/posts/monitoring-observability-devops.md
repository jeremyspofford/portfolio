---
title: "Monitoring and Observability in Modern DevOps Environments"
date: "2023-10-15"
description: "Master the three pillars of observability - metrics, logs, and traces - to build reliable, debuggable systems at scale."
tags: ["monitoring", "observability", "devops", "sre", "performance"]
---

## Monitoring vs. Observability

**Monitoring** tells you *when* something is wrong. **Observability** tells you *why* it's wrong.

Monitoring is about collecting known metrics (CPU, memory, request rate). Observability is about understanding system behavior from the outputs it produces, even for scenarios you didn't anticipate.

## The Three Pillars of Observability

### 1. Metrics: Aggregated Numbers

Metrics are numerical measurements aggregated over time. They're cheap to collect, store, and query.

**Example using Prometheus:**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'api-service'
    static_configs:
      - targets: ['localhost:8080']
```

**Instrument your code:**

```javascript
const prometheus = require('prom-client');
const register = new prometheus.Registry();

// Counter: Increments only
const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Histogram: Measures distributions
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Gauge: Goes up and down
const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register]
});

// Middleware to track requests
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    });

    end({
      method: req.method,
      route: req.route?.path || req.path
    });
  });

  next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

**Visualize with Grafana:**

```json
{
  "dashboard": {
    "title": "API Service Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "95th Percentile Latency",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      }
    ]
  }
}
```

### 2. Logs: Event Records

Logs are timestamped, immutable records of discrete events.

**Structured logging:**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log with context
logger.info('User login', {
  userId: user.id,
  email: user.email,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString(),
  traceId: req.headers['x-trace-id']
});

// Log errors with full context
try {
  await processPayment(order);
} catch (error) {
  logger.error('Payment processing failed', {
    error: error.message,
    stack: error.stack,
    orderId: order.id,
    amount: order.total,
    timestamp: new Date().toISOString(),
    traceId: req.headers['x-trace-id']
  });
  throw error;
}
```

**Aggregate with ELK Stack:**

```yaml
# Logstash pipeline
input {
  file {
    path => "/var/log/api-service/*.log"
    codec => json
  }
}

filter {
  if [level] == "error" {
    mutate {
      add_tag => ["error"]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "api-service-%{+YYYY.MM.dd}"
  }
}
```

### 3. Traces: Request Journeys

Distributed tracing tracks requests across multiple services.

**Using OpenTelemetry:**

```javascript
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

// Initialize tracer
const provider = new NodeTracerProvider();
const exporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces'
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

// Auto-instrument HTTP and Express
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation()
  ]
});

// Manual instrumentation
const tracer = provider.getTracer('api-service');

app.post('/orders', async (req, res) => {
  const span = tracer.startSpan('process_order');

  try {
    span.setAttribute('order.id', req.body.orderId);
    span.setAttribute('order.total', req.body.total);

    // Validate order
    const validateSpan = tracer.startSpan('validate_order', { parent: span });
    await validateOrder(req.body);
    validateSpan.end();

    // Process payment
    const paymentSpan = tracer.startSpan('process_payment', { parent: span });
    await processPayment(req.body);
    paymentSpan.end();

    // Update inventory
    const inventorySpan = tracer.startSpan('update_inventory', { parent: span });
    await updateInventory(req.body.items);
    inventorySpan.end();

    span.setStatus({ code: SpanStatusCode.OK });
    res.json({ success: true });
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
});
```

## Golden Signals: What to Monitor

### USE Method (Infrastructure)

- **Utilization**: % time resource is busy
- **Saturation**: Queue depth, backlog
- **Errors**: Error rate

```promql
# CPU Utilization
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Saturation
(node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# Disk Errors
rate(node_disk_io_errors_total[5m])
```

### RED Method (Services)

- **Rate**: Requests per second
- **Errors**: Failed requests per second
- **Duration**: Response time distribution

```promql
# Request Rate
sum(rate(http_requests_total[5m])) by (service)

# Error Rate
sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)

# Duration (95th percentile)
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))
```

## SLOs and Error Budgets

Define Service Level Objectives:

```yaml
# SLO definition
apiVersion: sloth.slok.dev/v1
kind: PrometheusServiceLevel
metadata:
  name: api-service-availability
spec:
  service: api-service
  slos:
    - name: requests-availability
      objective: 99.9
      description: API requests should succeed
      sli:
        events:
          errorQuery: sum(rate(http_requests_total{code=~"5.."}[5m]))
          totalQuery: sum(rate(http_requests_total[5m]))
      alerting:
        name: HighErrorRate
        labels:
          severity: critical
```

## OpenTelemetry: The Future

OpenTelemetry provides vendor-neutral instrumentation:

```yaml
# OpenTelemetry Collector config
receivers:
  otlp:
    protocols:
      grpc:
      http:

processors:
  batch:
    timeout: 10s

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
  jaeger:
    endpoint: "jaeger:14250"
  logging:
    loglevel: debug

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger, logging]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

## Best Practices

1. **Start with business metrics**: Track user-facing KPIs, not just infrastructure
2. **Use distributed tracing**: Essential for microservices debugging
3. **Alert on symptoms, not causes**: Alert on user impact (high latency), not disk space
4. **Keep cardinality low**: Don't use UUIDs as metric labels
5. **Correlate signals**: Link traces to logs to metrics via trace IDs
6. **Practice incident response**: Regular fire drills improve MTTR

## Conclusion

Observability is not optional in modern cloud environments. Invest in the three pillars - metrics, logs, and traces - from day one. Use vendor-neutral standards like OpenTelemetry. Define SLOs and measure error budgets. And most importantly: build dashboards for understanding, not decoration.

Your future on-call self will thank you.
