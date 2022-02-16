import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { BuildEvent } from './build-event.schema';
import { Device } from './device.schema';
import { User } from './user.schema';

@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    private httpService: HttpService,

    @InjectModel('buildEvents')
    private buildEventModel: Model<BuildEvent>,

    @InjectModel('devices')
    private deviceModel: Model<Device>,

    @InjectModel('users')
    private userModel: Model<User>,
  ) {}

  async onModuleInit() {
    this.getDevices();
  }

  // ============================================
  // GETTER
  // ============================================
  async getByTag(tag: string) {
    const list = this.buildEventModel.find({ tags: tag }).exec();
    return list;
  }

  async getDevices() {
    const list = this.deviceModel.find({}).exec();
    return list;
  }

  async getDevice(deviceId: string) {
    const device = await this.deviceModel.find({ deviceId: deviceId }).exec();
    return device;
  }

  async getUserSettings() {
    const user = await this.userModel.find().exec();
    return user;
  }

  async storeEvent(event: BuildEvent) {
    const filter = { eventId: event.eventId };
    return this.buildEventModel
      .findOneAndUpdate(filter, event, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async storeDevice(device: Device) {
    const event = {
      eventId: uuidv4(),
      eventType: 'deviceStored',
      time: new Date().toISOString(),
      tags: ['devices', device.deviceId],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { deviceId: device.deviceId };
    return this.deviceModel
      .findOneAndUpdate(filter, device, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async deleteDevice(device: Device) {
    const event = {
      eventId: uuidv4(),
      eventType: 'deviceDeleted',
      time: new Date().toISOString(),
      tags: ['devices', device.deviceId],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { deviceId: device.deviceId };
    return this.deviceModel.deleteOne(filter).exec();
  }

  async updateSettings(user: User) {
    const event = {
      eventId: uuidv4(),
      eventType: 'settingsUpdated',
      time: new Date().toISOString(),
      tags: ['settings', user.userId],
      payload: user,
    };
    this.storeEvent(event);

    const filter = { userId: user.userId };
    return this.userModel
      .findOneAndUpdate(filter, user, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async updateDeviceStatus(device: any) {
    const event = {
      eventId: uuidv4(),
      eventType: 'deviceStatusUpdated',
      time: new Date().toISOString(),
      tags: ['devices', device.deviceId],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { deviceId: device.deviceId };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          status: device.status,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }
}
