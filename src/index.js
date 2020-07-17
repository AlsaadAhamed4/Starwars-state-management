import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import dummyData from './dummy-data';

import './styles.scss';
import endpoint from "./endpoint";

const useFetch = url => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'LOADING'
    });

    const fetchUrl = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        dispatch({
          type: 'RESPONSE_COMPLETE',
          payload: {
            response: data
          }
        });
      }
      catch (error) {
        dispatch({
          type: 'ERRORS',
          payload: {
            error
          }
        });
      }
    }

    fetchUrl();

  }, [])

  return [state.error, state.loading, state.response];

}

const initialState = {
  response: null,
  loading: true,
  error: null
}

const fetchReducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      response: null,
      loading: true,
      error: null
    }
  }
  if (action.type === 'ERRORS') {
    return {
      response: null,
      loading: false,
      error: action.payload.error
    }
  }
  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      response: action.payload.response,
      loading: false,
      error: null
    }
  }
  return state;
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
