import { Module } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { PokeApiFetchAdapter } from './api/pokiapi.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon])
  ],
  controllers: [PokemonsController],
  providers: [PokemonsService, PokeApiFetchAdapter],
})
export class PokemonsModule {}
