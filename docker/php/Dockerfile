FROM php:7.1-fpm
# install the PHP extensions we need
# XDEBUG requires Docker 18.03+ because of the host IP resolution on mac
RUN apt-get update && apt-get install -y \ 
    libpng12-dev \ 
    libjpeg-dev \ 
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libpng-dev \
    && rm -rf /var/lib/apt/lists/* 

RUN docker-php-ext-configure gd --with-png-dir=/usr --with-jpeg-dir=/usr \
    && docker-php-ext-install gd

RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo_mysql

RUN docker-php-ext-install mbstring && docker-php-ext-enable mbstring

RUN docker-php-ext-install mcrypt && docker-php-ext-enable mcrypt

#RUN docker-php-ext-configure opcache --enable-opcache \
    #&& docker-php-ext-install opcache

COPY config/opcache.ini $PHP_INI_DIR/conf.d/

#RUN pecl install apcu \
    #&& echo extension=apcu.so > /usr/local/etc/php/conf.d/apcu.ini

RUN pecl install xdebug-2.6.0 \
    && docker-php-ext-enable xdebug \
    && sed -i '1 a xdebug.remote_autostart=true' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && sed -i '1 a xdebug.remote_mode=req' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && sed -i '1 a xdebug.remote_handler=dbgp' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    # && sed -i '1 a xdebug.remote_connect_back=1 ' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && sed -i '1 a xdebug.remote_port=9000' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && sed -i '1 a xdebug.remote_host=host.docker.internal' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && sed -i '1 a xdebug.remote_enable=1' /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
