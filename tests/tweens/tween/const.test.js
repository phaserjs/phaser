var TWEEN_CONST = require('../../../src/tweens/tween/const');

describe('const', function ()
{
    it('should be importable', function ()
    {
        expect(TWEEN_CONST).toBeDefined();
    });

    it('should have CREATED equal to 0', function ()
    {
        expect(TWEEN_CONST.CREATED).toBe(0);
    });

    it('should have DELAY equal to 2', function ()
    {
        expect(TWEEN_CONST.DELAY).toBe(2);
    });

    it('should have PENDING_RENDER equal to 4', function ()
    {
        expect(TWEEN_CONST.PENDING_RENDER).toBe(4);
    });

    it('should have PLAYING_FORWARD equal to 5', function ()
    {
        expect(TWEEN_CONST.PLAYING_FORWARD).toBe(5);
    });

    it('should have PLAYING_BACKWARD equal to 6', function ()
    {
        expect(TWEEN_CONST.PLAYING_BACKWARD).toBe(6);
    });

    it('should have HOLD_DELAY equal to 7', function ()
    {
        expect(TWEEN_CONST.HOLD_DELAY).toBe(7);
    });

    it('should have REPEAT_DELAY equal to 8', function ()
    {
        expect(TWEEN_CONST.REPEAT_DELAY).toBe(8);
    });

    it('should have COMPLETE equal to 9', function ()
    {
        expect(TWEEN_CONST.COMPLETE).toBe(9);
    });

    it('should have PENDING equal to 20', function ()
    {
        expect(TWEEN_CONST.PENDING).toBe(20);
    });

    it('should have ACTIVE equal to 21', function ()
    {
        expect(TWEEN_CONST.ACTIVE).toBe(21);
    });

    it('should have LOOP_DELAY equal to 22', function ()
    {
        expect(TWEEN_CONST.LOOP_DELAY).toBe(22);
    });

    it('should have COMPLETE_DELAY equal to 23', function ()
    {
        expect(TWEEN_CONST.COMPLETE_DELAY).toBe(23);
    });

    it('should have START_DELAY equal to 24', function ()
    {
        expect(TWEEN_CONST.START_DELAY).toBe(24);
    });

    it('should have PENDING_REMOVE equal to 25', function ()
    {
        expect(TWEEN_CONST.PENDING_REMOVE).toBe(25);
    });

    it('should have REMOVED equal to 26', function ()
    {
        expect(TWEEN_CONST.REMOVED).toBe(26);
    });

    it('should have FINISHED equal to 27', function ()
    {
        expect(TWEEN_CONST.FINISHED).toBe(27);
    });

    it('should have DESTROYED equal to 28', function ()
    {
        expect(TWEEN_CONST.DESTROYED).toBe(28);
    });

    it('should have MAX equal to 999999999999', function ()
    {
        expect(TWEEN_CONST.MAX).toBe(999999999999);
    });

    it('should have all values as numbers', function ()
    {
        expect(typeof TWEEN_CONST.CREATED).toBe('number');
        expect(typeof TWEEN_CONST.DELAY).toBe('number');
        expect(typeof TWEEN_CONST.PENDING_RENDER).toBe('number');
        expect(typeof TWEEN_CONST.PLAYING_FORWARD).toBe('number');
        expect(typeof TWEEN_CONST.PLAYING_BACKWARD).toBe('number');
        expect(typeof TWEEN_CONST.HOLD_DELAY).toBe('number');
        expect(typeof TWEEN_CONST.REPEAT_DELAY).toBe('number');
        expect(typeof TWEEN_CONST.COMPLETE).toBe('number');
        expect(typeof TWEEN_CONST.PENDING).toBe('number');
        expect(typeof TWEEN_CONST.ACTIVE).toBe('number');
        expect(typeof TWEEN_CONST.LOOP_DELAY).toBe('number');
        expect(typeof TWEEN_CONST.COMPLETE_DELAY).toBe('number');
        expect(typeof TWEEN_CONST.START_DELAY).toBe('number');
        expect(typeof TWEEN_CONST.PENDING_REMOVE).toBe('number');
        expect(typeof TWEEN_CONST.REMOVED).toBe('number');
        expect(typeof TWEEN_CONST.FINISHED).toBe('number');
        expect(typeof TWEEN_CONST.DESTROYED).toBe('number');
        expect(typeof TWEEN_CONST.MAX).toBe('number');
    });

    it('should have all TweenData state values unique', function ()
    {
        var tweenDataStates = [
            TWEEN_CONST.CREATED,
            TWEEN_CONST.DELAY,
            TWEEN_CONST.PENDING_RENDER,
            TWEEN_CONST.PLAYING_FORWARD,
            TWEEN_CONST.PLAYING_BACKWARD,
            TWEEN_CONST.HOLD_DELAY,
            TWEEN_CONST.REPEAT_DELAY,
            TWEEN_CONST.COMPLETE
        ];

        var unique = new Set(tweenDataStates);
        expect(unique.size).toBe(tweenDataStates.length);
    });

    it('should have all Tween state values unique', function ()
    {
        var tweenStates = [
            TWEEN_CONST.PENDING,
            TWEEN_CONST.ACTIVE,
            TWEEN_CONST.LOOP_DELAY,
            TWEEN_CONST.COMPLETE_DELAY,
            TWEEN_CONST.START_DELAY,
            TWEEN_CONST.PENDING_REMOVE,
            TWEEN_CONST.REMOVED,
            TWEEN_CONST.FINISHED,
            TWEEN_CONST.DESTROYED
        ];

        var unique = new Set(tweenStates);
        expect(unique.size).toBe(tweenStates.length);
    });

    it('should have all constant values unique across the entire module', function ()
    {
        var allValues = [
            TWEEN_CONST.CREATED,
            TWEEN_CONST.DELAY,
            TWEEN_CONST.PENDING_RENDER,
            TWEEN_CONST.PLAYING_FORWARD,
            TWEEN_CONST.PLAYING_BACKWARD,
            TWEEN_CONST.HOLD_DELAY,
            TWEEN_CONST.REPEAT_DELAY,
            TWEEN_CONST.COMPLETE,
            TWEEN_CONST.PENDING,
            TWEEN_CONST.ACTIVE,
            TWEEN_CONST.LOOP_DELAY,
            TWEEN_CONST.COMPLETE_DELAY,
            TWEEN_CONST.START_DELAY,
            TWEEN_CONST.PENDING_REMOVE,
            TWEEN_CONST.REMOVED,
            TWEEN_CONST.FINISHED,
            TWEEN_CONST.DESTROYED,
            TWEEN_CONST.MAX
        ];

        var unique = new Set(allValues);
        expect(unique.size).toBe(allValues.length);
    });

    it('should have Tween-specific states starting at 20 or above', function ()
    {
        expect(TWEEN_CONST.PENDING).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.ACTIVE).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.LOOP_DELAY).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.COMPLETE_DELAY).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.START_DELAY).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.PENDING_REMOVE).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.REMOVED).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.FINISHED).toBeGreaterThanOrEqual(20);
        expect(TWEEN_CONST.DESTROYED).toBeGreaterThanOrEqual(20);
    });

    it('should have MAX as a large integer value', function ()
    {
        expect(TWEEN_CONST.MAX).toBeGreaterThan(999999999998);
    });
});
