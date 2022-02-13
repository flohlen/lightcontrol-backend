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
    } else {
      return;
    }
  }

  async handleCommand(command: Command) {
    if (command.code === 'addDevice') {
      this.modelBuilderService.storeDevice(command.parameters);
      return command;
    } else if (command.code === 'deleteDevice') {
      this.modelBuilderService.deleteDevice(command.parameters);
      return command;
    } else {
      return `cannot handle ${command.code}`;
    }
  }

  async getStatus(deviceId: string) {
    return await this.modelBuilderService.getDevice(deviceId);
  }
}
