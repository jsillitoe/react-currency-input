import React from 'react'
import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import CurrencyInput from '../src/index'
import ReactTestUtils from 'react-addons-test-utils'
import setup from './setup'

chai.use(sinonChai);

describe('react-currency-input', function(){

    before('setup dom', function(){
        setup(); // setup the jsdom
    });

    describe('default arguments', function(){

        before('render and locate element', function() {
            this.renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput />
            );

            this.inputComponent = ReactTestUtils.findRenderedDOMComponentWithTag(
                this.renderedComponent,
                'input'
            );
        });

        it('<CurrencyInput> should have masked value of "0.00"', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('0.00')
        });


        it('<input> should be of type "text"', function() {
            expect(this.inputComponent.getAttribute('type')).to.equal('text')
        });


    });

    describe('custom arguments', function(){

        before('render and locate element', function() {
            this.renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput decimalSeparator="," thousandSeparator="." precision="3" value="123456789" inputType="tel" />
            );

            this.inputComponent = ReactTestUtils.findRenderedDOMComponentWithTag(
                this.renderedComponent,
                'input'
            );
        });

        it('<CurrencyInput> should have masked value of "123.456,789"', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('123.456.789,000')
        });

        it('<input> should be of type "tel"', function() {
            expect(this.inputComponent.getAttribute('type')).to.equal('tel')
        });
    });


    describe('properly convert number value props into display values', function(){

        it('adds decimals to whole numbers to match precision', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value={123456789} />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('123,456,789.00')
        });

        it('Does not change value when precision matches', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value={1234567.89} />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567.89')
        });


        it('Rounds down properly when an number with extra decimals is passed in', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value={1234567.89123} />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567.89')
        });


        it('Rounds up properly when an number with extra decimals is passed in', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value={1234567.89999} />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567.90')
        });

        it('Rounds up the whole number when an number with extra decimals is passed in', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="0" value={1234567.89999} />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,568')
        });

    });


    describe('properly convert string value props into display values', function(){

        it('adds decimals to whole numbers to match precision', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value="6300" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('6,300.00')
        });


        it('Does not change value when precision matches', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value="1234567.89" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567.89')
        });


        it('Rounds down properly when an number with extra decimals is passed in', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value="1234567.89123" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567.89')
        });


        it('Rounds up properly when an number with extra decimals is passed in', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="2" value="1234567.89999" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567.90')
        });


        it('Rounds up the whole number when an number with extra decimals is passed in', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput precision="0" value="1234567.89999" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,568')
        });


        it('Handles strings with separators', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1,000.01" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,000.01')
        });


        it('Handles strings with prefixes', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="$10.01" prefix="$" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('$10.01')
        });

        it('Handles strings with suffixes', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="10.01 kr" suffix=" kr" />
            );
            expect (renderedComponent.getMaskedValue()).to.equal('10.01 kr')
        });


        it('Handles strings with custom separators', function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="123.456.789,12" decimalSeparator="," thousandSeparator="."/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal('123.456.789,12')
        });


        it("Handles 1,234,567.89 format", function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1,234,567.89" decimalSeparator="." thousandSeparator=","/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567.89')
        });


        it("Handles 1 234 567.89 format", function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1,234,567.89" decimalSeparator="." thousandSeparator=" "/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1 234 567.89')
        });

        it("Handles 1 234 567,89 format", function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1 234 567,89" decimalSeparator="," thousandSeparator=" "/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1 234 567,89')
        });

        it("Handles 1,234,567·89 format", function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1,234,567·89" decimalSeparator="·" thousandSeparator=","/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1,234,567·89')
        });

        it("Handles 1.234.567,89 format", function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1.234.567,89" decimalSeparator="," thousandSeparator="."/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1.234.567,89')
        });

        it("Handles 1˙234˙567,89 format", function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1˙234˙567,89" decimalSeparator="," thousandSeparator="˙"/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal('1˙234˙567,89')
        });


        it("Handles 1'234'567.89 format", function() {
            var renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput value="1'234'567.89" decimalSeparator="." thousandSeparator="'"/>
            );
            expect (renderedComponent.getMaskedValue()).to.equal("1'234'567.89")
        });



    });

    describe('change events', function(){

        before('render and locate element', function() {
            this.handleChange = sinon.spy();

            this.renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput onChange={this.handleChange} value="0"/>
            );

            this.inputComponent = ReactTestUtils.findRenderedDOMComponentWithTag(
                this.renderedComponent,
                'input'
            );
        });

        it('should call onChange', function() {
            this.inputComponent.value=123456789;
            ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.handleChange).to.have.been.calledWith("1,234,567.89", 1234567.89);
        });


        it('should change the masked value', function() {
            this.inputComponent.value=123456789;
            ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal("1,234,567.89");
        });


        it('should change the component value', function() {
            this.inputComponent.value=123456789;
            ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.inputComponent.value).to.equal("1,234,567.89");
        });


    });


    describe('negative numbers', function() {

        before('render and locate element', function() {
            this.renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput onChange={this.handleChange} value="0" allowNegative={true}/>
            );

            this.inputComponent = ReactTestUtils.findRenderedDOMComponentWithTag(
                this.renderedComponent,
                'input'
            );
        });

        beforeEach('reset value to 0', function() {
            this.inputComponent.value = "0";
            ReactTestUtils.Simulate.change(this.inputComponent);
        });

        it('should render 0 without negative sign', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('0.00');
            this.inputComponent.value = "-0"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('0.00');
        });

        it('should render number with no or even number of "-" as positive', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('0.00');
            this.inputComponent.value = "123456"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
            this.inputComponent.value = "--123456"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
            this.inputComponent.value = "123--456"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
            this.inputComponent.value = "123456--"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
            this.inputComponent.value = "--123--456--"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
            this.inputComponent.value = "123456----"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
        });

        it('should render number with odd number of "-" as negative', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('0.00');
            this.inputComponent.value = "-123456"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('-1,234.56');
            this.inputComponent.value = "123-456"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('-1,234.56');
            this.inputComponent.value = "123456-"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('-1,234.56');
            this.inputComponent.value = "-123-456-"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('-1,234.56');
        });

        it('should correctly change between negative and positive numbers', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('0.00');
            this.inputComponent.value = "123456"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
            this.inputComponent.value = "1,234.56-"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('-1,234.56');
            this.inputComponent.value = "-1,234.56-"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
            this.inputComponent.value = "1-,234.56"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('-1,234.56');
            this.inputComponent.value = "-1,234.-56"; ReactTestUtils.Simulate.change(this.inputComponent);
            expect(this.renderedComponent.getMaskedValue()).to.equal('1,234.56');
        });

    });


    describe('currency prefix', function() {

        before('render and locate element', function () {
            this.renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput onChange={this.handleChange} value="0" prefix="$"/>
            );

            this.inputComponent = ReactTestUtils.findRenderedDOMComponentWithTag(
                this.renderedComponent,
                'input'
            );
        });

        it('should render the prefix', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('$0.00');
        });

    });

    describe('currency suffix', function() {

        before('render and locate element', function () {
            this.renderedComponent = ReactTestUtils.renderIntoDocument(
                <CurrencyInput onChange={this.handleChange} value="0" suffix=" kr"/>
            );

            this.inputComponent = ReactTestUtils.findRenderedDOMComponentWithTag(
                this.renderedComponent,
                'input'
            );
        });

        it('should render the suffix', function() {
            expect(this.renderedComponent.getMaskedValue()).to.equal('0.00 kr');
        });

    });

});
