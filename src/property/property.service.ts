import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Property } from './entity/property.entity';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Feature } from './entity/features-entity';
import { Photo } from './entity/photo-entity';
import * as fs from 'fs';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>
  ) {}

  get(): Promise<Property[]> {
    return this.propertyRepository.find({
        relations: {
            features: true,
            photos: true
        },
    });
  }

  //Get all properties
  async getProperties(){
    try{
     return await this.propertyRepository.find(
    );
  }catch(error){
    console.log(error)
  }
  }

  //Get Featured properties
  async getFeaturedProperties(){
    try{
     return await this.propertyRepository.find({
      where: {
        listingType: "Featured",
      },
  }
    );
  }catch(error){
    console.log(error)
  }
  }

  //Get User properties
  async getUserProperties(userId : number){
    try{
     return await this.propertyRepository.find({
      where: {
        userId: userId,
      },
  }
    );
  }catch(error){
    console.log(error)
  }
  }

  //Get General properties
  async getGeneralProperties(){
    try{
     return await this.propertyRepository.find({
      where: {
        listingType: "General",
      },
  }
    );
  }catch(error){
    console.log(error)
  }
  }

  //Get Active properties
  async getActiveProperties(){
    try{
     return await this.propertyRepository.find({
      where: {
        propertyStatus: "Active",
      },
  }
    );
  }catch(error){
    console.log(error)
  }
  }

  //Get Active properties
  async getDeActivedProperties(){
    try{
     return await this.propertyRepository.find({
      where: {
        propertyStatus: "DeActivated",
      },
  }
    );
  }catch(error){
    console.log(error)
  }
  }

//Add Property
  async create(createPropertyDto: CreatePropertyDto) {
    return await this.propertyRepository.save(createPropertyDto);
  }

//Update a Property
  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    try{

    const data = await this.propertyRepository.findOne({ where: { id } });
      if(data){
        var found = false;
        //console.log(updatePropertyDto.samePhotos);
        data.photos.forEach(element => {
            if(updatePropertyDto.samePhotos.some(x=> element.photoURL.includes(x))){
              found = true;
            }
            else{
              found = false;
            }

            if(!found){
            fs.unlink(`${element.photoURL}`, (err) => {
              if (err) {
               console.error(err);
               return err;
              }
             });
          }
         
        });
        

        data.projectName = updatePropertyDto.projectName;
        data.type = updatePropertyDto.type;
        data.statusType = updatePropertyDto.statusType;
        data.installmentAvailable = updatePropertyDto.installmentAvailable;
        data.city = updatePropertyDto.city;
        data.location = updatePropertyDto.location;
        data.area = updatePropertyDto.area;
        data.areaDesc = updatePropertyDto.areaDesc;
        data.contactPersonEmail = updatePropertyDto.contactPersonEmail;
        data.contactPersonName = updatePropertyDto.contactPersonName;
        data.contactPersonNumber = updatePropertyDto.contactPersonNumber;
        data.propertyType = updatePropertyDto.propertyType;
        data.numberOfBedrooms = updatePropertyDto.numberOfBedrooms;
        data.monthlyRent = updatePropertyDto.monthlyRent;
        data.features = updatePropertyDto.features;
        data.photos = updatePropertyDto.photos;
        data.statusType = updatePropertyDto.statusType;
        data.propertyStatus = updatePropertyDto.propertyType;
        data.photos.forEach(element => {
          element.property = data;
        });
        
        data.features = updatePropertyDto.features;
        data.features.forEach(element => {
          element.property = data;
        });
        const dataChanged = await this.propertyRepository.save(data);
        if(dataChanged){
          await this.featureRepository
            .createQueryBuilder()
            .delete()
            .from(Feature)
            .where("propertyId IS :propertyId", { propertyId: null })
            .execute();

            await this.photoRepository
            .createQueryBuilder()
            .delete()
            .from(Photo)
            .where("propertyId IS :propertyId", { propertyId: null })
            .execute();
        }
      return data;
    }
  }catch(error){
    console.log(error)
  }
  }


//Delete a Property
async deleteProperty(id: number) {
  try{

  const data = await this.propertyRepository.findOne({ where: { id } });
    if(data){
      data.photos.forEach(element => {
        fs.unlink(`${element.photoURL}`, (err) => {
          if (err) {
           console.error(err);
           return err;
          }
         });
      });
      
        await this.featureRepository
          .createQueryBuilder()
          .delete()
          .from(Feature)
          .where("propertyId = :propertyId", { propertyId: id })
          .execute();

          await this.photoRepository
          .createQueryBuilder()
          .delete()
          .from(Photo)
          .where("propertyId = :propertyId", { propertyId: id })
          .execute();

          const dataChanged = await this.propertyRepository.delete(id);

   return data;
  }
}catch(error){
  console.log(error)
}
}


//Find a specific property
findById(id: number) {
    return this.propertyRepository.findOne({ where: { id } });
  }

//Update Status(Active/Deactivated) Property
async changePropertyStatus(id: number, status: string) {
  try{

  const data = await this.propertyRepository.findOne({ where: { id } });
    if(data){
      data.statusType = status;
      const dataChanged = await this.propertyRepository.save(data);
      if(dataChanged){
        return data;
      }
      return data;
  }
}catch(error){
  console.log(error)
}
}

//Update Listing Type(Featured/General) Property
async changeListingType(id: number, listingType: string) {
  try{

  const data = await this.propertyRepository.findOne({ where: { id } });
    if(data){
      data.listingType = listingType;
      const dataChanged = await this.propertyRepository.save(data);
      if(dataChanged){
        return data;
      }
      return data;
  }
}catch(error){
  console.log(error)
}
}
  
}