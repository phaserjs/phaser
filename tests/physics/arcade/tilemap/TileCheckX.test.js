var TileCheckX = require('../../../../src/physics/arcade/tilemap/TileCheckX');

function createBody (overrides)
{
    var body = {
        x: 100,
        right: 132,
        deltaXVal: 0,
        customSeparateX: false,
        overlapX: 0,
        checkCollision: { left: true, right: true },
        blocked: { none: true, left: false, right: false },
        position: { x: 100 },
        bounce: { x: 0 },
        velocity: { x: 0 },
        updateCenter: function () {}
    };

    if (overrides)
    {
        Object.assign(body, overrides);

        if (overrides.checkCollision)
        {
            body.checkCollision = Object.assign({ left: true, right: true }, overrides.checkCollision);
        }

        if (overrides.blocked)
        {
            body.blocked = Object.assign({ none: true, left: false, right: false }, overrides.blocked);
        }
    }

    body.deltaX = function ()
    {
        return body.deltaXVal;
    };

    return body;
}

function createTile (overrides)
{
    var tile = {
        faceLeft: true,
        faceRight: true,
        collideLeft: true,
        collideRight: true
    };

    if (overrides)
    {
        Object.assign(tile, overrides);
    }

    return tile;
}

describe('Phaser.Physics.Arcade.Tilemap.TileCheckX', function ()
{
    describe('when body is stationary (deltaX === 0)', function ()
    {
        it('should return zero when the body is not moving', function ()
        {
            var body = createBody({ deltaXVal: 0, x: 105 });
            var tile = createTile();

            var result = TileCheckX(body, tile, 100, 132, 16, false);

            expect(result).toBe(0);
        });

        it('should not set blocked flags when body is not moving', function ()
        {
            var body = createBody({ deltaXVal: 0, x: 105 });
            var tile = createTile();

            TileCheckX(body, tile, 100, 132, 16, false);

            expect(body.blocked.none).toBe(true);
            expect(body.blocked.left).toBe(false);
            expect(body.blocked.right).toBe(false);
        });
    });

    describe('when body is moving left (deltaX < 0)', function ()
    {
        it('should return a negative overlap when body overlaps tile from the right', function ()
        {
            // body.x=105, tileRight=110 => ox = 105 - 110 = -5
            var body = createBody({ deltaXVal: -5, x: 105, position: { x: 105 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 80, 110, 16, false);

            expect(result).toBe(-5);
        });

        it('should return zero when body.x is not less than tileRight', function ()
        {
            // body.x exactly equals tileRight — no overlap
            var body = createBody({ deltaXVal: -5, x: 110, position: { x: 110 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 80, 110, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when overlap magnitude exceeds tileBias', function ()
        {
            // body.x=80, tileRight=110 => ox = -30, tileBias=16, -30 < -16 => ox=0
            var body = createBody({ deltaXVal: -5, x: 80, position: { x: 80 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 50, 110, 16, false);

            expect(result).toBe(0);
        });

        it('should return the overlap when it exactly equals negative tileBias', function ()
        {
            // body.x=94, tileRight=110 => ox = -16, tileBias=16: -16 is NOT < -16, kept
            var body = createBody({ deltaXVal: -5, x: 94, position: { x: 94 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 50, 110, 16, false);

            expect(result).toBe(-16);
        });

        it('should return zero when checkCollision.left is false', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105, checkCollision: { left: false, right: true } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 80, 110, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when collideRight is false and isLayer is true', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105 });
            var tile = createTile({ collideRight: false });

            var result = TileCheckX(body, tile, 80, 110, 16, true);

            expect(result).toBe(0);
        });

        it('should return zero when faceRight is false and isLayer is true', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105 });
            var tile = createTile({ faceRight: false });

            var result = TileCheckX(body, tile, 80, 110, 16, true);

            expect(result).toBe(0);
        });

        it('should ignore tile collideRight=false when isLayer is false', function ()
        {
            // isLayer=false overrides all flags to true
            var body = createBody({ deltaXVal: -5, x: 105, position: { x: 105 } });
            var tile = createTile({ collideRight: false, faceRight: false });

            var result = TileCheckX(body, tile, 80, 110, 16, false);

            expect(result).toBe(-5);
        });

        it('should set body.blocked.left when overlap occurs and customSeparateX is false', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105, position: { x: 105 } });
            var tile = createTile();

            TileCheckX(body, tile, 80, 110, 16, false);

            expect(body.blocked.left).toBe(true);
            expect(body.blocked.none).toBe(false);
        });
    });

    describe('when body is moving right (deltaX > 0)', function ()
    {
        it('should return a positive overlap when body overlaps tile from the left', function ()
        {
            // body.right=105, tileLeft=100 => ox = 105 - 100 = 5
            var body = createBody({ deltaXVal: 5, x: 73, right: 105, position: { x: 73 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 100, 132, 16, false);

            expect(result).toBe(5);
        });

        it('should return zero when body.right is not greater than tileLeft', function ()
        {
            // body.right exactly equals tileLeft — no overlap
            var body = createBody({ deltaXVal: 5, x: 68, right: 100, position: { x: 68 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 100, 132, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when overlap magnitude exceeds tileBias', function ()
        {
            // body.right=120, tileLeft=100 => ox = 20, tileBias=16, 20 > 16 => ox=0
            var body = createBody({ deltaXVal: 5, x: 88, right: 120, position: { x: 88 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 100, 132, 16, false);

            expect(result).toBe(0);
        });

        it('should return the overlap when it exactly equals tileBias', function ()
        {
            // body.right=116, tileLeft=100 => ox = 16, tileBias=16: 16 is NOT > 16, kept
            var body = createBody({ deltaXVal: 5, x: 84, right: 116, position: { x: 84 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 100, 132, 16, false);

            expect(result).toBe(16);
        });

        it('should return zero when checkCollision.right is false', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105, checkCollision: { left: true, right: false } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 100, 132, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when collideLeft is false and isLayer is true', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105 });
            var tile = createTile({ collideLeft: false });

            var result = TileCheckX(body, tile, 100, 132, 16, true);

            expect(result).toBe(0);
        });

        it('should return zero when faceLeft is false and isLayer is true', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105 });
            var tile = createTile({ faceLeft: false });

            var result = TileCheckX(body, tile, 100, 132, 16, true);

            expect(result).toBe(0);
        });

        it('should ignore tile collideLeft=false when isLayer is false', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105, position: { x: 73 } });
            var tile = createTile({ collideLeft: false, faceLeft: false });

            var result = TileCheckX(body, tile, 100, 132, 16, false);

            expect(result).toBe(5);
        });

        it('should set body.blocked.right when overlap occurs and customSeparateX is false', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105, position: { x: 73 } });
            var tile = createTile();

            TileCheckX(body, tile, 100, 132, 16, false);

            expect(body.blocked.right).toBe(true);
            expect(body.blocked.none).toBe(false);
        });
    });

    describe('isLayer flag behaviour', function ()
    {
        it('should override all tile flags to true when isLayer is false', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105, position: { x: 105 } });
            var tile = createTile({ faceRight: false, collideRight: false });

            var result = TileCheckX(body, tile, 80, 110, 16, false);

            expect(result).toBe(-5);
        });

        it('should respect tile flags when isLayer is true', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105 });
            var tile = createTile({ faceRight: false, collideRight: false });

            var result = TileCheckX(body, tile, 80, 110, 16, true);

            expect(result).toBe(0);
        });

        it('should collide when tile has all flags set and isLayer is true', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105, position: { x: 73 } });
            var tile = createTile({ collideLeft: true, faceLeft: true });

            var result = TileCheckX(body, tile, 100, 132, 16, true);

            expect(result).toBe(5);
        });

        it('should not collide when all tile flags are false and isLayer is true', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105 });
            var tile = createTile({ collideLeft: false, faceLeft: false });

            var result = TileCheckX(body, tile, 100, 132, 16, true);

            expect(result).toBe(0);
        });
    });

    describe('customSeparateX behaviour', function ()
    {
        it('should set body.overlapX when customSeparateX is true and body moves left', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105, customSeparateX: true });
            var tile = createTile();

            TileCheckX(body, tile, 80, 110, 16, false);

            expect(body.overlapX).toBe(-5);
        });

        it('should set body.overlapX when customSeparateX is true and body moves right', function ()
        {
            var body = createBody({ deltaXVal: 5, x: 73, right: 105, customSeparateX: true });
            var tile = createTile();

            TileCheckX(body, tile, 100, 132, 16, false);

            expect(body.overlapX).toBe(5);
        });

        it('should not modify body.blocked when customSeparateX is true', function ()
        {
            // customSeparateX skips ProcessTileSeparationX, so blocked stays unchanged
            var body = createBody({ deltaXVal: -5, x: 105, customSeparateX: true });
            var tile = createTile();

            TileCheckX(body, tile, 80, 110, 16, false);

            expect(body.blocked.none).toBe(true);
            expect(body.blocked.left).toBe(false);
        });

        it('should not modify body.overlapX when customSeparateX is false', function ()
        {
            var body = createBody({ deltaXVal: -5, x: 105, customSeparateX: false, overlapX: 0, position: { x: 105 } });
            var tile = createTile();

            TileCheckX(body, tile, 80, 110, 16, false);

            expect(body.overlapX).toBe(0);
        });

        it('should call ProcessTileSeparationX effects when customSeparateX is false and overlap exists', function ()
        {
            // Verify ProcessTileSeparationX ran by checking its side effects on body
            var body = createBody({ deltaXVal: -5, x: 105, customSeparateX: false, position: { x: 105 } });
            var tile = createTile();

            TileCheckX(body, tile, 80, 110, 16, false);

            // ProcessTileSeparationX sets blocked.left and updates position
            expect(body.blocked.left).toBe(true);
            expect(body.position.x).toBe(110); // 105 - (-5) = 110
        });

        it('should not set blocked flags when there is no overlap', function ()
        {
            var body = createBody({ deltaXVal: 0 });
            var tile = createTile();

            TileCheckX(body, tile, 100, 132, 16, false);

            expect(body.blocked.none).toBe(true);
            expect(body.blocked.left).toBe(false);
            expect(body.blocked.right).toBe(false);
        });
    });

    describe('return value', function ()
    {
        it('should return zero when there is no overlap', function ()
        {
            var body = createBody({ deltaXVal: 0 });
            var tile = createTile();

            expect(TileCheckX(body, tile, 100, 132, 16, false)).toBe(0);
        });

        it('should return the exact overlap value when moving left', function ()
        {
            // body.x=108, tileRight=110 => ox = -2
            var body = createBody({ deltaXVal: -3, x: 108, position: { x: 108 } });
            var tile = createTile();

            expect(TileCheckX(body, tile, 80, 110, 16, false)).toBe(-2);
        });

        it('should return the exact overlap value when moving right', function ()
        {
            // body.right=103, tileLeft=100 => ox = 3
            var body = createBody({ deltaXVal: 3, x: 71, right: 103, position: { x: 71 } });
            var tile = createTile();

            expect(TileCheckX(body, tile, 100, 132, 16, false)).toBe(3);
        });

        it('should return zero when overlap is suppressed by tileBias moving left', function ()
        {
            // ox = 50 - 110 = -60, tileBias=16, -60 < -16 => ox=0
            var body = createBody({ deltaXVal: -5, x: 50 });
            var tile = createTile();

            expect(TileCheckX(body, tile, 20, 110, 16, false)).toBe(0);
        });

        it('should return zero when overlap is suppressed by tileBias moving right', function ()
        {
            // ox = 140 - 100 = 40, tileBias=16, 40 > 16 => ox=0
            var body = createBody({ deltaXVal: 5, x: 108, right: 140 });
            var tile = createTile();

            expect(TileCheckX(body, tile, 100, 132, 16, false)).toBe(0);
        });
    });

    describe('tileBias edge cases', function ()
    {
        it('should return zero when tileBias is 0 and positive overlap exists', function ()
        {
            // ox = 5, tileBias = 0: 5 > 0 => ox = 0
            var body = createBody({ deltaXVal: 5, x: 73, right: 105 });
            var tile = createTile();

            expect(TileCheckX(body, tile, 100, 132, 0, false)).toBe(0);
        });

        it('should return zero when tileBias is 0 and negative overlap exists', function ()
        {
            // ox = -5, tileBias = 0: -5 < -0 => ox = 0
            var body = createBody({ deltaXVal: -5, x: 105 });
            var tile = createTile();

            expect(TileCheckX(body, tile, 80, 110, 0, false)).toBe(0);
        });

        it('should return overlap when tileBias is very large', function ()
        {
            // ox = 50 - 110 = -60, tileBias=9999: -60 is NOT < -9999, so kept
            var body = createBody({ deltaXVal: -5, x: 50, position: { x: 50 } });
            var tile = createTile();

            var result = TileCheckX(body, tile, 20, 110, 9999, false);

            expect(result).toBe(-60);
        });
    });
});
