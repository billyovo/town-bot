
# Town Bot

  
## Deploy

###  Docker


1. Create .env file with INFISICAL_TOKEN=<TOKEN>

2. build docker compose

`docker-compose up -d --build`


## Development

###  Docker

1. Create .env file with

INFISICAL_TOKEN_DEV=<TOKEN>

2. build docker-compose.dev

`docker-compose -f docker-compose.dev.yaml up -d --build`

### PNPM
1. Acquire .env file in dev enviornment from infisical
2. install dependencies
`pnpm add`
3. Start dev
`npm run dev`