var Image = require('../../../src/textures/parsers/Image');

describe('Phaser.Textures.Parsers.Image', function ()
{
    var mockTexture;
    var mockSource;

    beforeEach(function ()
    {
        mockSource = { width: 256, height: 128 };

        mockTexture = {
            source: [ mockSource ],
            add: vi.fn()
        };
    });

    it('should return the texture', function ()
    {
        var result = Image(mockTexture, 0);

        expect(result).toBe(mockTexture);
    });

    it('should call texture.add with __BASE as the frame name', function ()
    {
        Image(mockTexture, 0);

        expect(mockTexture.add).toHaveBeenCalled();
        expect(mockTexture.add.mock.calls[0][0]).toBe('__BASE');
    });

    it('should pass the sourceIndex to texture.add', function ()
    {
        Image(mockTexture, 0);

        expect(mockTexture.add.mock.calls[0][1]).toBe(0);
    });

    it('should pass zero for x and y to texture.add', function ()
    {
        Image(mockTexture, 0);

        expect(mockTexture.add.mock.calls[0][2]).toBe(0);
        expect(mockTexture.add.mock.calls[0][3]).toBe(0);
    });

    it('should pass the source width and height to texture.add', function ()
    {
        Image(mockTexture, 0);

        expect(mockTexture.add.mock.calls[0][4]).toBe(256);
        expect(mockTexture.add.mock.calls[0][5]).toBe(128);
    });

    it('should use the correct sourceIndex when accessing texture.source', function ()
    {
        var secondSource = { width: 512, height: 64 };
        mockTexture.source = [ mockSource, secondSource ];

        Image(mockTexture, 1);

        expect(mockTexture.add.mock.calls[0][1]).toBe(1);
        expect(mockTexture.add.mock.calls[0][4]).toBe(512);
        expect(mockTexture.add.mock.calls[0][5]).toBe(64);
    });

    it('should call texture.add exactly once', function ()
    {
        Image(mockTexture, 0);

        expect(mockTexture.add).toHaveBeenCalledTimes(1);
    });

    it('should handle a source with width and height of zero', function ()
    {
        mockSource.width = 0;
        mockSource.height = 0;

        var result = Image(mockTexture, 0);

        expect(result).toBe(mockTexture);
        expect(mockTexture.add.mock.calls[0][4]).toBe(0);
        expect(mockTexture.add.mock.calls[0][5]).toBe(0);
    });

    it('should handle large texture dimensions', function ()
    {
        mockSource.width = 4096;
        mockSource.height = 4096;

        Image(mockTexture, 0);

        expect(mockTexture.add.mock.calls[0][4]).toBe(4096);
        expect(mockTexture.add.mock.calls[0][5]).toBe(4096);
    });

    it('should handle non-square textures', function ()
    {
        mockSource.width = 1024;
        mockSource.height = 32;

        Image(mockTexture, 0);

        expect(mockTexture.add.mock.calls[0][4]).toBe(1024);
        expect(mockTexture.add.mock.calls[0][5]).toBe(32);
    });
});
