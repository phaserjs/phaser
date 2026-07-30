var Canvas = require('../../../src/textures/parsers/Canvas');

describe('Phaser.Textures.Parsers.Canvas', function ()
{
    var texture;
    var addSpy;

    beforeEach(function ()
    {
        addSpy = vi.fn();

        texture = {
            source: [
                { width: 256, height: 128 }
            ],
            add: addSpy
        };
    });

    it('should return the texture', function ()
    {
        var result = Canvas(texture, 0);

        expect(result).toBe(texture);
    });

    it('should call texture.add with __BASE frame key', function ()
    {
        Canvas(texture, 0);

        expect(addSpy).toHaveBeenCalledTimes(1);
        expect(addSpy.mock.calls[0][0]).toBe('__BASE');
    });

    it('should call texture.add with the correct sourceIndex', function ()
    {
        texture.source = [
            { width: 100, height: 100 },
            { width: 200, height: 200 }
        ];

        Canvas(texture, 1);

        expect(addSpy.mock.calls[0][1]).toBe(1);
    });

    it('should call texture.add with x and y of 0', function ()
    {
        Canvas(texture, 0);

        expect(addSpy.mock.calls[0][2]).toBe(0);
        expect(addSpy.mock.calls[0][3]).toBe(0);
    });

    it('should call texture.add with source width and height', function ()
    {
        Canvas(texture, 0);

        expect(addSpy.mock.calls[0][4]).toBe(256);
        expect(addSpy.mock.calls[0][5]).toBe(128);
    });

    it('should use correct source dimensions for a non-zero sourceIndex', function ()
    {
        texture.source = [
            { width: 64, height: 64 },
            { width: 512, height: 256 }
        ];

        Canvas(texture, 1);

        expect(addSpy.mock.calls[0][1]).toBe(1);
        expect(addSpy.mock.calls[0][4]).toBe(512);
        expect(addSpy.mock.calls[0][5]).toBe(256);
    });

    it('should handle a 1x1 source', function ()
    {
        texture.source = [ { width: 1, height: 1 } ];

        Canvas(texture, 0);

        expect(addSpy.mock.calls[0][4]).toBe(1);
        expect(addSpy.mock.calls[0][5]).toBe(1);
    });

    it('should handle a non-square source', function ()
    {
        texture.source = [ { width: 800, height: 200 } ];

        Canvas(texture, 0);

        expect(addSpy.mock.calls[0][4]).toBe(800);
        expect(addSpy.mock.calls[0][5]).toBe(200);
    });
});
