import { Injectable, NotFoundException } from '@nestjs/common';
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
    try {
      const existingNote = await this.noteModel
          .findById(id)
          .exec();

      if (!existingNote) {
        throw "Bad Id";
      }
      return existingNote;
    } catch (error) {
      throw new NotFoundException(`Note #${id} not found!`);
    }

  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    try{
      const existingNote = await this.noteModel
          .findByIdAndUpdate(
              id,
              updateNoteDto)
          .exec();

      if (!existingNote) {
        throw "Bad Id";
      }
      return existingNote;
    } catch (error) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
  }

  async remove(id: string): Promise<Note> {
    try {
      const deletedNote = await this.noteModel
          .findByIdAndDelete(id)
          .exec();

      if (!deletedNote) {
        throw "Bad Id";
      }
      return deletedNote;
    } catch (error) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
  }
}
