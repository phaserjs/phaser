var AtlasXML = require('../../../src/textures/parsers/AtlasXML');

describe('Phaser.Textures.Parsers.AtlasXML', function ()
{
    var texture;
    var addedFrames;

    function makeMockTexture (sourceWidth, sourceHeight)
    {
        addedFrames = [];

        return {
            source: [
                { width: sourceWidth || 512, height: sourceHeight || 512 }
            ],
            add: function (name, sourceIndex, x, y, width, height)
            {
                var frame = {
                    name: name,
                    sourceIndex: sourceIndex,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    trimmed: false,
                    setTrim: function (w, h, fx, fy, fw, fh)
                    {
                        this.trimmed = true;
                        this.realWidth = w;
                        this.realHeight = h;
                        this.trimX = fx;
                        this.trimY = fy;
                        this.trimWidth = fw;
                        this.trimHeight = fh;
                    }
                };

                addedFrames.push(frame);

                return frame;
            }
        };
    }

    function makeAttr (value)
    {
        return { value: String(value) };
    }

    function makeMockXml (subTextures)
    {
        var elements = (subTextures || []).map(function (st)
        {
            var attrs = {
                name: makeAttr(st.name),
                x: makeAttr(st.x),
                y: makeAttr(st.y),
                width: makeAttr(st.width),
                height: makeAttr(st.height)
            };

            if (st.frameX !== undefined)
            {
                attrs.frameX = makeAttr(st.frameX);
                attrs.frameY = makeAttr(st.frameY);
                attrs.frameWidth = makeAttr(st.frameWidth);
                attrs.frameHeight = makeAttr(st.frameHeight);
            }

            return { attributes: attrs };
        });

        return {
            getElementsByTagName: function (tag)
            {
                if (tag === 'TextureAtlas')
                {
                    return [{}];
                }

                if (tag === 'SubTexture')
                {
                    return elements;
                }

                return [];
            }
        };
    }

    function makeMalformedXml ()
    {
        return {
            getElementsByTagName: function ()
            {
                return null;
            }
        };
    }

    beforeEach(function ()
    {
        texture = makeMockTexture(512, 256);
    });

    it('should return undefined for malformed XML without TextureAtlas element', function ()
    {
        var xml = makeMalformedXml();
        var result = AtlasXML(texture, 0, xml);

        expect(result).toBeUndefined();
    });

    it('should not add any frames for malformed XML', function ()
    {
        var xml = makeMalformedXml();
        AtlasXML(texture, 0, xml);

        expect(addedFrames.length).toBe(0);
    });

    it('should return the texture object on success', function ()
    {
        var xml = makeMockXml([]);
        var result = AtlasXML(texture, 0, xml);

        expect(result).toBe(texture);
    });

    it('should add a __BASE frame using the source dimensions', function ()
    {
        var xml = makeMockXml([]);
        AtlasXML(texture, 0, xml);

        var base = addedFrames[0];

        expect(base.name).toBe('__BASE');
        expect(base.x).toBe(0);
        expect(base.y).toBe(0);
        expect(base.width).toBe(512);
        expect(base.height).toBe(256);
    });

    it('should add __BASE with correct sourceIndex', function ()
    {
        texture = makeMockTexture(512, 512);
        texture.source.push({ width: 256, height: 128 });

        var xml = makeMockXml([]);
        AtlasXML(texture, 1, xml);

        var base = addedFrames[0];

        expect(base.sourceIndex).toBe(1);
        expect(base.width).toBe(256);
        expect(base.height).toBe(128);
    });

    it('should add a frame for each SubTexture element', function ()
    {
        var xml = makeMockXml([
            { name: 'frame1', x: 0, y: 0, width: 64, height: 64 },
            { name: 'frame2', x: 64, y: 0, width: 32, height: 32 },
            { name: 'frame3', x: 96, y: 0, width: 16, height: 16 }
        ]);

        AtlasXML(texture, 0, xml);

        // 1 for __BASE + 3 frames
        expect(addedFrames.length).toBe(4);
    });

    it('should parse frame name correctly', function ()
    {
        var xml = makeMockXml([
            { name: 'explosion_01', x: 0, y: 0, width: 64, height: 64 }
        ]);

        AtlasXML(texture, 0, xml);

        expect(addedFrames[1].name).toBe('explosion_01');
    });

    it('should parse frame x and y as integers', function ()
    {
        var xml = makeMockXml([
            { name: 'sprite', x: 128, y: 64, width: 32, height: 32 }
        ]);

        AtlasXML(texture, 0, xml);

        var frame = addedFrames[1];

        expect(frame.x).toBe(128);
        expect(frame.y).toBe(64);
    });

    it('should parse frame width and height as integers', function ()
    {
        var xml = makeMockXml([
            { name: 'sprite', x: 0, y: 0, width: 100, height: 200 }
        ]);

        AtlasXML(texture, 0, xml);

        var frame = addedFrames[1];

        expect(frame.width).toBe(100);
        expect(frame.height).toBe(200);
    });

    it('should not call setTrim when frameX attribute is absent', function ()
    {
        var xml = makeMockXml([
            { name: 'sprite', x: 0, y: 0, width: 64, height: 64 }
        ]);

        AtlasXML(texture, 0, xml);

        expect(addedFrames[1].trimmed).toBe(false);
    });

    it('should call setTrim when frameX attribute is present', function ()
    {
        var xml = makeMockXml([
            {
                name: 'trimmed_sprite',
                x: 10, y: 10, width: 50, height: 50,
                frameX: -5, frameY: -8,
                frameWidth: 60, frameHeight: 66
            }
        ]);

        AtlasXML(texture, 0, xml);

        expect(addedFrames[1].trimmed).toBe(true);
    });

    it('should pass correct values to setTrim', function ()
    {
        var xml = makeMockXml([
            {
                name: 'trimmed_sprite',
                x: 10, y: 10, width: 50, height: 50,
                frameX: -5, frameY: -8,
                frameWidth: 60, frameHeight: 66
            }
        ]);

        AtlasXML(texture, 0, xml);

        var frame = addedFrames[1];

        //  setTrim(actualWidth, actualHeight, destX, destY, destWidth, destHeight)
        //  - actualWidth / actualHeight  → the ORIGINAL (untrimmed) sprite size,
        //    stored as frame.realWidth / realHeight
        //  - destX / destY               → the trim offset within the source
        //  - destWidth / destHeight      → the TRIMMED (in-atlas) size that was
        //    packed into the texture, captured here as trimWidth / trimHeight
        expect(frame.realWidth).toBe(60);
        expect(frame.realHeight).toBe(66);
        expect(frame.trimX).toBe(5);
        expect(frame.trimY).toBe(8);
        expect(frame.trimWidth).toBe(50);
        expect(frame.trimHeight).toBe(50);
    });

    it('should use Math.abs for frameX and frameY values', function ()
    {
        var xml = makeMockXml([
            {
                name: 'sprite',
                x: 0, y: 0, width: 40, height: 40,
                frameX: -10, frameY: -20,
                frameWidth: 50, frameHeight: 60
            }
        ]);

        AtlasXML(texture, 0, xml);

        var frame = addedFrames[1];

        expect(frame.trimX).toBe(10);
        expect(frame.trimY).toBe(20);
    });

    it('should use Math.abs for positive frameX and frameY values too', function ()
    {
        var xml = makeMockXml([
            {
                name: 'sprite',
                x: 0, y: 0, width: 40, height: 40,
                frameX: 10, frameY: 20,
                frameWidth: 50, frameHeight: 60
            }
        ]);

        AtlasXML(texture, 0, xml);

        var frame = addedFrames[1];

        expect(frame.trimX).toBe(10);
        expect(frame.trimY).toBe(20);
    });

    it('should handle an atlas with no SubTexture elements', function ()
    {
        var xml = makeMockXml([]);
        var result = AtlasXML(texture, 0, xml);

        expect(result).toBe(texture);
        expect(addedFrames.length).toBe(1); // only __BASE
    });

    it('should handle string number values in attributes (parseInt)', function ()
    {
        var xml = makeMockXml([
            { name: 'frame', x: '7', y: '13', width: '32', height: '48' }
        ]);

        AtlasXML(texture, 0, xml);

        var frame = addedFrames[1];

        expect(frame.x).toBe(7);
        expect(frame.y).toBe(13);
        expect(frame.width).toBe(32);
        expect(frame.height).toBe(48);
    });

    it('should add each frame with the correct sourceIndex', function ()
    {
        var xml = makeMockXml([
            { name: 'a', x: 0, y: 0, width: 16, height: 16 },
            { name: 'b', x: 16, y: 0, width: 16, height: 16 }
        ]);

        AtlasXML(texture, 0, xml);

        expect(addedFrames[1].sourceIndex).toBe(0);
        expect(addedFrames[2].sourceIndex).toBe(0);
    });

    it('should process multiple trimmed frames independently', function ()
    {
        var xml = makeMockXml([
            {
                name: 'a', x: 0, y: 0, width: 30, height: 30,
                frameX: -2, frameY: -4, frameWidth: 34, frameHeight: 38
            },
            {
                name: 'b', x: 30, y: 0, width: 20, height: 20,
                frameX: -1, frameY: -3, frameWidth: 22, frameHeight: 26
            }
        ]);

        AtlasXML(texture, 0, xml);

        var frameA = addedFrames[1];
        var frameB = addedFrames[2];

        //  realWidth / realHeight are the ORIGINAL (untrimmed) sprite dimensions;
        //  trimWidth / trimHeight are the TRIMMED in-atlas dimensions (the 5th and
        //  6th arguments passed to setTrim).
        expect(frameA.realWidth).toBe(34);
        expect(frameA.realHeight).toBe(38);
        expect(frameA.trimX).toBe(2);
        expect(frameA.trimY).toBe(4);
        expect(frameA.trimWidth).toBe(30);
        expect(frameA.trimHeight).toBe(30);

        expect(frameB.realWidth).toBe(22);
        expect(frameB.realHeight).toBe(26);
        expect(frameB.trimX).toBe(1);
        expect(frameB.trimY).toBe(3);
        expect(frameB.trimWidth).toBe(20);
        expect(frameB.trimHeight).toBe(20);
    });
});
