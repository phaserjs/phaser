vi.mock('../../../src/physics/arcade/ProcessY', function ()
{
    console.log('MOCK FACTORY CALLED');
    return {
        Set: vi.fn().mockReturnValue(0),
        Check: vi.fn().mockReturnValue(true),
        RunImmovableBody1: vi.fn(),
        RunImmovableBody2: vi.fn()
    };
});

var ProcessY = require('../../../src/physics/arcade/ProcessY');

console.log('MODULE SCOPE - ProcessY.Set type:', typeof ProcessY.Set);
console.log('MODULE SCOPE - mockReturnValue:', typeof ProcessY.Set.mockReturnValue);

describe('debug', function () {
    beforeEach(function () {
        console.log('BEFORE EACH - ProcessY.Set type:', typeof ProcessY.Set);
        console.log('BEFORE EACH - mockReturnValue:', typeof ProcessY.Set.mockReturnValue);
    });

    it('test1', function () {
        console.log('IT - ProcessY.Set type:', typeof ProcessY.Set);
        console.log('IT - mockReturnValue:', typeof ProcessY.Set.mockReturnValue);
        expect(true).toBe(true);
    });
});
