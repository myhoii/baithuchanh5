import {Controller,Get,Post,Delete,Param,Body,Headers,ParseIntPipe,UseGuards,} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('orders')
  getAllOrderReports() {
    return this.reportsService.getAllOrderReports();
  }

  @Get('orders/:id')
  getOrderReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getOrderReport(id);
  }

  @Get('products')
  getAllProductReports() {
    return this.reportsService.getAllProductReports();
  }

  @Get('products/:id')
  getProductReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getProductReport(id);
  }

  @Post('orders')
  createOrderReport(
    @Body('orderId', ParseIntPipe) orderId: number,
    @Headers('authorization') auth: string,
  ) {
    return this.reportsService.createOrderReport(orderId, auth);
  }

  @Post('products')
  createProductReport(
    @Body('orderReportId', ParseIntPipe) orderReportId: number,
    @Body('productId', ParseIntPipe) productId: number,
    @Headers('authorization') auth: string,
  ) {
    return this.reportsService.createProductReport(
      orderReportId,
      productId,
      auth,
    );
  }

  @Delete('orders/:id')
  deleteOrderReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.deleteOrderReport(id);
  }

  @Delete('products/:id')
  deleteProductReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.deleteProductReport(id);
  }
}
