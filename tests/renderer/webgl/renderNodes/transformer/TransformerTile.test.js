var TransformerTile = require('../../../../../src/renderer/webgl/renderNodes/transformer/TransformerTile');

describe('TransformerTile', function ()
{
    var mockManager;
    var node;

    beforeEach(function ()
    {
        mockManager = {};
        node = new TransformerTile(mockManager);
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should create an instance of TransformerTile', function ()
        {
            expect(node).toBeDefined();
        });

        it('should set the name from defaultConfig', function ()
        {
            expect(node.name).toBe('TransformerTile');
        });

        it('should store the manager reference', function ()
        {
            expect(node.manager).toBe(mockManager);
        });

        it('should initialise quad as a Float32Array of length 8', function ()
        {
            expect(node.quad).toBeInstanceOf(Float32Array);
            expect(node.quad.length).toBe(8);
        });

        it('should initialise quad values to zero', function ()
        {
            for (var i = 0; i < 8; i++)
            {
                expect(node.quad[i]).toBe(0);
            }
        });

        it('should create internal _spriteMatrix', function ()
        {
            expect(node._spriteMatrix).toBeDefined();
        });

        it('should create internal _calcMatrix', function ()
        {
            expect(node._calcMatrix).toBeDefined();
        });

        it('should accept a custom config object', function ()
        {
            var custom = new TransformerTile(mockManager, { name: 'CustomTile' });
            expect(custom.name).toBe('CustomTile');
        });
    });

    // -------------------------------------------------------------------------
    // defaultConfig
    // -------------------------------------------------------------------------

    describe('defaultConfig', function ()
    {
        it('should have name set to TransformerTile', function ()
        {
            expect(TransformerTile.prototype.defaultConfig.name).toBe('TransformerTile');
        });

        it('should have role set to Transformer', function ()
        {
            expect(TransformerTile.prototype.defaultConfig.role).toBe('Transformer');
        });
    });

    // -------------------------------------------------------------------------
    // run
    // -------------------------------------------------------------------------

    describe('run', function ()
    {
        var mockCalcMatrix;
        var mockSpriteMatrix;
        var drawingContext;
        var gameObject;
        var texturerNode;
        var element;

        beforeEach(function ()
        {
            mockCalcMatrix = {
                matrix: [ 1, 0, 0, 1, 0, 0 ],
                copyWithScrollFactorFrom: vi.fn(),
                multiply: vi.fn(),
                setQuad: vi.fn(function (x, y, x2, y2, quad)
                {
                    quad[0] = x;
                    quad[1] = y;
                    quad[2] = x2;
                    quad[3] = y;
                    quad[4] = x;
                    quad[5] = y2;
                    quad[6] = x2;
                    quad[7] = y2;
                })
            };

            mockSpriteMatrix = {
                applyITRS: vi.fn()
            };

            node._calcMatrix = mockCalcMatrix;
            node._spriteMatrix = mockSpriteMatrix;

            drawingContext = {
                camera: {
                    getViewMatrix: vi.fn(function () { return {}; }),
                    scrollX: 0,
                    scrollY: 0
                },
                useCanvas: false
            };

            gameObject = {
                scrollFactorX: 1,
                scrollFactorY: 1,
                scaleX: 1,
                scaleY: 1,
                x: 0,
                y: 0,
                gidMap: {
                    0: { tileOffset: { x: 0, y: 0 } }
                },
                willRoundVertices: vi.fn(function () { return false; })
            };

            texturerNode = {
                frameWidth: 32,
                frameHeight: 32
            };

            element = {
                index: 0,
                pixelX: 0,
                pixelY: 0,
                flipX: false,
                flipY: false,
                rotation: 0
            };
        });

        it('should call copyWithScrollFactorFrom on calcMatrix', function ()
        {
            node.run(drawingContext, gameObject, texturerNode, null, element);
            expect(mockCalcMatrix.copyWithScrollFactorFrom).toHaveBeenCalledOnce();
        });

        it('should call getViewMatrix on the camera', function ()
        {
            node.run(drawingContext, gameObject, texturerNode, null, element);
            expect(drawingContext.camera.getViewMatrix).toHaveBeenCalledOnce();
        });

        it('should call applyITRS on spriteMatrix', function ()
        {
            node.run(drawingContext, gameObject, texturerNode, null, element);
            expect(mockSpriteMatrix.applyITRS).toHaveBeenCalledOnce();
        });

        it('should call setQuad on calcMatrix', function ()
        {
            node.run(drawingContext, gameObject, texturerNode, null, element);
            expect(mockCalcMatrix.setQuad).toHaveBeenCalledOnce();
        });

        it('should call multiply on calcMatrix twice when no parentMatrix', function ()
        {
            node.run(drawingContext, gameObject, texturerNode, null, element);
            // Once for spriteMatrix multiply
            expect(mockCalcMatrix.multiply).toHaveBeenCalledTimes(1);
        });

        it('should call multiply on calcMatrix twice when parentMatrix is provided', function ()
        {
            var parentMatrix = {};
            node.run(drawingContext, gameObject, texturerNode, parentMatrix, element);
            // Once for parentMatrix, once for spriteMatrix
            expect(mockCalcMatrix.multiply).toHaveBeenCalledTimes(2);
        });

        it('should multiply by parentMatrix first when provided', function ()
        {
            var parentMatrix = {};
            node.run(drawingContext, gameObject, texturerNode, parentMatrix, element);
            expect(mockCalcMatrix.multiply).toHaveBeenCalledWith(parentMatrix);
        });

        it('should pass element rotation to applyITRS', function ()
        {
            element.rotation = Math.PI / 4;
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var call = mockSpriteMatrix.applyITRS.mock.calls[0];
            expect(call[2]).toBeCloseTo(Math.PI / 4);
        });

        it('should pass gameObject scale to applyITRS', function ()
        {
            gameObject.scaleX = 2;
            gameObject.scaleY = 3;
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var call = mockSpriteMatrix.applyITRS.mock.calls[0];
            expect(call[3]).toBe(2);
            expect(call[4]).toBe(3);
        });

        it('should compute srcX using gameObject position, pixelX, scaleX, frameWidth, and tileOffset', function ()
        {
            gameObject.x = 100;
            gameObject.scaleX = 2;
            gameObject.scaleY = 2;
            element.pixelX = 10;
            texturerNode.frameWidth = 32;
            gameObject.gidMap[0].tileOffset.x = 4;
            // srcX = 100 + 10*2 + (16*2 - 4) = 100 + 20 + 28 = 148
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var call = mockSpriteMatrix.applyITRS.mock.calls[0];
            expect(call[0]).toBeCloseTo(148);
        });

        it('should compute srcY using gameObject position, pixelY, scaleY, frameHeight, and tileOffset', function ()
        {
            gameObject.y = 50;
            gameObject.scaleX = 2;
            gameObject.scaleY = 2;
            element.pixelY = 5;
            texturerNode.frameHeight = 32;
            gameObject.gidMap[0].tileOffset.y = 8;
            // srcY = 50 + 5*2 + (16*2 - 8) = 50 + 10 + 24 = 84
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var call = mockSpriteMatrix.applyITRS.mock.calls[0];
            expect(call[1]).toBeCloseTo(84);
        });

        it('should negate width and offset x origin when flipX is true', function ()
        {
            element.flipX = true;
            texturerNode.frameWidth = 32;
            texturerNode.frameHeight = 32;
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var setQuadCall = mockCalcMatrix.setQuad.mock.calls[0];
            // x becomes -halfWidth + frameWidth = -16 + 32 = 16
            // x + width = 16 + (-32) = -16
            expect(setQuadCall[0]).toBe(16);
            expect(setQuadCall[2]).toBe(-16);
        });

        it('should negate height and offset y origin when flipY is true', function ()
        {
            element.flipY = true;
            texturerNode.frameWidth = 32;
            texturerNode.frameHeight = 32;
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var setQuadCall = mockCalcMatrix.setQuad.mock.calls[0];
            // y = -halfHeight = -16, height = -32, so y + height = -48
            expect(setQuadCall[1]).toBe(-16);
            expect(setQuadCall[3]).toBe(-48);
        });

        it('should use standard quad x and y when no flip is applied', function ()
        {
            texturerNode.frameWidth = 64;
            texturerNode.frameHeight = 64;
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var setQuadCall = mockCalcMatrix.setQuad.mock.calls[0];
            // x = -halfWidth = -32, y = -halfHeight = -32
            expect(setQuadCall[0]).toBe(-32);
            expect(setQuadCall[1]).toBe(-32);
            // x + width = -32 + 64 = 32, y + height = -32 + 64 = 32
            expect(setQuadCall[2]).toBe(32);
            expect(setQuadCall[3]).toBe(32);
        });

        it('should look up the tileset via element.index in gidMap', function ()
        {
            gameObject.gidMap = {
                5: { tileOffset: { x: 10, y: 20 } }
            };
            element.index = 5;
            gameObject.x = 0;
            gameObject.y = 0;
            gameObject.scaleX = 1;
            gameObject.scaleY = 1;
            element.pixelX = 0;
            element.pixelY = 0;
            texturerNode.frameWidth = 32;
            texturerNode.frameHeight = 32;
            // srcX = 0 + 0 + (16 - 10) = 6, srcY = 0 + 0 + (16 - 20) = -4
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var call = mockSpriteMatrix.applyITRS.mock.calls[0];
            expect(call[0]).toBeCloseTo(6);
            expect(call[1]).toBeCloseTo(-4);
        });

        it('should not round quad values when willRoundVertices returns false', function ()
        {
            gameObject.willRoundVertices = vi.fn(function () { return false; });
            // setQuad writes fractional values into quad
            mockCalcMatrix.setQuad = vi.fn(function (x, y, x2, y2, quad)
            {
                quad[0] = 1.7;
                quad[1] = 2.3;
                quad[2] = 3.9;
                quad[3] = 4.1;
                quad[4] = 5.5;
                quad[5] = 6.6;
                quad[6] = 7.2;
                quad[7] = 8.8;
            });
            node.run(drawingContext, gameObject, texturerNode, null, element);
            expect(node.quad[0]).toBeCloseTo(1.7);
            expect(node.quad[1]).toBeCloseTo(2.3);
        });

        it('should round quad values when willRoundVertices returns true', function ()
        {
            gameObject.willRoundVertices = vi.fn(function () { return true; });
            mockCalcMatrix.setQuad = vi.fn(function (x, y, x2, y2, quad)
            {
                quad[0] = 1.7;
                quad[1] = 2.3;
                quad[2] = 3.9;
                quad[3] = 4.1;
                quad[4] = 5.5;
                quad[5] = 6.6;
                quad[6] = 7.2;
                quad[7] = 8.8;
            });
            node.run(drawingContext, gameObject, texturerNode, null, element);
            expect(node.quad[0]).toBe(2);
            expect(node.quad[1]).toBe(2);
            expect(node.quad[2]).toBe(4);
            expect(node.quad[3]).toBe(4);
            expect(node.quad[4]).toBe(6);
            expect(node.quad[5]).toBe(7);
            expect(node.quad[6]).toBe(7);
            expect(node.quad[7]).toBe(9);
        });

        it('should pass camera and onlyTranslate flag to willRoundVertices', function ()
        {
            node.run(drawingContext, gameObject, texturerNode, null, element);
            expect(gameObject.willRoundVertices).toHaveBeenCalledWith(
                drawingContext.camera,
                expect.any(Boolean)
            );
        });

        it('should detect identity matrix as onlyTranslate=true', function ()
        {
            // matrix [1,0,0,1,...] is identity — no rotation/scale/skew
            mockCalcMatrix.matrix = [ 1, 0, 0, 1, 0, 0 ];
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var args = gameObject.willRoundVertices.mock.calls[0];
            expect(args[1]).toBe(true);
        });

        it('should detect scaled matrix as onlyTranslate=false', function ()
        {
            mockCalcMatrix.matrix = [ 2, 0, 0, 2, 0, 0 ];
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var args = gameObject.willRoundVertices.mock.calls[0];
            expect(args[1]).toBe(false);
        });

        it('should detect rotated matrix as onlyTranslate=false', function ()
        {
            mockCalcMatrix.matrix = [ 1, 0.5, -0.5, 1, 0, 0 ];
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var args = gameObject.willRoundVertices.mock.calls[0];
            expect(args[1]).toBe(false);
        });

        it('should pass useCanvas flag to camera.getViewMatrix', function ()
        {
            drawingContext.useCanvas = true;
            node.run(drawingContext, gameObject, texturerNode, null, element);
            // getViewMatrix receives !useCanvas = false
            expect(drawingContext.camera.getViewMatrix).toHaveBeenCalledWith(false);
        });

        it('should pass useCanvas=false flag to camera.getViewMatrix correctly', function ()
        {
            drawingContext.useCanvas = false;
            node.run(drawingContext, gameObject, texturerNode, null, element);
            // getViewMatrix receives !useCanvas = true
            expect(drawingContext.camera.getViewMatrix).toHaveBeenCalledWith(true);
        });

        it('should pass the quad Float32Array to setQuad', function ()
        {
            node.run(drawingContext, gameObject, texturerNode, null, element);
            var setQuadCall = mockCalcMatrix.setQuad.mock.calls[0];
            expect(setQuadCall[4]).toBe(node.quad);
        });
    });
});
