import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './schemas/build-event.schema';
import { BuilderService } from './builder.service';
import { DeviceSchema } from './schemas/device.schema';
import { UserSchema } from './schemas/user.schema';
import { BridgeSchema } from './schemas/bridge.schema';
import { CoordinatorSchema } from './schemas/coordinator.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'buildEvents', schema: BuildEventSchema },
      { name: 'devices', schema: DeviceSchema },
      { name: 'devices', schema: BridgeSchema },
      { name: 'devices', schema: CoordinatorSchema },
      { name: 'users', schema: UserSchema },
    ]),
  ],
  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}
