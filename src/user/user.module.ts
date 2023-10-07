import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]),
  MailerModule.forRoot({
    transport : {
      host: "gmail",
      //port: 587,
      //secure: false, // true for 465, false for other ports
      auth: {
        user: 'fzahra98@gmail.com', 
        pass: 'fwmntwgfqhvtcmaw', 
      },
    }
  })],
})
export class UserModule {}
