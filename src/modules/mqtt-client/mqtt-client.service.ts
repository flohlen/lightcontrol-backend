import { Injectable, OnModuleInit } from '@nestjs/common';
import { BuilderService } from '../builder/builder.service';
import { Device } from '../builder/schemas/device.schema';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttClientService implements OnModuleInit {
  constructor(private readonly modelBuilderService: BuilderService) {}

  private mqttClient: mqtt.MqttClient;

  onModuleInit() {
    this.mqttClient = mqtt.connect('mqtt:localhost:1883');
  }

  handleBridgeEvent(payload: any) {
    throw new Error('Method not implemented.');
  }
  handleDeviceAvailability(deviceId: any, payload: any) {
    throw new Error('Method not implemented.');
  }

  async enablePermitJoin(parameters: any) {
    const topic = 'zigbee2mqtt/bridge/request/permit_join';
    const payload = {
      value: true,
      time: parameters.timer,
    };

    this.publish(topic, payload);
  }

  async disablePermitJoin() {
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

  async updateDeviceState(parameters: any) {
    const address = parameters.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      state: parameters.state,
    };

    this.publish(topic, payload);
  }

  async startBrightnessMove(parameters: any) {
    const direction = parameters.direction;
    const address = parameters.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      brightness_move: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    };

    this.publish(topic, payload);
  }

  async stopBrightnessMove(parameters: any) {
    const address = parameters.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      brightness_move: 0,
    };

    this.publish(topic, payload);
  }

  async startColorTemperatureMove(parameters: any) {
    console.log(parameters.direction + ' | ' + parameters.address);
    const direction = parameters.direction;
    const address = parameters.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      color_temp_move:
        direction === 'warm' ? 40 : direction === 'cool' ? -40 : 0,
    };

    this.publish(topic, payload);
  }

  async stopColorTemperatureMove(parameters: any) {
    const address = parameters.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      color_temp_move: 0,
    };

    this.publish(topic, payload);
  }

  async updateDeviceValues(parameters: any) {
    const address = parameters.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      brightness: parameters.brightness,
      color_temp: parameters.color_temp,
    };

    this.publish(topic, payload);
  }

  async executeEffect(parameters: any) {
    const address = parameters.address;

    const topic = 'zigbee2mqtt/' + address + '/set';
    const payload = {
      effect: parameters.effect,
    };

    this.publish(topic, payload);
  }

  async publish(topic: string, payload: any) {
    this.mqttClient.publish(topic, JSON.stringify(payload));
  }
}
