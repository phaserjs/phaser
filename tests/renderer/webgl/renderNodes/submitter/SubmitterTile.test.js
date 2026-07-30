var SubmitterTile = require('../../../../../src/renderer/webgl/renderNodes/submitter/SubmitterTile');

describe('SubmitterTile', function ()
{
    var mockManager;

    beforeEach(function ()
    {
        mockManager = {};
    });

    describe('constructor', function ()
    {
        it('should create an instance with default config', function ()
        {
            var node = new SubmitterTile(mockManager);
            expect(node).toBeDefined();
        });

        it('should set the name to SubmitterTile by default', function ()
        {
            var node = new SubmitterTile(mockManager);
            expect(node.name).toBe('SubmitterTile');
        });

        it('should set the batchHandler to BatchHandler by default', function ()
        {
            var node = new SubmitterTile(mockManager);
            expect(node.batchHandler).toBe('BatchHandler');
        });

        it('should store the manager reference', function ()
        {
            var node = new SubmitterTile(mockManager);
            expect(node.manager).toBe(mockManager);
        });

        it('should set clampFrame to true on _renderOptions', function ()
        {
            var node = new SubmitterTile(mockManager);
            expect(node._renderOptions.clampFrame).toBe(true);
        });

        it('should accept a custom name via config', function ()
        {
            var node = new SubmitterTile(mockManager, { name: 'MyTileSubmitter' });
            expect(node.name).toBe('MyTileSubmitter');
        });

        it('should accept a custom batchHandler via config', function ()
        {
            var node = new SubmitterTile(mockManager, { batchHandler: 'CustomBatchHandler' });
            expect(node.batchHandler).toBe('CustomBatchHandler');
        });

        it('should initialise _renderOptions with multiTexturing true', function ()
        {
            var node = new SubmitterTile(mockManager);
            expect(node._renderOptions.multiTexturing).toBe(true);
        });

        it('should initialise _renderOptions with lighting null', function ()
        {
            var node = new SubmitterTile(mockManager);
            expect(node._renderOptions.lighting).toBeNull();
        });
    });

    describe('defaultConfig', function ()
    {
        it('should have name SubmitterTile', function ()
        {
            expect(SubmitterTile.prototype.defaultConfig.name).toBe('SubmitterTile');
        });

        it('should have role Submitter', function ()
        {
            expect(SubmitterTile.prototype.defaultConfig.role).toBe('Submitter');
        });

        it('should have batchHandler BatchHandler', function ()
        {
            expect(SubmitterTile.prototype.defaultConfig.batchHandler).toBe('BatchHandler');
        });
    });

    describe('run', function ()
    {
        var node;
        var mockBatch;
        var mockBatchHandler;
        var drawingContext;
        var gameObject;
        var parentMatrix;
        var texturerNode;
        var transformerNode;
        var glTexture;
        var quad;

        beforeEach(function ()
        {
            node = new SubmitterTile(mockManager);

            mockBatch = vi.fn();
            mockBatchHandler = { batch: mockBatch };

            drawingContext = {};
            parentMatrix = {};

            glTexture = {};
            quad = new Float32Array([
                0, 1,   // TL [0,1]
                2, 3,   // BL [2,3]
                4, 5,   // BR [4,5]  (index 4,5)
                6, 7    // TR [6,7]
            ]);

            texturerNode = {
                frame: { source: { glTexture: glTexture } },
                uvSource: { u0: 0.1, v0: 0.2, u1: 0.9, v1: 0.8 }
            };

            transformerNode = {
                quad: quad
            };

            gameObject = {
                customRenderNodes: { BatchHandler: mockBatchHandler },
                defaultRenderNodes: {},
                tintMode: 0,
                scene: {
                    sys: {
                        game: {
                            config: { smoothPixelArt: false }
                        }
                    }
                }
            };
        });

        it('should call batch on the game object batch handler', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            expect(mockBatch).toHaveBeenCalledTimes(1);
        });

        it('should fall back to defaultRenderNodes when customRenderNodes lacks the handler', function ()
        {
            gameObject.customRenderNodes = {};
            gameObject.defaultRenderNodes = { BatchHandler: mockBatchHandler };

            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            expect(mockBatch).toHaveBeenCalledTimes(1);
        });

        it('should pass drawingContext as the first batch argument', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            expect(args[0]).toBe(drawingContext);
        });

        it('should pass frame.source.glTexture as the second batch argument', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            expect(args[1]).toBe(glTexture);
        });

        it('should pass quad vertices in TL BL TR BR order', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            // quad order: TL=[0,1], BL=[2,3], TR=[6,7], BR=[4,5]
            expect(args[2]).toBe(quad[0]);
            expect(args[3]).toBe(quad[1]);
            expect(args[4]).toBe(quad[2]);
            expect(args[5]).toBe(quad[3]);
            expect(args[6]).toBe(quad[6]);
            expect(args[7]).toBe(quad[7]);
            expect(args[8]).toBe(quad[4]);
            expect(args[9]).toBe(quad[5]);
        });

        it('should pass UV coordinates as x, y, width, height', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            var u0 = 0.1;
            var v0 = 0.2;
            var u1 = 0.9;
            var v1 = 0.8;
            expect(args[10]).toBeCloseTo(u0);
            expect(args[11]).toBeCloseTo(v0);
            expect(args[12]).toBeCloseTo(u1 - u0);
            expect(args[13]).toBeCloseTo(v1 - v0);
        });

        it('should use 0xffffffff tint colors when no tinterNode is provided', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            // tintEffect at index 14, then TL, BL, TR, BR tints at 15,16,17,18
            expect(args[15]).toBe(0xffffffff);
            expect(args[16]).toBe(0xffffffff);
            expect(args[17]).toBe(0xffffffff);
            expect(args[18]).toBe(0xffffffff);
        });

        it('should use gameObject.tintMode for tintEffect when no tinterNode is provided', function ()
        {
            gameObject.tintMode = 2;
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            expect(args[14]).toBe(2);
        });

        it('should use tinterNode tint values when tinterNode is provided', function ()
        {
            var tinterNode = {
                tintEffect: 1,
                tintTopLeft: 0xaabbccdd,
                tintBottomLeft: 0x11223344,
                tintTopRight: 0x55667788,
                tintBottomRight: 0x99aabbcc
            };
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode, tinterNode);
            var args = mockBatch.mock.calls[0];
            expect(args[14]).toBe(1);
            expect(args[15]).toBe(0xaabbccdd);
            expect(args[16]).toBe(0x11223344);
            expect(args[17]).toBe(0x55667788);
            expect(args[18]).toBe(0x99aabbcc);
        });

        it('should pass _renderOptions as the batch options argument', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            expect(args[19]).toBe(node._renderOptions);
        });

        it('should pass _renderOptions with clampFrame true', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            expect(args[19].clampFrame).toBe(true);
        });

        it('should pass frame UV coordinates in TL BL TR BR order as the final batch arguments', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            var u0 = 0.1;
            var v0 = 0.2;
            var u1 = 0.9;
            var v1 = 0.8;
            // frame coords: TL=(u0,v1), BL=(u0,v0), TR=(u1,v1), BR=(u1,v0)
            expect(args[20]).toBeCloseTo(u0); // TL x
            expect(args[21]).toBeCloseTo(v1); // TL y
            expect(args[22]).toBeCloseTo(u0); // BL x
            expect(args[23]).toBeCloseTo(v0); // BL y
            expect(args[24]).toBeCloseTo(u1); // TR x
            expect(args[25]).toBeCloseTo(v1); // TR y
            expect(args[26]).toBeCloseTo(u1); // BR x
            expect(args[27]).toBeCloseTo(v0); // BR y
        });

        it('should call texturerNode.run when it has a run method', function ()
        {
            texturerNode.run = vi.fn();
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            expect(texturerNode.run).toHaveBeenCalledTimes(1);
            expect(texturerNode.run).toHaveBeenCalledWith(drawingContext, gameObject, null);
        });

        it('should not throw when texturerNode has no run method', function ()
        {
            expect(function ()
            {
                node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            }).not.toThrow();
        });

        it('should call transformerNode.run when it has a run method', function ()
        {
            transformerNode.run = vi.fn();
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            expect(transformerNode.run).toHaveBeenCalledTimes(1);
            expect(transformerNode.run).toHaveBeenCalledWith(drawingContext, gameObject, texturerNode, parentMatrix, null);
        });

        it('should not throw when transformerNode has no run method', function ()
        {
            expect(function ()
            {
                node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            }).not.toThrow();
        });

        it('should call tinterNode.run when tinterNode is provided and has a run method', function ()
        {
            var element = { tileIndex: 5 };
            var tinterNode = {
                run: vi.fn(),
                tintEffect: 0,
                tintTopLeft: 0xffffffff,
                tintBottomLeft: 0xffffffff,
                tintTopRight: 0xffffffff,
                tintBottomRight: 0xffffffff
            };
            node.run(drawingContext, gameObject, parentMatrix, element, texturerNode, transformerNode, tinterNode);
            expect(tinterNode.run).toHaveBeenCalledTimes(1);
            expect(tinterNode.run).toHaveBeenCalledWith(drawingContext, gameObject, element);
        });

        it('should pass element to texturerNode.run', function ()
        {
            var element = { tileIndex: 3 };
            texturerNode.run = vi.fn();
            node.run(drawingContext, gameObject, parentMatrix, element, texturerNode, transformerNode);
            expect(texturerNode.run).toHaveBeenCalledWith(drawingContext, gameObject, element);
        });

        it('should pass element to transformerNode.run', function ()
        {
            var element = { tileIndex: 3 };
            transformerNode.run = vi.fn();
            node.run(drawingContext, gameObject, parentMatrix, element, texturerNode, transformerNode);
            expect(transformerNode.run).toHaveBeenCalledWith(drawingContext, gameObject, texturerNode, parentMatrix, element);
        });

        it('should set _renderOptions.lighting to null when gameObject has no lighting', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            expect(node._renderOptions.lighting).toBeNull();
        });

        it('should set _renderOptions.smoothPixelArt from game config when texture has no override', function ()
        {
            gameObject.scene.sys.game.config.smoothPixelArt = true;
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            expect(node._renderOptions.smoothPixelArt).toBe(true);
        });

        it('should pass correct total number of arguments to batch', function ()
        {
            node.run(drawingContext, gameObject, parentMatrix, null, texturerNode, transformerNode);
            var args = mockBatch.mock.calls[0];
            // drawingContext + glTexture + 8 quad coords + 4 uv + tintEffect + 4 tints + renderOptions + 4 secondary tints + 8 frame coords = 32
            expect(args.length).toBe(32);
        });
    });
});
