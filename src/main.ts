import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Minha API')
    .setDescription('Documentação da API com Swagger')
    .setVersion('1.0')
    .addBearerAuth() // se quiser autenticação JWT no Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // acessível em /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
