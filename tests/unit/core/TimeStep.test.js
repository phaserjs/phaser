/**
 * @author       Test Contributor
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const TimeStep = require("../../../src/core/TimeStep");

describe("Phaser.Core.TimeStep", function () {
    describe("constructor", function () {
        it("should create a TimeStep with default values", function () {
            const game = {};
            const config = {};
            const timeStep = new TimeStep(game, config);

            expect(timeStep.game).toBe(game);
            expect(timeStep.started).toBe(false);
            expect(timeStep.running).toBe(false);
            expect(timeStep.minFps).toBe(5);
            expect(timeStep.targetFps).toBe(60);
            expect(timeStep.fpsLimit).toBe(0);
            expect(timeStep.hasFpsLimit).toBe(false);
        });

        it("should create a TimeStep with custom fps values", function () {
            const game = {};
            const config = {
                min: 10,
                target: 30,
                limit: 20,
            };
            const timeStep = new TimeStep(game, config);

            expect(timeStep.minFps).toBe(10);
            expect(timeStep.targetFps).toBe(30);
            expect(timeStep.fpsLimit).toBe(20);
            expect(timeStep.hasFpsLimit).toBe(true);
            expect(timeStep._limitRate).toBeCloseTo(50); // 1000 / 20
            expect(timeStep._min).toBeCloseTo(100); // 1000 / 10
            expect(timeStep._target).toBeCloseTo(33.33, 1); // 1000 / 30
        });
    });

    describe("step", function () {
        it("should update time values when stepping", function () {
            const game = {
                loop: {
                    tick: jest.fn(),
                },
            };
            const config = {};
            const timeStep = new TimeStep(game, config);

            // Mock the time values
            timeStep.startTime = 1000;
            timeStep.lastTime = 1000;

            // Call step with a time of 1016.66ms (16.66ms later, which is 60fps)
            timeStep.step(1016.66);

            expect(timeStep.lastTime).toBeCloseTo(1016.66);
            expect(timeStep.rawDelta).toBeCloseTo(16.66, 1);
            expect(game.loop.tick).toHaveBeenCalled();
        });
    });

    describe("smoothStep", function () {
        it("should smooth delta values", function () {
            const game = {
                loop: {
                    tick: jest.fn(),
                },
            };
            const config = {};
            const timeStep = new TimeStep(game, config);

            // Mock the time values
            timeStep.startTime = 1000;
            timeStep.lastTime = 1000;

            // Call smoothStep with a time of 1016.66ms (16.66ms later, which is 60fps)
            timeStep.smoothStep(1016.66);

            expect(timeStep.lastTime).toBeCloseTo(1016.66);
            expect(timeStep.rawDelta).toBeCloseTo(16.66, 1);
            expect(game.loop.tick).toHaveBeenCalled();
        });
    });

    describe("resetDelta", function () {
        it("should reset delta values", function () {
            const game = {};
            const config = {};
            const timeStep = new TimeStep(game, config);

            // Set some values
            timeStep.startTime = 1000;
            timeStep.lastTime = 1100;
            timeStep.rawDelta = 100;
            timeStep.delta = 100;

            // Reset
            timeStep.resetDelta();

            // The current time should be used for both startTime and lastTime
            expect(timeStep.startTime).toBe(timeStep.lastTime);
            expect(timeStep.rawDelta).toBe(0);
            expect(timeStep.delta).toBe(0);
        });
    });

    describe("start and stop", function () {
        it("should set flags correctly when starting and stopping", function () {
            const game = {};
            const config = {};
            const timeStep = new TimeStep(game, config);

            // Mock the RAF methods
            timeStep.raf.start = jest.fn();
            timeStep.raf.stop = jest.fn();

            // Start with a dummy function to avoid the recursive call
            const dummyStep = function () {};
            timeStep.start(dummyStep);

            expect(timeStep.started).toBe(true);
            expect(timeStep.running).toBe(true);
            expect(timeStep.raf.start).toHaveBeenCalled();

            // Stop
            timeStep.stop();

            expect(timeStep.started).toBe(false);
            expect(timeStep.running).toBe(false);
            expect(timeStep.raf.stop).toHaveBeenCalled();
        });
    });

    describe("sleep and wake", function () {
        it("should set flags correctly when sleeping and waking", function () {
            const game = {};
            const config = {};
            const timeStep = new TimeStep(game, config);

            // Mock the RAF methods
            timeStep.raf.start = jest.fn();
            timeStep.raf.stop = jest.fn();
            timeStep.raf.tick = jest.fn();

            // Start first
            timeStep.start(timeStep.step);

            // Sleep
            timeStep.sleep();

            expect(timeStep.running).toBe(false);
            expect(timeStep.started).toBe(true); // Still true because we're just sleeping
            expect(timeStep.raf.stop).toHaveBeenCalled();

            // Wake
            timeStep.wake();

            expect(timeStep.running).toBe(true);
            expect(timeStep.started).toBe(true);
            expect(timeStep.raf.start).toHaveBeenCalled();
        });
    });
});
