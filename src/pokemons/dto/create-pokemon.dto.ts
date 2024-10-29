import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreatePokemonDto {

    @IsPositive()
    id: number;

    @IsString()
    name: string;

    @IsNumber()
    base_experience: number;

}
