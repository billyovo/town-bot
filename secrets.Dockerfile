FROM alpine:latest

WORKDIR /app
RUN apk add --no-cache bash curl && curl -1sLf \
    'https://artifacts-cli.infisical.com/setup.apk.sh' | version=3.8.0 bash \
    && apk add infisical

COPY ./src/secrets /app/secrets

ENV ENVIRONMENT=production
CMD infisical agent --config /app/secrets/agent-config.yaml
