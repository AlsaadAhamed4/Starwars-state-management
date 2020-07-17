import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import dummyData from './dummy-data';

import './styles.scss';
import endpoint from "./endpoint";

const useFetch = url => {
  const [response, setResponse] = useState(dummyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(response => {
        setLoading(false);
        setResponse(response);
      })
      .catch(error => {
        setLoading(false);
        setError(error);
      });
  }, [])

  return [error, loading, response, setResponse];
}

const Application = () => {
  const [error, loading, response] = useFetch(endpoint + '/characters');
  const characters = (response && response.characters) || [];
  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {
            loading ? <p>loading.....</p> : <CharacterList characters={characters} />
          }
          {error && <p className="error">{error.message}</p>}
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
