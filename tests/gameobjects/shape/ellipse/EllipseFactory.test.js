var helper = require('../../../helper');

describe('EllipseFactory', function ()
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

    it('should register the ellipse factory method on the scene add plugin', function ()
    {
        expect(typeof scene.add.ellipse).toBe('function');
    });

    it('should call displayList.add with the created object and return it', function ()
    {
        var result = scene.add.ellipse(100, 200, 64, 32, 0xff0000, 1);

        expect(result).not.toBeNull();
        expect(result.type).toBe('Ellipse');
    });

    it('should pass x and y to the Ellipse constructor', function ()
    {
        var result = scene.add.ellipse(50, 75, 100, 100, 0x000000, 1);

        expect(result.x).toBe(50);
        expect(result.y).toBe(75);
    });

    it('should pass width and height to the Ellipse constructor', function ()
    {
        var result = scene.add.ellipse(0, 0, 200, 80, 0x000000, 1);

        expect(result.width).toBe(200);
        expect(result.height).toBe(80);
    });

    it('should pass fillColor and fillAlpha to the Ellipse constructor', function ()
    {
        var result = scene.add.ellipse(0, 0, 100, 100, 0xff0000, 0.5);

        expect(result.fillColor).toBe(0xff0000);
        expect(result.fillAlpha).toBeCloseTo(0.5);
    });

    it('should pass the scene reference to the Ellipse constructor', function ()
    {
        var result = scene.add.ellipse(0, 0, 100, 100);

        expect(result.scene).toBe(scene);
    });

    it('should use default width and height when not provided', function ()
    {
        var result = scene.add.ellipse(0, 0);

        expect(result.width).toBe(128);
        expect(result.height).toBe(128);
    });
});
