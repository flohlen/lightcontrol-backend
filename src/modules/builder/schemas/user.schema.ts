/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
