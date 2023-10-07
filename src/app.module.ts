import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { PropertyModule } from './property/property.module';
import { Property } from './property/entity/property.entity';
import { Photo } from './property/entity/photo-entity';
import { Feature } from './property/entity/features-entity';

@Module({
  controllers: [AppController],
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nestjs',
      entities: [User, Property, Photo, Feature],
      synchronize: true,
    }),
    AuthModule,
    ProfileModule,
    PropertyModule,
  ],
})
export class AppModule {}
