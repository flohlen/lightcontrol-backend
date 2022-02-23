import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { BuildEvent } from './schemas/build-event.schema';
import { Device } from './schemas/device.schema';
import { User } from './schemas/user.schema';

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
    await this.buildEventModel.deleteMany();
    await this.deviceModel.deleteMany();
    await this.userModel.deleteMany();
    console.log('database clear');
  }

  // ============================================
  // GETTER
  // ============================================
  async getByTag(tag: string) {
    const list = this.buildEventModel.find({ tags: tag }).exec();
    return list;
  }

  async getDevices(): Promise<Device[]> {
    const list = this.deviceModel.find({}).exec();
    return list;
  }

  async getDevice(id: string): Promise<Device> {
    const device = await this.deviceModel.findOne({ id: id }).exec();
    return device;
  }

  async getUserSettings(): Promise<User> {
    const user = await this.userModel.findOne({}).exec();
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

  async updateDevice(friendly_name: string, payload: any) {
    const filter = { friendly_name: friendly_name };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          brightness: payload.brightness,
          color_temp: payload.color_temp,
          state: payload.state,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  // ============================================
  // BRIDGE
  // ============================================
  async updateBridgeState(data: any) {
    const filter = { id: 'bridge' };
    return this.deviceModel.findOneAndUpdate(
      filter,
      {
        state: data.state,
      },
      { upsert: true, new: true },
    );
  }

  async updateBridgeInfo(data: any) {
    const filter = { id: 'bridge' };
    return this.deviceModel.findOneAndUpdate(
      filter,
      {
        permit_join: data.permit_join,
        friendly_name: 'bridge',
        address: 'bridge',
      },
      { upsert: true, new: true },
    );
  }

  async storeCoordinator(data: any) {
    const filter = { friendly_name: data.friendly_name };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          id: data.ieee_address,
          name: 'Coordinator',
          friendly_name: data.friendly_name,
          address: data.ieee_address,
          type: data.type,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async storeDevice(data: any) {
    const filter = { friendly_name: data.friendly_name };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          id: data.ieee_address,
          name: data.definition.model,
          friendly_name: data.friendly_name,
          address: data.ieee_address,
          type: data.type,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async removeDevice(device: Device): Promise<Device> {
    const event = {
      eventId: uuidv4(),
      eventType: 'deviceRemoved',
      time: new Date().toISOString(),
      tags: ['devices', device.id],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { id: device.id };
    return this.deviceModel.findOneAndDelete(filter).exec();
  }

  async updateSettings(user: User) {
    const event = {
      eventId: uuidv4(),
      eventType: 'settingsUpdated',
      time: new Date().toISOString(),
      tags: ['settings', user.id],
      payload: user,
    };
    this.storeEvent(event);

    const filter = { id: user.id };
    return this.userModel
      .findOneAndUpdate(filter, user, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async updateDeviceState(device: any): Promise<Device> {
    const event = {
      eventId: uuidv4(),
      eventType: 'deviceStateUpdated',
      time: new Date().toISOString(),
      tags: ['devices', device.id],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { id: device.id };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          state: device.state,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async updateDeviceValues(device: any): Promise<Device> {
    const event = {
      eventId: uuidv4(),
      eventType: 'deviceValuesUpdated',
      time: new Date().toISOString(),
      tags: ['devices', device.id],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { id: device.id };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          brightness: device.brightness,
          color_temp: device.color_temp,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async enablePermitJoin(device: any): Promise<Device> {
    const event = {
      eventId: uuidv4(),
      eventType: 'enablePermitJoin',
      time: new Date().toISOString(),
      tags: ['bridge', device.id],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { id: 'bridge' };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          permit_join: true,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async disablePermitJoin(device: any): Promise<Device> {
    const event = {
      eventId: uuidv4(),
      eventType: 'disablePermitJoin',
      time: new Date().toISOString(),
      tags: ['bridge', device.id],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { id: 'bridge' };
    return this.deviceModel
      .findOneAndUpdate(
        filter,
        {
          permit_join: false,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async restartCoordinator(device: any): Promise<Device> {
    const event = {
      eventId: uuidv4(),
      eventType: 'restartCoordinator',
      time: new Date().toISOString(),
      tags: ['bridge', device.id],
      payload: device,
    };
    this.storeEvent(event);

    const filter = { id: device.id };
    return this.deviceModel.findOne(filter).exec();
  }
}
