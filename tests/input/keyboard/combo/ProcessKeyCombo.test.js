var ProcessKeyCombo = require('../../../../src/input/keyboard/combo/ProcessKeyCombo');

describe('Phaser.Input.Keyboard.ProcessKeyCombo', function ()
{
    var event;
    var combo;

    function makeCombo (overrides)
    {
        var keyCodes = (overrides && overrides.keyCodes) ? overrides.keyCodes : [65, 66, 67];
        var base = {
            keyCodes: keyCodes,
            current: keyCodes[0],
            index: 0,
            size: keyCodes.length,
            maxKeyDelay: 0,
            timeLastMatched: 0,
            timeMatched: 0,
            matched: false,
            resetOnWrongKey: true
        };
        if (overrides)
        {
            Object.keys(overrides).forEach(function (k) { base[k] = overrides[k]; });
        }
        return base;
    }

    function makeEvent (keyCode, timeStamp)
    {
        return { keyCode: keyCode, timeStamp: timeStamp || 0 };
    }

    beforeEach(function ()
    {
        combo = makeCombo();
        event = makeEvent(65, 1000);
    });

    // --- already matched ---

    it('should return true immediately when combo is already matched', function ()
    {
        combo.matched = true;
        var result = ProcessKeyCombo(event, combo);
        expect(result).toBe(true);
    });

    it('should not mutate combo state when already matched', function ()
    {
        combo.matched = true;
        combo.index = 0;
        ProcessKeyCombo(event, combo);
        expect(combo.index).toBe(0);
    });

    // --- first key correct, no delay check ---

    it('should return false when the first correct key is pressed but combo is not finished', function ()
    {
        // keyCodes = [65, 66, 67], pressing 65 advances to index 1
        var result = ProcessKeyCombo(event, combo);
        expect(result).toBe(false);
    });

    it('should advance the combo index when the correct first key is pressed', function ()
    {
        ProcessKeyCombo(event, combo);
        expect(combo.index).toBe(1);
    });

    it('should update current to the next key after advancing', function ()
    {
        ProcessKeyCombo(event, combo);
        expect(combo.current).toBe(66);
    });

    it('should not mark combo as matched when only first key of multi-key combo is pressed', function ()
    {
        ProcessKeyCombo(event, combo);
        expect(combo.matched).toBe(false);
    });

    // --- full combo completion ---

    it('should return true when the last key in the combo is pressed', function ()
    {
        combo = makeCombo({ keyCodes: [65] });
        var result = ProcessKeyCombo(makeEvent(65, 1000), combo);
        expect(result).toBe(true);
    });

    it('should mark combo.matched as true when the full combo is completed', function ()
    {
        combo = makeCombo({ keyCodes: [65] });
        ProcessKeyCombo(makeEvent(65, 1000), combo);
        expect(combo.matched).toBe(true);
    });

    it('should set combo.timeMatched when the full combo is completed', function ()
    {
        combo = makeCombo({ keyCodes: [65] });
        ProcessKeyCombo(makeEvent(65, 5000), combo);
        expect(combo.timeMatched).toBe(5000);
    });

    it('should set combo.timeLastMatched when the full combo is completed', function ()
    {
        combo = makeCombo({ keyCodes: [65] });
        ProcessKeyCombo(makeEvent(65, 5000), combo);
        expect(combo.timeLastMatched).toBe(5000);
    });

    it('should complete a multi-key combo after all keys are pressed in sequence', function ()
    {
        // keyCodes = [65, 66, 67]
        ProcessKeyCombo(makeEvent(65, 1000), combo);
        ProcessKeyCombo(makeEvent(66, 2000), combo);
        var result = ProcessKeyCombo(makeEvent(67, 3000), combo);
        expect(result).toBe(true);
        expect(combo.matched).toBe(true);
    });

    // --- wrong key ---

    it('should return false when the wrong key is pressed', function ()
    {
        var result = ProcessKeyCombo(makeEvent(90, 1000), combo);
        expect(result).toBe(false);
    });

    it('should reset combo index when wrong key is pressed and resetOnWrongKey is true', function ()
    {
        combo.index = 1;
        combo.current = 66;
        ProcessKeyCombo(makeEvent(90, 1000), combo);
        expect(combo.index).toBe(0);
    });

    it('should reset combo.current to first keyCode when wrong key is pressed and resetOnWrongKey is true', function ()
    {
        combo.index = 1;
        combo.current = 66;
        ProcessKeyCombo(makeEvent(90, 1000), combo);
        expect(combo.current).toBe(65);
    });

    it('should not reset combo when wrong key is pressed and resetOnWrongKey is false', function ()
    {
        combo.resetOnWrongKey = false;
        combo.index = 1;
        combo.current = 66;
        ProcessKeyCombo(makeEvent(90, 1000), combo);
        expect(combo.index).toBe(1);
        expect(combo.current).toBe(66);
    });

    // --- maxKeyDelay checks ---

    it('should advance when index > 0, maxKeyDelay is set, and key pressed within time limit', function ()
    {
        combo.index = 1;
        combo.current = 66;
        combo.maxKeyDelay = 500;
        combo.timeLastMatched = 1000;
        // timeLimit = 1000 + 500 = 1500, event at 1200 is within limit
        var result = ProcessKeyCombo(makeEvent(66, 1200), combo);
        expect(result).toBe(false); // not last key, so not matched yet
        expect(combo.index).toBe(2);
    });

    it('should not advance when index > 0, maxKeyDelay is set, and key pressed too late', function ()
    {
        combo.index = 1;
        combo.current = 66;
        combo.maxKeyDelay = 500;
        combo.timeLastMatched = 1000;
        combo.resetOnWrongKey = false;
        // timeLimit = 1500, event at 2000 exceeds limit
        var result = ProcessKeyCombo(makeEvent(66, 2000), combo);
        expect(result).toBe(false);
        expect(combo.index).toBe(1); // not advanced
    });

    it('should not mark combo as matched when key pressed too late', function ()
    {
        combo.index = 1;
        combo.current = 66;
        combo.maxKeyDelay = 500;
        combo.timeLastMatched = 1000;
        ProcessKeyCombo(makeEvent(66, 2000), combo);
        expect(combo.matched).toBe(false);
    });

    it('should reset combo when key pressed too late and resetOnWrongKey is true', function ()
    {
        // key is correct but too late — keyMatched stays false, so resetOnWrongKey applies
        combo.index = 1;
        combo.current = 66;
        combo.maxKeyDelay = 500;
        combo.timeLastMatched = 1000;
        ProcessKeyCombo(makeEvent(66, 2000), combo);
        expect(combo.index).toBe(0);
        expect(combo.current).toBe(65);
    });

    it('should not apply delay check when index is 0', function ()
    {
        combo.maxKeyDelay = 500;
        combo.timeLastMatched = 0;
        // index === 0 so delay is skipped, should advance normally
        var result = ProcessKeyCombo(makeEvent(65, 9999), combo);
        expect(result).toBe(false);
        expect(combo.index).toBe(1);
    });

    it('should not apply delay check when maxKeyDelay is 0', function ()
    {
        combo.index = 1;
        combo.current = 66;
        combo.maxKeyDelay = 0;
        combo.timeLastMatched = 0;
        // maxKeyDelay === 0 so delay check is skipped
        var result = ProcessKeyCombo(makeEvent(66, 9999), combo);
        expect(result).toBe(false);
        expect(combo.index).toBe(2);
    });

    it('should complete combo at the exact time limit boundary', function ()
    {
        combo = makeCombo({ keyCodes: [65, 66] });
        ProcessKeyCombo(makeEvent(65, 1000), combo);
        combo.maxKeyDelay = 500;
        // timeLimit = timeLastMatched + maxKeyDelay; timeLastMatched was set by AdvanceKeyCombo
        var timeLimit = combo.timeLastMatched + combo.maxKeyDelay;
        var result = ProcessKeyCombo(makeEvent(66, timeLimit), combo);
        expect(result).toBe(true);
        expect(combo.matched).toBe(true);
    });
});
