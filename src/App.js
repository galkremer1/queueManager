import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/lib/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';

//import  from './components'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creatingTask: false, 
            response: ''
        };
    }

    creatManualTask = () => {
        this.setState({creatingTask: true, response: ''});
        axios.get('http://localhost:5000/task')
        .then(response => {
            this.setState({
                response: response.status,
                creatingTask: false
            });
        }).catch((err)=> {
            this.setState({
                response: err.response.status,
                creatingTask: false
            });
        });
    }
    listCurrentJobs = () => {
        axios.get('http://localhost:5000/queue')
        .then(response => {
            console.log('res: ', response);
            this.setState({
                currentJobs: response,
            });
        }).catch((err)=> {
            console.err(err);
        });
    }
    render() {
        return ( 
            <div className="main-container">
                <Button bsStyle="primary" bsSize="large" block disabled={this.state.creatingTask} onClick={this.creatManualTask}>Creat A Manual Task</Button>
                {
                    this.state.response && 
                    <div>
                        Response: {this.state.response}
                    </div>
                }
                <Button bsStyle="primary" bsSize="large" block  onClick={this.listCurrentJobs}>Get Current Job Queue</Button>

            </div>
        );
    }
}

export default App;