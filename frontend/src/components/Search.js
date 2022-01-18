import React from 'react';
import "../styles/Search.css";


function Search() {

  return (

    <form className="search-container">
        <input className="search-input" placeholder="Search all files..."/>
        <button className="search-button" type="submit">
            <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon"/>
        </button>
    </form>

  );

}

export default Search;