const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('Generate message', () => {
    it('should generate the correct object', () => {
        let from = 'Admin', text = 'Hi';

        let object = generateMessage(from, text);

        expect(object.from).toBe(from);
        expect(object.text).toBe(text);
        expect(typeof object.createdAt).toBe('number');
    });
});

describe('Generate location message', () => {

    it('should generate an object with message and url', () => {
        let from = 'Admin' , coords = {lat: 22, lng: 23};

        let object = generateLocationMessage(from, coords.lat, coords.lng);

        expect(object.from).toBe(from);
        expect(typeof object.url).toBe('string');

    });
});