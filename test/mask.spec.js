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

        it('set to 3 should change "123456789" to "123,456.789"', function(){
            expect(mask("123456789", 3)).to.equal("123,456.789");
        });

        it('set to 0 should change "123456789" to "123,456,789"', function(){
            expect(mask("123456789", 0)).to.equal("123,456,789");
        });

    });



});
