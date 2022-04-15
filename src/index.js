import React from "react";
import ReactDOM from "react-dom/client";
import {
  createApi,
  ApiProvider,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://pokeapi.co/api/v2/",
  }),
  endpoints: (build) => ({
    pokemonList: build.query({
      query() {
        return {
          // these are specific to `fetchBaseQuery`
          url: "pokemon",
          params: { limit: 9 },
          // all the different arguments that you could also pass into the `fetch` "init" option
          // see https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters
          method: "GET", // GET is the default, this could be skipped
        };
      },
    }),
    pokemonDetail: build.query({
      query: ({ name }) => `pokemon/${name}/`,
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
  const { isLoading, isError, isSuccess, data } = usePokemonDetailQuery({
    name: pokemonName,
  });

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
