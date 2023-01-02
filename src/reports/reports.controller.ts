import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createReport(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
