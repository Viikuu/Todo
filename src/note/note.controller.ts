import {Controller, Get, Post, Body, Param, Delete, HttpStatus, Res, Put} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(@Res() response, @Body() createNoteDto: CreateNoteDto) {
    try {
      const newNote = await this.noteService.create(createNoteDto);

      return response.status(HttpStatus.CREATED).json({
        message: 'Student has been created successfully',
        newNote,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Note not created!',
        error: 'Bad Request',
      });
    }
  }

  @Get()
  async findAll(@Res() response) {
    try{
      const noteData = await this.noteService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'All notes data found successfully',
        noteData,
      })
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string) {
    try {
      const existingNote = await this.noteService.findOne(id);

      return response.status(HttpStatus.OK).json({
        message: 'Note found successfully',
        existingNote,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Put(':id')
  async update(@Res() response, @Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    try {
      const existingNote = await this.noteService.update(id, updateNoteDto);
      return response.status(HttpStatus.OK).json({
        message: 'Note has been successfully updated',
        existingNote,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete(':id')
  async remove(@Res() response, @Param('id') id: string) {
    try {
      const deletedNote = await this.noteService.remove(id);

      return response.status(HttpStatus.OK).json({
        message: 'Note deleted successfully',
        deletedNote,
      });
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }
}
