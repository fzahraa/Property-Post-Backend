import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UserService } from './user.service';
import * as nodemailer from 'nodemailer';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import * as otpGenerator from 'otp-generator';
import { Response } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //get all users
  @Get()
  getUsers() {
    return this.userService.get();
  }

  //generate and send OTP
  @Post('/sendOTP')
  async sendOTP(@Request() req: any, @Res() res: Response) {
    await this.userService.findByEmail(req.body.email).then((data) => {
      if (data) {
        var otp = otpGenerator.generate(6, {
          digits: true,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'fzahra98@gmail.com',
            pass: 'fwmntwgfqhvtcmaw',
          },
        });

        transporter
          .sendMail({
            from: 'fzahra98@gmail.com',
            to: data.email,
            subject: 'Reset Password', // Subject line
            text: `Your One-Time Password (OTP) is ${otp} \n This OTP is Valid for the next 24 hours.`, // plain text body
          })
          .then(async (result) => {
            const createOtpDto: CreateOtpDto = {
              //@ts-ignore
              otp: otp,
              otpCreatedAt: new Date(),
            };

            await this.userService
              .saveOTP(req.body.email, createOtpDto)
              .then(async (data) => {
                //if(data){
                res.status(HttpStatus.OK).send({
                  message: 'OTP Sent and Saved Successfully.',
                });
                return res;
                //}
              });
          });
      } else {
        res.status(HttpStatus.FORBIDDEN).send({
          message: 'Please Sign up to Continue.',
        });
        return res;
      }
    });
  }

  //validate user's OTP
  @Post('/validateOTP')
  async validateOTP(@Request() req: any, @Res() res: Response) {
    await this.userService.findByEmail(req.body.email).then((data) => {
      if (data) {
        if (data.otp == req.body.otp) {
          const today = new Date();
          var diff = Math.floor(today.getTime() - data.otpCreatedAt.getTime());
          var day = 1000 * 60 * 60 * 24;

          var days = Math.floor(diff / day);
          if (days >= 1) {
            res.status(HttpStatus.FORBIDDEN).send({
              message: 'OTP is Expired.',
            });
            return res;
          } else {
            res.status(HttpStatus.OK).send({
              message: 'OTP is Valid',
            });
            return res;
          }
        } else {
          res.status(HttpStatus.FORBIDDEN).send({
            message: 'Invalid OTP',
          });
          return res;
        }
      } else {
        res.status(HttpStatus.FORBIDDEN).send({
          message: 'Invalid Email',
        });
        return res;
      }
    });
  }

  //sign up
  @Post('/signUp')
  async store(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    console.log(createUserDto);
    if (
      createUserDto.email != null &&
      createUserDto.password != null &&
      createUserDto.confirmPassword != null &&
      createUserDto.name != null
    ) {
      if (createUserDto.password === createUserDto.confirmPassword) {
        await this.userService.findByEmail(createUserDto.email).then(async(data) => {
          if (data) {
            res.status(HttpStatus.FORBIDDEN).send({
              message: 'Email Already Exists.',
            });
            return res;
          } else {
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
            createUserDto.password = hash;
            this.userService.create(createUserDto).then((obj) => {
              res.status(HttpStatus.OK).send({
                message: 'User Successfully Added.',
              });
            });
          }
        });
      } else if (createUserDto.password !== createUserDto.confirmPassword) {
        res.status(HttpStatus.FORBIDDEN).send({
          message: 'Password Not Matched.',
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).send({
          message:
            'There is an Error while creating this user. Please Try Again.',
        });
      }
    }
    return res;
  }

  //update password
  @Post('/updatePassword')
  async updatePassword(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
    @Res() res: Response,
  ) {
    await this.userService.findByEmail(req.body.email).then(async (data) => {
      if (!data) {
        res.status(HttpStatus.FORBIDDEN).send({
          message: 'User not Exists.',
        });
        return res;
      } else if (updateUserDto.password !== updateUserDto.confirmPassword) {
        res.status(HttpStatus.FORBIDDEN).send({
          message: 'Password Not Matched.',
        });
        return res;
      } else {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(updateUserDto.password, saltOrRounds);
        updateUserDto.password = hash;
        await this.userService
          .updatePassword(data.email, updateUserDto)
          .then(async (data) => {
            res.status(HttpStatus.OK).send({
              message: 'Password Updated Successfully.',
            });
          });
      }
    });
  }

  //update user profile
  @Patch('/updateProfile/:userId')
  @UseInterceptors(FileInterceptor('profilePhoto', {
    storage : diskStorage({
      destination : './public/uploads/profilePhotos', 
      filename : (req : any, file : any, cb : any) => {
        const filename : string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension : string = path.parse(file.originalname).ext;

        cb(null, `${filename}${extension}`)
      }
    })
  }))
  updateProfile(
    @UploadedFile() file,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    updateProfileDto.profilePhoto = file.path;
    this.userService.update(updateProfileDto, userId).then((data) =>{
      if(data){
        res.status(HttpStatus.OK).send({
          message: 'Profile Successfully Updated.',
        });
      }
      else{
        res.status(HttpStatus.BAD_REQUEST).send({
          message:
            'There is an Error while updating this profile. Please Try Again.',
        });
      }
    });
      
    return res;
  }

  //get a specific user
  @Get('/:userId')
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.show(userId);
  }

  //delete a user
  @Delete('/:userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.delete(userId);
  }
}
