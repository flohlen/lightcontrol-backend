import { Module } from '@nestjs/common';
import { MqttClientService } from './mqtt-client.service';

@Module({
  imports: [],
  providers: [MqttClientService],
  exports: [MqttClientService],
})
export class MqttClientModule {}
