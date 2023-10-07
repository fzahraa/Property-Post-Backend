import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entity/property.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Photo } from './entity/photo-entity';
import { Feature } from './entity/features-entity';


@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
  imports: [TypeOrmModule.forFeature([Property, Photo, Feature]),
],
})
export class PropertyModule {}
