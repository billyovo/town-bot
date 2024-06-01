FROM alpine:latest

WORKDIR /app
RUN apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk add infisical

COPY ./src/secrets /app/secrets

ENV ENVIRONMENT=production
CMD infisical agent --config /app/secrets/agent-config.yaml
