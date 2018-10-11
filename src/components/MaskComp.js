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
    maskEmails = (inputTextArr) => {
        function validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        function validateNumber(number) {
            let re = /^((\+)?)([\s-.\(\)]*\d{1}){8,13}$/;
            return re.test(number);
        }
        return inputTextArr.map((element)=> {
            if (validateEmail(element)) {
                return '<EMAIL>';
            } else {
                if (validateNumber(element)) {
                    return '<NUMBER>';
                } else {
                    return element;
                }
            }
        })
    }
    maskText = () => {
        let inputText = this.state.inputText;
        let inputTextArr = inputText.split(' ');
        inputTextArr = this.maskEmails(inputTextArr);
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
    clearText = () => {
        this.setState({maskedText: ''});
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
                        <h2>Masked Text</h2>
                        <div>
                            {this.state.maskedText}
                        </div>
                        <Button bsStyle="primary" bsSize="large" block onClick={this.clearText}>Clear</Button>

                    </div>
                }
            </div>

            );
    }
}

export default MaskComp;