var Button = require('../../../src/input/gamepad/Button');

function createMockPad ()
{
    var manager = {
        emitted: [],
        emit: function (event)
        {
            this.emitted.push(Array.prototype.slice.call(arguments));
        }
    };

    var pad = {
        emitted: [],
        manager: manager,
        emit: function (event)
        {
            this.emitted.push(Array.prototype.slice.call(arguments));
        }
    };

    return pad;
}

describe('Button', function ()
{
    describe('constructor', function ()
    {
        it('should set pad reference from argument', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            expect(btn.pad).toBe(pad);
        });

        it('should set events to pad.manager', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            expect(btn.events).toBe(pad.manager);
        });

        it('should set index from argument', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 3);
            expect(btn.index).toBe(3);
        });

        it('should default value to 0', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            expect(btn.value).toBe(0);
        });

        it('should default threshold to 1', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            expect(btn.threshold).toBe(1);
        });

        it('should default pressed to false when isPressed is not provided', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            expect(btn.pressed).toBe(false);
        });

        it('should set pressed to false when isPressed is explicitly false', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0, false);
            expect(btn.pressed).toBe(false);
        });

        it('should set pressed to true when isPressed is true', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0, true);
            expect(btn.pressed).toBe(true);
        });

        it('should store index 0', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            expect(btn.index).toBe(0);
        });

        it('should store large index values', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 15);
            expect(btn.index).toBe(15);
        });
    });

    describe('update', function ()
    {
        it('should set the value property', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(0.5);
            expect(btn.value).toBe(0.5);
        });

        it('should set value to 0', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(0);
            expect(btn.value).toBe(0);
        });

        it('should set value to 1', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(1);
            expect(btn.value).toBe(1);
        });

        it('should set pressed to true when value meets threshold', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(1);
            expect(btn.pressed).toBe(true);
        });

        it('should set pressed to true when value exceeds threshold', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.threshold = 0.5;
            btn.update(0.8);
            expect(btn.pressed).toBe(true);
        });

        it('should not set pressed when value is below threshold', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(0.5);
            expect(btn.pressed).toBe(false);
        });

        it('should emit BUTTON_DOWN on pad.manager when button is first pressed', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 2);
            btn.update(1);
            expect(pad.manager.emitted.length).toBe(1);
            expect(pad.manager.emitted[0][0]).toBe('down');
        });

        it('should emit GAMEPAD_BUTTON_DOWN on pad when button is first pressed', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 2);
            btn.update(1);
            expect(pad.emitted.length).toBe(1);
            expect(pad.emitted[0][0]).toBe('down');
        });

        it('should pass pad, button, and value to BUTTON_DOWN event', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 2);
            btn.update(1);
            var args = pad.manager.emitted[0];
            expect(args[1]).toBe(pad);
            expect(args[2]).toBe(btn);
            expect(args[3]).toBe(1);
        });

        it('should pass index, value, and button to GAMEPAD_BUTTON_DOWN event', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 2);
            btn.update(1);
            var args = pad.emitted[0];
            expect(args[1]).toBe(2);
            expect(args[2]).toBe(1);
            expect(args[3]).toBe(btn);
        });

        it('should not emit BUTTON_DOWN again if already pressed', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(1);
            btn.update(1);
            expect(pad.manager.emitted.length).toBe(1);
        });

        it('should emit BUTTON_UP when button is released', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(1);
            pad.manager.emitted = [];
            pad.emitted = [];
            btn.update(0);
            expect(pad.manager.emitted.length).toBe(1);
            expect(pad.manager.emitted[0][0]).toBe('up');
        });

        it('should emit GAMEPAD_BUTTON_UP on pad when button is released', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(1);
            pad.emitted = [];
            btn.update(0);
            expect(pad.emitted.length).toBe(1);
            expect(pad.emitted[0][0]).toBe('up');
        });

        it('should set pressed to false when button is released', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(1);
            expect(btn.pressed).toBe(true);
            btn.update(0);
            expect(btn.pressed).toBe(false);
        });

        it('should pass pad, button, and value to BUTTON_UP event', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 1);
            btn.update(1);
            pad.manager.emitted = [];
            btn.update(0);
            var args = pad.manager.emitted[0];
            expect(args[1]).toBe(pad);
            expect(args[2]).toBe(btn);
            expect(args[3]).toBe(0);
        });

        it('should not emit BUTTON_UP when already released', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(0);
            expect(pad.manager.emitted.length).toBe(0);
        });

        it('should not emit any events when value stays below threshold', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(0.3);
            btn.update(0.5);
            btn.update(0.9);
            expect(pad.manager.emitted.length).toBe(0);
        });

        it('should emit down then up on press and release cycle', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(1);
            btn.update(0);
            expect(pad.manager.emitted.length).toBe(2);
            expect(pad.manager.emitted[0][0]).toBe('down');
            expect(pad.manager.emitted[1][0]).toBe('up');
        });

        it('should respect a custom lower threshold', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.threshold = 0.5;
            btn.update(0.5);
            expect(btn.pressed).toBe(true);
        });

        it('should not trigger pressed when value is just below custom threshold', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.threshold = 0.5;
            btn.update(0.49);
            expect(btn.pressed).toBe(false);
        });

        it('should not emit down event when constructed with isPressed true and updated with high value', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0, true);
            btn.update(1);
            expect(pad.manager.emitted.length).toBe(0);
        });

        it('should emit up event when constructed with isPressed true and updated with low value', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0, true);
            btn.update(0);
            expect(btn.pressed).toBe(false);
            expect(pad.manager.emitted.length).toBe(1);
            expect(pad.manager.emitted[0][0]).toBe('up');
        });

        it('should update value even when no state change occurs', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.update(0.3);
            expect(btn.value).toBeCloseTo(0.3);
            btn.update(0.7);
            expect(btn.value).toBeCloseTo(0.7);
        });
    });

    describe('destroy', function ()
    {
        it('should set pad to null', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.destroy();
            expect(btn.pad).toBeNull();
        });

        it('should set events to null', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 0);
            btn.destroy();
            expect(btn.events).toBeNull();
        });

        it('should not affect index or value after destroy', function ()
        {
            var pad = createMockPad();
            var btn = new Button(pad, 5);
            btn.update(0.8);
            btn.destroy();
            expect(btn.index).toBe(5);
            expect(btn.value).toBeCloseTo(0.8);
        });
    });
});
