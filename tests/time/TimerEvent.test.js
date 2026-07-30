var TimerEvent = require('../../src/time/TimerEvent');

describe('TimerEvent', function ()
{
    describe('Constructor / reset', function ()
    {
        it('should create a TimerEvent with default values', function ()
        {
            var event = new TimerEvent({ delay: 1000 });

            expect(event.delay).toBe(1000);
            expect(event.repeat).toBe(0);
            expect(event.repeatCount).toBe(0);
            expect(event.loop).toBe(false);
            expect(event.timeScale).toBe(1);
            expect(event.startAt).toBe(0);
            expect(event.elapsed).toBe(0);
            expect(event.paused).toBe(false);
            expect(event.hasDispatched).toBe(false);
        });

        it('should set delay from config', function ()
        {
            var event = new TimerEvent({ delay: 500 });
            expect(event.delay).toBe(500);
        });

        it('should set repeat from config', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 3 });
            expect(event.repeat).toBe(3);
            expect(event.repeatCount).toBe(3);
        });

        it('should set loop from config', function ()
        {
            var event = new TimerEvent({ delay: 1000, loop: true });
            expect(event.loop).toBe(true);
            expect(event.repeatCount).toBe(999999999999);
        });

        it('should set repeatCount to large number when repeat is -1', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: -1 });
            expect(event.repeatCount).toBe(999999999999);
        });

        it('should set callback from config', function ()
        {
            var cb = function () {};
            var event = new TimerEvent({ delay: 1000, callback: cb });
            expect(event.callback).toBe(cb);
        });

        it('should set callbackScope from config', function ()
        {
            var scope = { name: 'test' };
            var event = new TimerEvent({ delay: 1000, callbackScope: scope });
            expect(event.callbackScope).toBe(scope);
        });

        it('should default callbackScope to the TimerEvent itself', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            expect(event.callbackScope).toBe(event);
        });

        it('should set args from config', function ()
        {
            var args = [1, 2, 3];
            var event = new TimerEvent({ delay: 1000, args: args });
            expect(event.args).toBe(args);
        });

        it('should default args to an empty array', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            expect(Array.isArray(event.args)).toBe(true);
            expect(event.args.length).toBe(0);
        });

        it('should set timeScale from config', function ()
        {
            var event = new TimerEvent({ delay: 1000, timeScale: 2 });
            expect(event.timeScale).toBe(2);
        });

        it('should set startAt from config and apply it to elapsed', function ()
        {
            var event = new TimerEvent({ delay: 1000, startAt: 250 });
            expect(event.startAt).toBe(250);
            expect(event.elapsed).toBe(250);
        });

        it('should set paused from config', function ()
        {
            var event = new TimerEvent({ delay: 1000, paused: true });
            expect(event.paused).toBe(true);
        });

        it('should reset hasDispatched to false on reset', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.hasDispatched = true;
            event.reset({ delay: 1000 });
            expect(event.hasDispatched).toBe(false);
        });

        it('should throw when delay is zero and repeat is positive', function ()
        {
            expect(function ()
            {
                new TimerEvent({ delay: 0, repeat: 1 });
            }).toThrow('TimerEvent infinite loop created via zero delay');
        });

        it('should throw when delay is zero and loop is true', function ()
        {
            expect(function ()
            {
                new TimerEvent({ delay: 0, loop: true });
            }).toThrow('TimerEvent infinite loop created via zero delay');
        });

        it('should not throw when delay is zero and repeat is zero', function ()
        {
            expect(function ()
            {
                new TimerEvent({ delay: 0 });
            }).not.toThrow();
        });

        it('should return itself from reset', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            var result = event.reset({ delay: 500 });
            expect(result).toBe(event);
        });
    });

    describe('getProgress', function ()
    {
        it('should return 0 when elapsed is 0', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            expect(event.getProgress()).toBe(0);
        });

        it('should return 0.5 when elapsed is half the delay', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 500;
            expect(event.getProgress()).toBeCloseTo(0.5);
        });

        it('should return 1 when elapsed equals delay', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 1000;
            expect(event.getProgress()).toBe(1);
        });

        it('should return correct progress for floating point elapsed', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 250;
            expect(event.getProgress()).toBeCloseTo(0.25);
        });
    });

    describe('getOverallProgress', function ()
    {
        it('should return same as getProgress when repeat is 0', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 500;
            expect(event.getOverallProgress()).toBeCloseTo(event.getProgress());
        });

        it('should return 0 at the start with repeats', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 2 });
            expect(event.getOverallProgress()).toBeCloseTo(0);
        });

        it('should account for completed repeats in progress', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 2 });
            // Total duration = 1000 + 1000*2 = 3000
            // After first fire: elapsed resets, repeatCount = 1 (2 - 1 = 1 done)
            event.elapsed = 500;
            event.repeatCount = 1;
            // totalElapsed = 500 + 1000*(2-1) = 1500
            // progress = 1500 / 3000 = 0.5
            expect(event.getOverallProgress()).toBeCloseTo(0.5);
        });

        it('should return 1 when all repeats are done and elapsed equals delay', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 2 });
            event.elapsed = 1000;
            event.repeatCount = 0;
            // totalElapsed = 1000 + 1000*(2-0) = 3000
            // totalDuration = 3000
            expect(event.getOverallProgress()).toBeCloseTo(1);
        });
    });

    describe('getRepeatCount', function ()
    {
        it('should return 0 for a non-repeating event', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            expect(event.getRepeatCount()).toBe(0);
        });

        it('should return the repeat count set in config', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 5 });
            expect(event.getRepeatCount()).toBe(5);
        });

        it('should return the current repeatCount value', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 5 });
            event.repeatCount = 3;
            expect(event.getRepeatCount()).toBe(3);
        });
    });

    describe('getElapsed', function ()
    {
        it('should return 0 at the start', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            expect(event.getElapsed()).toBe(0);
        });

        it('should return the current elapsed value', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 750;
            expect(event.getElapsed()).toBe(750);
        });

        it('should return startAt value when set', function ()
        {
            var event = new TimerEvent({ delay: 1000, startAt: 200 });
            expect(event.getElapsed()).toBe(200);
        });
    });

    describe('getElapsedSeconds', function ()
    {
        it('should return 0 at the start', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            expect(event.getElapsedSeconds()).toBe(0);
        });

        it('should return elapsed in seconds', function ()
        {
            var event = new TimerEvent({ delay: 2000 });
            event.elapsed = 1500;
            expect(event.getElapsedSeconds()).toBeCloseTo(1.5);
        });

        it('should return 0.001 for 1ms elapsed', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 1;
            expect(event.getElapsedSeconds()).toBeCloseTo(0.001);
        });
    });

    describe('getRemaining', function ()
    {
        it('should return full delay when elapsed is 0', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            expect(event.getRemaining()).toBe(1000);
        });

        it('should return zero when elapsed equals delay', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 1000;
            expect(event.getRemaining()).toBe(0);
        });

        it('should return remaining time correctly', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 400;
            expect(event.getRemaining()).toBe(600);
        });
    });

    describe('getRemainingSeconds', function ()
    {
        it('should return full delay in seconds when elapsed is 0', function ()
        {
            var event = new TimerEvent({ delay: 2000 });
            expect(event.getRemainingSeconds()).toBeCloseTo(2);
        });

        it('should return remaining time in seconds', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 600;
            expect(event.getRemainingSeconds()).toBeCloseTo(0.4);
        });

        it('should return 0 when elapsed equals delay', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 1000;
            expect(event.getRemainingSeconds()).toBeCloseTo(0);
        });
    });

    describe('getOverallRemaining', function ()
    {
        it('should return the full delay for a non-repeating event at start', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            // delay * (1 + 0) - 0 = 1000
            expect(event.getOverallRemaining()).toBe(1000);
        });

        it('should return total remaining time including all repeats', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 2 });
            // delay * (1 + repeatCount) - elapsed = 1000 * (1+2) - 0 = 3000
            expect(event.getOverallRemaining()).toBe(3000);
        });

        it('should decrease as elapsed increases', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 2 });
            event.elapsed = 500;
            // 1000 * 3 - 500 = 2500
            expect(event.getOverallRemaining()).toBe(2500);
        });

        it('should account for consumed repeats', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 2 });
            event.repeatCount = 1;
            event.elapsed = 0;
            // 1000 * (1+1) - 0 = 2000
            expect(event.getOverallRemaining()).toBe(2000);
        });
    });

    describe('getOverallRemainingSeconds', function ()
    {
        it('should return overall remaining in seconds', function ()
        {
            var event = new TimerEvent({ delay: 2000, repeat: 1 });
            // delay * (1 + 1) - 0 = 4000ms = 4s
            expect(event.getOverallRemainingSeconds()).toBeCloseTo(4);
        });

        it('should return 0 when nothing remains', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.elapsed = 1000;
            event.repeatCount = 0;
            expect(event.getOverallRemainingSeconds()).toBeCloseTo(0);
        });
    });

    describe('remove', function ()
    {
        it('should set elapsed to delay', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.remove();
            expect(event.elapsed).toBe(1000);
        });

        it('should set repeatCount to 0', function ()
        {
            var event = new TimerEvent({ delay: 1000, repeat: 5 });
            event.remove();
            expect(event.repeatCount).toBe(0);
        });

        it('should set hasDispatched to true when dispatchCallback is false (default)', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.remove();
            expect(event.hasDispatched).toBe(true);
        });

        it('should set hasDispatched to false when dispatchCallback is true', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.remove(true);
            expect(event.hasDispatched).toBe(false);
        });

        it('should set hasDispatched to true when dispatchCallback is false (explicit)', function ()
        {
            var event = new TimerEvent({ delay: 1000 });
            event.remove(false);
            expect(event.hasDispatched).toBe(true);
        });
    });

    describe('destroy', function ()
    {
        it('should set callback to undefined', function ()
        {
            var event = new TimerEvent({ delay: 1000, callback: function () {} });
            event.destroy();
            expect(event.callback).toBeUndefined();
        });

        it('should set callbackScope to undefined', function ()
        {
            var scope = {};
            var event = new TimerEvent({ delay: 1000, callbackScope: scope });
            event.destroy();
            expect(event.callbackScope).toBeUndefined();
        });

        it('should set args to an empty array', function ()
        {
            var event = new TimerEvent({ delay: 1000, args: [1, 2, 3] });
            event.destroy();
            expect(Array.isArray(event.args)).toBe(true);
            expect(event.args.length).toBe(0);
        });
    });
});
