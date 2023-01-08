import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Model } from "mongoose";
import { Note } from "./schema/note.schema";

@Injectable()
export class NoteService {
  constructor(@InjectModel('Note') private noteModel:Model<Note>) { }

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note>{
    try {
      const newNote = await new this.noteModel({
        userId,
        ...createNoteDto
      });
      return newNote.save();
    }  catch {
      throw new InternalServerErrorException('Something went wrong! Try again');

    }
  }

  async findAll(userId: string): Promise<Note[]> {
    try {
      const noteData = await this.noteModel
        .find({
          userId,
        })
        .exec();

      if(!noteData || noteData.length === 0) {
        return null;
      }
      return noteData;
    } catch {
      throw new InternalServerErrorException('Something went wrong! Try again');
    }
  }

  async findOne(id: string, userId): Promise<Note> {
    if (!id.match(/^\w{24}$/)){
      throw new BadRequestException('Invalid ID: The provided ID has to be 24digits long.')
    }
    try {
      const existingNote = await this.noteModel
        .findOne({
          _id: id,
          userId
        })
        .exec();
      if (!existingNote) {
        return null;
      }
      return existingNote;
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Something went wrong! Try again');
    }
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    if (!id.match(/^\w{24}$/)){
      throw new BadRequestException('Invalid ID: The provided ID has to be 24digits long.')
    }
    let updateNote = {}

    if(!(typeof updateNoteDto?.state === 'boolean') && !updateNoteDto?.title) {
      throw new BadRequestException(`Bad request: Given object should contain at least one of the following : -title, -state`)
    } else {
      if(updateNoteDto?.title){
        updateNote = {...updateNote, title : updateNoteDto.title};
      }
      if(typeof updateNoteDto?.state === 'boolean'){
        updateNote = {...updateNote, state : updateNoteDto.state};
      }
    }
    try {
      const existingNote = await this.noteModel
        .findOneAndUpdate(
          {
            _id: id,
            userId
          },
          updateNote,
          {
            new: true,
          })
        .exec();

      if (!existingNote) {
        return null;
      }
      return existingNote;
    } catch {
      throw new InternalServerErrorException('Something went wrong! Try again');
    }
  }

  async remove(id: string, userId: string): Promise<Note> {
    if (!id.match(/^\w{24}$/)){
      throw new BadRequestException('Invalid ID: The provided ID has to be 24digits long.')
    }
    try {
      const deletedNote = await this.noteModel
        .findOneAndDelete({
          _id: id,
          userId
        })
        .exec();

      if (!deletedNote) {
        return null;
      }
      return deletedNote;
    } catch {
      throw new InternalServerErrorException('Something went wrong! Try again');
    }
  }
}
