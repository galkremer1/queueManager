import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import axios from 'axios';

class MaskComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maskedText: '',
            inputText: ''
        };
    }

    maskText = () => {
        let inputText = this.state.inputText;
        let inputTextArr = inputText.split(' ');
        axios.get('http://localhost:5000/iscityorcountry', {
            params: {
                query: inputTextArr
              }
          })
          .then(response => {
            this.setState({
                maskedText: response.data.newArr.join(' ')
            });
        }).catch((err)=> {
            console.error(err);
        });
    }

    handleChange = (event) => {
        this.setState({inputText: event.target.value});
    }
    render() {
        return ( 
            <div>
                Enter Text Here:
                <div>
                    <textarea style={{width : '100%', height: '100px'}}  id="masked-input" onChange={this.handleChange} ></textarea>
                </div>
                <Button bsStyle="primary" bsSize="large" block onClick={this.maskText.bind(this)}>Mask Text</Button>
                {
                    this.state.maskedText && 
                        <div>
                            {this.state.maskedText}
                        </div>
                }
            </div>

            );
    }
}

export default MaskComp;