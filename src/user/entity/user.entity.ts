import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    default : null
  })
  profilePhoto: string;

  @Column()
  confirmPassword: string;

  @Column({
    default : ""
  })
  phone: string;

  @Column({
    default : ""
  })
  city: string;

  @Column({
    default : ""
  })
  country: string;

  @Column({
    default : false
  })
  smsNotification : boolean

  @Column({
    default : false
  })
  emaiRequestNotification : boolean
  
  @Column({
    default : false
  })
  promotionNotification : boolean
  
  @Column({
    default : false
  })
  campaign : boolean
  
  @Column({
    default : false
  })
  weeklyReport : boolean

  @Column({
    default : 0
  })  
  otp : Number


  @CreateDateColumn({ name: 'otpCreatedAt'})
  otpCreatedAt: Date;
}