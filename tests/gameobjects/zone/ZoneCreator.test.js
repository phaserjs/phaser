var helper = require('../../helper');

describe('ZoneCreator', function ()
{
    var scene;

    beforeEach(async function ()
    {
        scene = await helper.createGame();
    });

    afterEach(function ()
    {
        helper.destroyGame();
    });

    it('should register the zone factory with GameObjectCreator', function ()
    {
        expect(typeof scene.make.zone).toBe('function');
    });

    it('should register under the key "zone"', function ()
    {
        expect(typeof scene.make.zone).toBe('function');
    });

    it('should create a Zone with default values when config has no properties', function ()
    {
        var zone = scene.make.zone({});

        expect(zone.x).toBe(0);
        expect(zone.y).toBe(0);
        expect(zone.width).toBe(1);
        expect(zone.height).toBe(1);
    });

    it('should extract x from config', function ()
    {
        var zone = scene.make.zone({ x: 100 });

        expect(zone.x).toBe(100);
    });

    it('should extract y from config', function ()
    {
        var zone = scene.make.zone({ y: 200 });

        expect(zone.y).toBe(200);
    });

    it('should extract width from config', function ()
    {
        var zone = scene.make.zone({ width: 64 });

        expect(zone.width).toBe(64);
    });

    it('should extract height from config', function ()
    {
        var zone = scene.make.zone({ width: 64, height: 32 });

        expect(zone.width).toBe(64);
        expect(zone.height).toBe(32);
    });

    it('should default height to width when height is not provided', function ()
    {
        var zone = scene.make.zone({ width: 128 });

        expect(zone.width).toBe(128);
        expect(zone.height).toBe(128);
    });

    it('should extract all config values together', function ()
    {
        var zone = scene.make.zone({ x: 10, y: 20, width: 300, height: 400 });

        expect(zone.x).toBe(10);
        expect(zone.y).toBe(20);
        expect(zone.width).toBe(300);
        expect(zone.height).toBe(400);
    });

    it('should use default width of 1 when width is not provided', function ()
    {
        var zone = scene.make.zone({ x: 5, y: 5 });

        expect(zone.width).toBe(1);
        expect(zone.height).toBe(1);
    });

    it('should pass the scene from context to Zone', function ()
    {
        var zone = scene.make.zone({});

        expect(zone.scene).toBe(scene);
    });

    it('should return the created Zone instance', function ()
    {
        var zone = scene.make.zone({});

        expect(zone).toBeDefined();
        expect(zone.type).toBe('Zone');
    });

    it('should handle negative x and y values', function ()
    {
        var zone = scene.make.zone({ x: -50, y: -75 });

        expect(zone.x).toBe(-50);
        expect(zone.y).toBe(-75);
    });

    it('should handle floating point position values', function ()
    {
        var zone = scene.make.zone({ x: 1.5, y: 2.5, width: 10, height: 10 });

        expect(zone.x).toBe(1.5);
        expect(zone.y).toBe(2.5);
        expect(zone.width).toBe(10);
        expect(zone.height).toBe(10);
    });

    it('should handle zero width and height', function ()
    {
        var zone = scene.make.zone({ width: 0, height: 0 });

        expect(zone.width).toBe(0);
        expect(zone.height).toBe(0);
    });

    it('should default height to 0 when width is 0 and height is omitted', function ()
    {
        var zone = scene.make.zone({ width: 0 });

        expect(zone.width).toBe(0);
        expect(zone.height).toBe(0);
    });
});
