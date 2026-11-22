import {Injectable, NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { OrderReport } from './entities/order-report.entity';
import { ProductReport } from './entities/product-report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(OrderReport)
    private readonly orderReportRepo: Repository<OrderReport>,

    @InjectRepository(ProductReport)
    private readonly productReportRepo: Repository<ProductReport>,

    private readonly httpService: HttpService,
  ) {}

  // Lấy dữ liệu đơn hàng từ BTH4
  private async getOrder(orderId: number, auth: string) {
    const url = `${process.env.ORDER_SERVICE_URL}/orders/${orderId}`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: { Authorization: auth },
      }),
    );

    return response.data;
  }

  // Lấy dữ liệu sản phẩm từ BTH3
  private async getProduct(productId: number, auth: string) {
    const url = `${process.env.PRODUCT_SERVICE_URL}/products/${productId}`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: { Authorization: auth },
      }),
    );

    return response.data;
  }

  // Tạo báo cáo đơn hàng
  async createOrderReport(orderId: number, auth: string) {
    const order = await this.getOrder(orderId, auth);

    let totalCost = 0;

    for (const item of order.items) {
      const product = await this.getProduct(item.productId, auth);

      totalCost += Number(product.cost) * Number(item.quantity);
    }

    const totalRevenue = Number(order.totalAmount);

    const report = this.orderReportRepo.create({
      order_id: order.id,
      total_revenue: totalRevenue,
      total_cost: totalCost,
      total_profit: totalRevenue - totalCost,
    });

    return this.orderReportRepo.save(report);
  }

  // Tạo báo cáo một sản phẩm thuộc báo cáo đơn hàng
  async createProductReport(
    orderReportId: number,
    productId: number,
    auth: string,
  ) {
    const orderReport = await this.orderReportRepo.findOne({
      where: { id: orderReportId },
    });

    if (!orderReport) {
      throw new NotFoundException('Không tìm thấy báo cáo đơn hàng');
    }

    const order = await this.getOrder(orderReport.order_id, auth);

    const item = order.items.find(
      (i: any) => Number(i.productId) === Number(productId),
    );

    if (!item) {
      throw new NotFoundException(
        'Sản phẩm không tồn tại trong đơn hàng',
      );
    }

    const product = await this.getProduct(productId, auth);

    const quantity = Number(item.quantity);
    const stockQuantity = Number(product.quantity);
    const revenue = Number(item.totalPrice);
    const cost = Number(product.cost) * quantity;

    const report = this.productReportRepo.create({
      order_report_id: orderReportId,
      product_id: productId,
      total_sold: quantity,
      stock_quantity: stockQuantity,
      revenue,
      cost,
      profit: revenue - cost,
    });

    return this.productReportRepo.save(report);
  }

  // Danh sách báo cáo đơn hàng
  getAllOrderReports() {
    return this.orderReportRepo.find({
      relations: {products: true,},
    });
  }

  // Chi tiết báo cáo đơn hàng
  async getOrderReport(id: number) {
    const report = await this.orderReportRepo.findOne({
      where: { id },
      relations: {products: true},
    });

    if (!report) {
      throw new NotFoundException('Không tìm thấy báo cáo đơn hàng');
    }

    return report;
  }

  // Danh sách báo cáo sản phẩm
  getAllProductReports() {
    return this.productReportRepo.find();
  }

  // Chi tiết báo cáo sản phẩm
  async getProductReport(id: number) {
    const report = await this.productReportRepo.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Không tìm thấy báo cáo sản phẩm');
    }

    return report;
  }

  // Xóa báo cáo đơn hàng
  async deleteOrderReport(id: number) {
    const report = await this.getOrderReport(id);
    await this.orderReportRepo.remove(report);

    return { message: 'Đã xóa báo cáo đơn hàng thành công' };
  }

  // Xóa báo cáo sản phẩm
  async deleteProductReport(id: number) {
    const report = await this.getProductReport(id);
    await this.productReportRepo.remove(report);

    return { message: 'Đã xóa báo cáo sản phẩm thành công' };
  }
}
