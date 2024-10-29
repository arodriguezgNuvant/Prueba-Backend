import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokeAPIResponse } from './interfaces/pokeapi-response.interface';
import { PokeApiFetchAdapter } from './api/pokiapi.adapter';
import { RatePokemonDto } from './dto/rate-pokemon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PokemonsService {
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  private puntuations: RatePokemonDto[] = [
    {
      id: 1,
      puntuation: 5,
    },
    {
      id: 2,
      puntuation: 4,
    },
    {
      id: 3,
      puntuation: 3,
    },
  ];

  private readonly logger = new Logger('PokemonsService');

  constructor(
    private readonly pokeApifetch: PokeApiFetchAdapter,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  // Obtener pokemones por nombre
  async getOne(name: string) {
    const { id, base_experience }: PokeAPIResponse =
      await this.pokeApifetch.get(`${this.apiUrl}/${name}`);
    return { id, name, base_experience };
  }

  // Obtener todos los pokemones haciendo uso de paginacion Offset y limit
  async getAll(offset: number, limit: number) {
    const response = await this.pokeApifetch.get(
      `${this.apiUrl}?offset=${offset}&limit=${limit}`,
    );
    return response;
  }

  // Método que permite calificar. json : { "id": 81, "puntuation":5}
  async rate(ratePokemonDto: RatePokemonDto) {
    const pokemon = await this.pokemonRepository.preload({
      ...ratePokemonDto,
    });
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id ${ratePokemonDto.id} not found`,
      );

    try {
      await this.pokemonRepository.save(pokemon);
      return pokemon;
    } catch (error) {
      this.handleDBExceptions(error);
    }
    throw new BadRequestException('Puntuation must be 1 to 5');
  }

  // Consultar el top de los pokemones mejores calificados
  async getTopRated(top: number) {
    let pokemons: Pokemon[];
    const queryBuilder = await this.pokemonRepository
      .createQueryBuilder()
      .where('puntuation IS NOT NULL')
      .orderBy('puntuation', 'DESC')
      .limit(top)
      .offset(0)
      .getMany();
    // if (top > 0) {
    //   const data: RatePokemonDto[] = this.sortRated();
    //   return data.slice(0, top);
    // }
    pokemons = queryBuilder;
    return pokemons;
  }

  // FIltrar
  async filter(name: string, ope: string, baseExperience: number) {
    let pokemons: Pokemon[];
    const queryBuilder = this.pokemonRepository
      .createQueryBuilder()
      .where('name LIKE :name', { name: `%${name}%` });
    switch (ope) {
      case 'gt':
        pokemons = await queryBuilder
          .andWhere('base_experience > :base_experience', {
            base_experience: baseExperience,
          })
          .getMany();
        break;
      case 'lt':
        pokemons = await queryBuilder
          .andWhere('base_experience < :base_experience', {
            base_experience: baseExperience,
          })
          .getMany();
        break;
      case 'ge':
        pokemons = await queryBuilder
          .andWhere('base_experience >= :base_experience', {
            base_experience: baseExperience,
          })
          .getMany();
        break;
      case 'le':
        pokemons = await queryBuilder
          .andWhere('base_experience <= :base_experience', {
            base_experience: baseExperience,
          })
          .getMany();
        break;
      case 'eq':
        pokemons = await queryBuilder
          .andWhere('base_experience = :base_experience', {
            base_experience: baseExperience,
          })
          .getMany();
        break;
    }
    return pokemons;
  }

  async populateDB() {
    const data = this.getAllPokemon();
    (await data).forEach((pokemon) =>
      this.create({
        id: pokemon.id,
        name: pokemon.name,
        base_experience: pokemon.base_experience,
      }),
    );
  }

  
  private async create(createPokemonDto: CreatePokemonDto) {
    const pokemon = this.pokemonRepository.create(createPokemonDto);
    await this.pokemonRepository.save(pokemon);
    return pokemon;
  }

  async getAllPokemon() {
    try {
      
      const response = await fetch(`${this.apiUrl}?limit=500`);
      const data = await response.json();
      const pokemonList = data.results;
      return this.getDetails(pokemonList);      
    } catch (error) {
      throw new Error('Error fetching')
    }
  }
  
  private async getDetails(pokemonList){
    try{
      const pokemonDetails: PokeAPIResponse[] = await Promise.all(
        pokemonList.map(async (pokemon) => {
          return this.getOne(pokemon.name);
        }),
        // pokemonList.map(async (pokemon) => {
        //   const pokemonResponse = await fetch(pokemon.url);
        //   const { id, name, base_experience } = await pokemonResponse.json();
        //   return { id, name, base_experience };
        // }),
      );
      return pokemonDetails;
      
    } catch(error){
      console.error('Error getting details:', error);
      throw new Error('Error getting details');
    }
  }
  
  // private sortRated() {
  //   const result: RatePokemonDto[] = this.puntuations.sort(
  //     (a, b) => b.puntuation - a.puntuation,
  //   );
  //   console.log(result);
  //   return result;
  // }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    
    this.logger.error(error);
    // console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
