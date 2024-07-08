import formatCurrency from "../../../script/Utils/money.js";

//create a group of specs or say test suite
describe('test suite: formatCurrency', () => {
    //to create a test
    it('converts cents into dollars', () => {
        //in jasmine instead of creating if statement and displaying the code ourselves jasmine provide a function expect
        //expect lets us compare, to compare the value expect gives us an object with many methods for comparision 
        //jasmine codes are designed that is equivalent to english
        expect(formatCurrency(2095)).toEqual('20.95');
    });
    it('Works with 0', () => {
        expect(formatCurrency(0)).toEqual('0.00');
    });
    it('Round up to nearest cent', () => {
        expect(formatCurrency(2000.5)).toEqual('20.01');
    });
    it('Round down to nearest cent', () => {
        expect(formatCurrency(2000.4)).toEqual('20.00');
    });
});