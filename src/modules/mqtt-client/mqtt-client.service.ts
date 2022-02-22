import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BuilderService } from '../builder/builder.service';
import { Device } from '../builder/device.schema';

@Injectable()
export class MqttClientService implements OnModuleInit {
  constructor(
    private readonly modelBuilderService: BuilderService,

    @Inject('MQTT_Client')
    private client: ClientProxy,
  ) {}

  onModuleInit() {
    try {
      this.client.connect();
    } catch (error) {
      console.error(error);
    }
  }

  handleBridgeInfo(payload: any) {
    throw new Error('Method not implemented.');
  }
  handleBridgeEvent(payload: any) {
    throw new Error('Method not implemented.');
  }
  handleDeviceAvailability(deviceId: any, payload: any) {
    throw new Error('Method not implemented.');
  }
  handleDevice(deviceId: any, payload: any) {
    throw new Error('Method not implemented.');
  }
  handleBridgeDevices(payload: any) {
    throw new Error('Method not implemented.');
  }
  handleBridgeState(payload: any) {
    throw new Error('Method not implemented.');
  }

  async enablePermitJoin(device: Device, parameters: any) {
    const topic = 'zigbee2mqtt/bridge/request/permit_join';
    const payload = {
      value: true,
      time: parameters.timer,
    };

    this.publish(topic, payload);
  }

  async disablePermitJoin(device: Device, parameters: any) {
    const topic = 'zigbee2mqtt/bridge/request/permit_join';
    const payload = {
      value: false,
    };

    this.publish(topic, payload);
  }

  async restartCoordinator(device: Device, parameters: any) {
    const topic = 'zigbee2mqtt/bridge/request/restart';
    const payload = {};

    this.publish(topic, payload);
  }

  async removeDevice(device: Device, parameters: any) {
    const topic = 'zigbee2mqtt/bridge/request/device/remove';
    const payload = {
      id: device.address,
    };

    this.publish(topic, payload);
  }

  async updateDeviceState(device: Device, parameters: any) {
    const address =
      device.friendly_name != null ? device.friendly_name : device.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      state: parameters.state,
    };

    this.publish(topic, payload);
  }

  async startBrightnessMove(device: Device, parameters: any) {
    const direction = parameters.direction;
    const address =
      device.friendly_name != null ? device.friendly_name : device.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      brightness_move: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    };

    this.publish(topic, payload);
  }

  async stopBrightnessMove(device: Device, parameters: any) {
    const address =
      device.friendly_name != null ? device.friendly_name : device.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      brightness_move: 0,
    };

    this.publish(topic, payload);
  }

  async startColorTemperatureMove(device: Device, parameters: any) {
    const direction = parameters.direction;
    const address =
      device.friendly_name != null ? device.friendly_name : device.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      color_temp_move: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    };

    this.publish(topic, payload);
  }

  async stopColorTemperatureMove(device: Device, parameters: any) {
    const address =
      device.friendly_name != null ? device.friendly_name : device.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      brightness_move: 0,
    };

    this.publish(topic, payload);
  }

  async updateDeviceValues(device: Device, parameters: any) {
    const address =
      device.friendly_name != null ? device.friendly_name : device.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      brightness: parameters.brightness,
      color_temp: parameters.color_temp,
    };

    this.publish(topic, payload);
  }

  async bubatz(payload: any) {
    this.publish('zigbee2mqtt/' + payload.device_address + '/set', {
      brightness: payload.brightness,
    });
  }

  async publish(topic: string, payload: any) {
    const response = this.client.send(topic, payload);
    console.log(
      '\n' +
        topic +
        ' | ' +
        JSON.stringify(payload) +
        ' | ' +
        JSON.stringify(response),
    );
  }
}
