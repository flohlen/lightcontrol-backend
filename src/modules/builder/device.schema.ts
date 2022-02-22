/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Device {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  address: string;

  @Prop()
  health: string;

  @Prop()
  friendly_name: string;

  @Prop()
  state: string;

  @Prop()
  brightness: number;

  @Prop()
  color_temp: number;

  @Prop()
  model: string;
  
  @Prop()
  vendor: string;

  @Prop()
  description: string;

  @Prop()
  exposes: string;

  @Prop()
  link_quality: string;

  @Prop()
  transition: number;

  @Prop()
  permit_join: boolean;

  @Prop({type: MongooseSchema.Types.Mixed})
  update: any;

  @Prop()
  color_mode: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
