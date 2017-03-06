'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mask3 = require('./mask.js');

var _mask4 = _interopRequireDefault(_mask3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CurrencyInput = _react2.default.createClass({
    displayName: 'CurrencyInput',


    /**
     * Prop validation.
     * @see https://facebook.github.io/react/docs/component-specs.html#proptypes
     */
    propTypes: {
        onChange: _react.PropTypes.func,
        value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        decimalSeparator: _react.PropTypes.string,
        thousandSeparator: _react.PropTypes.string,
        precision: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
        inputType: _react.PropTypes.string,
        allowNegative: _react.PropTypes.bool,
        allowEmpty: _react.PropTypes.bool,
        prefix: _react.PropTypes.string,
        suffix: _react.PropTypes.string
    },

    /**
     * Component lifecycle function.
     *
     * Invoked once and cached when the class is created. Values in the mapping will be set on this.props if that
     * prop is not specified by the parent component
     *
     * @see https://facebook.github.io/react/docs/component-specs.html#getdefaultprops
     */
    getDefaultProps: function getDefaultProps() {
        return {
            onChange: function onChange(maskValue, value, event) {/*no-op*/},
            value: '0',
            decimalSeparator: '.',
            thousandSeparator: ',',
            precision: '2',
            inputType: 'text',
            allowNegative: false,
            prefix: '',
            suffix: ''
        };
    },


    /**
     * General function used to cleanup and define the final props used for rendering
     * @returns {{ maskedValue: {String}, value: {Number}, customProps: {Object} }}
     */
    prepareProps: function prepareProps(props) {
        var customProps = _extends({}, props); // babeljs converts to Object.assign, then polyfills.
        delete customProps.onChange;
        delete customProps.value;
        delete customProps.decimalSeparator;
        delete customProps.thousandSeparator;
        delete customProps.precision;
        delete customProps.inputType;
        delete customProps.allowNegative;
        delete customProps.allowEmpty;
        delete customProps.prefix;
        delete customProps.suffix;

        var initialValue = props.value;
        if (!initialValue) {
            initialValue = props.allowEmpty ? null : '';
        } else {

            if (typeof initialValue == 'string') {
                // Some people, when confronted with a problem, think "I know, I'll use regular expressions."
                // Now they have two problems.

                // Strip out thousand separators, prefix, and suffix, etc.
                if (props.thousandSeparator === ".") {
                    // special handle the . thousand separator
                    initialValue = initialValue.replace(/\./g, '');
                }

                if (props.decimalSeparator != ".") {
                    // fix the decimal separator
                    initialValue = initialValue.replace(new RegExp(props.decimalSeparator, 'g'), '.');
                }

                //Strip out anything that is not a digit, -, or decimal separator
                initialValue = initialValue.replace(/[^0-9-.]/g, '');

                // now we can parse.
                initialValue = Number.parseFloat(initialValue);
            }
            initialValue = Number(initialValue).toLocaleString(undefined, {
                style: 'decimal',
                minimumFractionDigits: props.precision,
                maximumFractionDigits: props.precision
            });
        }

        var _mask = (0, _mask4.default)(initialValue, props.precision, props.decimalSeparator, props.thousandSeparator, props.allowNegative, props.prefix, props.suffix);

        var maskedValue = _mask.maskedValue;
        var value = _mask.value;


        return { maskedValue: maskedValue, value: value, customProps: customProps };
    },


    /**
     * Component lifecycle function.
     * Invoked once before the component is mounted. The return value will be used as the initial value of this.state
     *
     * @returns {{ maskedValue: {String}, value: {Number}, customProps: {Object} }}
     * @see https://facebook.github.io/react/docs/component-specs.html#getinitialstate
     */
    getInitialState: function getInitialState() {
        return this.prepareProps(this.props);
    },


    /**
     * Component lifecycle function.
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param nextProps
     * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setState(this.prepareProps(nextProps));
    },


    /**
     * Exposes the current masked value.
     *
     * @returns {String}
     */
    getMaskedValue: function getMaskedValue() {
        return this.state.maskedValue;
    },


    /**
     * onChange Event Handler
     * @param event
     */
    handleChange: function handleChange(event) {
        event.preventDefault();

        var _mask2 = (0, _mask4.default)(event.target.value, this.props.precision, this.props.decimalSeparator, this.props.thousandSeparator, this.props.allowNegative, this.props.prefix, this.props.suffix);

        var maskedValue = _mask2.maskedValue;
        var value = _mask2.value;

        this.setState({ maskedValue: maskedValue, value: value });
        this.props.onChange(maskedValue, value, event);
    },


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/component-specs.html#render
     */
    render: function render() {
        return _react2.default.createElement('input', _extends({
            type: this.props.inputType,
            value: this.state.maskedValue,
            onChange: this.handleChange
        }, this.state.customProps));
    }
});

exports.default = CurrencyInput;