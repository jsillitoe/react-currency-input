import PropTypes from 'prop-types';
import React, { Component }  from 'react'
import ReactDOM from 'react-dom'
import mask from './mask.js'

// IE* parseFloat polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat#Polyfill
Number.parseFloat = parseFloat;

class CurrencyInput extends Component {
    constructor(props) {
        super(props);
        this.prepareProps = this.prepareProps.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = this.prepareProps(this.props);
    }


    /**
     * Exposes the current masked value.
     *
     * @returns {String}
     */
    getMaskedValue() {
        return this.state.maskedValue;
    }


    /**
     * General function used to cleanup and define the final props used for rendering
     * @returns {{ maskedValue: {String}, value: {Number}, customProps: {Object} }}
     */
    prepareProps(props) {
        let customProps = {...props}; // babeljs converts to Object.assign, then polyfills.
        delete customProps.onChange;
        delete customProps.onChangeEvent;
        delete customProps.value;
        delete customProps.decimalSeparator;
        delete customProps.thousandSeparator;
        delete customProps.precision;
        delete customProps.inputType;
        delete customProps.allowNegative;
        delete customProps.allowEmpty;
        delete customProps.prefix;
        delete customProps.suffix;

        let initialValue = props.value;
        if (initialValue === null) {
            initialValue = props.allowEmpty? null : '';
        }else{

            if (typeof initialValue == 'string') {
                // Some people, when confronted with a problem, think "I know, I'll use regular expressions."
                // Now they have two problems.

                // Strip out thousand separators, prefix, and suffix, etc.
                if (props.thousandSeparator === "."){
                    // special handle the . thousand separator
                    initialValue = initialValue.replace(/\./g, '');
                }

                if (props.decimalSeparator != "."){
                    // fix the decimal separator
                    initialValue = initialValue.replace(new RegExp(props.decimalSeparator, 'g'), '.');
                }

                //Strip out anything that is not a digit, -, or decimal separator
                initialValue = initialValue.replace(/[^0-9-.]/g, '');

                // now we can parse.
                initialValue = Number.parseFloat(initialValue);
            }
            initialValue = Number(initialValue).toLocaleString(undefined, {
                style                : 'decimal',
                minimumFractionDigits: props.precision,
                maximumFractionDigits: props.precision
            })

        }

        const { maskedValue, value } = mask(
            initialValue,
            props.precision,
            props.decimalSeparator,
            props.thousandSeparator,
            props.allowNegative,
            props.prefix,
            props.suffix
        );

        return { maskedValue, value, customProps };
    }


    /**
     * Component lifecycle function.
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param nextProps
     * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
     */
    componentWillReceiveProps(nextProps) {
        this.setState(this.prepareProps(nextProps));
    }


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/react-component.html#componentdidmount
     */
    componentDidMount(){
        let node = ReactDOM.findDOMNode(this.theInput);

        let selectionEnd = Math.min(node.selectionEnd, this.theInput.value.length - this.props.suffix.length);
        let selectionStart = Math.min(node.selectionStart, selectionEnd);
        //console.log("normal", selectionStart, selectionEnd);
        node.setSelectionRange(selectionStart, selectionEnd);

    }


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/react-component.html#componentdidupdate
     */
    componentDidUpdate(prevProps, prevState){

        let node = ReactDOM.findDOMNode(this.theInput);
        let selectionEnd = Math.min(this.state.selectionEnd, this.theInput.value.length - this.props.suffix.length);
        let selectionStart = Math.min(this.state.selectionStart, selectionEnd);

        // moves the cursor to the right when digits are added.
        let adjustment = Math.max(this.state.maskedValue.length - prevState.maskedValue.length - 1, 0);

        let baselength = this.props.suffix.length
            + this.props.prefix.length
            + this.props.decimalSeparator.length
            + Number(this.props.precision)
            + 1; // This is to account for the default '0' value that comes before the decimal separator

        if (this.state.maskedValue.length == baselength){
            // if we are already at base length, position the cursor at the end.
            selectionEnd = this.theInput.value.length - this.props.suffix.length;
            selectionStart = selectionEnd;
            adjustment = 0;
        }

        node.setSelectionRange(selectionStart + adjustment, selectionEnd + adjustment);

    }


    /**
     * onChange Event Handler
     * @param event
     */
    handleChange(event) {
        event.preventDefault();
        let { maskedValue, value } = mask(
            event.target.value,
            this.props.precision,
            this.props.decimalSeparator,
            this.props.thousandSeparator,
            this.props.allowNegative,
            this.props.prefix,
            this.props.suffix
        );

        let node = ReactDOM.findDOMNode(this.theInput);
        let selectionEnd = Math.min(node.selectionEnd, this.theInput.value.length - this.props.suffix.length);
        let selectionStart = Math.min(node.selectionStart, selectionEnd);

        event.persist();  // fixes issue #23

        this.setState({ maskedValue, value }, () => {
            this.props.onChange(maskedValue, value, event);
            this.props.onChangeEvent(event, maskedValue, value);
        });
    }


    /**
     * onFocus Event Handler
     * @param event
     */
    handleFocus(event) {
        //Whenever we receive focus check to see if the position is before the suffix, if not, move it.
        let selectionEnd = this.theInput.value.length - this.props.suffix.length;
        let selectionStart = this.props.prefix.length;
        console.log(selectionStart, selectionEnd);
        event.target.setSelectionRange(selectionStart, selectionEnd);
        this.setState( { selectionStart, selectionEnd} );
    }


    handleBlur(event) {
        this.setState({
            selectionStart: null,
            selectionEnd: null
        });
    }


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/component-specs.html#render
     */
    render() {
        return (
            <input
                ref={(input) => { this.theInput = input; }}
                type={this.props.inputType}
                value={this.state.maskedValue}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onMouseUp={this.handleFocus}
                {...this.state.customProps}
            />
        )
    }
}



/**
 * Prop validation.
 * @see https://facebook.github.io/react/docs/component-specs.html#proptypes
 */

CurrencyInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    decimalSeparator: PropTypes.string,
    thousandSeparator: PropTypes.string,
    precision: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    inputType: PropTypes.string,
    allowNegative: PropTypes.bool,
    allowEmpty: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string
};


CurrencyInput.defaultProps = {
    onChange: function(maskValue, value, event) {/*no-op*/},
    onChangeEvent: function(event, maskValue, value) {/*no-op*/},
    value: '0',
    decimalSeparator: '.',
    thousandSeparator: ',',
    precision: '2',
    inputType: 'text',
    allowNegative: false,
    prefix: '',
    suffix: ''
};


export default CurrencyInput
