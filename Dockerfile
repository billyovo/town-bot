# Build stage
FROM node:21-slim AS base
WORKDIR /app

FROM base AS build

COPY package.json pnpm-lock.yaml /app/
COPY src /app/src
COPY tsconfig.json /app/

RUN apt-get update \
    && apt-get install -y bash curl tesseract-ocr \
    && curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
    && apt-get install -y infisical \
    && npm i -g pnpm \
    && pnpm fetch \ 
    && pnpm install --frozen-lockfile --offline 

RUN ["pnpm", "run", "build"]
RUN ["pnpm", "prune", "--prod"]

# Runtime stage
FROM base

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /usr/bin/infisical /usr/bin/infisical
COPY --from=build Tesseract_* /usr/share/tesseract-ocr/5/tessdata
COPY --from=build /etc/ssl/certs /etc/ssl/certs

CMD ["npm", "run", "start"]
ENTRYPOINT ["infisical", "run", "--env=prod", "--"]