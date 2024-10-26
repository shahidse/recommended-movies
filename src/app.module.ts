import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import config from './config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Category } from './entities/category.entity';
import { Movie } from './entities/movies.entity';
import { MovieRating } from './entities/rating.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('config.database.host');
        const port = configService.get<number>('config.database.port');
        const username = configService.get<string>('config.database.username');
        const password = configService.get<string>('config.database.password');
        const database = configService.get<string>('config.database.database');
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [User, Category, Movie, MovieRating],
        };
      },
      inject: [ConfigService],
    }),
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
