import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    @IsNotEmpty()
    state:boolean;
}
