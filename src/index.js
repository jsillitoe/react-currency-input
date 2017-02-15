import React, { PropTypes } from 'react'
import mask from './mask.js'


const CurrencyInput = React.createClass({

    /**
     * Prop validation.
     * @see https://facebook.github.io/react/docs/component-specs.html#proptypes
     */
    propTypes: {
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
    },


    /**
     * Component lifecycle function.
     *
     * Invoked once and cached when the class is created. Values in the mapping will be set on this.props if that
     * prop is not specified by the parent component
     *
     * @see https://facebook.github.io/react/docs/component-specs.html#getdefaultprops
     */
    getDefaultProps() {
        return {
            onChange: function(maskValue, value, event) {/*no-op*/},
            value: '0',
            decimalSeparator: '.',
            thousandSeparator: ',',
            precision: '2',
            inputType: 'text',
            allowNegative: false,
            prefix: '',
            suffix: ''
        }
    },

    /**
     * General function used to cleanup and define the final props used for rendering
     * @returns {{ maskedValue: {String}, value: {Number}, customProps: {Object} }}
     */
    prepareProps(props) {
        let customProps = JSON.parse(JSON.stringify(props)); //not as clean, but better support
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

        let initialValue = props.value;
        if (!initialValue) {
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
    },

    /**
     * Component lifecycle function.
     * Invoked once before the component is mounted. The return value will be used as the initial value of this.state
     *
     * @returns {{ maskedValue: {String}, value: {Number}, customProps: {Object} }}
     * @see https://facebook.github.io/react/docs/component-specs.html#getinitialstate
     */
    getInitialState() {
        return this.prepareProps(this.props);
    },


    /**
     * Component lifecycle function.
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param nextProps
     * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
     */
    componentWillReceiveProps(nextProps) {
        this.setState(this.prepareProps(nextProps));
    },


    /**
     * Exposes the current masked value.
     *
     * @returns {String}
     */
    getMaskedValue() {
        return this.state.maskedValue;
    },


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
        this.setState({ maskedValue, value });
        this.props.onChange(maskedValue, value, event);
    },


    /**
     * Component lifecycle function.
     * @returns {XML}
     * @see https://facebook.github.io/react/docs/component-specs.html#render
     */
    render() {
        return (
            <input
                type={this.props.inputType}
                value={this.state.maskedValue}
                onChange={this.handleChange}
                {...this.state.customProps}
            />
        )
    }
});


export default CurrencyInput
