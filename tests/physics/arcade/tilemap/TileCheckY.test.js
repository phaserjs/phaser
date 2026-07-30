var TileCheckY = require('../../../../src/physics/arcade/tilemap/TileCheckY');

function createBody (overrides)
{
    var body = {
        y: 100,
        bottom: 132,
        deltaYVal: 0,
        customSeparateY: false,
        overlapY: 0,
        checkCollision: { up: true, down: true },
        blocked: { none: true, up: false, down: false },
        position: { y: 100 },
        bounce: { y: 0 },
        velocity: { y: 0 },
        updateCenter: function () {}
    };

    if (overrides)
    {
        Object.assign(body, overrides);

        if (overrides.checkCollision)
        {
            body.checkCollision = Object.assign({ up: true, down: true }, overrides.checkCollision);
        }

        if (overrides.blocked)
        {
            body.blocked = Object.assign({ none: true, up: false, down: false }, overrides.blocked);
        }
    }

    body.deltaY = function ()
    {
        return body.deltaYVal;
    };

    return body;
}

function createTile (overrides)
{
    var tile = {
        faceTop: true,
        faceBottom: true,
        collideUp: true,
        collideDown: true
    };

    if (overrides)
    {
        Object.assign(tile, overrides);
    }

    return tile;
}

describe('Phaser.Physics.Arcade.Tilemap.TileCheckY', function ()
{
    describe('when body is stationary (deltaY === 0)', function ()
    {
        it('should return zero when the body is not moving', function ()
        {
            var body = createBody({ deltaYVal: 0, y: 105 });
            var tile = createTile();

            var result = TileCheckY(body, tile, 100, 132, 16, false);

            expect(result).toBe(0);
        });

        it('should not set blocked flags when body is not moving', function ()
        {
            var body = createBody({ deltaYVal: 0, y: 105 });
            var tile = createTile();

            TileCheckY(body, tile, 100, 132, 16, false);

            expect(body.blocked.none).toBe(true);
            expect(body.blocked.up).toBe(false);
            expect(body.blocked.down).toBe(false);
        });
    });

    describe('when body is moving up (deltaY < 0)', function ()
    {
        it('should return a negative overlap when body.y is below tileBottom', function ()
        {
            // body.y=28, tileBottom=32 => oy = 28 - 32 = -4
            var body = createBody({ deltaYVal: -5, y: 28, position: { y: 28 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(-4);
        });

        it('should return zero when body.y is not less than tileBottom', function ()
        {
            // body.y exactly equals tileBottom — no overlap
            var body = createBody({ deltaYVal: -5, y: 32, position: { y: 32 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when overlap magnitude exceeds tileBias', function ()
        {
            // body.y=10, tileBottom=32 => oy = -22, tileBias=16, -22 < -16 => oy=0
            var body = createBody({ deltaYVal: -5, y: 10, position: { y: 10 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(0);
        });

        it('should return the overlap when it exactly equals negative tileBias', function ()
        {
            // body.y=16, tileBottom=32 => oy = -16, -16 is NOT < -16, so kept
            var body = createBody({ deltaYVal: -5, y: 16, position: { y: 16 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(-16);
        });

        it('should return zero when checkCollision.up is false', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28, checkCollision: { up: false, down: true } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when collideDown is false and isLayer is true', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28 });
            var tile = createTile({ collideDown: false });

            var result = TileCheckY(body, tile, 0, 32, 16, true);

            expect(result).toBe(0);
        });

        it('should return zero when faceBottom is false and isLayer is true', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28 });
            var tile = createTile({ faceBottom: false });

            var result = TileCheckY(body, tile, 0, 32, 16, true);

            expect(result).toBe(0);
        });

        it('should ignore tile collideDown=false when isLayer is false', function ()
        {
            // isLayer=false overrides all flags to true
            var body = createBody({ deltaYVal: -5, y: 28, position: { y: 28 } });
            var tile = createTile({ collideDown: false, faceBottom: false });

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(-4);
        });

        it('should set body.blocked.up when overlap occurs and customSeparateY is false', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28, position: { y: 28 } });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            expect(body.blocked.up).toBe(true);
            expect(body.blocked.none).toBe(false);
        });
    });

    describe('when body is moving down (deltaY > 0)', function ()
    {
        it('should return a positive overlap when body.bottom is above tileTop', function ()
        {
            // body.bottom=4, tileTop=0 => oy = 4 - 0 = 4
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4, position: { y: -28 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(4);
        });

        it('should return zero when body.bottom is not greater than tileTop', function ()
        {
            // body.bottom exactly equals tileTop — no overlap
            var body = createBody({ deltaYVal: 5, y: -32, bottom: 0, position: { y: -32 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when overlap magnitude exceeds tileBias', function ()
        {
            // body.bottom=20, tileTop=0 => oy = 20, tileBias=16, 20 > 16 => oy=0
            var body = createBody({ deltaYVal: 5, y: -12, bottom: 20, position: { y: -12 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(0);
        });

        it('should return the overlap when it exactly equals tileBias', function ()
        {
            // body.bottom=16, tileTop=0 => oy = 16, 16 is NOT > 16, so kept
            var body = createBody({ deltaYVal: 5, y: -16, bottom: 16, position: { y: -16 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(16);
        });

        it('should return zero when checkCollision.down is false', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4, checkCollision: { up: true, down: false } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(0);
        });

        it('should return zero when collideUp is false and isLayer is true', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4 });
            var tile = createTile({ collideUp: false });

            var result = TileCheckY(body, tile, 0, 32, 16, true);

            expect(result).toBe(0);
        });

        it('should return zero when faceTop is false and isLayer is true', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4 });
            var tile = createTile({ faceTop: false });

            var result = TileCheckY(body, tile, 0, 32, 16, true);

            expect(result).toBe(0);
        });

        it('should ignore tile collideUp=false when isLayer is false', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4, position: { y: -28 } });
            var tile = createTile({ collideUp: false, faceTop: false });

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(4);
        });

        it('should set body.blocked.down when overlap occurs and customSeparateY is false', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4, position: { y: -28 } });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            expect(body.blocked.down).toBe(true);
            expect(body.blocked.none).toBe(false);
        });
    });

    describe('isLayer flag behaviour', function ()
    {
        it('should override all tile flags to true when isLayer is false', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28, position: { y: 28 } });
            var tile = createTile({ faceBottom: false, faceTop: false, collideUp: false, collideDown: false });

            var result = TileCheckY(body, tile, 0, 32, 16, false);

            expect(result).toBe(-4);
        });

        it('should respect tile flags when isLayer is true', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28 });
            var tile = createTile({ faceBottom: false, collideDown: false });

            var result = TileCheckY(body, tile, 0, 32, 16, true);

            expect(result).toBe(0);
        });

        it('should collide when tile has all flags set and isLayer is true', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4, position: { y: -28 } });
            var tile = createTile({ collideUp: true, faceTop: true });

            var result = TileCheckY(body, tile, 0, 32, 16, true);

            expect(result).toBe(4);
        });

        it('should not collide when all tile flags are false and isLayer is true', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4 });
            var tile = createTile({ collideUp: false, faceTop: false });

            var result = TileCheckY(body, tile, 0, 32, 16, true);

            expect(result).toBe(0);
        });
    });

    describe('customSeparateY behaviour', function ()
    {
        it('should set body.overlapY when customSeparateY is true and body moves up', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28, customSeparateY: true });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            expect(body.overlapY).toBe(-4);
        });

        it('should set body.overlapY when customSeparateY is true and body moves down', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4, customSeparateY: true });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            expect(body.overlapY).toBe(4);
        });

        it('should not modify body.blocked when customSeparateY is true', function ()
        {
            // customSeparateY skips ProcessTileSeparationY, so blocked stays unchanged
            var body = createBody({ deltaYVal: -5, y: 28, customSeparateY: true });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            expect(body.blocked.none).toBe(true);
            expect(body.blocked.up).toBe(false);
        });

        it('should not modify body.overlapY when customSeparateY is false', function ()
        {
            var body = createBody({ deltaYVal: -5, y: 28, customSeparateY: false, overlapY: 0, position: { y: 28 } });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            expect(body.overlapY).toBe(0);
        });

        it('should call ProcessTileSeparationY effects when customSeparateY is false and overlap exists moving up', function ()
        {
            // Verify ProcessTileSeparationY ran by checking its side effects on body
            var body = createBody({ deltaYVal: -5, y: 28, customSeparateY: false, position: { y: 28 } });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            // ProcessTileSeparationY sets blocked.up and updates position.y by -oy
            // oy = -4, position.y -= oy => 28 - (-4) = 32
            expect(body.blocked.up).toBe(true);
            expect(body.position.y).toBe(32);
        });

        it('should call ProcessTileSeparationY effects when customSeparateY is false and overlap exists moving down', function ()
        {
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4, customSeparateY: false, position: { y: -28 } });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            // oy = 4, position.y -= oy => -28 - 4 = -32
            expect(body.blocked.down).toBe(true);
            expect(body.position.y).toBe(-32);
        });

        it('should not set blocked flags when there is no overlap', function ()
        {
            var body = createBody({ deltaYVal: 0 });
            var tile = createTile();

            TileCheckY(body, tile, 0, 32, 16, false);

            expect(body.blocked.none).toBe(true);
            expect(body.blocked.up).toBe(false);
            expect(body.blocked.down).toBe(false);
        });
    });

    describe('return value', function ()
    {
        it('should return zero when there is no overlap', function ()
        {
            var body = createBody({ deltaYVal: 0 });
            var tile = createTile();

            expect(TileCheckY(body, tile, 0, 32, 16, false)).toBe(0);
        });

        it('should return the exact overlap value when moving up', function ()
        {
            // body.y=30, tileBottom=32 => oy = -2
            var body = createBody({ deltaYVal: -3, y: 30, position: { y: 30 } });
            var tile = createTile();

            expect(TileCheckY(body, tile, 0, 32, 16, false)).toBe(-2);
        });

        it('should return the exact overlap value when moving down', function ()
        {
            // body.bottom=3, tileTop=0 => oy = 3
            var body = createBody({ deltaYVal: 3, y: -29, bottom: 3, position: { y: -29 } });
            var tile = createTile();

            expect(TileCheckY(body, tile, 0, 32, 16, false)).toBe(3);
        });

        it('should return zero when overlap is suppressed by tileBias moving up', function ()
        {
            // oy = 0 - 32 = -32, tileBias=16, -32 < -16 => oy=0
            var body = createBody({ deltaYVal: -5, y: 0 });
            var tile = createTile();

            expect(TileCheckY(body, tile, 0, 32, 16, false)).toBe(0);
        });

        it('should return zero when overlap is suppressed by tileBias moving down', function ()
        {
            // oy = 20 - 0 = 20, tileBias=16, 20 > 16 => oy=0
            var body = createBody({ deltaYVal: 5, y: -12, bottom: 20 });
            var tile = createTile();

            expect(TileCheckY(body, tile, 0, 32, 16, false)).toBe(0);
        });
    });

    describe('tileBias edge cases', function ()
    {
        it('should return zero when tileBias is 0 and positive overlap exists', function ()
        {
            // oy = 4, tileBias = 0: 4 > 0 => oy = 0
            var body = createBody({ deltaYVal: 5, y: -28, bottom: 4 });
            var tile = createTile();

            expect(TileCheckY(body, tile, 0, 32, 0, false)).toBe(0);
        });

        it('should return zero when tileBias is 0 and negative overlap exists', function ()
        {
            // oy = -4, tileBias = 0: -4 < -0 => oy = 0
            var body = createBody({ deltaYVal: -5, y: 28 });
            var tile = createTile();

            expect(TileCheckY(body, tile, 0, 32, 0, false)).toBe(0);
        });

        it('should return overlap when tileBias is very large', function ()
        {
            // oy = 0 - 32 = -32, tileBias=9999: -32 is NOT < -9999, so kept
            var body = createBody({ deltaYVal: -5, y: 0, position: { y: 0 } });
            var tile = createTile();

            var result = TileCheckY(body, tile, 0, 32, 9999, false);

            expect(result).toBe(-32);
        });
    });
});
