import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Note extends Document {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    state: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);