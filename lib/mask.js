'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mask;
function mask(value) {
    var precision = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];
    var decimalSeparator = arguments.length <= 2 || arguments[2] === undefined ? '.' : arguments[2];
    var thousandSeparator = arguments.length <= 3 || arguments[3] === undefined ? ',' : arguments[3];
    var allowNegative = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
    var prefix = arguments.length <= 5 || arguments[5] === undefined ? '' : arguments[5];
    var suffix = arguments.length <= 6 || arguments[6] === undefined ? '' : arguments[6];

    // provide some default values and arg validation.
    if (precision < 0) {
        precision = 0;
    } // precision cannot be negative
    if (precision > 20) {
        precision = 20;
    } // precision cannot be greater than 20

    if (value === null || value === undefined) {
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
        for (var idx = 0; idx < digits.length; idx += 1) {
            if (digits[idx] !== '0') {
                allDigitsAreZero = false;
                break;
            }
        }
        if (allDigitsAreZero) {
            numberIsNegative = false;
        }
    }

    // zero-pad a input
    while (digits.length <= precision) {
        digits.unshift('0');
    }

    if (precision > 0) {
        // add the decimal separator
        digits.splice(digits.length - precision, 0, ".");
    }

    // clean up extraneous digits like leading zeros.
    digits = Number(digits.join('')).toFixed(precision).split('');
    var raw = Number(digits.join(''));

    var decimalpos = digits.length - precision - 1; // -1 needed to position the decimal separator before the digits.
    if (precision > 0) {
        // set the final decimal separator
        digits[decimalpos] = decimalSeparator;
    } else {
        // when precision is 0, there is no decimal separator.
        decimalpos = digits.length;
    }

    // add in any thousand separators
    for (var x = decimalpos - 3; x > 0; x = x - 3) {
        digits.splice(x, 0, thousandSeparator);
    }

    // if we have a prefix or suffix, add them in.
    if (prefix.length > 0) {
        digits.unshift(prefix);
    }
    if (suffix.length > 0) {
        digits.push(suffix);
    }

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