var TexturerImage = require('../../../../../src/renderer/webgl/renderNodes/texturer/TexturerImage');

describe('TexturerImage', function ()
{
    var manager;
    var drawingContext;
    var frame;
    var gameObject;

    beforeEach(function ()
    {
        manager = {};

        drawingContext = {};

        frame = {
            cutWidth: 128,
            cutHeight: 64,
            source: { resolution: 1 },
            updateCropUVs: vi.fn()
        };

        gameObject = {
            frame: frame,
            isCropped: false,
            flipX: false,
            flipY: false,
            _crop: null
        };
    });

    describe('constructor', function ()
    {
        it('should set frame to null by default', function ()
        {
            var node = new TexturerImage(manager);
            expect(node.frame).toBeNull();
        });

        it('should set frameWidth to 0 by default', function ()
        {
            var node = new TexturerImage(manager);
            expect(node.frameWidth).toBe(0);
        });

        it('should set frameHeight to 0 by default', function ()
        {
            var node = new TexturerImage(manager);
            expect(node.frameHeight).toBe(0);
        });

        it('should set uvSource to null by default', function ()
        {
            var node = new TexturerImage(manager);
            expect(node.uvSource).toBeNull();
        });

        it('should set the name to TexturerImage', function ()
        {
            var node = new TexturerImage(manager);
            expect(node.name).toBe('TexturerImage');
        });

        it('should store the manager reference', function ()
        {
            var node = new TexturerImage(manager);
            expect(node.manager).toBe(manager);
        });
    });

    describe('run', function ()
    {
        it('should set frame from the gameObject frame', function ()
        {
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.frame).toBe(frame);
        });

        it('should set frameWidth from frame.cutWidth when not cropped', function ()
        {
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.frameWidth).toBe(128);
        });

        it('should set frameHeight from frame.cutHeight when not cropped', function ()
        {
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.frameHeight).toBe(64);
        });

        it('should set uvSource to frame when not cropped', function ()
        {
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.uvSource).toBe(frame);
        });

        it('should divide frameWidth by frame source resolution', function ()
        {
            frame.cutWidth = 256;
            frame.source.resolution = 2;
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.frameWidth).toBe(128);
        });

        it('should divide frameHeight by frame source resolution', function ()
        {
            frame.cutHeight = 128;
            frame.source.resolution = 4;
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.frameHeight).toBe(32);
        });

        it('should produce fractional dimensions for non-integer resolution', function ()
        {
            frame.cutWidth = 100;
            frame.cutHeight = 50;
            frame.source.resolution = 1.5;
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.frameWidth).toBeCloseTo(66.6667, 3);
            expect(node.frameHeight).toBeCloseTo(33.3333, 3);
        });

        describe('when isCropped is true', function ()
        {
            var crop;

            beforeEach(function ()
            {
                crop = {
                    width: 32,
                    height: 16,
                    flipX: false,
                    flipY: false,
                    u0: 0, v0: 0, u1: 1, v1: 1, x: 0, y: 0
                };
                gameObject.isCropped = true;
                gameObject._crop = crop;
            });

            it('should set uvSource to the crop object', function ()
            {
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(node.uvSource).toBe(crop);
            });

            it('should set frameWidth from crop.width', function ()
            {
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(node.frameWidth).toBe(32);
            });

            it('should set frameHeight from crop.height', function ()
            {
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(node.frameHeight).toBe(16);
            });

            it('should divide crop frameWidth by resolution', function ()
            {
                crop.width = 64;
                frame.source.resolution = 2;
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(node.frameWidth).toBe(32);
            });

            it('should divide crop frameHeight by resolution', function ()
            {
                crop.height = 64;
                frame.source.resolution = 4;
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(node.frameHeight).toBe(16);
            });

            it('should not call updateCropUVs when flip state matches', function ()
            {
                gameObject.flipX = false;
                gameObject.flipY = false;
                crop.flipX = false;
                crop.flipY = false;
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(frame.updateCropUVs).not.toHaveBeenCalled();
            });

            it('should call updateCropUVs when flipX differs', function ()
            {
                gameObject.flipX = true;
                gameObject.flipY = false;
                crop.flipX = false;
                crop.flipY = false;
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(frame.updateCropUVs).toHaveBeenCalledWith(crop, true, false);
            });

            it('should call updateCropUVs when flipY differs', function ()
            {
                gameObject.flipX = false;
                gameObject.flipY = true;
                crop.flipX = false;
                crop.flipY = false;
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(frame.updateCropUVs).toHaveBeenCalledWith(crop, false, true);
            });

            it('should call updateCropUVs when both flip states differ', function ()
            {
                gameObject.flipX = true;
                gameObject.flipY = true;
                crop.flipX = false;
                crop.flipY = false;
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(frame.updateCropUVs).toHaveBeenCalledWith(crop, true, true);
            });

            it('should call updateCropUVs when crop flipX is true but gameObject flipX is false', function ()
            {
                gameObject.flipX = false;
                gameObject.flipY = false;
                crop.flipX = true;
                crop.flipY = false;
                var node = new TexturerImage(manager);
                node.run(drawingContext, gameObject);
                expect(frame.updateCropUVs).toHaveBeenCalledWith(crop, false, false);
            });
        });

        it('should overwrite values on subsequent run calls', function ()
        {
            var frame2 = {
                cutWidth: 200,
                cutHeight: 100,
                source: { resolution: 1 },
                updateCropUVs: vi.fn()
            };
            var gameObject2 = {
                frame: frame2,
                isCropped: false,
                flipX: false,
                flipY: false,
                _crop: null
            };
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            node.run(drawingContext, gameObject2);
            expect(node.frame).toBe(frame2);
            expect(node.frameWidth).toBe(200);
            expect(node.frameHeight).toBe(100);
            expect(node.uvSource).toBe(frame2);
        });

        it('should handle zero-size frames', function ()
        {
            frame.cutWidth = 0;
            frame.cutHeight = 0;
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject);
            expect(node.frameWidth).toBe(0);
            expect(node.frameHeight).toBe(0);
        });

        it('should ignore the element argument', function ()
        {
            var node = new TexturerImage(manager);
            node.run(drawingContext, gameObject, { someElement: true });
            expect(node.frame).toBe(frame);
            expect(node.frameWidth).toBe(128);
            expect(node.frameHeight).toBe(64);
        });
    });
});
