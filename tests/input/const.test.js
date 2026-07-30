var INPUT_CONST = require('../../src/input/const');

describe('Phaser.Input.const', function ()
{
    it('should be importable', function ()
    {
        expect(INPUT_CONST).toBeDefined();
    });

    it('should define MOUSE_DOWN as 0', function ()
    {
        expect(INPUT_CONST.MOUSE_DOWN).toBe(0);
    });

    it('should define MOUSE_MOVE as 1', function ()
    {
        expect(INPUT_CONST.MOUSE_MOVE).toBe(1);
    });

    it('should define MOUSE_UP as 2', function ()
    {
        expect(INPUT_CONST.MOUSE_UP).toBe(2);
    });

    it('should define TOUCH_START as 3', function ()
    {
        expect(INPUT_CONST.TOUCH_START).toBe(3);
    });

    it('should define TOUCH_MOVE as 4', function ()
    {
        expect(INPUT_CONST.TOUCH_MOVE).toBe(4);
    });

    it('should define TOUCH_END as 5', function ()
    {
        expect(INPUT_CONST.TOUCH_END).toBe(5);
    });

    it('should define POINTER_LOCK_CHANGE as 6', function ()
    {
        expect(INPUT_CONST.POINTER_LOCK_CHANGE).toBe(6);
    });

    it('should define TOUCH_CANCEL as 7', function ()
    {
        expect(INPUT_CONST.TOUCH_CANCEL).toBe(7);
    });

    it('should define MOUSE_WHEEL as 8', function ()
    {
        expect(INPUT_CONST.MOUSE_WHEEL).toBe(8);
    });

    it('should have all constants as numbers', function ()
    {
        expect(typeof INPUT_CONST.MOUSE_DOWN).toBe('number');
        expect(typeof INPUT_CONST.MOUSE_MOVE).toBe('number');
        expect(typeof INPUT_CONST.MOUSE_UP).toBe('number');
        expect(typeof INPUT_CONST.TOUCH_START).toBe('number');
        expect(typeof INPUT_CONST.TOUCH_MOVE).toBe('number');
        expect(typeof INPUT_CONST.TOUCH_END).toBe('number');
        expect(typeof INPUT_CONST.POINTER_LOCK_CHANGE).toBe('number');
        expect(typeof INPUT_CONST.TOUCH_CANCEL).toBe('number');
        expect(typeof INPUT_CONST.MOUSE_WHEEL).toBe('number');
    });

    it('should have unique values for all constants', function ()
    {
        var values = [
            INPUT_CONST.MOUSE_DOWN,
            INPUT_CONST.MOUSE_MOVE,
            INPUT_CONST.MOUSE_UP,
            INPUT_CONST.TOUCH_START,
            INPUT_CONST.TOUCH_MOVE,
            INPUT_CONST.TOUCH_END,
            INPUT_CONST.POINTER_LOCK_CHANGE,
            INPUT_CONST.TOUCH_CANCEL,
            INPUT_CONST.MOUSE_WHEEL
        ];

        var unique = values.filter(function (value, index, self)
        {
            return self.indexOf(value) === index;
        });

        expect(unique.length).toBe(values.length);
    });

    it('should export exactly 9 constants', function ()
    {
        expect(Object.keys(INPUT_CONST).length).toBe(9);
    });
});
