import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { RatePokemonDto } from './dto/rate-pokemon.dto';
import { threadId } from 'worker_threads';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get('db')
  filter(
    @Query('name') name: string,
    @Query('ope') ope: string,
    @Query('base_experience', ParseIntPipe) base_experience: number,
  ) {
    return this.pokemonsService.filter(name, ope, base_experience);
  }
  @Get(':name')
  getOne(@Param('name') name: string) {
    return this.pokemonsService.getOne(name);
  }

  @Get()
  getAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.pokemonsService.getAll(offset, limit);
  }

  // @Get('getAll')
  // async getAllP(){
  //   console.log('hola')
  //   return await this.pokemonsService.getAllPokemon();
  // }

  @Get('topRated/:top')
  getTopRated(@Param('top', ParseIntPipe) top: number) {
    return this.pokemonsService.getTopRated(top);
  }

  @Patch('/rate')
  ratePokemon(@Body() ratePokemon: RatePokemonDto) {
    return this.pokemonsService.rate(ratePokemon);
  }


  @Post('/populateDB')
  populateDB() { 
    return this.pokemonsService.populateDB();
  }
}
