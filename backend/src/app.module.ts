import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RentsModule } from './apis/airbnb/rents/rents.module';
import { UsersModule } from './apis/airbnb/users/users.module';
import { AuthModule } from './apis/auth/auth.module';
import { JwtAccessStrategy } from './commons/auth/jwt-access-strategy';
import { JwtRefreshStrategy } from './commons/auth/jwt-refresh.strategy';
import { RentsPaymentsModule } from './apis/airbnb/payments/rentPayment.module';
import { FIlesModule } from './apis/files/files.module';
import { AppController } from './app.controller';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    FIlesModule,
    RentsModule,
    UsersModule,
    RentsPaymentsModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://10.21.209.3:6379',
      isGlobal: true,
    }),
  ],
  providers: [
    JwtAccessStrategy, //
    JwtRefreshStrategy,
  ],
  controllers: [AppController],
})
export class AppModule {}
