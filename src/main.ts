import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create HTTP server
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth', // Название схемы
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const httpPort = 5000;
  await app.listen(httpPort);
  console.log(`HTTP server is listening on port ${httpPort}`);

  // Create microservice
  // const microservice = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RMQ_URL],
  //     queue: process.env.RMQ_QUEUE,
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });

  // Start the microservice
  // await microservice.listen();
  console.log('Microservice is connected to RabbitMQ');
}

bootstrap();
