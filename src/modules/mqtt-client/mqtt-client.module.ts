import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BuilderModule } from '../builder/builder.module';
import { MqttClientService } from './mqtt-client.service';

@Module({
  imports: [
    BuilderModule,
    ClientsModule.register([
      {
        name: 'MQTT_Client',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
        },
      },
    ]),
    MqttClientModule,
  ],
  providers: [MqttClientService],
  exports: [MqttClientService],
})
export class MqttClientModule {}
