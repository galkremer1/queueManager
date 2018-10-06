import React, { Component } from 'react';
import Header from './components/Header';

//import  from './components'

class App extends Component {
    render() {
        const pathname = window.location.pathname
        return ( 
            <div>
            { !pathname.includes('editor') ? <Header /> : '' }
                <div>hello</div>
            </div>
        );
    }
}

export default App;