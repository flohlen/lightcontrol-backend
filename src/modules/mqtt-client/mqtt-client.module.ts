import { Module } from '@nestjs/common';
import { BuilderModule } from '../builder/builder.module';
import { MqttClientService } from './mqtt-client.service';

@Module({
  imports: [BuilderModule, MqttClientModule],
  providers: [MqttClientService],
  exports: [MqttClientService],
})
export class MqttClientModule {}
