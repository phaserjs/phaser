var Frame = require('../../src/textures/Frame');

function createMockTexture (sourceWidth, sourceHeight)
{
    if (sourceWidth === undefined) { sourceWidth = 512; }
    if (sourceHeight === undefined) { sourceHeight = 512; }

    return {
        source: [
            { width: sourceWidth, height: sourceHeight, glTexture: null }
        ]
    };
}

function createFrame (x, y, width, height, sourceWidth, sourceHeight)
{
    if (x === undefined) { x = 0; }
    if (y === undefined) { y = 0; }
    if (width === undefined) { width = 100; }
    if (height === undefined) { height = 100; }

    var texture = createMockTexture(sourceWidth, sourceHeight);

    return new Frame(texture, 'test', 0, x, y, width, height);
}

describe('Frame', function ()
{
    describe('constructor', function ()
    {
        it('should store a reference to the texture', function ()
        {
            var texture = createMockTexture();
            var frame = new Frame(texture, 'myFrame', 0, 0, 0, 100, 100);

            expect(frame.texture).toBe(texture);
        });

        it('should store the frame name', function ()
        {
            var frame = createFrame();

            expect(frame.name).toBe('test');
        });

        it('should store the source from the texture sources array', function ()
        {
            var texture = createMockTexture(256, 256);
            var frame = new Frame(texture, 'myFrame', 0, 0, 0, 100, 100);

            expect(frame.source).toBe(texture.source[0]);
        });

        it('should store the sourceIndex', function ()
        {
            var texture = { source: [{ width: 100, height: 100 }, { width: 200, height: 200 }] };
            var frame = new Frame(texture, 'myFrame', 1, 0, 0, 50, 50);

            expect(frame.sourceIndex).toBe(1);
            expect(frame.source).toBe(texture.source[1]);
        });

        it('should set default x and y to 0', function ()
        {
            var frame = createFrame(0, 0, 100, 100);

            expect(frame.x).toBe(0);
            expect(frame.y).toBe(0);
        });

        it('should set width and height', function ()
        {
            var frame = createFrame(0, 0, 200, 150);

            expect(frame.width).toBe(200);
            expect(frame.height).toBe(150);
        });

        it('should calculate halfWidth and halfHeight', function ()
        {
            var frame = createFrame(0, 0, 100, 100);

            expect(frame.halfWidth).toBe(50);
            expect(frame.halfHeight).toBe(50);
        });

        it('should floor halfWidth and halfHeight for odd dimensions', function ()
        {
            var frame = createFrame(0, 0, 101, 99);

            expect(frame.halfWidth).toBe(50);
            expect(frame.halfHeight).toBe(49);
        });

        it('should calculate centerX and centerY', function ()
        {
            var frame = createFrame(0, 0, 100, 100);

            expect(frame.centerX).toBe(50);
            expect(frame.centerY).toBe(50);
        });

        it('should floor centerX and centerY for odd dimensions', function ()
        {
            var frame = createFrame(0, 0, 101, 99);

            expect(frame.centerX).toBe(50);
            expect(frame.centerY).toBe(49);
        });

        it('should default pivotX and pivotY to 0', function ()
        {
            var frame = createFrame();

            expect(frame.pivotX).toBe(0);
            expect(frame.pivotY).toBe(0);
        });

        it('should default customPivot to false', function ()
        {
            var frame = createFrame();

            expect(frame.customPivot).toBe(false);
        });

        it('should default rotated to false', function ()
        {
            var frame = createFrame();

            expect(frame.rotated).toBe(false);
        });

        it('should default autoRound to -1', function ()
        {
            var frame = createFrame();

            expect(frame.autoRound).toBe(-1);
        });

        it('should initialise customData as empty object', function ()
        {
            var frame = createFrame();

            expect(frame.customData).toEqual({});
        });

        it('should initialise UV values to calculated values based on size', function ()
        {
            //  100x100 frame in 100x100 source at 0,0
            var frame = createFrame(0, 0, 100, 100, 100, 100);

            expect(frame.u0).toBe(0);
            expect(frame.v0).toBe(1);
            expect(frame.u1).toBe(1);
            expect(frame.v1).toBe(0);
        });

        it('should set data.trim to false', function ()
        {
            var frame = createFrame();

            expect(frame.data.trim).toBe(false);
        });

        it('should populate data.cut correctly', function ()
        {
            var frame = createFrame(10, 20, 100, 80);
            var cut = frame.data.cut;

            expect(cut.x).toBe(10);
            expect(cut.y).toBe(20);
            expect(cut.w).toBe(100);
            expect(cut.h).toBe(80);
            expect(cut.r).toBe(110);
            expect(cut.b).toBe(100);
        });

        it('should populate data.sourceSize correctly', function ()
        {
            var frame = createFrame(0, 0, 200, 150);

            expect(frame.data.sourceSize.w).toBe(200);
            expect(frame.data.sourceSize.h).toBe(150);
        });

        it('should populate data.spriteSourceSize correctly', function ()
        {
            var frame = createFrame(0, 0, 200, 150);
            var ss = frame.data.spriteSourceSize;

            expect(ss.w).toBe(200);
            expect(ss.h).toBe(150);
        });

        it('should calculate data.radius correctly', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            var expected = 0.5 * Math.sqrt(100 * 100 + 100 * 100);

            expect(frame.data.radius).toBeCloseTo(expected);
        });

        it('should populate data.drawImage correctly', function ()
        {
            var frame = createFrame(10, 20, 100, 80);
            var di = frame.data.drawImage;

            expect(di.x).toBe(10);
            expect(di.y).toBe(20);
            expect(di.width).toBe(100);
            expect(di.height).toBe(80);
        });

        it('should default data.scale9 to false', function ()
        {
            var frame = createFrame();

            expect(frame.data.scale9).toBe(false);
        });

        it('should default data.is3Slice to false', function ()
        {
            var frame = createFrame();

            expect(frame.data.is3Slice).toBe(false);
        });
    });

    describe('setCutPosition', function ()
    {
        it('should set cutX and cutY', function ()
        {
            var frame = createFrame();
            frame.setCutPosition(50, 75);

            expect(frame.cutX).toBe(50);
            expect(frame.cutY).toBe(75);
        });

        it('should default x and y to 0 if not provided', function ()
        {
            var frame = createFrame();
            frame.setCutPosition();

            expect(frame.cutX).toBe(0);
            expect(frame.cutY).toBe(0);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame();
            var result = frame.setCutPosition(10, 10);

            expect(result).toBe(frame);
        });

        it('should update UV coordinates after setting position', function ()
        {
            var frame = createFrame(0, 0, 50, 50, 100, 100);
            frame.setCutPosition(25, 25);

            expect(frame.u0).toBe(0.25);
            expect(frame.v0).toBeCloseTo(0.75);
        });
    });

    describe('setCutSize', function ()
    {
        it('should set cutWidth and cutHeight', function ()
        {
            var frame = createFrame();
            frame.setCutSize(200, 150);

            expect(frame.cutWidth).toBe(200);
            expect(frame.cutHeight).toBe(150);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame();
            var result = frame.setCutSize(100, 100);

            expect(result).toBe(frame);
        });

        it('should update UV coordinates after setting size', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            frame.setCutSize(50, 50);

            expect(frame.u1).toBeCloseTo(0.5);
            expect(frame.v1).toBeCloseTo(0.5);
        });
    });

    describe('setSize', function ()
    {
        it('should set width and height', function ()
        {
            var frame = createFrame();
            frame.setSize(200, 150);

            expect(frame.width).toBe(200);
            expect(frame.height).toBe(150);
        });

        it('should default x and y to 0 if not provided', function ()
        {
            var frame = createFrame();
            frame.setSize(100, 100);

            expect(frame.cutX).toBe(0);
            expect(frame.cutY).toBe(0);
        });

        it('should set x and y position when provided', function ()
        {
            var frame = createFrame();
            frame.setSize(100, 100, 10, 20);

            expect(frame.cutX).toBe(10);
            expect(frame.cutY).toBe(20);
        });

        it('should set halfWidth and halfHeight', function ()
        {
            var frame = createFrame();
            frame.setSize(60, 40);

            expect(frame.halfWidth).toBe(30);
            expect(frame.halfHeight).toBe(20);
        });

        it('should floor halfWidth and halfHeight', function ()
        {
            var frame = createFrame();
            frame.setSize(55, 45);

            expect(frame.halfWidth).toBe(Math.floor(55 * 0.5));
            expect(frame.halfHeight).toBe(Math.floor(45 * 0.5));
        });

        it('should set centerX and centerY', function ()
        {
            var frame = createFrame();
            frame.setSize(80, 60);

            expect(frame.centerX).toBe(40);
            expect(frame.centerY).toBe(30);
        });

        it('should update data.cut', function ()
        {
            var frame = createFrame();
            frame.setSize(100, 80, 5, 10);

            expect(frame.data.cut.x).toBe(5);
            expect(frame.data.cut.y).toBe(10);
            expect(frame.data.cut.w).toBe(100);
            expect(frame.data.cut.h).toBe(80);
            expect(frame.data.cut.r).toBe(105);
            expect(frame.data.cut.b).toBe(90);
        });

        it('should update data.sourceSize', function ()
        {
            var frame = createFrame();
            frame.setSize(300, 200);

            expect(frame.data.sourceSize.w).toBe(300);
            expect(frame.data.sourceSize.h).toBe(200);
        });

        it('should update data.spriteSourceSize', function ()
        {
            var frame = createFrame();
            frame.setSize(300, 200);

            expect(frame.data.spriteSourceSize.w).toBe(300);
            expect(frame.data.spriteSourceSize.h).toBe(200);
        });

        it('should update data.radius', function ()
        {
            var frame = createFrame();
            frame.setSize(60, 80);
            var expected = 0.5 * Math.sqrt(60 * 60 + 80 * 80);

            expect(frame.data.radius).toBeCloseTo(expected);
        });

        it('should update data.drawImage', function ()
        {
            var frame = createFrame();
            frame.setSize(100, 80, 5, 10);

            expect(frame.data.drawImage.x).toBe(5);
            expect(frame.data.drawImage.y).toBe(10);
            expect(frame.data.drawImage.width).toBe(100);
            expect(frame.data.drawImage.height).toBe(80);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame();
            var result = frame.setSize(100, 100);

            expect(result).toBe(frame);
        });
    });

    describe('setTrim', function ()
    {
        it('should set data.trim to true', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 10, 10, 100, 100);

            expect(frame.data.trim).toBe(true);
        });

        it('should set data.sourceSize to actualWidth and actualHeight', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 96, 10, 10, 100, 80);

            expect(frame.data.sourceSize.w).toBe(128);
            expect(frame.data.sourceSize.h).toBe(96);
        });

        it('should set spriteSourceSize values', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 10, 20, 80, 60);
            var ss = frame.data.spriteSourceSize;

            expect(ss.x).toBe(10);
            expect(ss.y).toBe(20);
            expect(ss.w).toBe(80);
            expect(ss.h).toBe(60);
            expect(ss.r).toBe(90);
            expect(ss.b).toBe(80);
        });

        it('should update x and y to destX and destY', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 15, 25, 80, 60);

            expect(frame.x).toBe(15);
            expect(frame.y).toBe(25);
        });

        it('should update width and height to destWidth and destHeight', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 0, 0, 80, 60);

            expect(frame.width).toBe(80);
            expect(frame.height).toBe(60);
        });

        it('should update halfWidth and halfHeight', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 0, 0, 80, 60);

            expect(frame.halfWidth).toBe(40);
            expect(frame.halfHeight).toBe(30);
        });

        it('should update centerX and centerY', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 0, 0, 80, 60);

            expect(frame.centerX).toBe(40);
            expect(frame.centerY).toBe(30);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            var result = frame.setTrim(128, 128, 0, 0, 80, 60);

            expect(result).toBe(frame);
        });

        it('should expose trimmed as true after calling setTrim', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 0, 0, 80, 60);

            expect(frame.trimmed).toBe(true);
        });
    });

    describe('setScale9', function ()
    {
        it('should set data.scale9 to true', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setScale9(10, 10, 80, 80);

            expect(frame.data.scale9).toBe(true);
        });

        it('should store scale9Borders', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setScale9(10, 20, 80, 60);

            expect(frame.data.scale9Borders.x).toBe(10);
            expect(frame.data.scale9Borders.y).toBe(20);
            expect(frame.data.scale9Borders.w).toBe(80);
            expect(frame.data.scale9Borders.h).toBe(60);
        });

        it('should set is3Slice to true when y is 0 and height equals frame height', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setScale9(10, 0, 80, 100);

            expect(frame.data.is3Slice).toBe(true);
        });

        it('should set is3Slice to false when y is not 0', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setScale9(10, 10, 80, 80);

            expect(frame.data.is3Slice).toBe(false);
        });

        it('should set is3Slice to false when height does not equal frame height', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setScale9(10, 0, 80, 50);

            expect(frame.data.is3Slice).toBe(false);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            var result = frame.setScale9(10, 10, 80, 80);

            expect(result).toBe(frame);
        });

        it('should expose scale9 as true via getter', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setScale9(10, 10, 80, 80);

            expect(frame.scale9).toBe(true);
        });

        it('should expose is3Slice correctly via getter', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setScale9(10, 0, 80, 100);

            expect(frame.is3Slice).toBe(true);
        });
    });

    describe('setUVs', function ()
    {
        it('should set u0, v0, u1, v1', function ()
        {
            var frame = createFrame();
            frame.setUVs(100, 100, 0.1, 0.9, 0.5, 0.5);

            expect(frame.u0).toBe(0.1);
            expect(frame.v0).toBe(0.9);
            expect(frame.u1).toBe(0.5);
            expect(frame.v1).toBe(0.5);
        });

        it('should update drawImage width and height', function ()
        {
            var frame = createFrame();
            frame.setUVs(200, 150, 0, 1, 1, 0);

            expect(frame.data.drawImage.width).toBe(200);
            expect(frame.data.drawImage.height).toBe(150);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame();
            var result = frame.setUVs(100, 100, 0, 1, 1, 0);

            expect(result).toBe(frame);
        });
    });

    describe('updateUVs', function ()
    {
        it('should calculate correct UV values for a full-frame source', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);

            expect(frame.u0).toBe(0);
            expect(frame.v0).toBe(1);
            expect(frame.u1).toBe(1);
            expect(frame.v1).toBe(0);
        });

        it('should calculate correct UV values for a sub-region', function ()
        {
            //  Frame at (25,25) size 50x50 in 100x100 source
            var frame = createFrame(25, 25, 50, 50, 100, 100);

            expect(frame.u0).toBe(0.25);
            expect(frame.v0).toBe(0.75);
            expect(frame.u1).toBe(0.75);
            expect(frame.v1).toBe(0.25);
        });

        it('should update drawImage dimensions', function ()
        {
            var frame = createFrame(0, 0, 100, 100);

            expect(frame.data.drawImage.width).toBe(100);
            expect(frame.data.drawImage.height).toBe(100);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame();
            var result = frame.updateUVs();

            expect(result).toBe(frame);
        });
    });

    describe('updateUVsInverted', function ()
    {
        it('should swap width and height axes in UV calculation', function ()
        {
            //  Frame at (0,0) cutWidth=50, cutHeight=25 in 100x100 source
            var frame = createFrame(0, 0, 50, 25, 100, 100);

            frame.updateUVsInverted();

            //  u0 = (cutX + cutHeight) / tw = (0 + 25) / 100 = 0.25
            //  v0 = 1 - cutY / th = 1 - 0/100 = 1
            //  u1 = cutX / tw = 0
            //  v1 = 1 - (cutY + cutWidth) / th = 1 - 50/100 = 0.5

            expect(frame.u0).toBe(0.25);
            expect(frame.v0).toBe(1);
            expect(frame.u1).toBe(0);
            expect(frame.v1).toBe(0.5);
        });

        it('should return the Frame object', function ()
        {
            var frame = createFrame();
            var result = frame.updateUVsInverted();

            expect(result).toBe(frame);
        });

        it('should produce different u0 value than updateUVs for non-square regions', function ()
        {
            //  Frame at (0,0) cutWidth=80, cutHeight=40 — after updateUVsInverted:
            //  u0 = (cutX + cutHeight) / tw = (0 + 40) / 100 = 0.4
            //  whereas updateUVs gives u0 = cutX / tw = 0
            var frame = createFrame(0, 0, 80, 40, 100, 100);

            var u0Normal = frame.u0;

            frame.updateUVsInverted();

            expect(frame.u0).not.toBe(u0Normal);
        });
    });

    describe('setCropUVs', function ()
    {
        it('should set crop x, y, width, height', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 10, 10, 50, 50, false, false);

            expect(crop.x).toBe(10);
            expect(crop.y).toBe(10);
            expect(crop.width).toBe(50);
            expect(crop.height).toBe(50);
        });

        it('should clamp x to 0', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, -10, 0, 50, 50, false, false);

            expect(crop.x).toBe(0);
        });

        it('should clamp y to 0', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 0, -10, 50, 50, false, false);

            expect(crop.y).toBe(0);
        });

        it('should clamp width so it does not exceed frame', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 50, 0, 200, 50, false, false);

            expect(crop.width).toBe(50);
        });

        it('should clamp height so it does not exceed frame', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 0, 50, 50, 200, false, false);

            expect(crop.height).toBe(50);
        });

        it('should calculate UV coordinates for a simple crop (no flip)', function ()
        {
            //  Frame fills the entire 100x100 source texture
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 25, 25, 50, 50, false, false);

            expect(crop.u0).toBeCloseTo(0.25);
            expect(crop.v0).toBeCloseTo(0.75);
            expect(crop.u1).toBeCloseTo(0.75);
            expect(crop.v1).toBeCloseTo(0.25);
        });

        it('should handle flipX by mirroring the crop origin', function ()
        {
            //  Frame at cx=0, cw=100, crop x=25, width=50 → flipX ox = 0 + (100 - 25 - 50) = 25
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };
            var cropNoFlip = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 25, 0, 50, 100, true, false);
            frame.setCropUVs(cropNoFlip, 25, 0, 50, 100, false, false);

            //  Both should have same u0 in this symmetric case
            expect(crop.u0).toBeCloseTo(cropNoFlip.u0);
        });

        it('should handle flipY by mirroring the crop origin', function ()
        {
            //  Use an asymmetric crop to ensure flipY changes the result.
            //  No flip:  oy = cy + y = 0 + 10 = 10  → v0 = 1 - 10/100 = 0.9
            //  flipY:    oy = cy + (ch - y - height) = 0 + (100 - 10 - 50) = 40 → v0 = 1 - 40/100 = 0.6
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };
            var cropNoFlip = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 0, 10, 100, 50, false, true);
            frame.setCropUVs(cropNoFlip, 0, 10, 100, 50, false, false);

            //  flipY should change the v0/v1 values
            expect(crop.v0).not.toBe(cropNoFlip.v0);
        });

        it('should store flipX and flipY in the crop object', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            frame.setCropUVs(crop, 0, 0, 50, 50, true, false);

            expect(crop.flipX).toBe(true);
            expect(crop.flipY).toBe(false);
        });

        it('should return the crop object', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 0, height: 0 };

            var result = frame.setCropUVs(crop, 0, 0, 50, 50, false, false);

            expect(result).toBe(crop);
        });

        it('should zero out UV when crop does not intersect trimmed region', function ()
        {
            var frame = createFrame(0, 0, 50, 50, 100, 100);
            //  Trim so the sprite only occupies a small region
            frame.setTrim(100, 100, 60, 60, 30, 30);

            var crop = { x: 0, y: 0, width: 0, height: 0 };
            //  Crop in the area before the trimmed region starts (0,0 to 20x20)
            frame.setCropUVs(crop, 0, 0, 20, 20, false, false);

            expect(crop.cw).toBe(0);
            expect(crop.ch).toBe(0);
        });

        it('should calculate UV for intersecting region when trimmed', function ()
        {
            var frame = createFrame(0, 0, 50, 50, 100, 100);
            //  Trim: real size 100x100, sprite starts at destX=10, destY=10, 50x50
            frame.setTrim(100, 100, 10, 10, 50, 50);

            var crop = { x: 0, y: 0, width: 0, height: 0 };
            //  Crop that overlaps the trimmed area
            frame.setCropUVs(crop, 0, 0, 100, 100, false, false);

            expect(crop.cw).toBeGreaterThan(0);
            expect(crop.ch).toBeGreaterThan(0);
        });
    });

    describe('updateCropUVs', function ()
    {
        it('should call setCropUVs with the crop object dimensions', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 10, y: 20, width: 40, height: 30, u0: 0, v0: 0, u1: 0, v1: 0 };

            var result = frame.updateCropUVs(crop, false, false);

            expect(result).toBe(crop);
            expect(crop.u0).toBeCloseTo(0.1);
        });

        it('should return the updated crop object', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop = { x: 0, y: 0, width: 50, height: 50 };

            var result = frame.updateCropUVs(crop, false, false);

            expect(result).toBe(crop);
        });

        it('should produce the same result as setCropUVs with crop x/y/width/height', function ()
        {
            var frame = createFrame(0, 0, 100, 100, 100, 100);
            var crop1 = { x: 15, y: 25, width: 40, height: 30 };
            var crop2 = { x: 15, y: 25, width: 40, height: 30 };

            frame.updateCropUVs(crop1, false, false);
            frame.setCropUVs(crop2, 15, 25, 40, 30, false, false);

            expect(crop1.u0).toBeCloseTo(crop2.u0);
            expect(crop1.v0).toBeCloseTo(crop2.v0);
            expect(crop1.u1).toBeCloseTo(crop2.u1);
            expect(crop1.v1).toBeCloseTo(crop2.v1);
        });
    });

    describe('clone', function ()
    {
        it('should return a new Frame instance', function ()
        {
            var frame = createFrame(10, 20, 100, 80);
            var clone = frame.clone();

            expect(clone).not.toBe(frame);
            expect(clone instanceof Frame).toBe(true);
        });

        it('should copy cutX, cutY, cutWidth, cutHeight', function ()
        {
            var frame = createFrame(10, 20, 100, 80);
            var clone = frame.clone();

            expect(clone.cutX).toBe(frame.cutX);
            expect(clone.cutY).toBe(frame.cutY);
            expect(clone.cutWidth).toBe(frame.cutWidth);
            expect(clone.cutHeight).toBe(frame.cutHeight);
        });

        it('should copy x and y', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 5, 10, 100, 100);
            var clone = frame.clone();

            expect(clone.x).toBe(frame.x);
            expect(clone.y).toBe(frame.y);
        });

        it('should copy width and height', function ()
        {
            var frame = createFrame(0, 0, 100, 80);
            var clone = frame.clone();

            expect(clone.width).toBe(100);
            expect(clone.height).toBe(80);
        });

        it('should copy halfWidth and halfHeight', function ()
        {
            var frame = createFrame(0, 0, 100, 80);
            var clone = frame.clone();

            expect(clone.halfWidth).toBe(frame.halfWidth);
            expect(clone.halfHeight).toBe(frame.halfHeight);
        });

        it('should copy centerX and centerY', function ()
        {
            var frame = createFrame(0, 0, 100, 80);
            var clone = frame.clone();

            expect(clone.centerX).toBe(frame.centerX);
            expect(clone.centerY).toBe(frame.centerY);
        });

        it('should copy rotated flag', function ()
        {
            var frame = createFrame();
            frame.rotated = true;
            var clone = frame.clone();

            expect(clone.rotated).toBe(true);
        });

        it('should deep-copy the data object', function ()
        {
            var frame = createFrame(0, 0, 100, 100);
            frame.setTrim(128, 128, 5, 10, 100, 100);
            var clone = frame.clone();

            expect(clone.data).not.toBe(frame.data);
            expect(clone.data.trim).toBe(frame.data.trim);
            expect(clone.data.sourceSize.w).toBe(frame.data.sourceSize.w);
        });

        it('should share the same texture reference', function ()
        {
            var frame = createFrame();
            var clone = frame.clone();

            expect(clone.texture).toBe(frame.texture);
        });

        it('should have the same UV values', function ()
        {
            var frame = createFrame(25, 25, 50, 50, 100, 100);
            var clone = frame.clone();

            expect(clone.u0).toBe(frame.u0);
            expect(clone.v0).toBe(frame.v0);
            expect(clone.u1).toBe(frame.u1);
            expect(clone.v1).toBe(frame.v1);
        });
    });

    describe('destroy', function ()
    {
        it('should set texture to null', function ()
        {
            var frame = createFrame();
            frame.destroy();

            expect(frame.texture).toBeNull();
        });

        it('should set source to null', function ()
        {
            var frame = createFrame();
            frame.destroy();

            expect(frame.source).toBeNull();
        });

        it('should set customData to null', function ()
        {
            var frame = createFrame();
            frame.destroy();

            expect(frame.customData).toBeNull();
        });

        it('should set data to null', function ()
        {
            var frame = createFrame();
            frame.destroy();

            expect(frame.data).toBeNull();
        });
    });

    describe('getters', function ()
    {
        describe('realWidth', function ()
        {
            it('should return data.sourceSize.w', function ()
            {
                var frame = createFrame(0, 0, 100, 80);

                expect(frame.realWidth).toBe(100);
            });

            it('should return actualWidth after setTrim', function ()
            {
                var frame = createFrame(0, 0, 100, 100);
                frame.setTrim(200, 150, 0, 0, 100, 100);

                expect(frame.realWidth).toBe(200);
            });
        });

        describe('realHeight', function ()
        {
            it('should return data.sourceSize.h', function ()
            {
                var frame = createFrame(0, 0, 100, 80);

                expect(frame.realHeight).toBe(80);
            });

            it('should return actualHeight after setTrim', function ()
            {
                var frame = createFrame(0, 0, 100, 100);
                frame.setTrim(200, 150, 0, 0, 100, 100);

                expect(frame.realHeight).toBe(150);
            });
        });

        describe('radius', function ()
        {
            it('should return the computed radius value', function ()
            {
                var frame = createFrame(0, 0, 60, 80);
                var expected = 0.5 * Math.sqrt(60 * 60 + 80 * 80);

                expect(frame.radius).toBeCloseTo(expected);
            });
        });

        describe('trimmed', function ()
        {
            it('should return false by default', function ()
            {
                var frame = createFrame();

                expect(frame.trimmed).toBe(false);
            });

            it('should return true after setTrim', function ()
            {
                var frame = createFrame(0, 0, 100, 100);
                frame.setTrim(128, 128, 0, 0, 100, 100);

                expect(frame.trimmed).toBe(true);
            });
        });

        describe('scale9', function ()
        {
            it('should return false by default', function ()
            {
                var frame = createFrame();

                expect(frame.scale9).toBe(false);
            });

            it('should return true after setScale9', function ()
            {
                var frame = createFrame(0, 0, 100, 100);
                frame.setScale9(10, 10, 80, 80);

                expect(frame.scale9).toBe(true);
            });
        });

        describe('is3Slice', function ()
        {
            it('should return false by default', function ()
            {
                var frame = createFrame();

                expect(frame.is3Slice).toBe(false);
            });

            it('should return true for a 3-slice setup', function ()
            {
                var frame = createFrame(0, 0, 100, 100);
                frame.setScale9(10, 0, 80, 100);

                expect(frame.is3Slice).toBe(true);
            });
        });

        describe('canvasData', function ()
        {
            it('should return data.drawImage', function ()
            {
                var frame = createFrame(5, 10, 100, 80);

                expect(frame.canvasData).toBe(frame.data.drawImage);
                expect(frame.canvasData.x).toBe(5);
                expect(frame.canvasData.y).toBe(10);
                expect(frame.canvasData.width).toBe(100);
                expect(frame.canvasData.height).toBe(80);
            });
        });
    });
});
