import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuilderModule } from './modules/builder/builder.module';
import { MqttClientModule } from './modules/mqtt-client/mqtt-client.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot(
      'mongodb+srv://flohlen:35408150Informatik@lightcontrol.l2xne.mongodb.net/lightcontrolDatabase?retryWrites=true&w=majority',
    ),
    BuilderModule,
    MqttClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
