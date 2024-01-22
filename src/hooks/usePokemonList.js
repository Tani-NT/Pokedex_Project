import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonList(){
    const [pokemonListState,setPokemonListState] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: "https://pokeapi.co/api/v2/pokemon",
        nextUrl: "",
        prevUrl: ""
    })

    async function downloadPokemon(){
        try{

                // setisLoading(true);
                setPokemonListState((state)=>({...state, isLoading: true}))

                // this downloads list of 20 pokemons
                const response = await axios.get(pokemonListState.pokedexUrl);

                // we get an array og pokemon from results
                const pokemonResults = response.data.results;
                console.log("response is: ",response.data.pokemon);
                console.log(pokemonListState);

                // setNextUrl(response.data.next);
                // setPrevUrl(response.data.previous);
                setPokemonListState((state)=> ({
                    ...state, 
                    nextUrl: response.data.next, 
                    prevUrl: response.data.previous
                }))

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
                // setPokemonList(pokemonListResult);
                // setisLoading(false);
                setPokemonListState((state)=> ({
                    ...state, 
                    pokemonList: pokemonListResult, 
                    isLoading: false
                }))
        }
        catch(error){
            console.log("Error while fetching Pokemon Data",error);
            // setisLoading(false);
            setPokemonListState((state)=> ({
                ...state,
                 isLoading: false
            }))
        }
    }
    useEffect(()=> {
        downloadPokemon();
    },[pokemonListState.pokedexUrl])   

    return(
        [pokemonListState,setPokemonListState]
    )
}
export default usePokemonList;