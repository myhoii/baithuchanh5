import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { OrderReport } from './entities/order-report.entity';
import { ProductReport } from './entities/product-report.entity';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([OrderReport, ProductReport]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, AuthGuard],
})
export class ReportsModule {}
