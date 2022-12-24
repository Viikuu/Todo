import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Model } from "mongoose";
import { Note } from "./schema/note.schema";

@Injectable()
export class NoteService {
  constructor(@InjectModel('Note') private noteModel:Model<Note>) { }

  async create(createNoteDto: CreateNoteDto): Promise<Note>{
    const newNote = await new this.noteModel(createNoteDto);
    return newNote.save();
  }

  async findAll(): Promise<Note[]> {
    const noteData = await this.noteModel.find();

    if(!noteData || noteData.length === 0) {
      throw new NotFoundException('Notes data not found!');
    }
    return noteData;
  }

  async findOne(id: string): Promise<Note> {
    const existingNote = await this.noteModel
        .findById(id)
        .exec();

    if (!existingNote) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
    return existingNote;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const existingNote = await this.noteModel
        .findByIdAndUpdate(
          id,
          updateNoteDto,
          {new: true})
        .exec();

    if (!existingNote) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
    return existingNote;
  }

  async remove(id: string): Promise<Note> {
    const deletedNote = await this.noteModel.findByIdAndDelete(id);

    if (!deletedNote) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
    return deletedNote;
  }
}
