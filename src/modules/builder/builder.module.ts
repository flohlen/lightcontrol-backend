import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';
import { DeviceSchema } from './device.schema';
import { UserSchema } from './user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'buildEvents', schema: BuildEventSchema },
      { name: 'devices', schema: DeviceSchema },
      { name: 'users', schema: UserSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
