Build Docker:
```
    docker build -t IMAGE_NAME .
```
if there is no Tesseract traineddata remove the line 17 in Dockerfile

Run Docker
```
    docker run -it -e TZ=Asia/Taipei --env INFISICAL_TOKEN=Service_TTTTOOOOKKKKEEEEENNNNNN --restart always --name container_name IMAGE_NAME
```