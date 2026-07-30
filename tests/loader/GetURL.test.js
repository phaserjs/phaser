var GetURL = require('../../src/loader/GetURL');

describe('Phaser.Loader.GetURL', function ()
{
    it('should return false when file has no url', function ()
    {
        var file = { url: '' };
        expect(GetURL(file, 'http://example.com/')).toBe(false);
    });

    it('should return false when file url is null', function ()
    {
        var file = { url: null };
        expect(GetURL(file, 'http://example.com/')).toBe(false);
    });

    it('should return false when file url is undefined', function ()
    {
        var file = { url: undefined };
        expect(GetURL(file, 'http://example.com/')).toBe(false);
    });

    it('should return the url as-is when it starts with http://', function ()
    {
        var file = { url: 'http://cdn.example.com/asset.png' };
        expect(GetURL(file, 'http://example.com/')).toBe('http://cdn.example.com/asset.png');
    });

    it('should return the url as-is when it starts with https://', function ()
    {
        var file = { url: 'https://cdn.example.com/asset.png' };
        expect(GetURL(file, 'http://example.com/')).toBe('https://cdn.example.com/asset.png');
    });

    it('should return the url as-is when it starts with //', function ()
    {
        var file = { url: '//cdn.example.com/asset.png' };
        expect(GetURL(file, 'http://example.com/')).toBe('//cdn.example.com/asset.png');
    });

    it('should return the url as-is when it starts with blob:', function ()
    {
        var file = { url: 'blob:http://example.com/some-blob-id' };
        expect(GetURL(file, 'http://example.com/')).toBe('blob:http://example.com/some-blob-id');
    });

    it('should return the url as-is when it starts with data:', function ()
    {
        var file = { url: 'data:image/png;base64,abc123' };
        expect(GetURL(file, 'http://example.com/')).toBe('data:image/png;base64,abc123');
    });

    it('should return the url as-is when it starts with capacitor://', function ()
    {
        var file = { url: 'capacitor://localhost/assets/image.png' };
        expect(GetURL(file, 'http://example.com/')).toBe('capacitor://localhost/assets/image.png');
    });

    it('should return the url as-is when it starts with file://', function ()
    {
        var file = { url: 'file:///path/to/asset.png' };
        expect(GetURL(file, 'http://example.com/')).toBe('file:///path/to/asset.png');
    });

    it('should prepend baseURL when url is relative', function ()
    {
        var file = { url: 'assets/image.png' };
        expect(GetURL(file, 'http://example.com/')).toBe('http://example.com/assets/image.png');
    });

    it('should prepend baseURL when url starts with a filename', function ()
    {
        var file = { url: 'image.png' };
        expect(GetURL(file, 'http://example.com/game/')).toBe('http://example.com/game/image.png');
    });

    it('should prepend baseURL when url starts with a subdirectory', function ()
    {
        var file = { url: 'sounds/sfx/explosion.mp3' };
        expect(GetURL(file, 'http://example.com/')).toBe('http://example.com/sounds/sfx/explosion.mp3');
    });

    it('should work with an empty baseURL and a relative url', function ()
    {
        var file = { url: 'assets/image.png' };
        expect(GetURL(file, '')).toBe('assets/image.png');
    });

    it('should concatenate baseURL and url without modification', function ()
    {
        var file = { url: 'sprite.json' };
        expect(GetURL(file, 'assets/')).toBe('assets/sprite.json');
    });
});
