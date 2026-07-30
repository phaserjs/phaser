var ParseFromAtlas = require('../../../src/gameobjects/bitmaptext/ParseFromAtlas');

function makeXmlNode (attrs)
{
    return {
        getAttribute: function (attr)
        {
            return attrs[attr] !== undefined ? String(attrs[attr]) : '0';
        }
    };
}

function makeMockXml (chars, kernings)
{
    if (chars === undefined) { chars = []; }
    if (kernings === undefined) { kernings = []; }

    return {
        getElementsByTagName: function (tagName)
        {
            if (tagName === 'info')
            {
                return [ makeXmlNode({ face: 'TestFont', size: 32 }) ];
            }
            else if (tagName === 'common')
            {
                return [ makeXmlNode({ lineHeight: 36 }) ];
            }
            else if (tagName === 'char')
            {
                return chars;
            }
            else if (tagName === 'kerning')
            {
                return kernings;
            }

            return [];
        }
    };
}

function makeMockFrame ()
{
    return {
        cutX: 0,
        cutY: 0,
        source: { width: 512, height: 256 },
        sourceIndex: 0,
        trimmed: false,
        data: {
            cut: { x: 0, y: 0 }
        }
    };
}

describe('ParseFromAtlas', function ()
{
    var scene;
    var mockFrame;
    var mockXml;
    var mockTexture;
    var addedFontData;

    beforeEach(function ()
    {
        mockFrame = makeMockFrame();
        mockXml = makeMockXml();
        addedFontData = null;

        mockTexture = {
            get: vi.fn(function () { return mockFrame; }),
            add: vi.fn()
        };

        scene = {
            sys: {
                textures: {
                    get: vi.fn(function () { return mockTexture; })
                },
                cache: {
                    xml: {
                        get: vi.fn(function () { return mockXml; })
                    },
                    bitmapFont: {
                        add: vi.fn(function (key, data)
                        {
                            addedFontData = { key: key, data: data };
                        })
                    }
                }
            }
        };
    });

    afterEach(function ()
    {
        vi.clearAllMocks();
    });

    it('should return true when frame and xml are both found', function ()
    {
        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(result).toBe(true);
    });

    it('should return false when frame is null', function ()
    {
        mockTexture.get.mockReturnValue(null);

        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(result).toBe(false);
    });

    it('should return false when xml is null', function ()
    {
        scene.sys.cache.xml.get.mockReturnValue(null);

        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(result).toBe(false);
    });

    it('should return false when frame is undefined', function ()
    {
        mockTexture.get.mockReturnValue(undefined);

        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(result).toBe(false);
    });

    it('should return false when xml is undefined', function ()
    {
        scene.sys.cache.xml.get.mockReturnValue(undefined);

        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(result).toBe(false);
    });

    it('should return false when both frame and xml are missing', function ()
    {
        mockTexture.get.mockReturnValue(null);
        scene.sys.cache.xml.get.mockReturnValue(null);

        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(result).toBe(false);
    });

    it('should call scene.sys.textures.get with the textureKey', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(scene.sys.textures.get).toHaveBeenCalledWith('textureKey');
    });

    it('should call texture.get with the frameKey', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(mockTexture.get).toHaveBeenCalledWith('frameKey');
    });

    it('should call scene.sys.cache.xml.get with the xmlKey', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(scene.sys.cache.xml.get).toHaveBeenCalledWith('xmlKey');
    });

    it('should add parsed data to the bitmapFont cache using the fontName as key', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(scene.sys.cache.bitmapFont.add).toHaveBeenCalledOnce();
        expect(addedFontData.key).toBe('myFont');
    });

    it('should set fromAtlas to true in the cached data', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(addedFontData.data.fromAtlas).toBe(true);
    });

    it('should store the textureKey in the cached entry', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'atlasTexture', 'spriteFrame', 'xmlKey');

        expect(addedFontData.data.texture).toBe('atlasTexture');
    });

    it('should store the frameKey in the cached entry', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'atlasTexture', 'spriteFrame', 'xmlKey');

        expect(addedFontData.data.frame).toBe('spriteFrame');
    });

    it('should include a data property in the cached entry', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(addedFontData.data.data).toBeDefined();
    });

    it('should not call bitmapFont.add when frame is missing', function ()
    {
        mockTexture.get.mockReturnValue(null);

        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(scene.sys.cache.bitmapFont.add).not.toHaveBeenCalled();
    });

    it('should not call bitmapFont.add when xml is missing', function ()
    {
        scene.sys.cache.xml.get.mockReturnValue(null);

        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(scene.sys.cache.bitmapFont.add).not.toHaveBeenCalled();
    });

    it('should parse font data including lineHeight from xml', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(addedFontData.data.data.lineHeight).toBe(36);
    });

    it('should apply ySpacing to lineHeight', function ()
    {
        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey', 0, 10);

        expect(addedFontData.data.data.lineHeight).toBe(46);
    });

    it('should parse char data from xml', function ()
    {
        var charNode = makeXmlNode({ id: 65, x: 10, y: 20, width: 16, height: 20, xoffset: 1, yoffset: 2, xadvance: 18 });
        mockXml = makeMockXml([ charNode ]);
        scene.sys.cache.xml.get.mockReturnValue(mockXml);

        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        var chars = addedFontData.data.data.chars;
        expect(chars[65]).toBeDefined();
        expect(chars[65].width).toBe(16);
        expect(chars[65].height).toBe(20);
    });

    it('should apply xSpacing to xAdvance of each character', function ()
    {
        var charNode = makeXmlNode({ id: 65, x: 0, y: 0, width: 16, height: 20, xoffset: 0, yoffset: 0, xadvance: 18 });
        mockXml = makeMockXml([ charNode ]);
        scene.sys.cache.xml.get.mockReturnValue(mockXml);

        ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey', 5, 0);

        var chars = addedFontData.data.data.chars;
        expect(chars[65].xAdvance).toBe(23);
    });

    it('should handle empty char list without error', function ()
    {
        mockXml = makeMockXml([]);
        scene.sys.cache.xml.get.mockReturnValue(mockXml);

        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(result).toBe(true);
        expect(addedFontData.data.data.chars).toEqual({});
    });

    it('should return a boolean true (not truthy) on success', function ()
    {
        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(typeof result).toBe('boolean');
        expect(result).toBe(true);
    });

    it('should return a boolean false (not falsy) on failure', function ()
    {
        mockTexture.get.mockReturnValue(null);

        var result = ParseFromAtlas(scene, 'myFont', 'textureKey', 'frameKey', 'xmlKey');

        expect(typeof result).toBe('boolean');
        expect(result).toBe(false);
    });
});
