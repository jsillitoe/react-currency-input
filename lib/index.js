'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _mask3 = require('./mask.js');

var _mask4 = _interopRequireDefault(_mask3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// IE* parseFloat polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat#Polyfill
Number.parseFloat = parseFloat;

var CurrencyInput = function (_Component) {
    _inherits(CurrencyInput, _Component);

    function CurrencyInput(props) {
        _classCallCheck(this, CurrencyInput);

        var _this = _possibleConstructorReturn(this, (CurrencyInput.__proto__ || Object.getPrototypeOf(CurrencyInput)).call(this, props));

        _this.prepareProps = _this.prepareProps.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.state = _this.prepareProps(_this.props);
        return _this;
    }

    /**
     * Exposes the current masked value.
     *
     * @returns {String}
     */


    _createClass(CurrencyInput, [{
        key: 'getMaskedValue',
        value: function getMaskedValue() {
            return this.state.maskedValue;
        }

        /**
         * General function used to cleanup and define the final props used for rendering
         * @returns {{ maskedValue: {String}, value: {Number}, customProps: {Object} }}
         */

    }, {
        key: 'prepareProps',
        value: function prepareProps(props) {
            var customProps = _extends({}, props); // babeljs converts to Object.assign, then polyfills.
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

            var initialValue = props.value;
            if (initialValue === null) {
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
        }

        /**
         * Component lifecycle function.
         * Invoked when a component is receiving new props. This method is not called for the initial render.
         *
         * @param nextProps
         * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
         */

    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState(this.prepareProps(nextProps));
        }

        /**
         * Component lifecycle function.
         * @returns {XML}
         * @see https://facebook.github.io/react/docs/react-component.html#componentdidmount
         */

    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var node = _reactDom2.default.findDOMNode(this.theInput);

            var selectionEnd = Math.min(node.selectionEnd, this.theInput.value.length - this.props.suffix.length);
            var selectionStart = Math.min(node.selectionStart, selectionEnd);
            //console.log("normal", selectionStart, selectionEnd);
            node.setSelectionRange(selectionStart, selectionEnd);
        }

        /**
         * Component lifecycle function.
         * @returns {XML}
         * @see https://facebook.github.io/react/docs/react-component.html#componentdidupdate
         */

    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {

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
        }

        /**
         * onChange Event Handler
         * @param event
         */

    }, {
        key: 'handleChange',
        value: function handleChange(event) {
            var _this2 = this;

            event.preventDefault();

            var _mask2 = (0, _mask4.default)(event.target.value, this.props.precision, this.props.decimalSeparator, this.props.thousandSeparator, this.props.allowNegative, this.props.prefix, this.props.suffix),
                maskedValue = _mask2.maskedValue,
                value = _mask2.value;

            var node = _reactDom2.default.findDOMNode(this.theInput);
            var selectionEnd = Math.min(node.selectionEnd, this.theInput.value.length - this.props.suffix.length);
            var selectionStart = Math.min(node.selectionStart, selectionEnd);

            event.persist(); // fixes issue #23

            this.setState({ maskedValue: maskedValue, value: value }, function () {
                _this2.props.onChange(maskedValue, value, event);
                _this2.props.onChangeEvent(event, maskedValue, value);
            });
        }

        /**
         * onFocus Event Handler
         * @param event
         */

    }, {
        key: 'handleFocus',
        value: function handleFocus(event) {
            //Whenever we receive focus check to see if the position is before the suffix, if not, move it.
            var selectionEnd = this.theInput.value.length - this.props.suffix.length;
            var selectionStart = this.props.prefix.length;
            console.log(selectionStart, selectionEnd);
            event.target.setSelectionRange(selectionStart, selectionEnd);
            this.setState({ selectionStart: selectionStart, selectionEnd: selectionEnd });
        }
    }, {
        key: 'handleBlur',
        value: function handleBlur(event) {
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

    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement('input', _extends({
                ref: function ref(input) {
                    _this3.theInput = input;
                },
                type: this.props.inputType,
                value: this.state.maskedValue,
                onChange: this.handleChange,
                onFocus: this.handleFocus,
                onMouseUp: this.handleFocus
            }, this.state.customProps));
        }
    }]);

    return CurrencyInput;
}(_react.Component);

/**
 * Prop validation.
 * @see https://facebook.github.io/react/docs/component-specs.html#proptypes
 */

CurrencyInput.propTypes = {
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
};

CurrencyInput.defaultProps = {
    onChange: function onChange(maskValue, value, event) {/*no-op*/},
    onChangeEvent: function onChangeEvent(event, maskValue, value) {/*no-op*/},
    value: '0',
    decimalSeparator: '.',
    thousandSeparator: ',',
    precision: '2',
    inputType: 'text',
    allowNegative: false,
    prefix: '',
    suffix: ''
};

exports.default = CurrencyInput;