import { IsDate, IsEmail, IsNumber, IsString, isDate, isNumber } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;
}