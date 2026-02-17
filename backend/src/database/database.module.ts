import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Candidate } from '../candidates/entities/candidate.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'), // Railway provides this variable
        entities: [Candidate],
        synchronize: true, // For dev - change to false in production
        ssl: true, // Railway requires SSL
        extra: {
          ssl: {
            rejectUnauthorized: false, // Important for Railway
          },
        },
        logging: ['query', 'error'], // See queries in console
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
