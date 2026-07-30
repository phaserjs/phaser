var LayerCanvasRenderer = require('../../../src/gameobjects/layer/LayerCanvasRenderer');

describe('LayerCanvasRenderer', function ()
{
    var renderer;
    var layer;
    var camera;

    function makeChild(willRender, alpha, blendMode)
    {
        var child = {
            alpha: alpha !== undefined ? alpha : 1,
            blendMode: blendMode !== undefined ? blendMode : 0,
            willRender: vi.fn().mockReturnValue(willRender !== undefined ? willRender : true),
            renderCanvas: vi.fn(),
            setAlpha: vi.fn(function (a) { child.alpha = a; })
        };
        return child;
    }

    beforeEach(function ()
    {
        renderer = {
            currentBlendMode: 0,
            setBlendMode: vi.fn(function (mode) { renderer.currentBlendMode = mode; })
        };

        layer = {
            list: [],
            blendMode: -1,
            _alpha: 1,
            mask: null,
            depthSort: vi.fn()
        };

        camera = {};
    });

    it('should be importable', function ()
    {
        expect(LayerCanvasRenderer).toBeDefined();
    });

    it('should be a function', function ()
    {
        expect(typeof LayerCanvasRenderer).toBe('function');
    });

    it('should return immediately when children list is empty', function ()
    {
        layer.list = [];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(layer.depthSort).not.toHaveBeenCalled();
        expect(renderer.setBlendMode).not.toHaveBeenCalled();
    });

    it('should call depthSort when children are present', function ()
    {
        layer.list = [ makeChild() ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(layer.depthSort).toHaveBeenCalledOnce();
    });

    it('should call renderer.setBlendMode(0) when layer blendMode is -1', function ()
    {
        layer.blendMode = -1;
        layer.list = [ makeChild() ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(renderer.setBlendMode).toHaveBeenCalledWith(0);
    });

    it('should not call renderer.setBlendMode(0) when layer has a blend mode other than -1', function ()
    {
        layer.blendMode = 1;
        layer.list = [ makeChild() ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(renderer.setBlendMode).not.toHaveBeenCalledWith(0);
    });

    it('should skip children that will not render', function ()
    {
        var child = makeChild(false);
        layer.list = [ child ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(child.renderCanvas).not.toHaveBeenCalled();
        expect(child.setAlpha).not.toHaveBeenCalled();
    });

    it('should call renderCanvas on children that will render', function ()
    {
        var child = makeChild(true);
        layer.list = [ child ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(child.renderCanvas).toHaveBeenCalledOnce();
        expect(child.renderCanvas).toHaveBeenCalledWith(renderer, child, camera);
    });

    it('should multiply child alpha by layer alpha when rendering', function ()
    {
        var child = makeChild(true, 0.5);
        layer._alpha = 0.8;
        layer.list = [ child ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(child.setAlpha).toHaveBeenCalledWith(0.5 * 0.8);
    });

    it('should restore the child alpha after rendering', function ()
    {
        var child = makeChild(true, 0.6);
        layer._alpha = 0.5;
        layer.list = [ child ];

        var callArgs = [];
        child.setAlpha = vi.fn(function (a) { callArgs.push(a); });

        LayerCanvasRenderer(renderer, layer, camera);

        expect(callArgs[0]).toBeCloseTo(0.6 * 0.5);
        expect(callArgs[1]).toBeCloseTo(0.6);
    });

    it('should call willRender with camera for each child', function ()
    {
        var child = makeChild(true);
        layer.list = [ child ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(child.willRender).toHaveBeenCalledWith(camera);
    });

    it('should set child blend mode when layer has no blend mode and child blend differs', function ()
    {
        layer.blendMode = -1;
        renderer.currentBlendMode = 0;

        var child = makeChild(true, 1, 2);
        layer.list = [ child ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(renderer.setBlendMode).toHaveBeenCalledWith(2);
    });

    it('should not change child blend mode when layer has its own blend mode', function ()
    {
        layer.blendMode = 1;
        renderer.currentBlendMode = 0;

        var child = makeChild(true, 1, 2);
        layer.list = [ child ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(renderer.setBlendMode).not.toHaveBeenCalledWith(2);
    });

    it('should not set child blend mode when it matches current renderer blend mode', function ()
    {
        layer.blendMode = -1;
        // layer.blendMode === -1 causes setBlendMode(0) first, setting currentBlendMode to 0
        // A child with blendMode 0 matches currentBlendMode and should not trigger another setBlendMode call

        var child = makeChild(true, 1, 0);
        layer.list = [ child ];

        LayerCanvasRenderer(renderer, layer, camera);

        var calls = renderer.setBlendMode.mock.calls;
        // Only one call (setBlendMode(0) for the layer), not a second one for the child
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toBe(0);
    });

    it('should call mask.preRenderCanvas when a mask is set', function ()
    {
        var mask = {
            preRenderCanvas: vi.fn(),
            postRenderCanvas: vi.fn()
        };
        layer.mask = mask;
        layer.list = [ makeChild() ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(mask.preRenderCanvas).toHaveBeenCalledOnce();
        expect(mask.preRenderCanvas).toHaveBeenCalledWith(renderer, null, camera);
    });

    it('should call mask.postRenderCanvas when a mask is set', function ()
    {
        var mask = {
            preRenderCanvas: vi.fn(),
            postRenderCanvas: vi.fn()
        };
        layer.mask = mask;
        layer.list = [ makeChild() ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(mask.postRenderCanvas).toHaveBeenCalledOnce();
        expect(mask.postRenderCanvas).toHaveBeenCalledWith(renderer);
    });

    it('should not call mask methods when mask is null', function ()
    {
        layer.mask = null;
        layer.list = [ makeChild() ];

        // No error should be thrown
        expect(function ()
        {
            LayerCanvasRenderer(renderer, layer, camera);
        }).not.toThrow();
    });

    it('should render all renderable children in order', function ()
    {
        var order = [];
        var child1 = makeChild(true);
        var child2 = makeChild(true);
        var child3 = makeChild(true);

        child1.renderCanvas = vi.fn(function () { order.push(1); });
        child2.renderCanvas = vi.fn(function () { order.push(2); });
        child3.renderCanvas = vi.fn(function () { order.push(3); });

        layer.list = [ child1, child2, child3 ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(order).toEqual([ 1, 2, 3 ]);
    });

    it('should skip non-renderable children but still render others', function ()
    {
        var child1 = makeChild(true);
        var child2 = makeChild(false);
        var child3 = makeChild(true);

        layer.list = [ child1, child2, child3 ];

        LayerCanvasRenderer(renderer, layer, camera);

        expect(child1.renderCanvas).toHaveBeenCalledOnce();
        expect(child2.renderCanvas).not.toHaveBeenCalled();
        expect(child3.renderCanvas).toHaveBeenCalledOnce();
    });

    it('should use layer alpha of 1 when _alpha is 1', function ()
    {
        var child = makeChild(true, 0.4);
        layer._alpha = 1;
        layer.list = [ child ];

        var setAlphaArgs = [];
        child.setAlpha = vi.fn(function (a) { setAlphaArgs.push(a); });

        LayerCanvasRenderer(renderer, layer, camera);

        expect(setAlphaArgs[0]).toBeCloseTo(0.4);
    });

    it('should handle multiple children with mixed render eligibility', function ()
    {
        var children = [];
        for (var i = 0; i < 5; i++)
        {
            children.push(makeChild(i % 2 === 0));
        }
        layer.list = children;

        LayerCanvasRenderer(renderer, layer, camera);

        // indices 0, 2, 4 should render
        expect(children[0].renderCanvas).toHaveBeenCalledOnce();
        expect(children[1].renderCanvas).not.toHaveBeenCalled();
        expect(children[2].renderCanvas).toHaveBeenCalledOnce();
        expect(children[3].renderCanvas).not.toHaveBeenCalled();
        expect(children[4].renderCanvas).toHaveBeenCalledOnce();
    });
});
