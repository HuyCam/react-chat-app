import React from 'react';

import '../styles/search-bar.css';

class SearchBar extends React.Component {
    render() {
        return (
            <div className="search-box">
                <form className="email-search">
                    <input type="text" placeholder="user@email.com"/>
                    <button>Search</button>
                </form>
            </div>
        )
    }
}

export default SearchBar;