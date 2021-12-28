import { makeId } from './utils';

test('makeId should generate unique id based on length', () => {
    // -- arranage
    const uniqueId = makeId(15);

    // -- act
    const expected = 15;
    const uniqueIdLength = uniqueId.length;

    // -- assert
    expect(uniqueIdLength).toBe(expected);
});