import { Injectable } from '@nestjs/common';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/schemas/command';
import { MqttClientService } from './modules/mqtt-client/mqtt-client.service';

@Injectable()
export class AppService {
  constructor(
    private readonly modelBuilderService: BuilderService,
    private readonly mqttClientService: MqttClientService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getQuery(key: string): Promise<any> {
    if (key === 'settings') {
      return await this.modelBuilderService.getUserSettings();
    } else if (key === 'devices') {
      return await this.modelBuilderService.getDevices();
    } else if (key.startsWith('device_')) {
      const substring = key.substring('device_'.length);
      return await this.modelBuilderService.getDevice(substring);
    } else {
      const list = await this.modelBuilderService.getByTag(key);
      const answer = {
        key: key,
        result: list,
      };
      return answer;
    }
  }

  async getStatus(deviceId: string) {
    return await this.modelBuilderService.getDevice(deviceId);
  }

  async handleCommand(command: Command) {
    if (command.code === 'storeDevice') {
      this.modelBuilderService.storeDevice(command.parameters);
      return command.code;
    } else if (command.code === 'removeDevice') {
      const device = await this.modelBuilderService.removeDevice(
        command.parameters,
      );
      this.mqttClientService.removeDevice(command.parameters);
      return command.code;
    } else if (command.code === 'updateSettings') {
      this.modelBuilderService.updateSettings(command.parameters);
      return command.code;
    } else if (command.code === 'updateDeviceState') {
      this.mqttClientService.updateDeviceState(command.parameters);
      return command.code;
    } else if (command.code === 'startBrightnessMove') {
      this.mqttClientService.startBrightnessMove(command.parameters);
      return command.code;
    } else if (command.code === 'startColorTemperatureMove') {
      this.mqttClientService.startColorTemperatureMove(command.parameters);
      return command.code;
    } else if (command.code === 'stopBrightnessMove') {
      this.mqttClientService.stopBrightnessMove(command.parameters);
      return command.code;
    } else if (command.code === 'stopColorTemperatureMove') {
      this.mqttClientService.stopColorTemperatureMove(command.parameters);
      return command.code;
    } else if (command.code === 'updateDeviceValues') {
      this.mqttClientService.updateDeviceValues(command.parameters);
      return command.code;
    } else if (command.code === 'enablePermitJoin') {
      this.mqttClientService.enablePermitJoin(command.parameters);
      return command.code;
    } else if (command.code === 'disablePermitJoin') {
      this.mqttClientService.disablePermitJoin();
      return command.code;
    } else if (command.code === 'restartCoordinator') {
      const device = await this.modelBuilderService.restartCoordinator(
        command.parameters,
      );
      this.mqttClientService.restartCoordinator(command.parameters);
      return command.code;
    } else if (command.code === 'executeEffect') {
      this.mqttClientService.executeEffect(command.parameters);
      return command.code;
    } else {
      return `cannot handle ${command.code}`;
    }
  }

  // ============================================
  // MQTT
  // ============================================
  handleBridgeInfoTopic(topic: string, payload: any) {
    console.log('\n' + topic + ' : ' + JSON.stringify(payload));
    this.modelBuilderService.updateBridgeInfo(payload);
  }

  handleBridgeStateTopic(topic: string, payload: any) {
    console.log('\n' + topic + ' : ' + JSON.stringify(payload));
    this.modelBuilderService.updateBridgeState(payload);
  }

  handleBridgeDevicesTopic(topic: string, payload: any) {
    console.log('\n' + topic + ' : ' + JSON.stringify(payload));
    for (const device of payload) {
      if (device.type === 'Coordinator') {
        this.modelBuilderService.storeCoordinator(device);
      } else {
        this.modelBuilderService.storeDevice(device);
      }
    }
  }

  handleBridgeEventTopic(topic: string, payload: any) {
    this.mqttClientService.handleBridgeEvent(payload);
  }

  handleDeviceTopic(topic: string, payload: any) {
    console.log('\n' + topic + ' : ' + JSON.stringify(payload));
    const device_id = topic.substring('zigbee2mqtt/'.length);
    this.modelBuilderService.updateDevice(device_id, payload);
  }

  handleDeviceAvailabilityTopic(topic: string, payload: any) {
    console.log(payload);
    // update database for device id
    const deviceId = null;
    this.mqttClientService.handleDeviceAvailability(deviceId, payload);
  }
}
