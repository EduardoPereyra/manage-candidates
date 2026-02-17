import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CandidatesModule } from './candidates/candidates.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CandidatesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
