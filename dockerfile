FROM nginx:1.15.2-alpine
COPY ./dist /var/www
EXPOSE 80 443