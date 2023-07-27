// src/App.js
import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';
import './App.css';

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results {
        id
        name
        status
        image
        location {
          name
        }
        episode {
          name
        }
        origin {
          name
        }
        species
      }
    }
  }
`;

const CharacterCard = ({ character }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine the class name for the status box based on the character's status
  const statusClassName = character.status === 'Alive' ? 'alive' : character.status === 'Dead' ? 'dead' : 'unknown';

  return (
    <div
      className={`card ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`status-box ${statusClassName}`}>
        <p>{character.status}</p>
      </div>
      <img src={character.image} alt={character.name} />
      <h2>{character.name}</h2>
      <p>Origin: {character.origin.name}</p>
      <p>Species: {character.species}</p>
      <div className={`expandable-content ${isExpanded ? 'visible' : ''}`}>
        <p>Location: {character.location.name}</p>
        <p>Episodes: {character.episode.length}</p>
      </div>
    </div>
  );
};

const App = () => {
  const { loading, error, data } = useQuery(GET_CHARACTERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { results } = data.characters;

  return (
    <div className="App">
      <h1>Rick and Morty</h1>
      <div className="cards-container">
        {results.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

const AppWithApollo = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default AppWithApollo;
