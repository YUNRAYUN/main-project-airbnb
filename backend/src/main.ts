import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress()); // 16버전에 문제 있음 => 13.0.0으로 변경
  await app.listen(3000);
}
bootstrap();
