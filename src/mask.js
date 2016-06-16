
export default function mask(value, precision, decimalSeparator, thousandSeparator){
    // provide some default values and arg validation.
    if (decimalSeparator === undefined){decimalSeparator = ".";} // default to '.' as decimal separator
    if (thousandSeparator === undefined){thousandSeparator = ",";} // default to ',' as thousand separator
    if (precision === undefined){precision = 2;} // by default, 2 decimal places
    if (precision < 0) {precision = 0;} // precision cannot be negative.
    if (precision > 20) {precision = 20;} // precision cannot greater than 20

    // extract digits. if no digits, fill in a zero.
    let digits = value.match(/\d/g) || ['0'];

    // zero-pad a input
    while (digits.length <= precision) {digits.unshift('0')}

    if (precision > 0){
        // add the decimal separator
        digits.splice(digits.length - precision, 0, ".");
    }

    // clean up extraneous digits like leading zeros.
    digits = Number(digits.join('')).toFixed(precision).split('');


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

    return digits.join('');
}
