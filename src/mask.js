
export default function mask(value, precision, decimalSeparator, thousandSeparator, allowNegative, prefix, suffix){
    // provide some default values and arg validation.
    if (decimalSeparator === undefined){decimalSeparator = ".";} // default to '.' as decimal separator
    if (thousandSeparator === undefined){thousandSeparator = ",";} // default to ',' as thousand separator
    if (allowNegative === undefined){allowNegative = false;} // default to not allowing negative numbers
    if (precision === undefined){precision = 2;} // by default, 2 decimal places
    if (precision < 0) {precision = 0;} // precision cannot be negative.
    if (precision > 20) {precision = 20;} // precision cannot greater than 20
    if (prefix === undefined){prefix = '';} // default prefix to empty string
    if (suffix === undefined){suffix = '';} // default suffix to empty string

    let numberIsNegative = false;
    if (allowNegative) {
        let negativeSignCount = (value.match(/-/g) || []).length;
        // number will be negative if we have an odd number of "-"
        // ideally, we should only ever have 0, 1 or 2 (positive number, making a number negative
        // and making a negative number positive, respectively)
        numberIsNegative = negativeSignCount % 2 === 1;
    }

    // extract digits. if no digits, fill in a zero.
    let digits = value.match(/\d/g) || ['0'];

    if (allowNegative) {
        // if every digit in the array is '0', then the number should
        // never be negative
        let allDigitsAreZero = true;
        for(let idx=0; idx < digits.length; idx += 1) {
            if(digits[idx] !== '0') {
                allDigitsAreZero = false;
                break;
            }
        }
        if(allDigitsAreZero) {
            numberIsNegative = false;
        }
    }

    // zero-pad a input
    while (digits.length <= precision) {digits.unshift('0')}

    if (precision > 0){
        // add the decimal separator
        digits.splice(digits.length - precision, 0, ".");
    }

    // clean up extraneous digits like leading zeros.
    digits = Number(digits.join('')).toFixed(precision).split('');
    const raw = Number(digits.join(''));

    let decimalpos = digits.length - precision - 1;  // -1 needed to position the decimal separator before the digits.
    if (precision > 0) {
        // set the final decimal separator
        digits[decimalpos] = decimalSeparator;
    }else{
        // when precision is 0, there is no decimal separator.
        decimalpos = digits.length
    }

    // add in any thousand separators
    for (let x=decimalpos - 3; x > 0; x = x - 3){
        digits.splice(x, 0, thousandSeparator);
    }

    // if we have a prefix or suffix, add them in.
    if (prefix.length > 0){digits.unshift(prefix);}
    if (suffix.length > 0){digits.push(suffix);}

    // if the number is negative, insert a "-" to
    // the front of the array
    if (allowNegative && numberIsNegative) {
        digits.unshift('-');
    }

    return {
        value: raw,
        maskedValue: digits.join('').trim()
    };
}
