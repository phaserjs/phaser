var TilemapGPULayerWebGLRenderer = require('../../src/tilemaps/TilemapGPULayerWebGLRenderer');

describe('TilemapGPULayerWebGLRenderer', function ()
{
    it('should be a function', function ()
    {
        expect(typeof TilemapGPULayerWebGLRenderer).toBe('function');
    });

    it('should call submitterNode.run with drawingContext, src, and parentMatrix', function ()
    {
        var runCalls = [];
        var submitterNode = {
            run: function (drawingContext, src, parentMatrix)
            {
                runCalls.push({ drawingContext: drawingContext, src: src, parentMatrix: parentMatrix });
            }
        };

        var drawingContext = { id: 'drawingContext' };
        var parentMatrix = { id: 'parentMatrix' };
        var src = {
            customRenderNodes: { Submitter: submitterNode },
            defaultRenderNodes: {}
        };
        var renderer = {};

        TilemapGPULayerWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(runCalls.length).toBe(1);
        expect(runCalls[0].drawingContext).toBe(drawingContext);
        expect(runCalls[0].src).toBe(src);
        expect(runCalls[0].parentMatrix).toBe(parentMatrix);
    });

    it('should use defaultRenderNodes.Submitter when customRenderNodes.Submitter is not set', function ()
    {
        var runCalls = [];
        var defaultSubmitter = {
            run: function (drawingContext, src, parentMatrix)
            {
                runCalls.push({ drawingContext: drawingContext, src: src, parentMatrix: parentMatrix });
            }
        };

        var drawingContext = { id: 'drawingContext' };
        var parentMatrix = { id: 'parentMatrix' };
        var src = {
            customRenderNodes: {},
            defaultRenderNodes: { Submitter: defaultSubmitter }
        };
        var renderer = {};

        TilemapGPULayerWebGLRenderer(renderer, src, drawingContext, parentMatrix);

        expect(runCalls.length).toBe(1);
        expect(runCalls[0].drawingContext).toBe(drawingContext);
        expect(runCalls[0].src).toBe(src);
        expect(runCalls[0].parentMatrix).toBe(parentMatrix);
    });

    it('should prefer customRenderNodes.Submitter over defaultRenderNodes.Submitter', function ()
    {
        var customRunCalled = false;
        var defaultRunCalled = false;

        var customSubmitter = {
            run: function ()
            {
                customRunCalled = true;
            }
        };
        var defaultSubmitter = {
            run: function ()
            {
                defaultRunCalled = true;
            }
        };

        var src = {
            customRenderNodes: { Submitter: customSubmitter },
            defaultRenderNodes: { Submitter: defaultSubmitter }
        };
        var renderer = {};
        var drawingContext = {};

        TilemapGPULayerWebGLRenderer(renderer, src, drawingContext, undefined);

        expect(customRunCalled).toBe(true);
        expect(defaultRunCalled).toBe(false);
    });

    it('should pass undefined parentMatrix when not provided', function ()
    {
        var capturedParentMatrix = 'not-called';
        var submitterNode = {
            run: function (drawingContext, src, parentMatrix)
            {
                capturedParentMatrix = parentMatrix;
            }
        };

        var src = {
            customRenderNodes: { Submitter: submitterNode },
            defaultRenderNodes: {}
        };
        var renderer = {};
        var drawingContext = {};

        TilemapGPULayerWebGLRenderer(renderer, src, drawingContext);

        expect(capturedParentMatrix).toBeUndefined();
    });
});
