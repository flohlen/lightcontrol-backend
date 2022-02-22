/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Device {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
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

  @Prop()
  update: any;

  @Prop()
  color_mode: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
