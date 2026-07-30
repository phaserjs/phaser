var ProcessTileSeparationX = require('../../../../src/physics/arcade/tilemap/ProcessTileSeparationX');

describe('Phaser.Physics.Arcade.Tilemap.ProcessTileSeparationX', function ()
{
    var body;

    beforeEach(function ()
    {
        body = {
            blocked: { none: true, left: false, right: false, up: false, down: false },
            position: { x: 100, y: 100 },
            velocity: { x: 200, y: 0 },
            bounce: { x: 0, y: 0 },
            updateCenter: vi.fn()
        };
    });

    it('should set blocked.left and clear blocked.none when x is negative', function ()
    {
        ProcessTileSeparationX(body, -10);

        expect(body.blocked.left).toBe(true);
        expect(body.blocked.none).toBe(false);
    });

    it('should not set blocked.right when x is negative', function ()
    {
        ProcessTileSeparationX(body, -10);

        expect(body.blocked.right).toBe(false);
    });

    it('should set blocked.right and clear blocked.none when x is positive', function ()
    {
        ProcessTileSeparationX(body, 10);

        expect(body.blocked.right).toBe(true);
        expect(body.blocked.none).toBe(false);
    });

    it('should not set blocked.left when x is positive', function ()
    {
        ProcessTileSeparationX(body, 10);

        expect(body.blocked.left).toBe(false);
    });

    it('should not modify blocked flags when x is zero', function ()
    {
        ProcessTileSeparationX(body, 0);

        expect(body.blocked.none).toBe(true);
        expect(body.blocked.left).toBe(false);
        expect(body.blocked.right).toBe(false);
    });

    it('should subtract x from body.position.x', function ()
    {
        ProcessTileSeparationX(body, 10);

        expect(body.position.x).toBe(90);
    });

    it('should subtract negative x from body.position.x (moves right)', function ()
    {
        ProcessTileSeparationX(body, -10);

        expect(body.position.x).toBe(110);
    });

    it('should not change body.position.x when x is zero', function ()
    {
        ProcessTileSeparationX(body, 0);

        expect(body.position.x).toBe(100);
    });

    it('should call updateCenter after adjusting position', function ()
    {
        ProcessTileSeparationX(body, 10);

        expect(body.updateCenter).toHaveBeenCalledOnce();
    });

    it('should zero velocity.x when bounce.x is zero', function ()
    {
        body.velocity.x = 300;
        body.bounce.x = 0;

        ProcessTileSeparationX(body, 10);

        expect(body.velocity.x).toBe(0);
    });

    it('should zero velocity.x when bounce.x is zero and x is negative', function ()
    {
        body.velocity.x = -300;
        body.bounce.x = 0;

        ProcessTileSeparationX(body, -10);

        expect(body.velocity.x).toBe(0);
    });

    it('should apply bounce to velocity.x when bounce.x is non-zero', function ()
    {
        body.velocity.x = 200;
        body.bounce.x = 0.5;

        ProcessTileSeparationX(body, 10);

        expect(body.velocity.x).toBe(-100);
    });

    it('should reverse and scale velocity.x with bounce.x coefficient', function ()
    {
        body.velocity.x = -150;
        body.bounce.x = 0.8;

        ProcessTileSeparationX(body, -10);

        expect(body.velocity.x).toBeCloseTo(120);
    });

    it('should fully reverse velocity.x when bounce.x is 1', function ()
    {
        body.velocity.x = 250;
        body.bounce.x = 1;

        ProcessTileSeparationX(body, 10);

        expect(body.velocity.x).toBe(-250);
    });

    it('should handle floating point separation values', function ()
    {
        body.position.x = 50.5;

        ProcessTileSeparationX(body, 3.5);

        expect(body.position.x).toBeCloseTo(47.0);
    });

    it('should handle large separation values', function ()
    {
        body.position.x = 1000;

        ProcessTileSeparationX(body, 500);

        expect(body.position.x).toBe(500);
        expect(body.blocked.right).toBe(true);
    });

    it('should not affect velocity.y', function ()
    {
        body.velocity.y = 50;

        ProcessTileSeparationX(body, 10);

        expect(body.velocity.y).toBe(50);
    });

    it('should not affect position.y', function ()
    {
        body.position.y = 200;

        ProcessTileSeparationX(body, 10);

        expect(body.position.y).toBe(200);
    });
});
