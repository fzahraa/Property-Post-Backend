import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, OneToMany, JoinColumn } from 'typeorm';
import { Feature } from './features-entity';
import { Photo } from './photo-entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column()
  type:string;

  @Column()
  statusType: string;

  @Column()
  installmentAvailable: boolean;

  @Column()
  area: string;

  @Column()
  areaDesc: string;

  @Column()
  city: string;

  @Column()
  location: string;

  @Column()
  contactPersonName: string;

  @Column()
  contactPersonEmail: string;

  @Column()
  contactPersonNumber: string;

  @Column()
  propertyType: string;

  @Column()
  numberOfBedrooms: number;

  @Column()
  currency: string;

  @Column()
  monthlyRent: number;

  @Column()
  userId : number;

  @Column({
    default : 'General'
  })  
  listingType : string;

  @Column({
    default : 'Active'
  })  
  propertyStatus : string;
  
  @OneToMany((type) => Photo, (photo) => photo.property,{
    cascade: ['insert', 'update'],
    eager: true
  })
  photos: Photo[];

  @OneToMany((type) => Feature, (feature) => feature.property,{
    cascade: ['insert', 'update'],
    eager: true
    })
  features: Feature[];

}