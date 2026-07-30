var SubmitterTileSprite = require('../../../../../src/renderer/webgl/renderNodes/submitter/SubmitterTileSprite');

describe('SubmitterTileSprite', function ()
{
    var mockManager;

    beforeEach(function ()
    {
        mockManager = {
            renderer: {
                normalTexture: {}
            }
        };
    });

    describe('constructor', function ()
    {
        it('should create an instance with default config name', function ()
        {
            var node = new SubmitterTileSprite(mockManager);
            expect(node.name).toBe('SubmitterTileSprite');
        });

        it('should set the default batchHandler', function ()
        {
            var node = new SubmitterTileSprite(mockManager);
            expect(node.batchHandler).toBe('BatchHandler');
        });

        it('should store the manager reference', function ()
        {
            var node = new SubmitterTileSprite(mockManager);
            expect(node.manager).toBe(mockManager);
        });

        it('should set wrapFrame to true on _renderOptions', function ()
        {
            var node = new SubmitterTileSprite(mockManager);
            expect(node._renderOptions.wrapFrame).toBe(true);
        });

        it('should allow a custom name via config', function ()
        {
            var node = new SubmitterTileSprite(mockManager, { name: 'MyTileSubmitter' });
            expect(node.name).toBe('MyTileSubmitter');
        });

        it('should allow a custom batchHandler via config', function ()
        {
            var node = new SubmitterTileSprite(mockManager, { batchHandler: 'CustomBatch' });
            expect(node.batchHandler).toBe('CustomBatch');
        });

        it('should initialise _renderOptions with multiTexturing true', function ()
        {
            var node = new SubmitterTileSprite(mockManager);
            expect(node._renderOptions.multiTexturing).toBe(true);
        });

        it('should initialise _lightingOptions with normalMapRotation 0', function ()
        {
            var node = new SubmitterTileSprite(mockManager);
            expect(node._lightingOptions.normalMapRotation).toBe(0);
        });
    });

    describe('defaultConfig', function ()
    {
        it('should have the correct default name', function ()
        {
            expect(SubmitterTileSprite.prototype.defaultConfig.name).toBe('SubmitterTileSprite');
        });

        it('should have role set to Submitter', function ()
        {
            expect(SubmitterTileSprite.prototype.defaultConfig.role).toBe('Submitter');
        });

        it('should have batchHandler set to BatchHandler', function ()
        {
            expect(SubmitterTileSprite.prototype.defaultConfig.batchHandler).toBe('BatchHandler');
        });
    });

    describe('run', function ()
    {
        var node;
        var mockDrawingContext;
        var mockGameObject;
        var mockParentMatrix;
        var mockTexturerNode;
        var mockTransformerNode;
        var mockBatchHandler;

        beforeEach(function ()
        {
            node = new SubmitterTileSprite(mockManager);

            mockDrawingContext = {};

            mockBatchHandler = {
                batch: vi.fn()
            };

            mockGameObject = {
                tintMode: 0,
                tintTopLeft: 0xffffff,
                tintBottomLeft: 0xffffff,
                tintTopRight: 0xffffff,
                tintBottomRight: 0xffffff,
                _alphaTL: 1,
                _alphaBL: 1,
                _alphaTR: 1,
                _alphaBR: 1,
                tileRotation: 0,
                lighting: null,
                displayTexture: null,
                texture: {
                    smoothPixelArt: false,
                    dataSource: [ null ]
                },
                frame: {
                    sourceIndex: 0
                },
                customRenderNodes: {},
                defaultRenderNodes: {
                    'BatchHandler': mockBatchHandler
                }
            };

            mockTexturerNode = {
                frame: {
                    source: {
                        glTexture: {}
                    },
                    u0: 0,
                    v0: 0,
                    u1: 1,
                    v1: 1
                },
                uvMatrix: {
                    quad: new Float32Array([ 0, 0, 0, 1, 1, 1, 1, 0 ])
                }
            };

            mockTransformerNode = {
                quad: new Float32Array([ 0, 0, 0, 100, 100, 100, 100, 0 ])
            };
        });

        it('should call batch on the default render node when customRenderNodes has no entry', function ()
        {
            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            expect(mockBatchHandler.batch).toHaveBeenCalledOnce();
        });

        it('should call batch on customRenderNodes entry when present', function ()
        {
            var customBatch = { batch: vi.fn() };
            mockGameObject.customRenderNodes['BatchHandler'] = customBatch;

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            expect(customBatch.batch).toHaveBeenCalledOnce();
            expect(mockBatchHandler.batch).not.toHaveBeenCalled();
        });

        it('should call texturerNode.run when it has a run method', function ()
        {
            mockTexturerNode.run = vi.fn();

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            expect(mockTexturerNode.run).toHaveBeenCalledWith(mockDrawingContext, mockGameObject, null);
        });

        it('should call transformerNode.run when it has a run method', function ()
        {
            mockTransformerNode.run = vi.fn();

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            expect(mockTransformerNode.run).toHaveBeenCalledWith(
                mockDrawingContext,
                mockGameObject,
                mockTexturerNode,
                mockParentMatrix,
                null
            );
        });

        it('should call tinterNode.run when tinterNode has a run method', function ()
        {
            var mockTinterNode = {
                run: vi.fn(),
                tintEffect: 1,
                tintTopLeft: 0xff0000,
                tintBottomLeft: 0x00ff00,
                tintTopRight: 0x0000ff,
                tintBottomRight: 0xffffff
            };

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode,
                mockTinterNode
            );

            expect(mockTinterNode.run).toHaveBeenCalledWith(mockDrawingContext, mockGameObject, null);
        });

        it('should use tinterNode tint values when tinterNode is provided', function ()
        {
            var mockTinterNode = {
                tintEffect: 2,
                tintTopLeft: 0xaabbcc,
                tintBottomLeft: 0x112233,
                tintTopRight: 0x445566,
                tintBottomRight: 0x778899
            };

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode,
                mockTinterNode
            );

            var batchArgs = mockBatchHandler.batch.mock.calls[0];
            // indices: 0=ctx, 1=glTex, 2-9=quad(8), 10=u0, 11=v0, 12=width, 13=height, 14=tintEffect, 15-18=tints, 19=renderOptions, 20-27=uvQuad
            expect(batchArgs[14]).toBe(2); // tintEffect
            expect(batchArgs[15]).toBe(0xaabbcc); // tintTopLeft
            expect(batchArgs[16]).toBe(0x112233); // tintBottomLeft
            expect(batchArgs[17]).toBe(0x445566); // tintTopRight
            expect(batchArgs[18]).toBe(0x778899); // tintBottomRight
        });

        it('should use gameObject tint values when tinterNode is not provided', function ()
        {
            mockGameObject.tintMode = 3;

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            var batchArgs = mockBatchHandler.batch.mock.calls[0];
            expect(batchArgs[14]).toBe(3); // tintEffect from gameObject.tintMode
        });

        it('should pass the glTexture from frame.source to batch', function ()
        {
            var glTex = { id: 'texture-1' };
            mockTexturerNode.frame.source.glTexture = glTex;

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            var batchArgs = mockBatchHandler.batch.mock.calls[0];
            expect(batchArgs[1]).toBe(glTex);
        });

        it('should pass the drawing context as the first argument to batch', function ()
        {
            var ctx = { id: 'ctx-1' };

            node.run(
                ctx,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            var batchArgs = mockBatchHandler.batch.mock.calls[0];
            expect(batchArgs[0]).toBe(ctx);
        });

        it('should pass uvQuad coordinates to batch after renderOptions', function ()
        {
            var uvQuad = new Float32Array([ 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8 ]);
            mockTexturerNode.uvMatrix.quad = uvQuad;

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            var batchArgs = mockBatchHandler.batch.mock.calls[0];
            // renderOptions is at index 19, uvQuad TL.x at 20
            expect(batchArgs[20]).toBeCloseTo(uvQuad[0]); // TL x
            expect(batchArgs[21]).toBeCloseTo(uvQuad[1]); // TL y
            expect(batchArgs[22]).toBeCloseTo(uvQuad[2]); // BL x
            expect(batchArgs[23]).toBeCloseTo(uvQuad[3]); // BL y
            expect(batchArgs[24]).toBeCloseTo(uvQuad[6]); // TR x
            expect(batchArgs[25]).toBeCloseTo(uvQuad[7]); // TR y
            expect(batchArgs[26]).toBeCloseTo(uvQuad[4]); // BR x
            expect(batchArgs[27]).toBeCloseTo(uvQuad[5]); // BR y
        });

        it('should add gameObject.tileRotation to _lightingOptions.normalMapRotation', function ()
        {
            mockGameObject.tileRotation = 1.5;
            node._lightingOptions.normalMapRotation = 0;

            // We need lighting to be enabled to see the rotation in renderOptions,
            // but tileRotation is added regardless. Verify via _lightingOptions directly.
            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            // After run, normalMapRotation should have tileRotation added.
            // setRenderOptions resets it first (NaN path sets from gameObject.rotation which is undefined here)
            // The line `this._lightingOptions.normalMapRotation += gameObject.tileRotation` always runs.
            expect(node._lightingOptions.normalMapRotation).toBeCloseTo(1.5);
        });

        it('should pass UV width and height derived from frame u0/v0/u1/v1 to batch', function ()
        {
            mockTexturerNode.frame.u0 = 0.25;
            mockTexturerNode.frame.v0 = 0.125;
            mockTexturerNode.frame.u1 = 0.75;
            mockTexturerNode.frame.v1 = 0.875;

            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            var batchArgs = mockBatchHandler.batch.mock.calls[0];
            // indices: 0=ctx, 1=glTex, 2-9=quad(8 values), 10=u0, 11=v0, 12=width(u1-u0), 13=height(v1-v0)
            expect(batchArgs[10]).toBeCloseTo(0.25);  // u0
            expect(batchArgs[11]).toBeCloseTo(0.125); // v0
            expect(batchArgs[12]).toBeCloseTo(0.5);   // u1 - u0
            expect(batchArgs[13]).toBeCloseTo(0.75);  // v1 - v0
        });

        it('should pass _renderOptions with wrapFrame true to batch', function ()
        {
            node.run(
                mockDrawingContext,
                mockGameObject,
                mockParentMatrix,
                null,
                mockTexturerNode,
                mockTransformerNode
            );

            var batchArgs = mockBatchHandler.batch.mock.calls[0];
            // renderOptions is at index 19 (after tintEffect + 4 tint values = indices 14-18)
            expect(batchArgs[19]).toBe(node._renderOptions);
            expect(batchArgs[19].wrapFrame).toBe(true);
        });
    });
});
