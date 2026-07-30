vi.mock('../../../src/physics/arcade/ProcessY', function ()
{
    return {
        Set: vi.fn().mockReturnValue(0),
        Check: vi.fn().mockReturnValue(true),
        RunImmovableBody1: vi.fn(),
        RunImmovableBody2: vi.fn()
    };
});

var ProcessY = require('../../../src/physics/arcade/ProcessY');

describe('debug', function () {
    it('check ProcessY type', function () {
        console.log('ProcessY:', JSON.stringify(ProcessY));
        console.log('ProcessY.Set type:', typeof ProcessY.Set);
        console.log('has mockReturnValue:', typeof ProcessY.Set.mockReturnValue);
    });
});
