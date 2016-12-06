import {expect} from 'chai'
import mask from '../src/mask'


describe('mask', function(){


    it('should change "0" to "$0.00"', function(){
        expect(mask("0")).to.equal("0.00");
    });

    it('should change "00" to "0.00"', function(){
        expect(mask("00")).to.equal("0.00");
    });

    it('should change "000" to "0.00"', function(){
        expect(mask("000")).to.equal("0.00");
    });

    it('should change "0000" to "0.00"', function(){
        expect(mask("0000")).to.equal("0.00");
    });

    it('should change "0001" to "0.01"', function(){
        expect(mask("0001")).to.equal("0.01");
    });

    it('should change "1001" to "10.01"', function(){
        expect(mask("1001")).to.equal("10.01");
    });

    it('should change "123456789" to "1,234,567.89"', function(){
        expect(mask("123456789")).to.equal("1,234,567.89");
    });


    describe('with separators', function(){

        it('decimal:"," thousand:"." should change "123456789" to "1.234.567,89"', function(){
            expect(mask("123456789", 2, ",", ".")).to.equal("1.234.567,89");
        });

        it('zero length thousand separator should change "123456789" to "1234567.89"', function(){
            expect(mask("123456789", 2, ".", "")).to.equal("1234567.89");
        });

        it('zero length decimal separator should change "123456789" to "1,234,56789"', function(){
            expect(mask("123456789", 2, "", ",")).to.equal("1,234,56789");
        });

    });


    describe('with precision', function(){

        it('set to string value "3" should change "123456789" to "123,456.789"', function(){
            expect(mask("123456789", "3")).to.equal("123,456.789");
        });

        it('set to 3 should change "123456789" to "123,456.789"', function(){
            expect(mask("123456789", 3)).to.equal("123,456.789");
        });

        it('set to 0 should change "123456789" to "123,456,789"', function(){
            expect(mask("123456789", 0)).to.equal("123,456,789");
        });

    });


    describe('negative numbers', function(){

        it('all "-" should be stripped out if allowNegative is false', function(){
            expect(mask("123456")).to.equal("1,234.56");
            expect(mask("-123456")).to.equal("1,234.56");
            expect(mask("--123456")).to.equal("1,234.56");
            expect(mask("--123--456")).to.equal("1,234.56");
            expect(mask("--123--456--")).to.equal("1,234.56");
        });

        it('single "-" anywhere in the string should result in a negative number', function(){
            expect(mask("-123456", "2", ".", ",", true)).to.equal("-1,234.56");
            expect(mask("123-456", "2", ".", ",", true)).to.equal("-1,234.56");
            expect(mask("123456-", "2", ".", ",", true)).to.equal("-1,234.56");
        });

        it('no or even number of "-" should result in a positive number', function(){
            expect(mask("123456", "2", ".", ",", true)).to.equal("1,234.56");
            expect(mask("--123456", "2", ".", ",", true)).to.equal("1,234.56");
            expect(mask("123--456", "2", ".", ",", true)).to.equal("1,234.56");
            expect(mask("123456--", "2", ".", ",", true)).to.equal("1,234.56");
            expect(mask("--123456--", "2", ".", ",", true)).to.equal("1,234.56");
            expect(mask("--123--456--", "2", ".", ",", true)).to.equal("1,234.56");
            expect(mask("--1--234--56--", "2", ".", ",", true)).to.equal("1,234.56");
        });

        it('odd number of "-" should result in a negative number', function(){
            expect(mask("-123456", "2", ".", ",", true)).to.equal("-1,234.56");
            expect(mask("123-456", "2", ".", ",", true)).to.equal("-1,234.56");
            expect(mask("123456-", "2", ".", ",", true)).to.equal("-1,234.56");
            expect(mask("-123-456-", "2", ".", ",", true)).to.equal("-1,234.56");
            expect(mask("-1-23-45-6-", "2", ".", ",", true)).to.equal("-1,234.56");
            expect(mask("-1-2-3-4-5-6-", "2", ".", ",", true)).to.equal("-1,234.56");
        });

        it('0 is never negative', function(){
            expect(mask("", "2", ".", ",", true)).to.equal("0.00");
            expect(mask("0", "2", ".", ",", true)).to.equal("0.00");
            expect(mask("-0", "2", ".", ",", true)).to.equal("0.00");
            expect(mask("-0-", "2", ".", ",", true)).to.equal("0.00");
            expect(mask("--0-", "2", ".", ",", true)).to.equal("0.00");
        });

        it('just "-" should result in 0.00', function(){
            expect(mask("-", "2", ".", ",", true)).to.equal("0.00");
        });

    });



});
