import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, isEnum } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  photoURL: string;

}