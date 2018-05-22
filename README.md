# react-currency-input

An ES2015 react component for currency. Supports custom decimal and thousand separators as well as precision.

[![Build Status](https://travis-ci.org/jsillitoe/react-currency-input.svg?branch=master)](https://travis-ci.org/jsillitoe/react-currency-input)

## Changes

## v1.3.0:

- Deprecated "onChange" option in favor of "onChangeEvent". This fixes the argument order to better match React's default input handling
- Updated dependencies to React 15
- Added parseFloat polyfill
- Persist events to deal with an issue of event pooling
- Other bug fixes.

## Installation

```
npm install react-currency-input --save
```

## Integration

You can store the value passed in to the change handler in your state.

```javascript
import React from 'react'
import CurrencyInput from 'react-currency-input';

const MyApp = React.createClass({
    getInitialState(){
        return ({amount: "0.00"});
    },

    handleChange(event, maskedvalue, floatvalue){
        this.setState({amount: maskedvalue});
    },
    render() {
        return (
            <div>
                <CurrencyInput value={this.state.amount} onChangeEvent={this.handleChange}/>
            </div>
        );
    }
});
export default MyApp
```

You can also assign a reference then access the value using a call to getMaskedValue().

```javascript
import React from 'react'
import CurrencyInput from 'react-currency-input';

const MyApp = React.createClass({
    handleSubmit(event){
        event.preventDefault();
        console.log(this.refs.myinput.getMaskedValue())
    },
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <CurrencyInput ref="myinput" />
            </form>
        );
    }
});
export default MyApp
```

## Separators and Precision

Specify custom decimal and thousand separators:

```javascript
    // 1.234.567,89
    <CurrencyInput decimalSeparator="," thousandSeparator="." />
```

Specify a specific precision:

```javascript
    // 123,456.789
    <CurrencyInput precision="3" />
```

```javascript
    // 123,456,789
    <CurrencyInput precision="0" />
```

## Currency

Optionally set a currency symbol as a prefix or suffix

```javascript
    // $1,234,567.89
    <CurrencyInput prefix="$" />
```

```javascript
    // 1,234,567.89 kr
    <CurrencyInput suffix=" kr" />
```

Negative signs come before the prefix

```javascript
    // -$20.00
    <CurrencyInput prefix="$" value="-20.00" />
```

All other attributes are applied to the input element. For example, you can integrate bootstrap styling:

```javascript
    <CurrencyInput className="form-control" />
```

## Options

Option            | Default Value | Description
----------------- | ------------- | -----------------------------------------------------------------------------
value             | 0             | The initial currency value
onChange          | n/a           | Callback function to handle value changes. Deprecated, use onChangeEvent.
onChangeEvent     | n/a           | Callback function to handle value changes
precision         | 2             | Number of digits after the decimal separator
decimalSeparator  | '.'           | The decimal separator
thousandSeparator | ','           | The thousand separator
inputType         | "text"        | Input field tag type. You may want to use `number` or `tel`*
allowNegative     | false         | Allows negative numbers in the input
allowEmpty        | false         | If no `value` is given, defines if it starts as null (`true`) or '' (`false`)
selectAllOnFocus  | false         | Selects all text on focus or does not
prefix            | ''            | Currency prefix
suffix            | ''            | Currency suffix
autoFocus         | false         | Autofocus
maxValue          | undefined     | Maximum input value (state won't change if input is higher)
minValue          | undefined     | Minimum input value (state won't change if input is lower)

***Note:** Enabling any mask-related features such as prefix, suffix or separators with an inputType="number" or "tel" could trigger errors. Most of those characters would be invalid in such input types.
