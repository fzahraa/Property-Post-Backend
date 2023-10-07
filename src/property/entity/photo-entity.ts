import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, ManyToOne, JoinColumn} from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photoURL: string;

  @ManyToOne(() => Property, (property) => property.photos)
  property: Property

}