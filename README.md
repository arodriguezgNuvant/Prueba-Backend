<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Desarrollo prueba back

Prueba backend desarrollada con NestJS, TypeORM, Docker, Postgresql y Postman.
El archivo .env se sube para facilitar la conexción a la base de datos.

## Pasos para ejecutar el proyecto
1. Clonar el proyecto.
2. Entrar a la carpeta del proyecto.
3. Ejecutar `npm install`
4. Ejecutar `npm run start:dev`


## Endpoints


0. Poblar la base de datos. Este endpoint se encarga de consultar 500 pokemones e introducirlos a la base de datos para poder realizar las consultas relacionadas a este.
```
http://localhost:3000/pokemons/populateDB
```

1. GetOne (obtener un Pokemon por nombre)
```
http://localhost:3000/pokemons/{name}
```

2. GetAll (Obtener todos los pokemones con una paginación haciendo uso de Offset y Limit)
```
http://localhost:3000/pokemons/?offset=0&limit=10
```

3. Crear un método que permita calificar un Pokemon de 1 a 5 (se debe crear un DTO)

```
http://localhost:3000/pokemons/rate

{
    "id": 81,
    "puntuation": 5
}
```
4. Crear un método que permita consultar el top de los pokemones mejores calificados.
```
http://localhost:3000/pokemons/topRated/3
```

5. Crear un método que permita consultar el top de los pokemones mejores calificados (En los query parámetros se enviará en valor del top). 
- Parte del nombre no debe distinguir de mayúsculas o minúsculas.
- Filtros
  - ope=gt (mayor)
  - ope=lt (menor)
  - ope=ge (mayor igual)
  - ope=le (menor igual)
  - ope=eq (igual)
- Valor del parámetro: base_experience
```
http://localhost:3000/pokemons/db?name=bul&ope=gt&base_experience=20
```

