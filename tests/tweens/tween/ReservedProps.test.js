var ReservedProps = require('../../../src/tweens/tween/ReservedProps');

describe('ReservedProps', function ()
{
    it('should be an array', function ()
    {
        expect(Array.isArray(ReservedProps)).toBe(true);
    });

    it('should contain callbackScope', function ()
    {
        expect(ReservedProps).toContain('callbackScope');
    });

    it('should contain completeDelay', function ()
    {
        expect(ReservedProps).toContain('completeDelay');
    });

    it('should contain delay', function ()
    {
        expect(ReservedProps).toContain('delay');
    });

    it('should contain duration', function ()
    {
        expect(ReservedProps).toContain('duration');
    });

    it('should contain ease', function ()
    {
        expect(ReservedProps).toContain('ease');
    });

    it('should contain easeParams', function ()
    {
        expect(ReservedProps).toContain('easeParams');
    });

    it('should contain flipX', function ()
    {
        expect(ReservedProps).toContain('flipX');
    });

    it('should contain flipY', function ()
    {
        expect(ReservedProps).toContain('flipY');
    });

    it('should contain hold', function ()
    {
        expect(ReservedProps).toContain('hold');
    });

    it('should contain interpolation', function ()
    {
        expect(ReservedProps).toContain('interpolation');
    });

    it('should contain loop', function ()
    {
        expect(ReservedProps).toContain('loop');
    });

    it('should contain loopDelay', function ()
    {
        expect(ReservedProps).toContain('loopDelay');
    });

    it('should contain onActive', function ()
    {
        expect(ReservedProps).toContain('onActive');
    });

    it('should contain onActiveParams', function ()
    {
        expect(ReservedProps).toContain('onActiveParams');
    });

    it('should contain onComplete', function ()
    {
        expect(ReservedProps).toContain('onComplete');
    });

    it('should contain onCompleteParams', function ()
    {
        expect(ReservedProps).toContain('onCompleteParams');
    });

    it('should contain onLoop', function ()
    {
        expect(ReservedProps).toContain('onLoop');
    });

    it('should contain onLoopParams', function ()
    {
        expect(ReservedProps).toContain('onLoopParams');
    });

    it('should contain onPause', function ()
    {
        expect(ReservedProps).toContain('onPause');
    });

    it('should contain onPauseParams', function ()
    {
        expect(ReservedProps).toContain('onPauseParams');
    });

    it('should contain onRepeat', function ()
    {
        expect(ReservedProps).toContain('onRepeat');
    });

    it('should contain onRepeatParams', function ()
    {
        expect(ReservedProps).toContain('onRepeatParams');
    });

    it('should contain onResume', function ()
    {
        expect(ReservedProps).toContain('onResume');
    });

    it('should contain onResumeParams', function ()
    {
        expect(ReservedProps).toContain('onResumeParams');
    });

    it('should contain onStart', function ()
    {
        expect(ReservedProps).toContain('onStart');
    });

    it('should contain onStartParams', function ()
    {
        expect(ReservedProps).toContain('onStartParams');
    });

    it('should contain onStop', function ()
    {
        expect(ReservedProps).toContain('onStop');
    });

    it('should contain onStopParams', function ()
    {
        expect(ReservedProps).toContain('onStopParams');
    });

    it('should contain onUpdate', function ()
    {
        expect(ReservedProps).toContain('onUpdate');
    });

    it('should contain onUpdateParams', function ()
    {
        expect(ReservedProps).toContain('onUpdateParams');
    });

    it('should contain onYoyo', function ()
    {
        expect(ReservedProps).toContain('onYoyo');
    });

    it('should contain onYoyoParams', function ()
    {
        expect(ReservedProps).toContain('onYoyoParams');
    });

    it('should contain paused', function ()
    {
        expect(ReservedProps).toContain('paused');
    });

    it('should contain persist', function ()
    {
        expect(ReservedProps).toContain('persist');
    });

    it('should contain props', function ()
    {
        expect(ReservedProps).toContain('props');
    });

    it('should contain repeat', function ()
    {
        expect(ReservedProps).toContain('repeat');
    });

    it('should contain repeatDelay', function ()
    {
        expect(ReservedProps).toContain('repeatDelay');
    });

    it('should contain targets', function ()
    {
        expect(ReservedProps).toContain('targets');
    });

    it('should contain yoyo', function ()
    {
        expect(ReservedProps).toContain('yoyo');
    });

    it('should contain only string entries', function ()
    {
        ReservedProps.forEach(function (entry)
        {
            expect(typeof entry).toBe('string');
        });
    });

    it('should have 39 entries', function ()
    {
        expect(ReservedProps.length).toBe(39);
    });

    it('should not contain duplicate entries', function ()
    {
        var unique = ReservedProps.filter(function (value, index, self)
        {
            return self.indexOf(value) === index;
        });

        expect(unique.length).toBe(ReservedProps.length);
    });
});
