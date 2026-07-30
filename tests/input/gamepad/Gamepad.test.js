var Gamepad = require('../../../src/input/gamepad/Gamepad');

function createMockManager ()
{
    return {
        emit: function () {}
    };
}

function createMockPad (buttonCount, axisCount, options)
{
    if (buttonCount === undefined) { buttonCount = 4; }
    if (axisCount === undefined) { axisCount = 4; }
    if (options === undefined) { options = {}; }

    var buttons = [];
    for (var i = 0; i < buttonCount; i++)
    {
        buttons.push({ value: 0, pressed: false });
    }

    var axes = [];
    for (var i = 0; i < axisCount; i++)
    {
        axes.push(0);
    }

    return {
        id: options.id !== undefined ? options.id : 'Mock Gamepad 045e-028e',
        index: options.index !== undefined ? options.index : 0,
        buttons: buttons,
        axes: axes,
        vibrationActuator: options.vibrationActuator !== undefined ? options.vibrationActuator : null,
        connected: options.connected !== undefined ? options.connected : true,
        timestamp: options.timestamp !== undefined ? options.timestamp : 0
    };
}

describe('Gamepad', function ()
{
    describe('constructor', function ()
    {
        it('should store the manager reference', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad();
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.manager).toBe(manager);

            gamepad.destroy();
        });

        it('should store the pad reference', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad();
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.pad).toBe(pad);

            gamepad.destroy();
        });

        it('should copy the id from the pad', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4, { id: 'Test Controller 1234' });
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.id).toBe('Test Controller 1234');

            gamepad.destroy();
        });

        it('should copy the index from the pad', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4, { index: 2 });
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.index).toBe(2);

            gamepad.destroy();
        });

        it('should create buttons array matching pad button count', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(16, 4);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.buttons.length).toBe(16);

            gamepad.destroy();
        });

        it('should create axes array matching pad axis count', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 6);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.axes.length).toBe(6);

            gamepad.destroy();
        });

        it('should create empty buttons array when pad has no buttons', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(0, 0);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.buttons.length).toBe(0);

            gamepad.destroy();
        });

        it('should create empty axes array when pad has no axes', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 0);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.axes.length).toBe(0);

            gamepad.destroy();
        });

        it('should store vibration actuator from pad', function ()
        {
            var manager = createMockManager();
            var actuator = { playEffect: function () {} };
            var pad = createMockPad(4, 4, { vibrationActuator: actuator });
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.vibration).toBe(actuator);

            gamepad.destroy();
        });

        it('should initialise leftStick as a Vector2 at origin', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad();
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.leftStick.x).toBe(0);
            expect(gamepad.leftStick.y).toBe(0);

            gamepad.destroy();
        });

        it('should initialise rightStick as a Vector2 at origin', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad();
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.rightStick.x).toBe(0);
            expect(gamepad.rightStick.y).toBe(0);

            gamepad.destroy();
        });

        it('should mark a button as pressed when its initial value is >= 0.5', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            pad.buttons[0].value = 0.8;
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.buttons[0].pressed).toBe(true);

            gamepad.destroy();
        });

        it('should not mark a button as pressed when its initial value is < 0.5', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            pad.buttons[0].value = 0.3;
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.buttons[0].pressed).toBe(false);

            gamepad.destroy();
        });
    });

    describe('getAxisTotal', function ()
    {
        it('should return the number of axes', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.getAxisTotal()).toBe(4);

            gamepad.destroy();
        });

        it('should return zero when there are no axes', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 0);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.getAxisTotal()).toBe(0);

            gamepad.destroy();
        });

        it('should return the correct count for a large axis set', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 8);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.getAxisTotal()).toBe(8);

            gamepad.destroy();
        });
    });

    describe('getAxisValue', function ()
    {
        it('should return zero for an axis at rest (below threshold)', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            // Default axis value is 0, which is below the default threshold of 0.1
            expect(gamepad.getAxisValue(0)).toBe(0);

            gamepad.destroy();
        });

        it('should return the axis value when above the threshold', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.axes[0].value = 0.8;

            expect(gamepad.getAxisValue(0)).toBeCloseTo(0.8);

            gamepad.destroy();
        });

        it('should return zero when axis value is exactly at the threshold boundary (below)', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.axes[0].value = 0.05;

            expect(gamepad.getAxisValue(0)).toBe(0);

            gamepad.destroy();
        });

        it('should return a negative value for a negative axis deflection above threshold', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.axes[0].value = -0.9;

            expect(gamepad.getAxisValue(0)).toBeCloseTo(-0.9);

            gamepad.destroy();
        });

        it('should respect different axis indices', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.axes[2].value = 0.5;

            expect(gamepad.getAxisValue(0)).toBe(0);
            expect(gamepad.getAxisValue(2)).toBeCloseTo(0.5);

            gamepad.destroy();
        });
    });

    describe('setAxisThreshold', function ()
    {
        it('should set the threshold on all axes', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.setAxisThreshold(0.25);

            for (var i = 0; i < gamepad.axes.length; i++)
            {
                expect(gamepad.axes[i].threshold).toBe(0.25);
            }

            gamepad.destroy();
        });

        it('should affect getAxisValue results after threshold change', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.axes[0].value = 0.15;

            // Default threshold is 0.1, so 0.15 should be returned
            expect(gamepad.getAxisValue(0)).toBeCloseTo(0.15);

            // After raising the threshold, 0.15 should now be zeroed out
            gamepad.setAxisThreshold(0.5);

            expect(gamepad.getAxisValue(0)).toBe(0);

            gamepad.destroy();
        });

        it('should set threshold to zero making all non-zero values register', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.setAxisThreshold(0);
            gamepad.axes[0].value = 0.01;

            expect(gamepad.getAxisValue(0)).toBeCloseTo(0.01);

            gamepad.destroy();
        });

        it('should not throw when there are no axes', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 0);
            var gamepad = new Gamepad(manager, pad);

            expect(function () { gamepad.setAxisThreshold(0.5); }).not.toThrow();

            gamepad.destroy();
        });
    });

    describe('getButtonTotal', function ()
    {
        it('should return the number of buttons', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(16, 4);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.getButtonTotal()).toBe(16);

            gamepad.destroy();
        });

        it('should return zero when there are no buttons', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(0, 0);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.getButtonTotal()).toBe(0);

            gamepad.destroy();
        });

        it('should return the correct count for varying button sets', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(8, 4);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.getButtonTotal()).toBe(8);

            gamepad.destroy();
        });
    });

    describe('getButtonValue', function ()
    {
        it('should return zero for an unpressed button', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.getButtonValue(0)).toBe(0);

            gamepad.destroy();
        });

        it('should return the value set on the button', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.buttons[0].value = 0.75;

            expect(gamepad.getButtonValue(0)).toBeCloseTo(0.75);

            gamepad.destroy();
        });

        it('should return 1 for a fully pressed button', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.buttons[1].value = 1;

            expect(gamepad.getButtonValue(1)).toBe(1);

            gamepad.destroy();
        });

        it('should respect button index and return the correct button value', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.buttons[2].value = 0.5;

            expect(gamepad.getButtonValue(0)).toBe(0);
            expect(gamepad.getButtonValue(2)).toBeCloseTo(0.5);

            gamepad.destroy();
        });
    });

    describe('isButtonDown', function ()
    {
        it('should return false for an unpressed button', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            expect(gamepad.isButtonDown(0)).toBe(false);

            gamepad.destroy();
        });

        it('should return true when a button is pressed', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.buttons[0].pressed = true;

            expect(gamepad.isButtonDown(0)).toBe(true);

            gamepad.destroy();
        });

        it('should return false after a button is released', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.buttons[0].pressed = true;
            gamepad.buttons[0].pressed = false;

            expect(gamepad.isButtonDown(0)).toBe(false);

            gamepad.destroy();
        });

        it('should check only the specified button index', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.buttons[1].pressed = true;

            expect(gamepad.isButtonDown(0)).toBe(false);
            expect(gamepad.isButtonDown(1)).toBe(true);
            expect(gamepad.isButtonDown(2)).toBe(false);

            gamepad.destroy();
        });
    });

    describe('destroy', function ()
    {
        it('should set manager to null', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad();
            var gamepad = new Gamepad(manager, pad);

            gamepad.destroy();

            expect(gamepad.manager).toBeNull();
        });

        it('should set pad to null', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad();
            var gamepad = new Gamepad(manager, pad);

            gamepad.destroy();

            expect(gamepad.pad).toBeNull();
        });

        it('should empty the buttons array', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(16, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.destroy();

            expect(gamepad.buttons.length).toBe(0);
        });

        it('should empty the axes array', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad(4, 4);
            var gamepad = new Gamepad(manager, pad);

            gamepad.destroy();

            expect(gamepad.axes.length).toBe(0);
        });

        it('should remove all event listeners', function ()
        {
            var manager = createMockManager();
            var pad = createMockPad();
            var gamepad = new Gamepad(manager, pad);
            var called = false;

            gamepad.on('testEvent', function () { called = true; });
            gamepad.destroy();
            gamepad.emit('testEvent');

            expect(called).toBe(false);
        });
    });
});
