var CONST = require('../../src/scene/const');

describe('const', function ()
{
    it('should export an object', function ()
    {
        expect(typeof CONST).toBe('object');
    });

    it('should define PENDING as 0', function ()
    {
        expect(CONST.PENDING).toBe(0);
    });

    it('should define INIT as 1', function ()
    {
        expect(CONST.INIT).toBe(1);
    });

    it('should define START as 2', function ()
    {
        expect(CONST.START).toBe(2);
    });

    it('should define LOADING as 3', function ()
    {
        expect(CONST.LOADING).toBe(3);
    });

    it('should define CREATING as 4', function ()
    {
        expect(CONST.CREATING).toBe(4);
    });

    it('should define RUNNING as 5', function ()
    {
        expect(CONST.RUNNING).toBe(5);
    });

    it('should define PAUSED as 6', function ()
    {
        expect(CONST.PAUSED).toBe(6);
    });

    it('should define SLEEPING as 7', function ()
    {
        expect(CONST.SLEEPING).toBe(7);
    });

    it('should define SHUTDOWN as 8', function ()
    {
        expect(CONST.SHUTDOWN).toBe(8);
    });

    it('should define DESTROYED as 9', function ()
    {
        expect(CONST.DESTROYED).toBe(9);
    });

    it('should have all constants as numbers', function ()
    {
        expect(typeof CONST.PENDING).toBe('number');
        expect(typeof CONST.INIT).toBe('number');
        expect(typeof CONST.START).toBe('number');
        expect(typeof CONST.LOADING).toBe('number');
        expect(typeof CONST.CREATING).toBe('number');
        expect(typeof CONST.RUNNING).toBe('number');
        expect(typeof CONST.PAUSED).toBe('number');
        expect(typeof CONST.SLEEPING).toBe('number');
        expect(typeof CONST.SHUTDOWN).toBe('number');
        expect(typeof CONST.DESTROYED).toBe('number');
    });

    it('should have unique values for all constants', function ()
    {
        var values = [
            CONST.PENDING,
            CONST.INIT,
            CONST.START,
            CONST.LOADING,
            CONST.CREATING,
            CONST.RUNNING,
            CONST.PAUSED,
            CONST.SLEEPING,
            CONST.SHUTDOWN,
            CONST.DESTROYED
        ];
        var unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('should have constants in ascending order from PENDING to DESTROYED', function ()
    {
        expect(CONST.PENDING).toBeLessThan(CONST.INIT);
        expect(CONST.INIT).toBeLessThan(CONST.START);
        expect(CONST.START).toBeLessThan(CONST.LOADING);
        expect(CONST.LOADING).toBeLessThan(CONST.CREATING);
        expect(CONST.CREATING).toBeLessThan(CONST.RUNNING);
        expect(CONST.RUNNING).toBeLessThan(CONST.PAUSED);
        expect(CONST.PAUSED).toBeLessThan(CONST.SLEEPING);
        expect(CONST.SLEEPING).toBeLessThan(CONST.SHUTDOWN);
        expect(CONST.SHUTDOWN).toBeLessThan(CONST.DESTROYED);
    });

    it('should have exactly 10 constants', function ()
    {
        expect(Object.keys(CONST).length).toBe(10);
    });
});
