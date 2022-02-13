import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import { Device } from './device.schema';

@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    private httpService: HttpService,

    @InjectModel('buildEvents')
    private buildEventModel: Model<BuildEvent>,

    @InjectModel('devices')
    private deviceModel: Model<Device>,
  ) {}

  async onModuleInit() {
    this.getDevices();
  }

  // ============================================
  // GETTER
  // ============================================
  async getDevices() {
    const list = this.deviceModel.find({}).exec();
    return list;
  }

  async getDevice(deviceId: string) {
    const device = await this.deviceModel.find({ deviceId: deviceId }).exec();
    return device;
  }

  async storeEvent(event: BuildEvent) {
    const filter = { eventId: event.eventId };
    return this.buildEventModel.findOneAndUpdate(filter, event, {
      upsert: true,
    });
  }

  async storeDevice(device: Device) {
    const filter = { deviceId: device.deviceId };
    return this.deviceModel.findByIdAndUpdate(filter, device, {
      upsert: true,
    });
  }

  async deleteDevice(device: Device) {
    const filter = { deviceId: device.deviceId };
    return this.deviceModel.deleteOne(filter);
  }
}
