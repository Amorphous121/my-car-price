import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Max(1000000)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsNumber()
  @IsLatitude()
  lat: number;

  @IsNumber()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @Min(0)
  @Max(100000)
  mileage: number;
}
