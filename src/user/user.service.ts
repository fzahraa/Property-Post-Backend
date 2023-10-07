import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOtpDto } from './dto/create-otp.dto';
import { User } from './entity/user.entity';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  get(): Promise<User[]> {
    return this.userRepository.find();
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  update(updateProfileDto: UpdateProfileDto, userId: number) {
    return this.userRepository.update(userId, updateProfileDto);
  }

  //update password
  async updatePassword(email: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.findOne({ where: { email} }).then(async(data) => {
      if(data){
        return this.userRepository.update(data.id, updateUserDto);
      }
    }); 
  }
  show(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }


  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  //save OTP in the system
  async saveOTP(email: string, createOtpDto: CreateOtpDto){
    await this.findByEmail(email).then(async (data)=>{
      if(data){
        await this.userRepository.update(data.id, createOtpDto).then(async(obj) => {
          return obj;
        });
      }
    })
  }

  delete(userId: number) {
    return this.userRepository.delete(userId);
  }
}