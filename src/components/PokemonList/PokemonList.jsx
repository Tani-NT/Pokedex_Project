import { useEffect, useState } from "react";
import Pokemon from "../Pokemon/Pokemon";
import axios from "axios";

// Import CSS
import './PokemonList.css'

function PokemonList(){

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading,setisLoading] = useState(true);
    const [pokedexUrl,setPokedexUrl] = useState("https://pokeapi.co/api/v2/pokemon/");

    const [nextUrl,setNextUrl] = useState('');
    const [prevUrl,setPrevUrl] = useState(''); 

    async function downloadPokemon(){
        try{
            setisLoading(true);
            // this downloads list of 20 pokemons
            const response = await axios.get(pokedexUrl);

            // we get an array og pokemon from results
            const pokemonResults = response.data.results;
            console.log(response.data);
            setNextUrl(response.data.next);
            setPrevUrl(response.data.previous);

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
    },[pokedexUrl]);

    return(
        <>
            <div className="pokemon-list-wrapper">
                <div className="pokemon-wrapper">
                    {(isLoading)? 'Loading' : 
                        pokemonList.map((p)=> <Pokemon name={p.name} image = {p.image} key={p.id} />)    
                    }
                </div>
                <div className="controls">
                    <button disabled={prevUrl == null} onClick={()=> setPokedexUrl(prevUrl)} >Prev</button>
                    <button disabled={nextUrl== null} onClick={()=> setPokedexUrl(nextUrl)} >Next</button>
                </div>
            </div>
        </>
    )
}
export default PokemonList;