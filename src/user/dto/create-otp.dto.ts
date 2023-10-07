import { IsDate, IsEmail, IsNumber, IsString, isDate, isNumber } from 'class-validator';

export class CreateOtpDto {

    @IsNumber()
    otp: number;
    
    @IsDate()
    otpCreatedAt : Date;
}
