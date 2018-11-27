const expect = require('expect');
const {generateMessage} = require('./message');

describe('Generate message', () => {
    it('should generate the correct object', () => {
        let from = 'Admin', text = 'Hi';

        let object = generateMessage(from, text);

        expect(object.from).toBe(from);
        expect(object.text).toBe(text);
        expect(typeof object.createdAt).toBe('number');

    });
});