import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class Note extends Document {
    @Prop({type: String, required: true})
    title: string;

    @Prop({type: Boolean, required: true})
    state: boolean;

    @Prop({ type: String, required: true })
    userId: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
