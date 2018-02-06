/**
 * Created by jrs1 on 3/7/17.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import CurrencyInput from '../src/index';


ReactDOM.render(<CurrencyInput value={0.0}/>, document.getElementById('example0'));

ReactDOM.render(<CurrencyInput suffix=" kr"/>, document.getElementById('example1'));

ReactDOM.render(<CurrencyInput suffix=" kr" precision="0"/>, document.getElementById('example2'));

ReactDOM.render(<CurrencyInput prefix="$"/>, document.getElementById('example3'));

ReactDOM.render(<CurrencyInput prefix="$" precision="0"/>, document.getElementById('example4'));

ReactDOM.render(<CurrencyInput prefix="$" suffix=" kr"/>, document.getElementById('example5'));

ReactDOM.render(<CurrencyInput value="1" allowNegative={true}/>, document.getElementById('example6'));

var onChangeEvent = function(event, mask, floatValue) {
  console.log(event)
  console.log(mask)
  console.log(floatValue)
}

ReactDOM.render(
  <CurrencyInput onChangeEvent={onChangeEvent} decimalSeparator="." thousandSeparator="," />,
  document.getElementById('example7')
);

ReactDOM.render(<CurrencyInput prefix="$" autoFocus={true}/>, document.getElementById('example8'));

