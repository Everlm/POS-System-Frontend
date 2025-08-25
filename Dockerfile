# Stage 1: Build - Compila la aplicación de Angular
FROM node:16-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json para instalar dependencias
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Instala las dependencias del proyecto
# RUN npm install

# Copia el resto del código fuente de la aplicación
COPY . .

# Ejecuta el script de build para producción. Este comando crea la carpeta /app/dist.
RUN npm run build

# Stage 2: Serve - Sirve la aplicación con Nginx
FROM nginx:stable-alpine

# Copia los artefactos de la compilación desde la etapa 'build' al directorio web de Nginx
# Copia los artefactos de la compilación desde la etapa 'build' al directorio web de Nginx
COPY --from=build /app/dist/vex /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
