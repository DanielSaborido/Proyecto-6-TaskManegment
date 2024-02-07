# Fase de construcción
FROM composer:latest AS build

WORKDIR /app

COPY ./laravel_proyecto_6/database ./database
COPY ./laravel_proyecto_6/artisan ./artisan
COPY ./laravel_proyecto_6/composer.json ./composer.json
COPY ./laravel_proyecto_6/composer.lock ./composer.lock

RUN composer install --ignore-platform-reqs

COPY ./laravel_proyecto_6 .

# Fase de producción
FROM php:8.0-apache

WORKDIR /var/www/html

COPY --from=build /app .