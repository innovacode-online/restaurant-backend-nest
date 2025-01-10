<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Restaurant POS - Nest JS

## Instalacion en desarrollo
1. Renombrar el archivo ``.env.template`` a ``.env`` y asignar los valores correspondientes

2. Instalar las dependencias de desarrollo 
```bash
$ npm install
```

3. Instanciar nuestra base de datos y cliente
```bash
$ npx prisma db push #Crea los documentos en MongoDB

$ npx prisma generate #Genera el cliente
```

## Correr el proyecto en desarrollo
1. Ejercutar en la terminal ``npm run start:dev``
