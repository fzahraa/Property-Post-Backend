import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  featureName: string;

  @ManyToOne(() => Property, (property) => property.features)
  property: Property

}