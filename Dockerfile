FROM node:21-slim

RUN apt-get update \
    && apt-get install -y bash curl tesseract-ocr \
    && curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
    && apt-get update \
    && apt-get install -y infisical \
    && apt-get install -y --no-install-recommends tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm i -g pnpm


COPY Tesseract_* /usr/share/tesseract-ocr/5/tessdata

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml /app/

RUN pnpm install --frozen-lockfile

COPY src /app/src
COPY tsconfig.json /app/

RUN ["npm", "run", "build"]
CMD ["npm", "run", "start"]
ENTRYPOINT ["infisical", "run", "--env=prod", "--"]
