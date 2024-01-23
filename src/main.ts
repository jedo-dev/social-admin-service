import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Social Business Logic Service')
    .setDescription('http://localhost:' + PORT + '/api-json')
    .setVersion('1.0.0')

    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(PORT, () => console.log(`serv start on port = ${PORT}`));
}

start();
