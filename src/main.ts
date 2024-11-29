import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir credenciales si es necesario
  });

  // Configuración básica de Swagger
  const config = new DocumentBuilder()
    .setTitle('AgroSenior API Documentation') // Título de la documentación
    .setDescription('Documentación de endpoints para el backend de AgroSenior') // Descripción 
    .setVersion('1.0') // Versión de la API
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Configurar el módulo de Swagger en la ruta `/api`
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
