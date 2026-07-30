var ResetKeyCombo = require('../../../../src/input/keyboard/combo/ResetKeyCombo');

describe('Phaser.Input.Keyboard.ResetKeyCombo', function ()
{
    it('should reset index to zero', function ()
    {
        var combo = { keyCodes: [65, 66, 67], current: 66, index: 2, timeLastMatched: 1000, matched: true, timeMatched: 2000 };

        ResetKeyCombo(combo);

        expect(combo.index).toBe(0);
    });

    it('should set current to the first keyCode', function ()
    {
        var combo = { keyCodes: [65, 66, 67], current: 66, index: 2, timeLastMatched: 1000, matched: true, timeMatched: 2000 };

        ResetKeyCombo(combo);

        expect(combo.current).toBe(65);
    });

    it('should reset timeLastMatched to zero', function ()
    {
        var combo = { keyCodes: [65, 66, 67], current: 66, index: 2, timeLastMatched: 1000, matched: true, timeMatched: 2000 };

        ResetKeyCombo(combo);

        expect(combo.timeLastMatched).toBe(0);
    });

    it('should reset matched to false', function ()
    {
        var combo = { keyCodes: [65, 66, 67], current: 66, index: 2, timeLastMatched: 1000, matched: true, timeMatched: 2000 };

        ResetKeyCombo(combo);

        expect(combo.matched).toBe(false);
    });

    it('should reset timeMatched to zero', function ()
    {
        var combo = { keyCodes: [65, 66, 67], current: 66, index: 2, timeLastMatched: 1000, matched: true, timeMatched: 2000 };

        ResetKeyCombo(combo);

        expect(combo.timeMatched).toBe(0);
    });

    it('should return the combo object', function ()
    {
        var combo = { keyCodes: [65, 66, 67], current: 65, index: 0, timeLastMatched: 0, matched: false, timeMatched: 0 };

        var result = ResetKeyCombo(combo);

        expect(result).toBe(combo);
    });

    it('should work with a single keyCode', function ()
    {
        var combo = { keyCodes: [72], current: 72, index: 0, timeLastMatched: 500, matched: true, timeMatched: 999 };

        ResetKeyCombo(combo);

        expect(combo.current).toBe(72);
        expect(combo.index).toBe(0);
        expect(combo.timeLastMatched).toBe(0);
        expect(combo.matched).toBe(false);
        expect(combo.timeMatched).toBe(0);
    });

    it('should set current to the first keyCode regardless of how many keys are in the combo', function ()
    {
        var combo = { keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], current: 65, index: 9, timeLastMatched: 1234, matched: true, timeMatched: 5678 };

        ResetKeyCombo(combo);

        expect(combo.current).toBe(38);
        expect(combo.index).toBe(0);
    });

    it('should not modify the keyCodes array', function ()
    {
        var keyCodes = [65, 66, 67];
        var combo = { keyCodes: keyCodes, current: 67, index: 2, timeLastMatched: 100, matched: true, timeMatched: 200 };

        ResetKeyCombo(combo);

        expect(combo.keyCodes).toBe(keyCodes);
        expect(combo.keyCodes.length).toBe(3);
        expect(combo.keyCodes[0]).toBe(65);
        expect(combo.keyCodes[1]).toBe(66);
        expect(combo.keyCodes[2]).toBe(67);
    });
});
