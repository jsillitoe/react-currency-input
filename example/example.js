import React from 'react'
import ReactDOM from 'react-dom'

import CurrencyInput from '../src/index'


var App = React.createClass({

    getInitialState(){
        return ({amount: "0.00"});
    },


    handleChange(value){
        this.setState({amount: value});
    },

    render() {
        return (
            <div>
                <CurrencyInput value={this.state.amount} onChange={this.handleChange} />
            </div>
        );
    }
});



ReactDOM.render(<App />, document.getElementById('example'));

