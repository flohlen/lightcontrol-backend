import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import Command from './modules/builder/command';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private httpsService: HttpService,
  ) {}

  // ============================================
  // HTTP
  // ============================================

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    const result = await this.appService.getQuery(key);
    this.logger.log('Result: GET query/' + key + ': ' + result);
    return result;
  }

  @Get('status')
  async getStatus(@Body() deviceId: string) {
    try {
      const result = await this.appService.getStatus(deviceId);
      this.logger.log('Result: GET status of' + deviceId + ': ' + result);
      return result;
    } catch (error) {
      return error;
    }
  }

  @Post('cmd')
  async postCommand(@Body() command: Command) {
    try {
      const result = await this.appService.handleCommand(command);
      this.logger.log('Result: POST cmd: ' + result);
      return result;
    } catch (error) {
      return error;
    }
  }

  // ============================================
  // MQTT
  // ============================================
  @MessagePattern('zigbee2mqtt/bridge/state')
  getBridgeState(@Payload() data: any, @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
  }

  @MessagePattern('zigbee2mqtt/bridge/devices')
  getBridgeDevices(@Payload() data: any, @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
  }

  @MessagePattern('zigbee2mqtt/bridge/groups')
  getBridgeGroups(@Payload() data: any, @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
  }

  @MessagePattern('zigbee2mqtt/bridge/event')
  getBridgeEvent(@Payload() data: any, @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
  }
}
