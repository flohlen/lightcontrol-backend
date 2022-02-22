import { Injectable } from '@nestjs/common';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
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
      return command;
    } else if (command.code === 'removeDevice') {
      const device = await this.modelBuilderService.removeDevice(
        command.parameters,
      );
      this.mqttClientService.removeDevice(device, command.parameters);
      return command;
    } else if (command.code === 'updateSettings') {
      this.modelBuilderService.updateSettings(command.parameters);
      return command;
    } else if (command.code === 'updateDeviceState') {
      const device = await this.modelBuilderService.updateDeviceState(
        command.parameters,
      );
      this.mqttClientService.updateDeviceState(device, command.parameters);
      return command;
    } else if (command.code === 'startBrightnessMove') {
      const device = await this.modelBuilderService.getDevice(
        command.parameters.id,
      );
      this.mqttClientService.startBrightnessMove(device, command.parameters);
      return command;
    } else if (command.code === 'startColorTemperatureMove') {
      const device = await this.modelBuilderService.getDevice(
        command.parameters.id,
      );
      this.mqttClientService.startColorTemperatureMove(
        device,
        command.parameters,
      );
      return command;
    } else if (command.code === 'stopBrightnessMove') {
      const device = await this.modelBuilderService.getDevice(
        command.parameters.id,
      );
      this.mqttClientService.stopBrightnessMove(device, command.parameters);
      return command;
    } else if (command.code === 'stopColorTemperatureMove') {
      const device = await this.modelBuilderService.getDevice(
        command.parameters.id,
      );
      this.mqttClientService.stopColorTemperatureMove(
        device,
        command.parameters,
      );
      return command;
    } else if (command.code === 'updateDeviceValues') {
      const device = await this.modelBuilderService.updateDeviceValues(
        command.parameters,
      );
      this.mqttClientService.updateDeviceValues(device, command.parameters);
      return command;
    } else if (command.code === 'enablePermitJoin') {
      const device = await this.modelBuilderService.enablePermitJoin(
        command.parameters,
      );
      this.mqttClientService.enablePermitJoin(device, command.parameters);
    } else if (command.code === 'disablePermitJoin') {
      const device = await this.modelBuilderService.disablePermitJoin(
        command.parameters,
      );
      this.mqttClientService.disablePermitJoin(device, command.parameters);
    } else if (command.code === 'restartCoordinator') {
      const device = await this.modelBuilderService.restartCoordinator(
        command.parameters,
      );
      this.mqttClientService.restartCoordinator(device, command.parameters);
    } else {
      return `cannot handle ${command.code}`;
    }
  }

  // ============================================
  // MQTT
  // ============================================
  handleBridgeInfoTopic(topic: string, payload: any) {
    console.log(payload);
    this.mqttClientService.handleBridgeInfo(payload);
  }

  handleBridgeStateTopic(topic: string, payload: any) {
    console.log(payload);
    // update database
    this.mqttClientService.handleBridgeState(payload);
  }

  handleBridgeDevicesTopic(topic: string, payload: any) {
    console.log(payload);
    this.mqttClientService.handleBridgeDevices(payload);
  }

  handleBridgeEventTopic(topic: string, payload: any) {
    this.mqttClientService.handleBridgeEvent(payload);
  }

  handleDeviceTopic(topic: string, payload: any) {
    console.log(payload);
    const deviceId = null;
    this.mqttClientService.handleDevice(deviceId, payload);
  }

  handleDeviceAvailabilityTopic(topic: string, payload: any) {
    console.log(payload);
    // update database for device id
    const deviceId = null;
    this.mqttClientService.handleDeviceAvailability(deviceId, payload);
  }

  bubatz(topic: string, payload: any) {
    this.mqttClientService.bubatz(payload);
  }
}
