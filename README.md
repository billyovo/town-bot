
# Town Bot

  
## Deploy

###  Docker


1. Create .env file with INFISICAL_TOKEN=<TOKEN>

2. build docker compose (which will fetch image from github packages)

`docker-compose up -d`


## Development

###  Docker

1. Create .env file with

INFISICAL_TOKEN_DEV=<TOKEN>

2. build docker-compose.dev

`docker-compose -f docker-compose.dev.yaml up -d --build`

### pnpm
1. Acquire .env file in dev environment from infisical
2. install dependencies
`pnpm add`
3. Start dev
`pnpm run dev`

### infisical
infisical run -- pnpm run dev
