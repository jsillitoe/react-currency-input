'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PropTypes = _interopDefault(require('prop-types'));
var React = require('react');
var React__default = _interopDefault(React);
var ReactDOM = _interopDefault(require('react-dom'));

Object.assign = Object.assign ||
  function(target) {
    var arguments$1 = arguments;

    for (var i = 1; i < arguments.length; i++) {
      var source = arguments$1[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

function mask(value, precision, decimalSeparator, thousandSeparator, allowNegative, prefix, suffix){
    if ( precision === void 0 ) precision = 2;
    if ( decimalSeparator === void 0 ) decimalSeparator = '.';
    if ( thousandSeparator === void 0 ) thousandSeparator = ',';
    if ( allowNegative === void 0 ) allowNegative = false;
    if ( prefix === void 0 ) prefix = '';
    if ( suffix === void 0 ) suffix = '';

    // provide some default values and arg validation.
    if (precision < 0) { precision = 0; } // precision cannot be negative
    if (precision > 20) { precision = 20; } // precision cannot be greater than 20
    
    if (value === null || value===undefined) {
          return {
              value: 0,
              maskedValue: ''
          };
     }
  
    value = String(value); //if the given value is a Number, let's convert into String to manipulate that

    if (value.length == 0) {
        return {
            value: 0,
            maskedValue: ''
        };
    }


    // extract digits. if no digits, fill in a zero.
    var digits = value.match(/\d/g) || ['0'];
    
    var numberIsNegative = false;
    if (allowNegative) {
        var negativeSignCount = (value.match(/-/g) || []).length;
        // number will be negative if we have an odd number of "-"
        // ideally, we should only ever have 0, 1 or 2 (positive number, making a number negative
        // and making a negative number positive, respectively)
        numberIsNegative = negativeSignCount % 2 === 1;
        
        // if every digit in the array is '0', then the number should never be negative
        var allDigitsAreZero = true;
        for (var idx=0; idx < digits.length; idx += 1) {
            if(digits[idx] !== '0') {
                allDigitsAreZero = false;
                break;
            }
        }
        if (allDigitsAreZero) {
            numberIsNegative = false;
        }
    }

    // zero-pad a input
    while (digits.length <= precision) { digits.unshift('0'); }

    if (precision > 0) {
        // add the decimal separator
        digits.splice(digits.length - precision, 0, ".");
    }

    // clean up extraneous digits like leading zeros.
    digits = Number(digits.join('')).toFixed(precision).split('');
    var raw = Number(digits.join(''));

    var decimalpos = digits.length - precision - 1;  // -1 needed to position the decimal separator before the digits.
    if (precision > 0) {
        // set the final decimal separator
        digits[decimalpos] = decimalSeparator;
    } else {
        // when precision is 0, there is no decimal separator.
        decimalpos = digits.length;
    }

    // add in any thousand separators
    for (var x=decimalpos - 3; x > 0; x = x - 3) {
        digits.splice(x, 0, thousandSeparator);
    }

    // if we have a prefix or suffix, add them in.
    if (prefix.length > 0) { digits.unshift(prefix); }
    if (suffix.length > 0) { digits.push(suffix); }

    // if the number is negative, insert a "-" to
    // the front of the array and negate the raw value
    if (allowNegative && numberIsNegative) {
        digits.unshift('-');
        raw = -raw;
    }

    return {
        value: raw,
        maskedValue: digits.join('').trim()
    };
}

// IE* parseFloat polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat#Polyfill
Number.parseFloat = parseFloat;

var CurrencyInput = (function (Component$$1) {
    function CurrencyInput(props) {
        Component$$1.call(this, props);
        this.prepareProps = this.prepareProps.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.setSelectionRange = this.setSelectionRange.bind(this);
        this.state = this.prepareProps(this.props);

        this.inputSelectionStart = 1;
        this.inputSelectionEnd = 1;
    }

    if ( Component$$1 ) CurrencyInput.__proto__ = Component$$1;
    CurrencyInput.prototype = Object.create( Component$$1 && Component$$1.prototype );
    CurrencyInput.prototype.constructor = CurrencyInput;


    /**
     * Exposes the current masked value.
     *
     * @returns {String}
     */
    CurrencyInput.prototype.getMaskedValue = function getMaskedValue () {
        return this.state.maskedValue;
    };


    /**
     * General function used to cleanup and define the final props used for rendering
     * @returns {{ maskedValue: {String}, value: {Number}, customProps: {Object} }}
     */
    CurrencyInput.prototype.prepareProps = function prepareProps (props) {
        var customProps = Object.assign({}, props); // babeljs converts to Object.assign, then polyfills.
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
        delete customProps.selectAllOnFocus;
        delete customProps.autoFocus;

        var initialValue = props.value;
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
            });

        }

        var ref = mask(
            initialValue,
            props.precision,
            props.decimalSeparator,
            props.thousandSeparator,
            props.allowNegative,
            props.prefix,
            props.suffix
        );
        var maskedValue = ref.maskedValue;
        var value = ref.value;

        return { maskedValue: maskedValue, value: value, customProps: customProps };
    };


    /**
     * Component lifecycle function.
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param nextProps
     * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
     */
    CurrencyInput.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
        this.setState(this.prepareProps(nextProps));
    };


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/react-component.html#componentdidmount
     */
    CurrencyInput.prototype.componentDidMount = function componentDidMount (){
        var node = ReactDOM.findDOMNode(this.theInput);
        var selectionStart, selectionEnd;

        if (this.props.autoFocus) {
            this.theInput.focus();
            selectionEnd = this.state.maskedValue.length - this.props.suffix.length;
            selectionStart = selectionEnd;
        } else {
            selectionEnd = Math.min(node.selectionEnd, this.theInput.value.length - this.props.suffix.length);
            selectionStart = Math.min(node.selectionStart, selectionEnd);
        }

        this.setSelectionRange(node, selectionStart, selectionEnd);
    };


    /**
     * Component lifecycle function
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/react-component.html#componentwillupdate
     */
    CurrencyInput.prototype.componentWillUpdate = function componentWillUpdate () {
        var node = ReactDOM.findDOMNode(this.theInput);
        this.inputSelectionStart = node.selectionStart;
        this.inputSelectionEnd = node.selectionEnd;
    };


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/react-component.html#componentdidupdate
     */
    CurrencyInput.prototype.componentDidUpdate = function componentDidUpdate (prevProps, prevState){
        var ref = this.props;
        var decimalSeparator = ref.decimalSeparator;
        var node = ReactDOM.findDOMNode(this.theInput);
        var isNegative = (this.theInput.value.match(/-/g) || []).length % 2 === 1;
        var minPos = this.props.prefix.length + (isNegative ? 1 : 0);
        var selectionEnd = Math.max(minPos, Math.min(this.inputSelectionEnd, this.theInput.value.length - this.props.suffix.length));
        var selectionStart = Math.max(minPos, Math.min(this.inputSelectionEnd, selectionEnd));

        var regexEscapeRegex = /[-[\]{}()*+?.,\\^$|#\s]/g;
        var separatorsRegex = new RegExp(decimalSeparator.replace(regexEscapeRegex, '\\$&') + '|' + this.props.thousandSeparator.replace(regexEscapeRegex, '\\$&'), 'g');
        var currSeparatorCount = (this.state.maskedValue.match(separatorsRegex) || []).length;
        var prevSeparatorCount = (prevState.maskedValue.match(separatorsRegex) || []).length;
        var adjustment = Math.max(currSeparatorCount - prevSeparatorCount, 0);

        selectionEnd = selectionEnd + adjustment;
        selectionStart = selectionStart + adjustment;

        var precision = Number(this.props.precision);

        var baselength = this.props.suffix.length
            + this.props.prefix.length
            + (precision > 0 ? decimalSeparator.length : 0) // if precision is 0 there will be no decimal part
            + precision
            + 1; // This is to account for the default '0' value that comes before the decimal separator

        if (this.state.maskedValue.length == baselength){
            // if we are already at base length, position the cursor at the end.
            selectionEnd = this.theInput.value.length - this.props.suffix.length;
            selectionStart = selectionEnd;
        }

        this.setSelectionRange(node, selectionStart, selectionEnd);
        this.inputSelectionStart = selectionStart;
        this.inputSelectionEnd = selectionEnd;
    };

    /**
     * Set selection range only if input is in focused state
     * @param node DOMElement
     * @param start number
     * @param end number
     */
    CurrencyInput.prototype.setSelectionRange = function setSelectionRange (node, start, end) {
      if (document.activeElement === node) {
        node.setSelectionRange(start, end);
      }
    };


    /**
     * onChange Event Handler
     * @param event
     */
    CurrencyInput.prototype.handleChange = function handleChange (event) {
        var this$1 = this;

        event.preventDefault();
        var ref = mask(
            event.target.value,
            this.props.precision,
            this.props.decimalSeparator,
            this.props.thousandSeparator,
            this.props.allowNegative,
            this.props.prefix,
            this.props.suffix
        );
        var maskedValue = ref.maskedValue;
        var value = ref.value;

        event.persist();  // fixes issue #23

        this.setState({ maskedValue: maskedValue, value: value }, function () {
            this$1.props.onChange(maskedValue, value, event);
            this$1.props.onChangeEvent(event, maskedValue, value);
        });
    };


    /**
     * onFocus Event Handler
     * @param event
     */
    CurrencyInput.prototype.handleFocus = function handleFocus (event) {
        if (!this.theInput) { return; }

        //Whenever we receive focus check to see if the position is before the suffix, if not, move it.
        var selectionEnd = this.theInput.value.length - this.props.suffix.length;
        var isNegative = (this.theInput.value.match(/-/g) || []).length % 2 === 1;
        var selectionStart = this.props.prefix.length + (isNegative ? 1 : 0);
        this.props.selectAllOnFocus && event.target.setSelectionRange(selectionStart, selectionEnd);
        this.inputSelectionStart = selectionStart;
        this.inputSelectionEnd = selectionEnd;
    };


    CurrencyInput.prototype.handleBlur = function handleBlur (event) {
        this.inputSelectionStart = 0;
        this.inputSelectionEnd = 0;
    };


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/component-specs.html#render
     */
    CurrencyInput.prototype.render = function render () {
        var this$1 = this;

        return (
            React__default.createElement( 'input', Object.assign({},
                { ref: function (input) { this$1.theInput = input; }, type: this.props.inputType, value: this.state.maskedValue, onChange: this.handleChange, onFocus: this.handleFocus, onMouseUp: this.handleFocus }, this.state.customProps))
        )
    };

    return CurrencyInput;
}(React.Component));



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
    suffix: PropTypes.string,
    selectAllOnFocus: PropTypes.bool
};


CurrencyInput.defaultProps = {
    onChange: function(maskValue, value, event) {/*no-op*/},
    onChangeEvent: function(event, maskValue, value) {/*no-op*/},
    autoFocus: false,
    value: '0',
    decimalSeparator: '.',
    thousandSeparator: ',',
    precision: '2',
    inputType: 'text',
    allowNegative: false,
    prefix: '',
    suffix: '',
    selectAllOnFocus: false
};

module.exports = CurrencyInput;
//# sourceMappingURL=react-currency-input.cjs.js.map
