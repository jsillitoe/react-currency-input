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
            expect(this.renderedComponent.getMaskedValue()).to.equal('123.456,789')
        });

        it('<input> should be of type "tel"', function() {
            expect(this.inputComponent.getAttribute('type')).to.equal('tel')
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
