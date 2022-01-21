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

                <button className="close-button" onClick={() => setShowResults(prevState => !prevState)}>
                    <img src="/img/search_exit_icon.svg" alt="Close Search Results" className="close-icon"/>
                </button>

                { input === "" ? (

                    <div>
                        <p className="fontsize-18">All files</p>
                        {allFiles.map( (val, index) => (
                        <div className="file-result" style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF': '#bbbcbc33' }}>
                            <p>{val.name}</p>
                        </div>
                        ))}  
                    </div>
                )
                :
                ( filteredFiles.length === 0 ? (
                    <div className="no-results">
                        <img src="/img/sad_face.svg" alt="Sad Face" className="sad-face"/>
                        <p className="fontsize-18">No files related to <q>{input}</q> found.</p>
                        <p className="fontsize-12">Please enter a new search keyword.</p>
                    </div>
                    )
                    :
                    (
                    <div>
                        <p className="fontsize-18">All files with keyword <q>{input}</q></p>
                        {filteredFiles.map( (val, index) => (
                            <div className="file-result" style={{ backgroundColor: index % 2 === 0 ? '#FFFFFF': '#bbbcbc33' }}>
                                <p>{val.name}</p>
                            </div>
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