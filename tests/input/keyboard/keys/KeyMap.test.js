var KeyCodes = require('../../../../src/input/keyboard/keys/KeyCodes');
var KeyMap = require('../../../../src/input/keyboard/keys/KeyMap');

describe('KeyMap', function ()
{
    it('should be a plain object', function ()
    {
        expect(typeof KeyMap).toBe('object');
        expect(KeyMap).not.toBeNull();
    });

    it('should map numeric key codes to key name strings', function ()
    {
        for (var code in KeyMap)
        {
            expect(typeof parseInt(code, 10)).toBe('number');
            expect(typeof KeyMap[code]).toBe('string');
        }
    });

    it('should be the inverse mapping of KeyCodes', function ()
    {
        for (var key in KeyCodes)
        {
            var code = KeyCodes[key];
            expect(KeyMap[code]).toBe(key);
        }
    });

    it('should map BACKSPACE (8) to the string "BACKSPACE"', function ()
    {
        expect(KeyMap[8]).toBe('BACKSPACE');
    });

    it('should map TAB (9) to the string "TAB"', function ()
    {
        expect(KeyMap[9]).toBe('TAB');
    });

    it('should map ENTER (13) to the string "ENTER"', function ()
    {
        expect(KeyMap[13]).toBe('ENTER');
    });

    it('should map SHIFT (16) to the string "SHIFT"', function ()
    {
        expect(KeyMap[16]).toBe('SHIFT');
    });

    it('should map CTRL (17) to the string "CTRL"', function ()
    {
        expect(KeyMap[17]).toBe('CTRL');
    });

    it('should map ALT (18) to the string "ALT"', function ()
    {
        expect(KeyMap[18]).toBe('ALT');
    });

    it('should map ESC (27) to the string "ESC"', function ()
    {
        expect(KeyMap[27]).toBe('ESC');
    });

    it('should map SPACE (32) to the string "SPACE"', function ()
    {
        expect(KeyMap[32]).toBe('SPACE');
    });

    it('should map LEFT (37) to the string "LEFT"', function ()
    {
        expect(KeyMap[37]).toBe('LEFT');
    });

    it('should map UP (38) to the string "UP"', function ()
    {
        expect(KeyMap[38]).toBe('UP');
    });

    it('should map RIGHT (39) to the string "RIGHT"', function ()
    {
        expect(KeyMap[39]).toBe('RIGHT');
    });

    it('should map DOWN (40) to the string "DOWN"', function ()
    {
        expect(KeyMap[40]).toBe('DOWN');
    });

    it('should map A (65) to the string "A"', function ()
    {
        expect(KeyMap[65]).toBe('A');
    });

    it('should map Z (90) to the string "Z"', function ()
    {
        expect(KeyMap[90]).toBe('Z');
    });

    it('should not contain undefined values for any KeyCodes entry', function ()
    {
        for (var key in KeyCodes)
        {
            var code = KeyCodes[key];
            expect(KeyMap[code]).not.toBeUndefined();
        }
    });

    it('should return undefined for a code not in KeyCodes', function ()
    {
        expect(KeyMap[99999]).toBeUndefined();
    });
});
