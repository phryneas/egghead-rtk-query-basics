import React from "react";
import ReactDOM from "react-dom/client";
import { createApi, ApiProvider } from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: () => {},
  endpoints: (build) => ({
    pokemonList: build.query({
      async queryFn() {
        const result = await fetch("https://pokeapi.co/api/v2/pokemon?limit=9");
        if (result.ok) {
          const data = await result.json();
          return { data };
        } else {
          return { error: "something went wrong" };
        }
      },
    }),
    pokemonDetail: build.query({
      async queryFn() {
        const result = await fetch("https://pokeapi.co/api/v2/pokemon/1/");
        if (result.ok) {
          const data = await result.json();
          return { data };
        } else {
          return { error: "something went wrong" };
        }
      },
    }),
  }),
});

const { usePokemonListQuery, usePokemonDetailQuery } = api;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApiProvider api={api}>
      <App />
    </ApiProvider>
  </React.StrictMode>
);

function App() {
  const [selectedPokemon, selectPokemon] = React.useState(undefined);

  return (
    <>
      <header>
        <h1>My Pokedex</h1>
      </header>
      <main>
        {selectedPokemon ? (
          <>
            <PokemonDetails pokemonName={selectedPokemon} />
            <button onClick={() => selectPokemon(undefined)}>back</button>
          </>
        ) : (
          <PokemonList onPokemonSelected={selectPokemon} />
        )}
      </main>
    </>
  );
}

function PokemonList({ onPokemonSelected }) {
  const { isLoading, isError, isSuccess, data } = usePokemonListQuery();

  if (isLoading) {
    return <p>loading, please wait</p>;
  }

  if (isError) {
    return <p>something went wrong</p>;
  }

  if (isSuccess) {
    return (
      <article>
        <h2>Overview</h2>
        <ol start={1}>
          {data.results.map((pokemon) => (
            <li key={pokemon.name}>
              <button onClick={() => onPokemonSelected(pokemon.name)}>
                {pokemon.name}
              </button>
            </li>
          ))}
        </ol>
      </article>
    );
  }
}

const listFormatter = new Intl.ListFormat("en-GB", {
  style: "short",
  type: "conjunction",
});
function PokemonDetails({ pokemonName }) {
  const { isLoading, isError, isSuccess, data } = usePokemonDetailQuery();

  if (isLoading) {
    return <p>loading, please wait</p>;
  }

  if (isError) {
    return <p>something went wrong</p>;
  }

  if (isSuccess) {
    return (
      <article>
        <h2>{data.name}</h2>
        <img src={data.sprites.front_default} alt={data.name} />
        <ul>
          <li>id: {data.id}</li>
          <li>height: {data.height}</li>
          <li>weight: {data.weight}</li>
          <li>
            types:
            {listFormatter.format(data.types.map((item) => item.type.name))}
          </li>
        </ul>
      </article>
    );
  }
}
