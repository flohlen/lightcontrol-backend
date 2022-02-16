import { Injectable } from '@nestjs/common';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getQuery(key: string) {
    if (key === 'devices') {
      return await this.modelBuilderService.getDevices();
    } else if (key === 'settings') {
      return await this.modelBuilderService.getUserSettings();
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
    } else if (command.code === 'deleteDevice') {
      this.modelBuilderService.deleteDevice(command.parameters);
      return command;
    } else if (command.code === 'updateSettings') {
      this.modelBuilderService.updateSettings(command.parameters);
      return command;
    } else if (command.code === 'updateDeviceStatus') {
      this.modelBuilderService.updateDeviceStatus(command.parameters);
      return command;
    } else {
      return `cannot handle ${command.code}`;
    }
  }
}
