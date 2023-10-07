import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsNumber, IsString, isDate, isNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  phone: string;

  @IsString()
  city: string;

  profilePhoto: string;

  @IsString()
  country: string;

  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  smsNotification : boolean

  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  emaiRequestNotification : boolean
  
  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  promotionNotification : boolean
  
  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  campaign : boolean
  
  @IsBoolean()
  @Transform(({ value} ) => value === 'true')
  weeklyReport : boolean
}