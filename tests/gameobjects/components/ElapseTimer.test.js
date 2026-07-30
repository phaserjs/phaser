var ElapseTimer = require('../../../src/gameobjects/components/ElapseTimer');

describe('ElapseTimer', function ()
{
    var obj;

    beforeEach(function ()
    {
        obj = Object.assign({}, ElapseTimer);
    });

    describe('default values', function ()
    {
        it('should have timeElapsed of 0', function ()
        {
            expect(obj.timeElapsed).toBe(0);
        });

        it('should have timeElapsedResetPeriod of 3600000 (1 hour)', function ()
        {
            expect(obj.timeElapsedResetPeriod).toBe(3600000);
        });

        it('should have timePaused of false', function ()
        {
            expect(obj.timePaused).toBe(false);
        });
    });

    describe('setTimerResetPeriod', function ()
    {
        it('should set timeElapsedResetPeriod to the given value', function ()
        {
            obj.setTimerResetPeriod(5000);

            expect(obj.timeElapsedResetPeriod).toBe(5000);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.setTimerResetPeriod(1000);

            expect(result).toBe(obj);
        });

        it('should accept zero', function ()
        {
            obj.setTimerResetPeriod(0);

            expect(obj.timeElapsedResetPeriod).toBe(0);
        });

        it('should accept large values', function ()
        {
            obj.setTimerResetPeriod(999999999);

            expect(obj.timeElapsedResetPeriod).toBe(999999999);
        });

        it('should accept floating point values', function ()
        {
            obj.setTimerResetPeriod(1234.567);

            expect(obj.timeElapsedResetPeriod).toBeCloseTo(1234.567);
        });
    });

    describe('setTimerPaused', function ()
    {
        it('should set timePaused to true when passed true', function ()
        {
            obj.setTimerPaused(true);

            expect(obj.timePaused).toBe(true);
        });

        it('should set timePaused to false when passed false', function ()
        {
            obj.timePaused = true;
            obj.setTimerPaused(false);

            expect(obj.timePaused).toBe(false);
        });

        it('should set timePaused to false when called with no argument', function ()
        {
            obj.timePaused = true;
            obj.setTimerPaused();

            expect(obj.timePaused).toBe(false);
        });

        it('should coerce truthy values to true', function ()
        {
            obj.setTimerPaused(1);

            expect(obj.timePaused).toBe(true);
        });

        it('should coerce falsy values to false', function ()
        {
            obj.timePaused = true;
            obj.setTimerPaused(0);

            expect(obj.timePaused).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.setTimerPaused(true);

            expect(result).toBe(obj);
        });
    });

    describe('resetTimer', function ()
    {
        it('should reset timeElapsed to 0 when called with no argument', function ()
        {
            obj.timeElapsed = 5000;
            obj.resetTimer();

            expect(obj.timeElapsed).toBe(0);
        });

        it('should set timeElapsed to the given ms value', function ()
        {
            obj.resetTimer(2500);

            expect(obj.timeElapsed).toBe(2500);
        });

        it('should accept zero explicitly', function ()
        {
            obj.timeElapsed = 9999;
            obj.resetTimer(0);

            expect(obj.timeElapsed).toBe(0);
        });

        it('should accept floating point values', function ()
        {
            obj.resetTimer(123.456);

            expect(obj.timeElapsed).toBeCloseTo(123.456);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.resetTimer();

            expect(result).toBe(obj);
        });
    });

    describe('updateTimer', function ()
    {
        it('should increment timeElapsed by delta when not paused', function ()
        {
            obj.timeElapsed = 0;
            obj.updateTimer(1000, 16);

            expect(obj.timeElapsed).toBe(16);
        });

        it('should not increment timeElapsed when paused', function ()
        {
            obj.timeElapsed = 100;
            obj.timePaused = true;
            obj.updateTimer(1000, 16);

            expect(obj.timeElapsed).toBe(100);
        });

        it('should wrap timeElapsed when it reaches the reset period', function ()
        {
            obj.timeElapsedResetPeriod = 1000;
            obj.timeElapsed = 990;
            obj.updateTimer(0, 20);

            expect(obj.timeElapsed).toBe(10);
        });

        it('should wrap exactly when timeElapsed equals the reset period', function ()
        {
            obj.timeElapsedResetPeriod = 1000;
            obj.timeElapsed = 980;
            obj.updateTimer(0, 20);

            expect(obj.timeElapsed).toBe(0);
        });

        it('should not wrap timeElapsed when just below the reset period', function ()
        {
            obj.timeElapsedResetPeriod = 1000;
            obj.timeElapsed = 980;
            obj.updateTimer(0, 19);

            expect(obj.timeElapsed).toBe(999);
        });

        it('should accumulate delta over multiple calls', function ()
        {
            obj.timeElapsed = 0;
            obj.updateTimer(0, 10);
            obj.updateTimer(10, 10);
            obj.updateTimer(20, 10);

            expect(obj.timeElapsed).toBe(30);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.updateTimer(0, 16);

            expect(result).toBe(obj);
        });

        it('should ignore the time parameter (only delta matters)', function ()
        {
            obj.timeElapsed = 0;
            obj.updateTimer(99999, 50);

            expect(obj.timeElapsed).toBe(50);
        });

        it('should handle floating point delta values', function ()
        {
            obj.timeElapsed = 0;
            obj.updateTimer(0, 16.667);

            expect(obj.timeElapsed).toBeCloseTo(16.667);
        });

        it('should wrap using the default reset period of 3600000', function ()
        {
            obj.timeElapsed = 3599990;
            obj.updateTimer(0, 20);

            expect(obj.timeElapsed).toBe(10);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining multiple methods', function ()
        {
            var result = obj
                .setTimerResetPeriod(5000)
                .setTimerPaused(true)
                .resetTimer(100)
                .setTimerPaused(false)
                .updateTimer(0, 50);

            expect(result).toBe(obj);
            expect(obj.timeElapsedResetPeriod).toBe(5000);
            expect(obj.timePaused).toBe(false);
            expect(obj.timeElapsed).toBe(150);
        });
    });
});
