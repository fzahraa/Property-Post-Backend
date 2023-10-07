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
    ConsoleLogger,
    UploadedFiles,
    UseGuards,
    Req,
  } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyService } from './property.service';
import { Response } from 'express';
//import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { Photo } from './entity/photo-entity';
import { Feature } from './entity/features-entity';
  
  @Controller('property')
  export class PropertyController {
    constructor(private propertyService: PropertyService) {}
  
  //get all Properties
    @Get('/getProperties')
    getProperties() {
      return this.propertyService.getProperties();
    }

  //get Featured Properties
  @Get('/getFeaturedProperties')
  getFeaturedProperties() {
    return this.propertyService.getFeaturedProperties();
  }

    //get User Properties
    @Get('/getUserProperties/:userId')
    async getUserProperties(@Request() req: any, @Res() res: Response) {
      await this.propertyService.getUserProperties(req.params.userId).then((data) => {
        if(data){
          return data;
        }
        else{
          res.status(HttpStatus.NOT_FOUND).send({
            message:
              'TNo properties found against this user.',
          });
        }
      });
      return res;
    }

    //get General Properties
    @Get('/getGeneralProperties')
    getGeneralProperties() {
      return this.propertyService.getGeneralProperties();
    }

  //get Active Properties
  @Get('/getActivatedProperties')
  getActiveProperties() {
    return this.propertyService.getActiveProperties();
  }

    //get Deactivated Properties
    @Get('/getDeactivatedProperties')
    getDeactivatedProperties() {
      return this.propertyService.getDeActivedProperties();
    }
  
    //Create a Property
    @Post('/addProperty')
    @UseInterceptors(FilesInterceptor('photos', 10, {
      storage : diskStorage({
        destination : './public/uploads/propertyImages', 
        filename : (req : any, file : any, cb : any) => {
          const filename : string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension : string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`)
        }
      })
    }))
    async store(@UploadedFiles() files , @Body() createPropertyDto: CreatePropertyDto, @Res() res: Response, @Req() req: Request) {
      const obj = JSON.parse(JSON.stringify(req.body)); 

      const featuresArray = JSON.parse(obj.features); 
      let photos:Array<Photo> = [] ;
      if(files?.length> 0){
        files.forEach(element => {
          const photo = new Photo();
          photo.photoURL = element.path;
          photos.push(photo);
        });
      }
      createPropertyDto.photos = photos;

      let features:Array<Feature> = [];

      featuresArray.forEach(element => {
        const feature = new Feature();
        feature.featureName = element.featureName;
        features.push(feature);
      });
      
      createPropertyDto.features = features;

      this.propertyService.create(createPropertyDto).then((obj) => {
            if(obj){
            res.status(HttpStatus.OK).send({
              message: 'Property Successfully Added.',
            });
        }else {
                  res.status(HttpStatus.BAD_REQUEST).send({
                    message:
                      'There is an Error while creating this property. Please Try Again.',
                  });
                }
          });
      
      return res;
    }

    //Update a Property
    @Patch('/updateProperty/:id')
    @UseInterceptors(FilesInterceptor('photos', 10, {
      storage : diskStorage({
        destination : './public/uploads/propertyImages', 
        filename : (req : any, file : any, cb : any) => {
          const filename : string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension : string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`)
        }
      })
    }))
    async update(@UploadedFiles() files, @Body() updatePropertyDto: UpdatePropertyDto, @Request() req: any, @Res() res: Response) {
        await this.propertyService.findById(req.params.id).then(async (data) => {
            if(data){
              // console.log(updatePropertyDto)
              // console.log(updatePropertyDto.samePhotos);
              // console.log(files);
              let photos:Array<Photo> = [] ;
              if(files?.length> 0){
                files.forEach(element => {
                  const photo = new Photo();
                  photo.photoURL = element.path;
                  photos.push(photo);
                });
              }

              const obj = JSON.parse(JSON.stringify(req.body)); 

              updatePropertyDto.samePhotos = JSON.parse(obj?.samePhotos);
              if(updatePropertyDto?.samePhotos.length > 0){
                updatePropertyDto?.samePhotos.forEach(element => {
                  const photo = new Photo();
                  photo.photoURL = "public\\uploads\\propertyImages\\" + element;
                  photos.push(photo);
                })
              }
              
              updatePropertyDto.photos = photos;

              const featuresArray = JSON.parse(obj?.features); 
              let features:Array<Feature> = [];
        
              featuresArray.forEach(element => {
                const feature = new Feature();
                feature.featureName = element.featureName;
                features.push(feature);
              });
              
              updatePropertyDto.features = features;

                this.propertyService.update(req.params.id, updatePropertyDto).then((obj:any) => {
                    if(obj){
                    res.status(HttpStatus.OK).send({
                      message: 'Property Successfully Updated.',
                    });
                }else {
                          res.status(HttpStatus.BAD_REQUEST).send({
                            message:
                              'There is an Error while updating this property. Please Try Again.',
                          });
                        }
                  });
        
            }
            else{

            }
        })

      return res;
    }

    //Update Property status
    @Patch('/updatePropertyStatus/:id/:status')
    async changePropertyStatus(@Request() req: any, @Res() res: Response) {
        await this.propertyService.findById(req.params.id).then(async (data) => {
            if(data){
                
                this.propertyService.changePropertyStatus(req.params.id, req.params.status).then((obj:any) => {
                    if(obj){
                    res.status(HttpStatus.OK).send({
                      message: 'Property Status Successfully Updated.',
                    });
                }else {
                          res.status(HttpStatus.BAD_REQUEST).send({
                            message:
                              'There is an Error while updating this status. Please Try Again.',
                          });
                        }
                  });
        
            }
            else{

            }
        })

      return res;
    }

    //Delete Property
    @Delete('/deleteProperty/:id')
    async deleteProperty(@Request() req: any, @Res() res: Response) {
        await this.propertyService.findById(req.params.id).then(async (data) => {
            if(data){
                
                this.propertyService.deleteProperty(req.params.id).then((obj:any) => {
                    if(obj){
                    res.status(HttpStatus.OK).send({
                      message: 'Property Successfully Deleted.',
                    });
                }else {
                          res.status(HttpStatus.BAD_REQUEST).send({
                            message:
                              'There is an Error while deleting this property. Please Try Again.',
                          });
                        }
                  });
        
            }
            else{

            }
        })

      return res;
    }

    //Update Listing Type
    @Patch('/updateListingType/:id/:listingType')
    async changeListingType(@Request() req: any, @Res() res: Response) {
        await this.propertyService.findById(req.params.id).then(async (data) => {
            if(data){
                
                this.propertyService.changeListingType(req.params.id, req.params.listingType).then((obj:any) => {
                    if(obj){
                    res.status(HttpStatus.OK).send({
                      message: 'Property Listing type Successfully Updated.',
                    });
                }else {
                          res.status(HttpStatus.BAD_REQUEST).send({
                            message:
                              'There is an Error while updating this listing type. Please Try Again.',
                          });
                        }
                  });
        
            }
            else{

            }
        })

      return res;
    }

  }
  