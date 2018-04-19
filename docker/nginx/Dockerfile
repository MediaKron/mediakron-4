FROM nginx:latest

COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN apt-get update && \
    apt-get install -y openssl && \
    mkdir /etc/nginx/ssl && \
    openssl req -x509 -newkey rsa:2048 -keyout /etc/nginx/ssl/key.pem -out /etc/nginx/ssl/cert.pem -days 365 -nodes \
        -subj "/C=US/ST=Massachusetts/L=Boston/O=Convertiv/OU=IT Department/CN=localhost"