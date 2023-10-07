import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, isEnum } from 'class-validator';
import { Photo } from '../entity/photo-entity';
import { Feature } from '../entity/features-entity';
import { Transform } from 'class-transformer';

export class UpdatePropertyDto {
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

  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  userId: string;

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
  monthlyRent: number;

  photos : Photo[];

  @IsNotEmpty()
  features : Feature[]

  @IsString({ each: true })
  samePhotos : string[];

}