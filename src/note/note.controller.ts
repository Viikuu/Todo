import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Res,
  Put,
  Request,
  BadRequestException, HttpCode, NotFoundException, UseGuards
} from "@nestjs/common";
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() request, @Body() createNoteDto: CreateNoteDto) {
    try {
      const newNote = await this.noteService.create(createNoteDto, request.user._id);
      return {
        message: 'Note has been created successfully',
        newNote,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Error: Note not created!');
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() request) {
    const noteData = await this.noteService.findAll(request);
    if(!noteData) {
      return {
        message: 'All notes data found successfully',
        noteData: [],
      };
    }
    return {
      message: 'All notes data found successfully',
      noteData,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Request() request, @Param('id') id: string) {
    const existingNote = await this.noteService.findOne(id, request.user._id);
    if(!existingNote) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
    return {
      message: 'Note found successfully',
      existingNote,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Request() request, @Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    const existingNote = await this.noteService.update(id, updateNoteDto, request.user._id);
    if (!existingNote) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
    return {
      message: 'Note has been successfully updated',
      existingNote,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Request() request, @Param('id') id: string) {
    const deletedNote = await this.noteService.remove(id, request.user._id);
    if (!deletedNote) {
      throw new NotFoundException(`Note #${id} not found!`);
    }
    return {
      message: 'Note deleted successfully',
      deletedNote,
    };
  }
}
