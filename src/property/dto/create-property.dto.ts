import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { Photo } from '../entity/photo-entity';
import { Feature } from '../entity/features-entity';
import { Transform } from 'class-transformer';
import { ParseIntPipe } from '@nestjs/common';

export class CreatePropertyDto {
  @IsString()
  projectName: string;

  @IsString()
  type: string;

  @IsString()
  statusType: string;

  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  installmentAvailable: boolean;

  @IsString()
  area: string;

  @IsString()
  areaDesc: string;

  @IsString()
  city: string;

  @IsString()
  location: string;

  @IsString()
  contactPersonName: string;

  @IsEmail()
  contactPersonEmail: string;

  @IsString()
  contactPersonNumber: string;

  @IsString()
  propertyType: string;

  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  numberOfBedrooms: number;

  @IsString()
  currency: string;

  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  userId: number;

  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  monthlyRent: number;

  photos : Photo[];

  features : Feature[]

}