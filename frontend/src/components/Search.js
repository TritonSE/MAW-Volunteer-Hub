import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import "../styles/Search.css";


const allFiles = [
    {
        'id': 'file_1',
        'name': 'MAW File'
    }, 
    {
        'id': 'file_2',
        'name': 'TSE File'
    },
    {
        'id': 'file_3',
        'name': 'Testing'
    },
];

function Search() {

    const [input, setInput] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [filteredFiles, setFilteredFiles] = useState([]);

    // const [allFiles, setAllFiles] = useState([]);

    useEffect ( () => {
        setFilteredFiles(allFiles.filter(f => f['name'].toLowerCase().includes(input.toLowerCase())));
    }, [input] );

    useEffect ( () => {
        // get all files
    }, []);


  return (

    <form className="search-container" role="search" onSubmit={(e) => e.preventDefault()}>

        <input className="search-input" placeholder="Search all files..." onChange={(e) => setInput(e.target.value)}/>
        <button className="search-button" type="submit" onClick={() => setShowResults(prevState => !prevState)}>
            <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon"/>
        </button>

        <Modal
            isOpen={showResults}
            onRequestClose={() => setShowResults(prevState => !prevState)}
            className="search-results"
            overlayClassName="search-results-overlay"
        >
            <div className="results-container">

                <p>"{input}"</p>


                { input === "" ? (

                    <div>
                        {allFiles.map(val => (
                            <p>{val.name}</p>
                        ))}  
                    </div>
                )
                :
                ( filteredFiles.length === 0 ? (
                    <div>
                        <p>No results for {input}</p>
                    </div>
                    )
                    :
                    (
                    <div>
                        {filteredFiles.map(val => (
                            <p>{val.name}</p>
                        ))}                        
                    </div>
                    )
                )

                }


            </div>
        </Modal>

    </form>

  );

}

export default Search;