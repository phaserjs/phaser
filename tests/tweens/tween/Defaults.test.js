var TWEEN_DEFAULTS = require('../../../src/tweens/tween/Defaults');

describe('Defaults', function ()
{
    it('should be importable', function ()
    {
        expect(TWEEN_DEFAULTS).toBeDefined();
    });

    it('should be a plain object', function ()
    {
        expect(typeof TWEEN_DEFAULTS).toBe('object');
        expect(TWEEN_DEFAULTS).not.toBeNull();
    });

    it('should have targets set to null', function ()
    {
        expect(TWEEN_DEFAULTS.targets).toBeNull();
    });

    it('should have delay set to 0', function ()
    {
        expect(TWEEN_DEFAULTS.delay).toBe(0);
    });

    it('should have duration set to 1000', function ()
    {
        expect(TWEEN_DEFAULTS.duration).toBe(1000);
    });

    it('should have ease set to Power0', function ()
    {
        expect(TWEEN_DEFAULTS.ease).toBe('Power0');
    });

    it('should have easeParams set to null', function ()
    {
        expect(TWEEN_DEFAULTS.easeParams).toBeNull();
    });

    it('should have hold set to 0', function ()
    {
        expect(TWEEN_DEFAULTS.hold).toBe(0);
    });

    it('should have repeat set to 0', function ()
    {
        expect(TWEEN_DEFAULTS.repeat).toBe(0);
    });

    it('should have repeatDelay set to 0', function ()
    {
        expect(TWEEN_DEFAULTS.repeatDelay).toBe(0);
    });

    it('should have yoyo set to false', function ()
    {
        expect(TWEEN_DEFAULTS.yoyo).toBe(false);
    });

    it('should have flipX set to false', function ()
    {
        expect(TWEEN_DEFAULTS.flipX).toBe(false);
    });

    it('should have flipY set to false', function ()
    {
        expect(TWEEN_DEFAULTS.flipY).toBe(false);
    });

    it('should have persist set to false', function ()
    {
        expect(TWEEN_DEFAULTS.persist).toBe(false);
    });

    it('should have interpolation set to null', function ()
    {
        expect(TWEEN_DEFAULTS.interpolation).toBeNull();
    });

    it('should have exactly the expected keys', function ()
    {
        var keys = Object.keys(TWEEN_DEFAULTS).sort();
        var expected = [
            'delay',
            'duration',
            'ease',
            'easeParams',
            'flipX',
            'flipY',
            'hold',
            'interpolation',
            'persist',
            'repeat',
            'repeatDelay',
            'targets',
            'yoyo'
        ];

        expect(keys).toEqual(expected);
    });
});
