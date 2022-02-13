import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { BuilderService } from './builder.service';
import { DeviceSchema } from './device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'buildEvents', schema: BuildEventSchema },
      { name: 'devices', schema: DeviceSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
