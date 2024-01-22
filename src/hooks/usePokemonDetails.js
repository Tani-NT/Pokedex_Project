import { useState,useEffect } from "react";
import axios from 'axios';
import usePokemonList from "./usePokemonList";
import { useParams } from "react-router-dom";

function usePokemonDetails(PokemonName){
    const {id} = useParams();
    const [pokemon,setPokemon] = useState({});
    async function downloadPokemon(){
        try{
            let response;
            if(PokemonName){
                response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${PokemonName}`)
            }
            else{
                response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            }
            const pokemonOfSameTypes = await axios.get(`https://pokeapi.co/api/v2/type/${response.data.types? response.data.types[0].type.name : ''}`)
            console.log("sameTypes:",pokemonOfSameTypes);
            setPokemon({
                name: response.data.name,
                image: response.data.sprites.other.dream_world.front_default,
                weight: response.data.weight,
                height: response.data.height,
                types: response.data.types.map((t)=> t.type.name),
                similarPokemons: pokemonOfSameTypes.data.pokemon.slice(0,5)
            });
            console.log(response.data.types);
            setPokemonListState({
                ...pokemonListState,
                type: response.data.types? response.data.types[0].type.name : ''})
            }
        catch{
            console.log("something went wrong!");
        }
    }

    const [pokemonListState,setPokemonListState] = usePokemonList();

    useEffect(()=> {
        downloadPokemon();
        console.log("list", pokemon.types,pokemonListState);
    },[])

    return [pokemon];

}
export default usePokemonDetails;