var TimeStep = require('../../src/core/TimeStep');
var Clock = require('../../src/time/Clock');
var EventEmitter = require('eventemitter3');

function createLoop (config, callback)
{
    var loop = new TimeStep({}, config);

    vi.spyOn(loop.raf, 'start').mockImplementation(function () {});
    loop.start(callback);

    return loop;
}

describe('TimeStep', function ()
{
    beforeEach(function ()
    {
        vi.spyOn(window.performance, 'now').mockReturnValue(0);
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    describe('stepLimitFPS', function ()
    {
        it('should not deliver the limiter remainder twice', function ()
        {
            var loop = createLoop({ limit: 50, smoothStep: false });
            var updates = [];

            loop.callback = function (time, delta)
            {
                updates.push([time, delta]);
                expect(loop.delta).toBe(delta);
            };

            for (var time = 8; time <= 80; time += 8)
            {
                loop.stepLimitFPS(time);
            }

            expect(updates).toEqual([[24, 24], [40, 16], [64, 24], [80, 16]]);
            expect(loop.time).toBe(80);
        });

        it('should preserve elapsed time when the limit exceeds the browser frame rate', function ()
        {
            var loop = createLoop({ limit: 91, smoothStep: false });
            var deltas = [];

            loop.callback = function (time, delta)
            {
                deltas.push(delta);
            };

            for (var frame = 1; frame <= 75; frame++)
            {
                loop.stepLimitFPS(frame * 1000 / 75);
            }

            expect(deltas).toHaveLength(75);
            expect(deltas.reduce(function (sum, delta) { return sum + delta; }, 0)).toBeCloseTo(1000);
        });

        it('should accumulate skipped frames without changing an exact limiter cadence', function ()
        {
            var loop = createLoop({ limit: 50, smoothStep: false });
            var updates = [];

            loop.callback = function (time, delta)
            {
                updates.push([time, delta]);
            };

            for (var time = 5; time <= 40; time += 5)
            {
                loop.stepLimitFPS(time);
            }

            expect(updates).toEqual([[20, 20], [40, 20]]);
        });
        it('should preserve smoothing while keeping the limiter cadence', function ()
        {
            var updates = [];
            var loop = createLoop({ limit: 50, target: 125 }, function (time, delta)
            {
                updates.push([time, delta]);
            });

            for (var time = 8; time <= 80; time += 8)
            {
                loop.stepLimitFPS(time);
            }

            expect(updates).toEqual([[24, 24], [40, 16], [64, 24], [80, 16]]);
        });

        it('should deliver a long frame once and retain its limiter phase', function ()
        {
            var updates = [];
            var loop = createLoop({ limit: 50, smoothStep: false }, function (time, delta)
            {
                updates.push([time, delta]);
            });

            loop.stepLimitFPS(105);
            loop.stepLimitFPS(110);
            loop.stepLimitFPS(120);

            expect(updates).toEqual([[105, 105], [120, 15]]);
        });

        it('should discard pending time and limiter phase on reset', function ()
        {
            var updates = [];
            var loop = createLoop({ limit: 50, smoothStep: false }, function (time, delta)
            {
                updates.push([time, delta]);
            });

            loop.stepLimitFPS(24);
            loop.stepLimitFPS(32);
            window.performance.now.mockReturnValue(100);
            loop.resetDelta();
            loop.stepLimitFPS(108);
            loop.stepLimitFPS(116);
            loop.stepLimitFPS(124);

            expect(updates).toEqual([[24, 24], [124, 24]]);
        });

        it('should not replay an unlimited update when enabling the limit', function ()
        {
            var updates = [];
            var loop = createLoop({ smoothStep: false }, function (time, delta)
            {
                updates.push([time, delta]);
            });

            loop.step(8);
            loop.setFPSLimit(50);
            loop.stepLimitFPS(16);
            loop.stepLimitFPS(24);
            loop.stepLimitFPS(32);

            expect(updates).toEqual([[8, 8], [32, 24]]);
        });

        it('should retain undelivered time when changing a positive limit', function ()
        {
            var updates = [];
            var loop = createLoop({ limit: 50, smoothStep: false }, function (time, delta)
            {
                updates.push([time, delta]);
            });

            loop.stepLimitFPS(24);
            loop.stepLimitFPS(32);
            loop.setFPSLimit(25);
            loop.stepLimitFPS(48);
            loop.stepLimitFPS(64);

            expect(updates).toEqual([[24, 24], [64, 40]]);
        });

        it('should not advance Scene timers faster than elapsed time', function ()
        {
            var firedAt = null;
            var clock = new Clock({ sys: { events: new EventEmitter() } });
            var loop = createLoop({ limit: 91, target: 75 }, function (time, delta)
            {
                clock.preUpdate(time, delta);
                clock.update(time, delta);
            });

            clock.delayedCall(999, function ()
            {
                firedAt = loop.now;
            });

            for (var frame = 1; frame <= 75; frame++)
            {
                loop.stepLimitFPS(frame * 1000 / 75);
            }

            expect(firedAt).toBeCloseTo(1000);
            clock.destroy();
        });
    });
});
