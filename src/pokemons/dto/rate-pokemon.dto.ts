import { IsNumber } from "class-validator";

export class RatePokemonDto{
    @IsNumber()
    id: number;
    @IsNumber()
    puntuation: number;
}