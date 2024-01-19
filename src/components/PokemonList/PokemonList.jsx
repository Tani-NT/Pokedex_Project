import { useEffect, useState } from "react";
import Pokemon from "../Pokemon/Pokemon";
import axios from "axios";

// Import CSS
import './PokemonList.css'

function PokemonList(){

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading,setisLoading] = useState(true);
    const POKEDEX_URL = "https://pokeapi.co/api/v2/pokemon/";

    async function downloadPokemon(){
        try{
            // this downloads list of 20 pokemons
            const response = await axios.get(POKEDEX_URL);

            // we get an array og pokemon from results
            const pokemonResults = response.data.results;

            // now we are iterating over the array of pokemons an dusing their url to create promises that will return 20 pokemons
            const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));

            // passing that promise array to axios.all
            // will get us detailed of 20 pokemons
            const pokemonData = await axios.all(pokemonResultPromise);

            // now iterate on the data of each pokemon and extract id, name, image and type
            const pokemonListResult = pokemonData.map((pokeData)=> {
                const pokemon = pokeData.data
                return{
                    id: pokemon.id,
                    name: pokemon.name,
                    // ternary operator
                    image:(pokemon.sprites.other) ?  pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                    types: pokemon.types.map((type)=> type.type.name),
                }
            });
            console.log(pokemonListResult);
            setPokemonList(pokemonListResult);
            setisLoading(false);
        }
        catch(error){
            console.log("Error while fetching Pokemon Data",error);
            setisLoading(false);
        }
}      

    useEffect(() => {
        downloadPokemon();
    },[]);

    return(
        <>
            <div className="pokemon-list-wrapper">
                <div>Pokemon List</div>
                {(isLoading)? 'Loading' : 
                    pokemonList.map((p)=> <Pokemon name={p.name} image = {p.image} key={p.id} />)    
                }
            </div>
        </>
    )
}
export default PokemonList;