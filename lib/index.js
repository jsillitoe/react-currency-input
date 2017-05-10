'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

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
        onChange: _propTypes2.default.func,
        value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
        decimalSeparator: _propTypes2.default.string,
        thousandSeparator: _propTypes2.default.string,
        precision: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
        inputType: _propTypes2.default.string,
        allowNegative: _propTypes2.default.bool,
        allowEmpty: _propTypes2.default.bool,
        prefix: _propTypes2.default.string,
        suffix: _propTypes2.default.string
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

        var _mask = (0, _mask4.default)(initialValue, props.precision, props.decimalSeparator, props.thousandSeparator, props.allowNegative, props.prefix, props.suffix),
            maskedValue = _mask.maskedValue,
            value = _mask.value;

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
    componentDidMount: function componentDidMount() {
        var node = _reactDom2.default.findDOMNode(this.theInput);

        var selectionEnd = Math.min(node.selectionEnd, this.theInput.value.length - this.props.suffix.length);
        var selectionStart = Math.min(node.selectionStart, selectionEnd);
        //console.log("normal", selectionStart, selectionEnd);
        node.setSelectionRange(selectionStart, selectionEnd);
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {

        var node = _reactDom2.default.findDOMNode(this.theInput);
        var selectionEnd = Math.min(this.state.selectionEnd, this.theInput.value.length - this.props.suffix.length);
        var selectionStart = Math.min(this.state.selectionStart, selectionEnd);

        // moves the cursor to the right when digits are added.
        var adjustment = Math.max(this.state.maskedValue.length - prevState.maskedValue.length - 1, 0);

        var baselength = this.props.suffix.length + this.props.prefix.length + this.props.decimalSeparator.length + Number(this.props.precision) + 1; // This is to account for the default '0' value that comes before the decimal separator

        if (this.state.maskedValue.length == baselength) {
            // if we are already at base length, position the cursor at the end.
            selectionEnd = this.theInput.value.length - this.props.suffix.length;
            selectionStart = selectionEnd;
            adjustment = 0;
        }

        node.setSelectionRange(selectionStart + adjustment, selectionEnd + adjustment);
    },


    /**
     * onChange Event Handler
     * @param event
     */
    handleChange: function handleChange(event) {
        var _this = this;

        event.preventDefault();

        var _mask2 = (0, _mask4.default)(event.target.value, this.props.precision, this.props.decimalSeparator, this.props.thousandSeparator, this.props.allowNegative, this.props.prefix, this.props.suffix),
            maskedValue = _mask2.maskedValue,
            value = _mask2.value;

        var node = _reactDom2.default.findDOMNode(this.theInput);
        var selectionEnd = Math.min(node.selectionEnd, this.theInput.value.length - this.props.suffix.length);
        var selectionStart = Math.min(node.selectionStart, selectionEnd);

        this.setState({ maskedValue: maskedValue, value: value }, function () {
            _this.props.onChange(maskedValue, value, event);
        });
    },


    /**
     * onFocus Event Handler
     * @param event
     */
    handleFocus: function handleFocus(event) {
        //Whenever we receive focus check to see if the position is before the suffix, if not, move it.
        var selectionEnd = this.theInput.value.length - this.props.suffix.length;
        var selectionStart = this.props.prefix.length;
        console.log(selectionStart, selectionEnd);
        event.target.setSelectionRange(selectionStart, selectionEnd);
        this.setState({ selectionStart: selectionStart, selectionEnd: selectionEnd });
    },
    handleBlur: function handleBlur(event) {
        this.setState({
            selectionStart: null,
            selectionEnd: null
        });
    },


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/component-specs.html#render
     */
    render: function render() {
        var _this2 = this;

        return _react2.default.createElement('input', _extends({
            ref: function ref(input) {
                _this2.theInput = input;
            },
            type: this.props.inputType,
            value: this.state.maskedValue,
            onChange: this.handleChange,
            onFocus: this.handleFocus,
            onMouseUp: this.handleFocus
        }, this.state.customProps));
    }
});

exports.default = CurrencyInput;