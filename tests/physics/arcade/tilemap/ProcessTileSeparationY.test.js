var ProcessTileSeparationY = require('../../../../src/physics/arcade/tilemap/ProcessTileSeparationY');

describe('Phaser.Physics.Arcade.Tilemap.ProcessTileSeparationY', function ()
{
    var body;

    beforeEach(function ()
    {
        body = {
            blocked: { none: true, up: false, down: false, left: false, right: false },
            position: { x: 100, y: 200 },
            velocity: { x: 0, y: 100 },
            bounce: { x: 0, y: 0 },
            updateCenter: vi.fn()
        };
    });

    it('should set blocked.up and clear blocked.none when y is negative', function ()
    {
        ProcessTileSeparationY(body, -10);

        expect(body.blocked.up).toBe(true);
        expect(body.blocked.none).toBe(false);
    });

    it('should not set blocked.down when y is negative', function ()
    {
        ProcessTileSeparationY(body, -10);

        expect(body.blocked.down).toBe(false);
    });

    it('should set blocked.down and clear blocked.none when y is positive', function ()
    {
        ProcessTileSeparationY(body, 10);

        expect(body.blocked.down).toBe(true);
        expect(body.blocked.none).toBe(false);
    });

    it('should not set blocked.up when y is positive', function ()
    {
        ProcessTileSeparationY(body, 10);

        expect(body.blocked.up).toBe(false);
    });

    it('should not modify blocked flags when y is zero', function ()
    {
        ProcessTileSeparationY(body, 0);

        expect(body.blocked.none).toBe(true);
        expect(body.blocked.up).toBe(false);
        expect(body.blocked.down).toBe(false);
    });

    it('should subtract y from body position when y is negative', function ()
    {
        ProcessTileSeparationY(body, -10);

        expect(body.position.y).toBe(210);
    });

    it('should subtract y from body position when y is positive', function ()
    {
        ProcessTileSeparationY(body, 10);

        expect(body.position.y).toBe(190);
    });

    it('should not change body position when y is zero', function ()
    {
        ProcessTileSeparationY(body, 0);

        expect(body.position.y).toBe(200);
    });

    it('should call updateCenter after adjusting position', function ()
    {
        ProcessTileSeparationY(body, 10);

        expect(body.updateCenter).toHaveBeenCalledOnce();
    });

    it('should zero velocity.y when bounce.y is zero', function ()
    {
        body.velocity.y = 150;
        body.bounce.y = 0;

        ProcessTileSeparationY(body, 10);

        expect(body.velocity.y).toBe(0);
    });

    it('should reverse and scale velocity.y when bounce.y is non-zero', function ()
    {
        body.velocity.y = 100;
        body.bounce.y = 0.5;

        ProcessTileSeparationY(body, 10);

        expect(body.velocity.y).toBeCloseTo(-50);
    });

    it('should fully reverse velocity.y when bounce.y is 1', function ()
    {
        body.velocity.y = 100;
        body.bounce.y = 1;

        ProcessTileSeparationY(body, 10);

        expect(body.velocity.y).toBeCloseTo(-100);
    });

    it('should handle negative velocity with bounce', function ()
    {
        body.velocity.y = -80;
        body.bounce.y = 0.5;

        ProcessTileSeparationY(body, -10);

        expect(body.velocity.y).toBeCloseTo(40);
    });

    it('should handle large separation values', function ()
    {
        ProcessTileSeparationY(body, 500);

        expect(body.position.y).toBe(-300);
        expect(body.blocked.down).toBe(true);
    });

    it('should handle fractional separation values', function ()
    {
        ProcessTileSeparationY(body, 0.5);

        expect(body.position.y).toBeCloseTo(199.5);
    });

    it('should zero velocity.y when bounce.y is zero and y is negative', function ()
    {
        body.velocity.y = -200;
        body.bounce.y = 0;

        ProcessTileSeparationY(body, -10);

        expect(body.velocity.y).toBe(0);
    });

    it('should not modify x-axis blocked flags', function ()
    {
        ProcessTileSeparationY(body, 10);

        expect(body.blocked.left).toBe(false);
        expect(body.blocked.right).toBe(false);
    });

    it('should not modify body.position.x', function ()
    {
        ProcessTileSeparationY(body, 10);

        expect(body.position.x).toBe(100);
    });
});
