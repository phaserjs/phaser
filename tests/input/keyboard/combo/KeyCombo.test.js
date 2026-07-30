var KeyCombo = require('../../../../src/input/keyboard/combo/KeyCombo');

describe('KeyCombo', function ()
{
    var mockPlugin;

    beforeEach(function ()
    {
        mockPlugin = {
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn()
        };
    });

    describe('constructor', function ()
    {
        it('should create a combo from a string of keys', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');

            expect(combo.enabled).toBe(true);
            expect(combo.matched).toBe(false);
            expect(combo.index).toBe(0);
            expect(combo.size).toBe(2);
            expect(combo.keyCodes.length).toBe(2);
        });

        it('should convert string characters to uppercase char codes', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'ab');

            expect(combo.keyCodes[0]).toBe('A'.charCodeAt(0));
            expect(combo.keyCodes[1]).toBe('B'.charCodeAt(0));
        });

        it('should accept an array of number key codes', function ()
        {
            var combo = new KeyCombo(mockPlugin, [ 65, 66, 67 ]);

            expect(combo.keyCodes).toEqual([ 65, 66, 67 ]);
            expect(combo.size).toBe(3);
        });

        it('should accept an array of string characters', function ()
        {
            var combo = new KeyCombo(mockPlugin, [ 'A', 'B' ]);

            expect(combo.keyCodes[0]).toBe('A'.charCodeAt(0));
            expect(combo.keyCodes[1]).toBe('B'.charCodeAt(0));
        });

        it('should accept an array of objects with keyCode property', function ()
        {
            var combo = new KeyCombo(mockPlugin, [ { keyCode: 38 }, { keyCode: 40 } ]);

            expect(combo.keyCodes[0]).toBe(38);
            expect(combo.keyCodes[1]).toBe(40);
        });

        it('should accept a mixed array of numbers, strings, and objects', function ()
        {
            var combo = new KeyCombo(mockPlugin, [ 65, 'B', { keyCode: 67 } ]);

            expect(combo.keyCodes[0]).toBe(65);
            expect(combo.keyCodes[1]).toBe('B'.charCodeAt(0));
            expect(combo.keyCodes[2]).toBe(67);
        });

        it('should set current to the first keyCode', function ()
        {
            var combo = new KeyCombo(mockPlugin, [ 38, 40 ]);

            expect(combo.current).toBe(38);
        });

        it('should set default timeLastMatched to 0', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');

            expect(combo.timeLastMatched).toBe(0);
        });

        it('should set default timeMatched to 0', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');

            expect(combo.timeMatched).toBe(0);
        });

        it('should register the keydown listener on the plugin', function ()
        {
            new KeyCombo(mockPlugin, 'AB');

            expect(mockPlugin.on).toHaveBeenCalledOnce();
        });

        it('should not initialize properly when keys length is less than 2', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'A');

            expect(combo.enabled).toBeUndefined();
        });

        it('should not initialize properly when keys array has only one element', function ()
        {
            var combo = new KeyCombo(mockPlugin, [ 65 ]);

            expect(combo.enabled).toBeUndefined();
        });

        describe('config defaults', function ()
        {
            it('should default resetOnWrongKey to true', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB');

                expect(combo.resetOnWrongKey).toBe(true);
            });

            it('should default maxKeyDelay to 0', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB');

                expect(combo.maxKeyDelay).toBe(0);
            });

            it('should default resetOnMatch to false', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB');

                expect(combo.resetOnMatch).toBe(false);
            });

            it('should default deleteOnMatch to false', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB');

                expect(combo.deleteOnMatch).toBe(false);
            });
        });

        describe('config overrides', function ()
        {
            it('should accept resetOnWrongKey from config', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB', { resetOnWrongKey: false });

                expect(combo.resetOnWrongKey).toBe(false);
            });

            it('should accept maxKeyDelay from config', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB', { maxKeyDelay: 500 });

                expect(combo.maxKeyDelay).toBe(500);
            });

            it('should accept resetOnMatch from config', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB', { resetOnMatch: true });

                expect(combo.resetOnMatch).toBe(true);
            });

            it('should accept deleteOnMatch from config', function ()
            {
                var combo = new KeyCombo(mockPlugin, 'AB', { deleteOnMatch: true });

                expect(combo.deleteOnMatch).toBe(true);
            });
        });
    });

    describe('progress', function ()
    {
        it('should return 0 at the start', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'ABCD');

            expect(combo.progress).toBe(0);
        });

        it('should return the ratio of index to size', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'ABCD');

            combo.index = 2;

            expect(combo.progress).toBeCloseTo(0.5);
        });

        it('should return 1 when index equals size', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');

            combo.index = 2;

            expect(combo.progress).toBe(1);
        });

        it('should reflect partial progress', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'ABCD');

            combo.index = 1;

            expect(combo.progress).toBeCloseTo(0.25);
        });
    });

    describe('destroy', function ()
    {
        it('should set enabled to false', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');
            combo.destroy();

            expect(combo.enabled).toBe(false);
        });

        it('should clear the keyCodes array', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'ABCD');
            combo.destroy();

            expect(combo.keyCodes).toEqual([]);
        });

        it('should remove the keydown listener from the plugin', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');
            combo.destroy();

            expect(mockPlugin.off).toHaveBeenCalledOnce();
        });

        it('should set manager to null', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');
            combo.destroy();

            expect(combo.manager).toBeNull();
        });

        it('should pass the stored onKeyDown handler to off()', function ()
        {
            var combo = new KeyCombo(mockPlugin, 'AB');
            var handler = combo.onKeyDown;
            combo.destroy();

            var offCall = mockPlugin.off.mock.calls[0];

            expect(offCall[1]).toBe(handler);
        });
    });
});
