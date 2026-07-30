var KeyCodes = require('../../../../src/input/keyboard/keys/KeyCodes');

describe('KeyCodes', function ()
{
    it('should be importable', function ()
    {
        expect(KeyCodes).toBeDefined();
    });

    it('should be a plain object', function ()
    {
        expect(typeof KeyCodes).toBe('object');
        expect(KeyCodes).not.toBeNull();
    });

    it('should have correct code for BACKSPACE', function ()
    {
        expect(KeyCodes.BACKSPACE).toBe(8);
    });

    it('should have correct code for TAB', function ()
    {
        expect(KeyCodes.TAB).toBe(9);
    });

    it('should have correct code for ENTER', function ()
    {
        expect(KeyCodes.ENTER).toBe(13);
    });

    it('should have correct code for SHIFT', function ()
    {
        expect(KeyCodes.SHIFT).toBe(16);
    });

    it('should have correct code for CTRL', function ()
    {
        expect(KeyCodes.CTRL).toBe(17);
    });

    it('should have correct code for ALT', function ()
    {
        expect(KeyCodes.ALT).toBe(18);
    });

    it('should have correct code for PAUSE', function ()
    {
        expect(KeyCodes.PAUSE).toBe(19);
    });

    it('should have correct code for CAPS_LOCK', function ()
    {
        expect(KeyCodes.CAPS_LOCK).toBe(20);
    });

    it('should have correct code for ESC', function ()
    {
        expect(KeyCodes.ESC).toBe(27);
    });

    it('should have correct code for SPACE', function ()
    {
        expect(KeyCodes.SPACE).toBe(32);
    });

    it('should have correct codes for navigation keys', function ()
    {
        expect(KeyCodes.PAGE_UP).toBe(33);
        expect(KeyCodes.PAGE_DOWN).toBe(34);
        expect(KeyCodes.END).toBe(35);
        expect(KeyCodes.HOME).toBe(36);
    });

    it('should have correct codes for arrow keys', function ()
    {
        expect(KeyCodes.LEFT).toBe(37);
        expect(KeyCodes.UP).toBe(38);
        expect(KeyCodes.RIGHT).toBe(39);
        expect(KeyCodes.DOWN).toBe(40);
    });

    it('should have correct code for PRINT_SCREEN', function ()
    {
        expect(KeyCodes.PRINT_SCREEN).toBe(42);
    });

    it('should have correct code for INSERT', function ()
    {
        expect(KeyCodes.INSERT).toBe(45);
    });

    it('should have correct code for DELETE', function ()
    {
        expect(KeyCodes.DELETE).toBe(46);
    });

    it('should have correct codes for digit keys 0-9', function ()
    {
        expect(KeyCodes.ZERO).toBe(48);
        expect(KeyCodes.ONE).toBe(49);
        expect(KeyCodes.TWO).toBe(50);
        expect(KeyCodes.THREE).toBe(51);
        expect(KeyCodes.FOUR).toBe(52);
        expect(KeyCodes.FIVE).toBe(53);
        expect(KeyCodes.SIX).toBe(54);
        expect(KeyCodes.SEVEN).toBe(55);
        expect(KeyCodes.EIGHT).toBe(56);
        expect(KeyCodes.NINE).toBe(57);
    });

    it('should have correct codes for letter keys A-Z', function ()
    {
        expect(KeyCodes.A).toBe(65);
        expect(KeyCodes.B).toBe(66);
        expect(KeyCodes.C).toBe(67);
        expect(KeyCodes.D).toBe(68);
        expect(KeyCodes.E).toBe(69);
        expect(KeyCodes.F).toBe(70);
        expect(KeyCodes.G).toBe(71);
        expect(KeyCodes.H).toBe(72);
        expect(KeyCodes.I).toBe(73);
        expect(KeyCodes.J).toBe(74);
        expect(KeyCodes.K).toBe(75);
        expect(KeyCodes.L).toBe(76);
        expect(KeyCodes.M).toBe(77);
        expect(KeyCodes.N).toBe(78);
        expect(KeyCodes.O).toBe(79);
        expect(KeyCodes.P).toBe(80);
        expect(KeyCodes.Q).toBe(81);
        expect(KeyCodes.R).toBe(82);
        expect(KeyCodes.S).toBe(83);
        expect(KeyCodes.T).toBe(84);
        expect(KeyCodes.U).toBe(85);
        expect(KeyCodes.V).toBe(86);
        expect(KeyCodes.W).toBe(87);
        expect(KeyCodes.X).toBe(88);
        expect(KeyCodes.Y).toBe(89);
        expect(KeyCodes.Z).toBe(90);
    });

    it('should have correct codes for numpad digit keys 0-9', function ()
    {
        expect(KeyCodes.NUMPAD_ZERO).toBe(96);
        expect(KeyCodes.NUMPAD_ONE).toBe(97);
        expect(KeyCodes.NUMPAD_TWO).toBe(98);
        expect(KeyCodes.NUMPAD_THREE).toBe(99);
        expect(KeyCodes.NUMPAD_FOUR).toBe(100);
        expect(KeyCodes.NUMPAD_FIVE).toBe(101);
        expect(KeyCodes.NUMPAD_SIX).toBe(102);
        expect(KeyCodes.NUMPAD_SEVEN).toBe(103);
        expect(KeyCodes.NUMPAD_EIGHT).toBe(104);
        expect(KeyCodes.NUMPAD_NINE).toBe(105);
    });

    it('should have correct codes for numpad operator keys', function ()
    {
        expect(KeyCodes.NUMPAD_ADD).toBe(107);
        expect(KeyCodes.NUMPAD_SUBTRACT).toBe(109);
    });

    it('should have correct codes for function keys F1-F12', function ()
    {
        expect(KeyCodes.F1).toBe(112);
        expect(KeyCodes.F2).toBe(113);
        expect(KeyCodes.F3).toBe(114);
        expect(KeyCodes.F4).toBe(115);
        expect(KeyCodes.F5).toBe(116);
        expect(KeyCodes.F6).toBe(117);
        expect(KeyCodes.F7).toBe(118);
        expect(KeyCodes.F8).toBe(119);
        expect(KeyCodes.F9).toBe(120);
        expect(KeyCodes.F10).toBe(121);
        expect(KeyCodes.F11).toBe(122);
        expect(KeyCodes.F12).toBe(123);
    });

    it('should have correct codes for punctuation keys', function ()
    {
        expect(KeyCodes.SEMICOLON).toBe(186);
        expect(KeyCodes.PLUS).toBe(187);
        expect(KeyCodes.COMMA).toBe(188);
        expect(KeyCodes.MINUS).toBe(189);
        expect(KeyCodes.PERIOD).toBe(190);
        expect(KeyCodes.FORWARD_SLASH).toBe(191);
        expect(KeyCodes.BACK_SLASH).toBe(220);
        expect(KeyCodes.QUOTES).toBe(222);
        expect(KeyCodes.BACKTICK).toBe(192);
        expect(KeyCodes.OPEN_BRACKET).toBe(219);
        expect(KeyCodes.CLOSED_BRACKET).toBe(221);
    });

    it('should have correct codes for Firefox-specific keys', function ()
    {
        expect(KeyCodes.SEMICOLON_FIREFOX).toBe(59);
        expect(KeyCodes.COLON).toBe(58);
        expect(KeyCodes.COMMA_FIREFOX_WINDOWS).toBe(60);
        expect(KeyCodes.COMMA_FIREFOX).toBe(62);
        expect(KeyCodes.BRACKET_RIGHT_FIREFOX).toBe(174);
        expect(KeyCodes.BRACKET_LEFT_FIREFOX).toBe(175);
    });

    it('should have all values as numbers', function ()
    {
        var keys = Object.keys(KeyCodes);

        for (var i = 0; i < keys.length; i++)
        {
            expect(typeof KeyCodes[keys[i]]).toBe('number');
        }
    });

    it('should have all values as positive integers', function ()
    {
        var keys = Object.keys(KeyCodes);

        for (var i = 0; i < keys.length; i++)
        {
            var value = KeyCodes[keys[i]];
            expect(value).toBeGreaterThan(0);
            expect(Number.isInteger(value)).toBe(true);
        }
    });

    it('should have SEMICOLON differ from SEMICOLON_FIREFOX', function ()
    {
        expect(KeyCodes.SEMICOLON).not.toBe(KeyCodes.SEMICOLON_FIREFOX);
        expect(KeyCodes.SEMICOLON).toBe(186);
        expect(KeyCodes.SEMICOLON_FIREFOX).toBe(59);
    });

    it('should have OPEN_BRACKET differ from BRACKET_LEFT_FIREFOX', function ()
    {
        expect(KeyCodes.OPEN_BRACKET).not.toBe(KeyCodes.BRACKET_LEFT_FIREFOX);
        expect(KeyCodes.OPEN_BRACKET).toBe(219);
        expect(KeyCodes.BRACKET_LEFT_FIREFOX).toBe(175);
    });

    it('should have CLOSED_BRACKET differ from BRACKET_RIGHT_FIREFOX', function ()
    {
        expect(KeyCodes.CLOSED_BRACKET).not.toBe(KeyCodes.BRACKET_RIGHT_FIREFOX);
        expect(KeyCodes.CLOSED_BRACKET).toBe(221);
        expect(KeyCodes.BRACKET_RIGHT_FIREFOX).toBe(174);
    });

    it('should have sequential letter key codes from A to Z', function ()
    {
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        for (var i = 0; i < letters.length; i++)
        {
            expect(KeyCodes[letters[i]]).toBe(65 + i);
        }
    });

    it('should have sequential digit key codes from ZERO to NINE', function ()
    {
        var digits = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];

        for (var i = 0; i < digits.length; i++)
        {
            expect(KeyCodes[digits[i]]).toBe(48 + i);
        }
    });

    it('should have sequential numpad key codes from NUMPAD_ZERO to NUMPAD_NINE', function ()
    {
        var numpadKeys = ['NUMPAD_ZERO', 'NUMPAD_ONE', 'NUMPAD_TWO', 'NUMPAD_THREE', 'NUMPAD_FOUR',
            'NUMPAD_FIVE', 'NUMPAD_SIX', 'NUMPAD_SEVEN', 'NUMPAD_EIGHT', 'NUMPAD_NINE'];

        for (var i = 0; i < numpadKeys.length; i++)
        {
            expect(KeyCodes[numpadKeys[i]]).toBe(96 + i);
        }
    });

    it('should have sequential function key codes from F1 to F12', function ()
    {
        var fKeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

        for (var i = 0; i < fKeys.length; i++)
        {
            expect(KeyCodes[fKeys[i]]).toBe(112 + i);
        }
    });
});
