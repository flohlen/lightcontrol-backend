/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Device {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  friendly_name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  name: string;

  @Prop()
  state: string;

  @Prop()
  brightness: number;

  @Prop()
  color_temp: number;

  @Prop()
  permit_join: boolean;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
