var AdvanceKeyCombo = require('../../../../src/input/keyboard/combo/AdvanceKeyCombo');

describe('Phaser.Input.Keyboard.AdvanceKeyCombo', function ()
{
    var event;
    var combo;

    beforeEach(function ()
    {
        event = { timeStamp: 1000 };
        combo = {
            timeLastMatched: 0,
            index: 0,
            size: 3,
            keyCodes: [65, 66, 67],
            current: 65
        };
    });

    it('should update timeLastMatched from the event timeStamp', function ()
    {
        AdvanceKeyCombo(event, combo);
        expect(combo.timeLastMatched).toBe(1000);
    });

    it('should increment the combo index', function ()
    {
        AdvanceKeyCombo(event, combo);
        expect(combo.index).toBe(1);
    });

    it('should return false when not at the end of the combo', function ()
    {
        var result = AdvanceKeyCombo(event, combo);
        expect(result).toBe(false);
    });

    it('should update current to the next keyCode when not at the end', function ()
    {
        AdvanceKeyCombo(event, combo);
        expect(combo.current).toBe(66);
    });

    it('should return true when advancing reaches the end of the combo', function ()
    {
        combo.index = 2;
        var result = AdvanceKeyCombo(event, combo);
        expect(result).toBe(true);
    });

    it('should not update current when reaching the end of the combo', function ()
    {
        combo.index = 2;
        combo.current = 67;
        AdvanceKeyCombo(event, combo);
        expect(combo.current).toBe(67);
    });

    it('should set index to size when advancing from the last key', function ()
    {
        combo.index = 2;
        AdvanceKeyCombo(event, combo);
        expect(combo.index).toBe(3);
    });

    it('should work with a single-key combo', function ()
    {
        combo.size = 1;
        combo.keyCodes = [65];
        combo.index = 0;
        var result = AdvanceKeyCombo(event, combo);
        expect(result).toBe(true);
        expect(combo.index).toBe(1);
    });

    it('should update current to the correct keyCode on second advance', function ()
    {
        AdvanceKeyCombo(event, combo);
        AdvanceKeyCombo(event, combo);
        expect(combo.current).toBe(67);
    });

    it('should use the timeStamp from the event object', function ()
    {
        event.timeStamp = 9999;
        AdvanceKeyCombo(event, combo);
        expect(combo.timeLastMatched).toBe(9999);
    });

    it('should return false for the first advance in a multi-key combo', function ()
    {
        combo.size = 5;
        combo.keyCodes = [65, 66, 67, 68, 69];
        var result = AdvanceKeyCombo(event, combo);
        expect(result).toBe(false);
        expect(combo.index).toBe(1);
        expect(combo.current).toBe(66);
    });
});
