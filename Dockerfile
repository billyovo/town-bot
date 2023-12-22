FROM node:21-slim
RUN npm i -g pnpm

COPY ["package.json", "package-lock.json*", "./"]

RUN apt-get update && apt-get install -y bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | bash \
&& apt-get update && apt-get install -y infisical

RUN apt-get update \
    &&  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata
    
RUN TZ=Asia/Taipei \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata
     
RUN apt-get install tesseract-ocr -y
RUN pnpm install
COPY . .
RUN mv Tesseract_Data/* /usr/share/tesseract-ocr/5/tessdata 
# ENV NODE_ENV=production
CMD ["infisical", "run", "--env=prod", "--","npm", "run", "dev"]

