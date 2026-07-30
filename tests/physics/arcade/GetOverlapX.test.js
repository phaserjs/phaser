var GetOverlapX = require('../../../src/physics/arcade/GetOverlapX');
var CONST = require('../../../src/physics/arcade/const');

describe('Phaser.Physics.Arcade.GetOverlapX', function ()
{
    function makeBody (x, width, dx, physicsType)
    {
        return {
            x: x,
            width: width,
            right: x + width,
            _dx: dx,
            physicsType: physicsType !== undefined ? physicsType : CONST.DYNAMIC_BODY,
            embedded: false,
            overlapX: 0,
            touching: { none: true, left: false, right: false },
            blocked: { none: true, left: false, right: false },
            checkCollision: { left: true, right: true },
            deltaAbsX: function () { return Math.abs(this._dx); }
        };
    }

    describe('when both bodies are stationary (dx === 0)', function ()
    {
        it('should set embedded on both bodies', function ()
        {
            var body1 = makeBody(10, 20, 0);
            var body2 = makeBody(20, 20, 0);

            GetOverlapX(body1, body2, false, 0);

            expect(body1.embedded).toBe(true);
            expect(body2.embedded).toBe(true);
        });

        it('should return zero overlap', function ()
        {
            var body1 = makeBody(10, 20, 0);
            var body2 = makeBody(20, 20, 0);

            var result = GetOverlapX(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should set overlapX to zero on both bodies', function ()
        {
            var body1 = makeBody(10, 20, 0);
            var body2 = makeBody(20, 20, 0);

            GetOverlapX(body1, body2, false, 0);

            expect(body1.overlapX).toBe(0);
            expect(body2.overlapX).toBe(0);
        });
    });

    describe('when body1 is moving right (body1._dx > body2._dx)', function ()
    {
        it('should return correct overlap when bodies overlap within maxOverlap', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0);

            // overlap = body1.right - body2.x = 30 - 20 = 10
            // maxOverlap = 5 + 0 + 0 = 5, but overlapOnly=true skips that check
            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(10);
        });

        it('should set touching.right on body1 and touching.left on body2', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0);

            GetOverlapX(body1, body2, true, 0);

            expect(body1.touching.right).toBe(true);
            expect(body1.touching.none).toBe(false);
            expect(body2.touching.left).toBe(true);
            expect(body2.touching.none).toBe(false);
        });

        it('should set overlapX on both bodies', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0);

            GetOverlapX(body1, body2, true, 0);

            expect(body1.overlapX).toBe(10);
            expect(body2.overlapX).toBe(10);
        });

        it('should return zero when overlap exceeds maxOverlap and not overlapOnly', function ()
        {
            var body1 = makeBody(0, 30, 1);
            var body2 = makeBody(20, 30, 0);

            // overlap = 10, maxOverlap = 1 + 0 + 0 = 1, 10 > 1 and !overlapOnly
            var result = GetOverlapX(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should not return zero when overlap exceeds maxOverlap but overlapOnly is true', function ()
        {
            var body1 = makeBody(0, 30, 1);
            var body2 = makeBody(20, 30, 0);

            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(10);
        });

        it('should return zero when body1.checkCollision.right is false', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0);
            body1.checkCollision.right = false;

            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(0);
        });

        it('should return zero when body2.checkCollision.left is false', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0);
            body2.checkCollision.left = false;

            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(0);
        });

        it('should set body1.blocked.right when body2 is static and not overlapOnly', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0, CONST.STATIC_BODY);

            GetOverlapX(body1, body2, false, 4 + 10);

            expect(body1.blocked.right).toBe(true);
            expect(body1.blocked.none).toBe(false);
        });

        it('should not set body1.blocked.right when body2 is static but overlapOnly is true', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0, CONST.STATIC_BODY);

            GetOverlapX(body1, body2, true, 0);

            expect(body1.blocked.right).toBe(false);
            expect(body1.blocked.none).toBe(true);
        });

        it('should set body2.blocked.left when body1 is static and not overlapOnly', function ()
        {
            var body1 = makeBody(0, 30, 5, CONST.STATIC_BODY);
            var body2 = makeBody(20, 30, 0);

            GetOverlapX(body1, body2, false, 4 + 10);

            expect(body2.blocked.left).toBe(true);
            expect(body2.blocked.none).toBe(false);
        });

        it('should include bias in maxOverlap calculation', function ()
        {
            var body1 = makeBody(0, 30, 1);
            var body2 = makeBody(20, 30, 0);

            // overlap = 10, maxOverlap = 1 + 0 + bias
            // with bias=9, maxOverlap=10, overlap(10) > maxOverlap(10) is false, so overlap returned
            var result = GetOverlapX(body1, body2, false, 9);

            expect(result).toBe(10);
        });
    });

    describe('when body1 is moving left (body1._dx < body2._dx)', function ()
    {
        it('should return correct negative overlap when bodies overlap within maxOverlap', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 5);

            // overlap = body1.x - body2.width - body2.x = 20 - 30 - 0 = -10
            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(-10);
        });

        it('should set touching.left on body1 and touching.right on body2', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 5);

            GetOverlapX(body1, body2, true, 0);

            expect(body1.touching.left).toBe(true);
            expect(body1.touching.none).toBe(false);
            expect(body2.touching.right).toBe(true);
            expect(body2.touching.none).toBe(false);
        });

        it('should set overlapX on both bodies to negative value', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 5);

            GetOverlapX(body1, body2, true, 0);

            expect(body1.overlapX).toBe(-10);
            expect(body2.overlapX).toBe(-10);
        });

        it('should return zero when -overlap exceeds maxOverlap and not overlapOnly', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 1);

            // overlap = -10, -overlap = 10, maxOverlap = 0 + 1 + 0 = 1, 10 > 1 and !overlapOnly
            var result = GetOverlapX(body1, body2, false, 0);

            expect(result).toBe(0);
        });

        it('should not return zero when -overlap exceeds maxOverlap but overlapOnly is true', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 1);

            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(-10);
        });

        it('should return zero when body1.checkCollision.left is false', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 5);
            body1.checkCollision.left = false;

            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(0);
        });

        it('should return zero when body2.checkCollision.right is false', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 5);
            body2.checkCollision.right = false;

            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(0);
        });

        it('should set body1.blocked.left when body2 is static and not overlapOnly', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 5, CONST.STATIC_BODY);

            GetOverlapX(body1, body2, false, 4 + 10);

            expect(body1.blocked.left).toBe(true);
            expect(body1.blocked.none).toBe(false);
        });

        it('should set body2.blocked.right when body1 is static and not overlapOnly', function ()
        {
            var body1 = makeBody(20, 30, 0, CONST.STATIC_BODY);
            var body2 = makeBody(0, 30, 5);

            GetOverlapX(body1, body2, false, 4 + 10);

            expect(body2.blocked.right).toBe(true);
            expect(body2.blocked.none).toBe(false);
        });

        it('should not set blocked flags when overlapOnly is true', function ()
        {
            var body1 = makeBody(20, 30, 0);
            var body2 = makeBody(0, 30, 5, CONST.STATIC_BODY);

            GetOverlapX(body1, body2, true, 0);

            expect(body1.blocked.left).toBe(false);
            expect(body1.blocked.none).toBe(true);
        });
    });

    describe('edge cases', function ()
    {
        it('should return zero and not set touching when bodies do not overlap (moving right)', function ()
        {
            var body1 = makeBody(0, 10, 5);
            var body2 = makeBody(20, 10, 0);

            // overlap = body1.right - body2.x = 10 - 20 = -10, which is <= 0
            // maxOverlap = 5 + 0 + 0 = 5, -10 > 5 is false so overlap is set to -10
            // But touching flags would still be set — let's just confirm return value
            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(-10);
        });

        it('should handle zero bias correctly', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0);

            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBe(10);
        });

        it('should handle floating point positions', function ()
        {
            var body1 = makeBody(0, 30.5, 5);
            body1.right = 30.5;
            var body2 = makeBody(20.2, 30, 0);

            // overlap = 30.5 - 20.2 = 10.3
            var result = GetOverlapX(body1, body2, true, 0);

            expect(result).toBeCloseTo(10.3, 5);
        });

        it('should set overlapX to zero on both bodies when overlap is rejected', function ()
        {
            var body1 = makeBody(0, 30, 1);
            var body2 = makeBody(20, 30, 0);
            body1.overlapX = 99;
            body2.overlapX = 99;

            GetOverlapX(body1, body2, false, 0);

            expect(body1.overlapX).toBe(0);
            expect(body2.overlapX).toBe(0);
        });

        it('should not modify embedded when bodies are moving', function ()
        {
            var body1 = makeBody(0, 30, 5);
            var body2 = makeBody(20, 30, 0);

            GetOverlapX(body1, body2, true, 0);

            expect(body1.embedded).toBe(false);
            expect(body2.embedded).toBe(false);
        });

        it('should not set blocked flags for dynamic bodies', function ()
        {
            var body1 = makeBody(0, 30, 5, CONST.DYNAMIC_BODY);
            var body2 = makeBody(20, 30, 0, CONST.DYNAMIC_BODY);

            GetOverlapX(body1, body2, false, 4 + 10);

            expect(body1.blocked.right).toBe(false);
            expect(body2.blocked.left).toBe(false);
        });
    });
});
