var path = require('path');

var GetCalcMatrixPath = path.resolve(__dirname, '../../../src/gameobjects/GetCalcMatrix.js');
var ExternWebGLRendererPath = path.resolve(__dirname, '../../../src/gameobjects/extern/ExternWebGLRenderer.js');

describe('ExternWebGLRenderer', function ()
{
    var ExternWebGLRenderer;
    var renderer;
    var src;
    var drawingContext;
    var parentMatrix;
    var displayList;
    var displayListIndex;
    var yieldContextNode;
    var rebindContextNode;
    var mockGetCalcMatrixCalls;
    var mockCalcResult;
    var calcMatrix;

    beforeEach(function ()
    {
        mockGetCalcMatrixCalls = [];
        calcMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        mockCalcResult = { calc: calcMatrix };

        // Inject mock into the require cache before loading ExternWebGLRenderer
        delete require.cache[GetCalcMatrixPath];
        delete require.cache[ExternWebGLRendererPath];

        require.cache[GetCalcMatrixPath] = {
            id: GetCalcMatrixPath,
            filename: GetCalcMatrixPath,
            loaded: true,
            exports: function (src, camera, parentMatrix, flag)
            {
                mockGetCalcMatrixCalls.push([ src, camera, parentMatrix, flag ]);
                return mockCalcResult;
            }
        };

        ExternWebGLRenderer = require('../../../src/gameobjects/extern/ExternWebGLRenderer');

        yieldContextNode = { run: vi.fn() };
        rebindContextNode = { run: vi.fn() };

        renderer = {
            renderNodes: {
                getNode: vi.fn(function (name)
                {
                    if (name === 'YieldContext') { return yieldContextNode; }
                    if (name === 'RebindContext') { return rebindContextNode; }
                    return null;
                })
            }
        };

        src = {
            render: vi.fn()
        };

        drawingContext = {
            camera: { id: 'mockCamera' },
            useCanvas: false
        };

        parentMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        displayList = [ {}, {} ];
        displayListIndex = 0;
    });

    afterEach(function ()
    {
        delete require.cache[GetCalcMatrixPath];
        delete require.cache[ExternWebGLRendererPath];
    });

    it('should be a function', function ()
    {
        expect(typeof ExternWebGLRenderer).toBe('function');
    });

    it('should call YieldContext run with the drawing context', function ()
    {
        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(yieldContextNode.run).toHaveBeenCalledWith(drawingContext);
    });

    it('should call GetCalcMatrix with src, camera, parentMatrix, and inverted useCanvas flag', function ()
    {
        drawingContext.useCanvas = false;

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(mockGetCalcMatrixCalls.length).toBe(1);
        expect(mockGetCalcMatrixCalls[0][0]).toBe(src);
        expect(mockGetCalcMatrixCalls[0][1]).toBe(drawingContext.camera);
        expect(mockGetCalcMatrixCalls[0][2]).toBe(parentMatrix);
        expect(mockGetCalcMatrixCalls[0][3]).toBe(true);
    });

    it('should pass true as fourth arg to GetCalcMatrix when useCanvas is false', function ()
    {
        drawingContext.useCanvas = false;

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(mockGetCalcMatrixCalls[0][3]).toBe(true);
    });

    it('should pass false as fourth arg to GetCalcMatrix when useCanvas is true', function ()
    {
        drawingContext.useCanvas = true;

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(mockGetCalcMatrixCalls[0][3]).toBe(false);
    });

    it('should call src.render with the correct arguments', function ()
    {
        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(src.render).toHaveBeenCalledWith(renderer, drawingContext, calcMatrix, displayList, displayListIndex);
    });

    it('should call src.render with src as the this context', function ()
    {
        var renderThis = null;

        src.render = vi.fn(function ()
        {
            renderThis = this;
        });

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(renderThis).toBe(src);
    });

    it('should pass the calc matrix from GetCalcMatrix to src.render', function ()
    {
        var customCalc = { a: 2, b: 0, c: 0, d: 2, e: 10, f: 20 };

        mockCalcResult = { calc: customCalc };

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(src.render).toHaveBeenCalledWith(renderer, drawingContext, customCalc, displayList, displayListIndex);
    });

    it('should call RebindContext run with the drawing context', function ()
    {
        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(rebindContextNode.run).toHaveBeenCalledWith(drawingContext);
    });

    it('should call YieldContext before src.render', function ()
    {
        var callOrder = [];

        yieldContextNode.run = vi.fn(function () { callOrder.push('yield'); });
        src.render = vi.fn(function () { callOrder.push('render'); });
        rebindContextNode.run = vi.fn(function () { callOrder.push('rebind'); });

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(callOrder[0]).toBe('yield');
        expect(callOrder[1]).toBe('render');
    });

    it('should call RebindContext after src.render', function ()
    {
        var callOrder = [];

        yieldContextNode.run = vi.fn(function () { callOrder.push('yield'); });
        src.render = vi.fn(function () { callOrder.push('render'); });
        rebindContextNode.run = vi.fn(function () { callOrder.push('rebind'); });

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(callOrder[1]).toBe('render');
        expect(callOrder[2]).toBe('rebind');
    });

    it('should pass the displayListIndex to src.render', function ()
    {
        var index = 7;

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, index);

        expect(src.render).toHaveBeenCalledWith(renderer, drawingContext, calcMatrix, displayList, index);
    });

    it('should pass the displayList array to src.render', function ()
    {
        var list = [ { id: 'a' }, { id: 'b' }, { id: 'c' } ];

        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, list, 0);

        expect(src.render).toHaveBeenCalledWith(renderer, drawingContext, calcMatrix, list, 0);
    });

    it('should look up YieldContext and RebindContext nodes by name', function ()
    {
        ExternWebGLRenderer(renderer, src, drawingContext, parentMatrix, 0, displayList, displayListIndex);

        expect(renderer.renderNodes.getNode).toHaveBeenCalledWith('YieldContext');
        expect(renderer.renderNodes.getNode).toHaveBeenCalledWith('RebindContext');
    });
});
