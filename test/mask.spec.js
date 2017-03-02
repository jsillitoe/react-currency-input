import {expect} from 'chai'
import mask from '../src/mask'


describe('mask', function(){

    it('should return empty strings when value is not set"', function(){
        const {maskedValue, value} = mask();

        expect(maskedValue).to.equal("");
        expect(value).to.equal(0);
    });

    it('should return empty strings when value is empty string"', function(){
        const {maskedValue, value} = mask("");

        expect(maskedValue).to.equal("");
        expect(value).to.equal(0);
    });

    it('should return empty strings when value is null"', function(){
        const {maskedValue, value} = mask(null);

        expect(maskedValue).to.equal("");
        expect(value).to.equal(0);
    });

    it('should change "0" to "0.00"', function(){
        const {maskedValue, value} = mask("0");

        expect(maskedValue).to.equal("0.00");
        expect(value).to.equal(0);
    });

    it('should change "00" to "0.00"', function(){
        const {maskedValue, value} = mask("00");

        expect(maskedValue).to.equal("0.00");
        expect(value).to.equal(0);
    });

    it('should change "000" to "0.00"', function(){
        const {maskedValue, value} = mask("000");
        expect(maskedValue).to.equal("0.00");
        expect(value).to.equal(0);
    });

    it('should change "0000" to "0.00"', function(){
        const {maskedValue, value} = mask("0000");
        expect(maskedValue).to.equal("0.00");
        expect(value).to.equal(0);
    });

    it('should change "0001" to "0.01"', function(){
        const {maskedValue, value} = mask("0001");
        expect(maskedValue).to.equal("0.01");
        expect(value).to.equal(0.01);
    });

    it('should change "1001" to "10.01"', function(){
        const {maskedValue, value} = mask("1001");
        expect(maskedValue).to.equal("10.01");
        expect(value).to.equal(10.01);
    });

    it('should change "123456789" to "1,234,567.89"', function(){
        const {maskedValue, value} = mask("123456789");
        expect(maskedValue).to.equal("1,234,567.89");
        expect(value).to.equal(1234567.89);
    });


    describe('with separators', function(){

        it('decimal:"," thousand:"." should change "123456789" to "1.234.567,89"', function(){
            const {maskedValue, value} = mask("123456789", 2, ",", ".");
            expect(maskedValue).to.equal("1.234.567,89");
            expect(value).to.equal(1234567.89);
        });

        it('zero length thousand separator should change "123456789" to "1234567.89"', function(){
            const {maskedValue, value} = mask("123456789", 2, ".", "");
            expect(maskedValue).to.equal("1234567.89");
            expect(value).to.equal(1234567.89);
        });

        it('zero length decimal separator should change "123456789" to "1,234,56789"', function(){
            const {maskedValue, value} = mask("123456789", 2, "", ",");
            expect(maskedValue).to.equal("1,234,56789");
            expect(value).to.equal(1234567.89);
        });

    });


    describe('with precision', function(){

        it('set to string value "3" should change "123456789" to "123,456.789"', function(){
            const {maskedValue, value} = mask("123456789", "3");
            expect(maskedValue).to.equal("123,456.789");
            expect(value).to.equal(123456.789)
        });

        it('set to 3 should change "123456789" to "123,456.789"', function(){
            const {maskedValue, value} = mask("123456789", 3);
            expect(maskedValue).to.equal("123,456.789");
            expect(value).to.equal(123456.789);
        });

        it('set to 0 should change "123456789" to "123,456,789"', function(){
            const {maskedValue, value} = mask("123456789", 0);
            expect(maskedValue).to.equal("123,456,789");
            expect(value).to.equal(123456789);
        });

    });


    describe('negative numbers', function(){

        it('all "-" should be stripped out if allowNegative is false', function(){
            expect(mask("123456").maskedValue).to.equal("1,234.56");
            expect(mask("-123456").maskedValue).to.equal("1,234.56");
            expect(mask("--123456").maskedValue).to.equal("1,234.56");
            expect(mask("--123--456").maskedValue).to.equal("1,234.56");
            expect(mask("--123--456--").maskedValue).to.equal("1,234.56");
        });

        it('single "-" anywhere in the string should result in a negative masked number', function(){
            expect(mask("-123456", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
            expect(mask("123-456", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
            expect(mask("123456-", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
        });

        it('single "-" anywhere in the string should result in a negative unmasked number', function(){
            expect(mask("-123456", "2", ".", ",", true).value).to.equal(-1234.56);
            expect(mask("123-456", "2", ".", ",", true).value).to.equal(-1234.56);
            expect(mask("123456-", "2", ".", ",", true).value).to.equal(-1234.56);
        });

        it('no or even number of "-" should result in a positive number', function(){
            expect(mask("123456", "2", ".", ",", true).maskedValue).to.equal("1,234.56");
            expect(mask("--123456", "2", ".", ",", true).maskedValue).to.equal("1,234.56");
            expect(mask("123--456", "2", ".", ",", true).maskedValue).to.equal("1,234.56");
            expect(mask("123456--", "2", ".", ",", true).maskedValue).to.equal("1,234.56");
            expect(mask("--123456--", "2", ".", ",", true).maskedValue).to.equal("1,234.56");
            expect(mask("--123--456--", "2", ".", ",", true).maskedValue).to.equal("1,234.56");
            expect(mask("--1--234--56--", "2", ".", ",", true).maskedValue).to.equal("1,234.56");
        });

        it('odd number of "-" should result in a negative number', function(){
            expect(mask("-123456", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
            expect(mask("123-456", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
            expect(mask("123456-", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
            expect(mask("-123-456-", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
            expect(mask("-1-23-45-6-", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
            expect(mask("-1-2-3-4-5-6-", "2", ".", ",", true).maskedValue).to.equal("-1,234.56");
        });

        it('0 is never negative', function(){
            expect(mask("0", "2", ".", ",", true).maskedValue).to.equal("0.00");
            expect(mask("-0", "2", ".", ",", true).maskedValue).to.equal("0.00");
            expect(mask("-0-", "2", ".", ",", true).maskedValue).to.equal("0.00");
            expect(mask("--0-", "2", ".", ",", true).maskedValue).to.equal("0.00");
        });

        it('just "-" should result in 0.00', function(){
            expect(mask("-", "2", ".", ",", true).maskedValue).to.equal("0.00");
        });

    });



    describe('with currency symbol', function(){

        it('"$" prefix should change "0" to "$0.00"', function(){
            expect(mask("0","2",".",",",true,"$","").maskedValue).to.equal("$0.00");
        });

        it('"kr" suffix should change "0" to "0.00kr"', function(){
            expect(mask("0","2",".",",",true,"","kr").maskedValue).to.equal("0.00kr");
        });

        it('can have both a prefix and a suffix', function(){
            expect(mask("0","2",".",",",true,"$","kr").maskedValue).to.equal("$0.00kr");
        });

        it('does not strip whitespaces between amount and symbol', function(){
            expect(mask("0","2",".",",",true,"$ ","").maskedValue).to.equal("$ 0.00");
            expect(mask("0","2",".",",",true,""," kr").maskedValue).to.equal("0.00 kr");
        });

        it('strips whitespaces before and after value', function(){
            expect(mask("0","2",".",",",true,"  $ ","").maskedValue).to.equal("$ 0.00");
            expect(mask("0","2",".",",",true,""," kr   ").maskedValue).to.equal("0.00 kr");
        });


        it('"-" should come before the prefix', function(){
            expect(mask("-20.00","2",".",",",true,"$","").maskedValue).to.equal("-$20.00");
        });

    });



});
