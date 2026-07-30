var GetOverlapY = require('../../../src/physics/arcade/GetOverlapY');
var CONST = require('../../../src/physics/arcade/const');

describe('Phaser.Physics.Arcade.GetOverlapY', function ()
{
    function makeBody (options)
    {
        var opts = options || {};
        var dy = opts._dy !== undefined ? opts._dy : 0;

        return {
            _dy: dy,
            y: opts.y !== undefined ? opts.y : 0,
            bottom: opts.bottom !== undefined ? opts.bottom : 0,
            overlapY: 0,
            embedded: false,
            physicsType: opts.physicsType !== undefined ? opts.physicsType : CONST.DYNAMIC_BODY,
            // Allow explicit deltaAbsY override; otherwise derive from _dy
            deltaAbsY: (function (d)
            {
                return function () { return d; };
            })(opts.deltaAbsY !== undefined ? opts.deltaAbsY : Math.abs(dy)),
            checkCollision: {
                up: opts.checkCollision && opts.checkCollision.up !== undefined ? opts.checkCollision.up : true,
                down: opts.checkCollision && opts.checkCollision.down !== undefined ? opts.checkCollision.down : true
            },
            touching: { none: true, up: false, down: false },
            blocked: { none: true, up: false, down: false }
        };
    }

    // --- Both bodies stationary ---

    describe('when both bodies have _dy === 0', function ()
    {
        it('should set embedded true on both bodies', function ()
        {
            var body1 = makeBody({ _dy: 0 });
            var body2 = makeBody({ _dy: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.embedded).toBe(true);
            expect(body2.embedded).toBe(true);
        });

        it('should return zero overlap when both bodies are stationary', function ()
        {
            var body1 = makeBody({ _dy: 0 });
            var body2 = makeBody({ _dy: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should set overlapY to zero on both bodies when stationary', function ()
        {
            var body1 = makeBody({ _dy: 0 });
            var body2 = makeBody({ _dy: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.overlapY).toBe(0);
            expect(body2.overlapY).toBe(0);
        });

        it('should not modify touching or blocked flags when both stationary', function ()
        {
            var body1 = makeBody({ _dy: 0 });
            var body2 = makeBody({ _dy: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.touching.none).toBe(true);
            expect(body2.touching.none).toBe(true);
            expect(body1.blocked.none).toBe(true);
            expect(body2.blocked.none).toBe(true);
        });
    });

    // --- body1 moving down (body1._dy > body2._dy) ---

    describe('when body1._dy > body2._dy (body1 moving down)', function ()
    {
        it('should return correct overlap when body1 bottom overlaps body2 top', function ()
        {
            // overlap=10, maxOverlap = 20+0+0 = 20, 10 < 20 → valid
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(10);
        });

        it('should set overlapY on both bodies to the computed overlap', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.overlapY).toBe(10);
            expect(body2.overlapY).toBe(10);
        });

        it('should set touching.down on body1 and touching.up on body2', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.touching.down).toBe(true);
            expect(body1.touching.none).toBe(false);
            expect(body2.touching.up).toBe(true);
            expect(body2.touching.none).toBe(false);
        });

        it('should not set touching.up on body1 or touching.down on body2', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.touching.up).toBe(false);
            expect(body2.touching.down).toBe(false);
        });

        it('should return zero when overlap exceeds maxOverlap and overlapOnly is false', function ()
        {
            // overlap=50, maxOverlap = 5+0+0 = 5 → 50 > 5 → 0
            var body1 = makeBody({ _dy: 5, bottom: 150, deltaAbsY: 5 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should not zero out overlap when overlap exceeds maxOverlap but overlapOnly is true', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 150, deltaAbsY: 5 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            var result = GetOverlapY(body1, body2, true, 0);

            expect(result).toBe(50);
        });

        it('should return zero when body1 checkCollision.down is false', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, checkCollision: { down: false, up: true } });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should return zero when body2 checkCollision.up is false', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0, checkCollision: { up: false, down: true } });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should not set touching flags when collision check is disabled', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, checkCollision: { down: false, up: true } });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.touching.down).toBe(false);
            expect(body1.touching.none).toBe(true);
            expect(body2.touching.up).toBe(false);
            expect(body2.touching.none).toBe(true);
        });

        it('should set body1.blocked.down when body2 is a static body and overlapOnly is false', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0, physicsType: CONST.STATIC_BODY });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.blocked.down).toBe(true);
            expect(body1.blocked.none).toBe(false);
        });

        it('should not set body1.blocked.down when body2 is static but overlapOnly is true', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0, physicsType: CONST.STATIC_BODY });

            GetOverlapY(body1, body2, true, 0);

            expect(body1.blocked.down).toBe(false);
            expect(body1.blocked.none).toBe(true);
        });

        it('should set body2.blocked.up when body1 is a static body and overlapOnly is false', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, physicsType: CONST.STATIC_BODY });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body2.blocked.up).toBe(true);
            expect(body2.blocked.none).toBe(false);
        });

        it('should not set body2.blocked.up when body1 is static but overlapOnly is true', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, physicsType: CONST.STATIC_BODY });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, true, 0);

            expect(body2.blocked.up).toBe(false);
            expect(body2.blocked.none).toBe(true);
        });

        it('should not set blocked flags when neither body is static', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.blocked.down).toBe(false);
            expect(body2.blocked.up).toBe(false);
        });

        it('should account for bias in maxOverlap calculation', function ()
        {
            // overlap=10, deltaAbsY1=2, deltaAbsY2=2, bias=20 → maxOverlap=24 → 10 < 24 → valid
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 2 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 2 });

            var result = GetOverlapY(body1, body2, false, 20);

            expect(result).toBe(10);
        });

        it('should still zero the overlap when bias is not large enough', function ()
        {
            // overlap=10, maxOverlap=2+2+3=7 → 10 > 7 → 0
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 2 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 2 });

            var result = GetOverlapY(body1, body2, false, 3);

            expect(result).toBe(0);
        });
    });

    // --- body1 moving up (body1._dy < body2._dy) ---

    describe('when body1._dy < body2._dy (body1 moving up)', function ()
    {
        it('should return correct (negative) overlap when body1 top overlaps body2 bottom', function ()
        {
            // overlap = body1.y - body2.bottom = 100 - 110 = -10, -overlap=10, maxOverlap=0+20=20 → valid
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(-10);
        });

        it('should set overlapY on both bodies to the negative overlap value', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.overlapY).toBe(-10);
            expect(body2.overlapY).toBe(-10);
        });

        it('should set touching.up on body1 and touching.down on body2', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.touching.up).toBe(true);
            expect(body1.touching.none).toBe(false);
            expect(body2.touching.down).toBe(true);
            expect(body2.touching.none).toBe(false);
        });

        it('should not set touching.down on body1 or touching.up on body2', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.touching.down).toBe(false);
            expect(body2.touching.up).toBe(false);
        });

        it('should return zero when -overlap exceeds maxOverlap and overlapOnly is false', function ()
        {
            // overlap = 100 - 150 = -50, -overlap=50, maxOverlap=0+5=5 → 50 > 5 → 0
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 150, deltaAbsY: 5 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should not zero out overlap when -overlap exceeds maxOverlap but overlapOnly is true', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 150, deltaAbsY: 5 });

            var result = GetOverlapY(body1, body2, true, 0);

            expect(result).toBe(-50);
        });

        it('should return zero when body1 checkCollision.up is false', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0, checkCollision: { up: false, down: true } });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should return zero when body2 checkCollision.down is false', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, checkCollision: { down: false, up: true } });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should set body1.blocked.up when body2 is a static body and overlapOnly is false', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, physicsType: CONST.STATIC_BODY });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.blocked.up).toBe(true);
            expect(body1.blocked.none).toBe(false);
        });

        it('should not set body1.blocked.up when body2 is static but overlapOnly is true', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, physicsType: CONST.STATIC_BODY });

            GetOverlapY(body1, body2, true, 0);

            expect(body1.blocked.up).toBe(false);
        });

        it('should set body2.blocked.down when body1 is a static body and overlapOnly is false', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0, physicsType: CONST.STATIC_BODY });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            GetOverlapY(body1, body2, false, 0);

            expect(body2.blocked.down).toBe(true);
            expect(body2.blocked.none).toBe(false);
        });

        it('should not set body2.blocked.down when body1 is static but overlapOnly is true', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0, physicsType: CONST.STATIC_BODY });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            GetOverlapY(body1, body2, true, 0);

            expect(body2.blocked.down).toBe(false);
        });
    });

    // --- overlapY always set ---

    describe('overlapY assignment', function ()
    {
        it('should always set overlapY on both bodies to the same value', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.overlapY).toBe(body2.overlapY);
        });

        it('should set overlapY to zero when overlap is zeroed out by maxOverlap', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 200, deltaAbsY: 5 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.overlapY).toBe(0);
            expect(body2.overlapY).toBe(0);
        });

        it('should set overlapY to zero when zeroed out by disabled checkCollision', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20, checkCollision: { down: false, up: true } });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            GetOverlapY(body1, body2, false, 0);

            expect(body1.overlapY).toBe(0);
            expect(body2.overlapY).toBe(0);
        });
    });

    // --- bias parameter ---

    describe('bias parameter', function ()
    {
        it('should allow an overlap that would be zeroed without bias', function ()
        {
            // overlap=10, deltaAbsY1=2, deltaAbsY2=2 → without bias maxOverlap=4 → zeroed
            // with bias=10 → maxOverlap=14 → 10 < 14 → valid
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 2 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 2 });

            var result = GetOverlapY(body1, body2, false, 10);

            expect(result).toBe(10);
        });

        it('should zero the overlap when bias is not large enough to cover it', function ()
        {
            // overlap=10, maxOverlap=2+2+5=9 → 10 > 9 → 0
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 2 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 2 });

            var result = GetOverlapY(body1, body2, false, 5);

            expect(result).toBe(0);
        });
    });

    // --- return value ---

    describe('return value', function ()
    {
        it('should return a number', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(typeof result).toBe('number');
        });

        it('should return the overlap with floating point values', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110.5, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBeCloseTo(10.5);
        });

        it('should return zero when both bodies are stationary', function ()
        {
            var body1 = makeBody({ _dy: 0 });
            var body2 = makeBody({ _dy: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should return a positive overlap when body1 moves down into body2', function ()
        {
            var body1 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });
            var body2 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBeGreaterThan(0);
        });

        it('should return a negative overlap when body1 moves up into body2', function ()
        {
            var body1 = makeBody({ _dy: 0, y: 100, deltaAbsY: 0 });
            var body2 = makeBody({ _dy: 5, bottom: 110, deltaAbsY: 20 });

            var result = GetOverlapY(body1, body2, false, 0);

            expect(result).toBeLessThan(0);
        });
    });
});
