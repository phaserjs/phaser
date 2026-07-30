var ContainerCanvasRenderer = require('../../../src/gameobjects/container/ContainerCanvasRenderer');

describe('ContainerCanvasRenderer', function ()
{
    var renderer;
    var container;
    var camera;
    var transformMatrix;

    function makeChild (opts)
    {
        opts = opts || {};
        var child = {
            alpha: opts.alpha !== undefined ? opts.alpha : 1,
            scrollFactorX: opts.scrollFactorX !== undefined ? opts.scrollFactorX : 1,
            scrollFactorY: opts.scrollFactorY !== undefined ? opts.scrollFactorY : 1,
            blendMode: opts.blendMode !== undefined ? opts.blendMode : 0,
            willRender: vi.fn().mockReturnValue(opts.willRender !== undefined ? opts.willRender : true),
            setAlpha: vi.fn(function (v) { this.alpha = v; }),
            setScrollFactor: vi.fn(function (x, y) { this.scrollFactorX = x; this.scrollFactorY = y; }),
            renderCanvas: vi.fn()
        };
        return child;
    }

    beforeEach(function ()
    {
        transformMatrix = {
            loadIdentity: vi.fn(),
            multiply: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            scale: vi.fn(),
            applyITRS: vi.fn()
        };

        renderer = {
            currentBlendMode: 0,
            setBlendMode: vi.fn()
        };

        container = {
            list: [],
            localTransform: transformMatrix,
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            blendMode: 0,
            _alpha: 1,
            scrollFactorX: 1,
            scrollFactorY: 1,
            mask: null
        };

        camera = {
            addToRenderList: vi.fn()
        };
    });

    it('should always call camera.addToRenderList with the container', function ()
    {
        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(camera.addToRenderList).toHaveBeenCalledWith(container);
    });

    it('should call camera.addToRenderList even when the container has no children', function ()
    {
        container.list = [];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(camera.addToRenderList).toHaveBeenCalledOnce();
    });

    it('should return early and not process the transform matrix when children list is empty', function ()
    {
        container.list = [];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(transformMatrix.applyITRS).not.toHaveBeenCalled();
        expect(transformMatrix.loadIdentity).not.toHaveBeenCalled();
    });

    it('should call applyITRS when no parentMatrix is provided', function ()
    {
        container.list = [ makeChild() ];
        container.x = 10;
        container.y = 20;
        container.rotation = 0.5;
        container.scaleX = 2;
        container.scaleY = 3;

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(transformMatrix.applyITRS).toHaveBeenCalledWith(10, 20, 0.5, 2, 3);
    });

    it('should call loadIdentity, multiply, translate, rotate, scale when parentMatrix is provided', function ()
    {
        var parentMatrix = { type: 'parentMatrix' };
        container.list = [ makeChild() ];
        container.x = 5;
        container.y = 15;
        container.rotation = 1.0;
        container.scaleX = 1.5;
        container.scaleY = 2.5;

        ContainerCanvasRenderer(renderer, container, camera, parentMatrix);

        expect(transformMatrix.loadIdentity).toHaveBeenCalled();
        expect(transformMatrix.multiply).toHaveBeenCalledWith(parentMatrix);
        expect(transformMatrix.translate).toHaveBeenCalledWith(5, 15);
        expect(transformMatrix.rotate).toHaveBeenCalledWith(1.0);
        expect(transformMatrix.scale).toHaveBeenCalledWith(1.5, 2.5);
        expect(transformMatrix.applyITRS).not.toHaveBeenCalled();
    });

    it('should not call renderer.setBlendMode when container has a valid blend mode', function ()
    {
        container.blendMode = 1;
        container.list = [ makeChild() ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(renderer.setBlendMode).not.toHaveBeenCalled();
    });

    it('should call renderer.setBlendMode(0) when container blendMode is -1', function ()
    {
        container.blendMode = -1;
        container.list = [ makeChild() ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(renderer.setBlendMode).toHaveBeenCalledWith(0);
    });

    it('should call child.renderCanvas with correct arguments', function ()
    {
        var child = makeChild();
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(child.renderCanvas).toHaveBeenCalledWith(renderer, child, camera, transformMatrix);
    });

    it('should skip children where willRender returns false', function ()
    {
        var child = makeChild({ willRender: false });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(child.renderCanvas).not.toHaveBeenCalled();
    });

    it('should multiply child alpha by container alpha before rendering', function ()
    {
        container._alpha = 0.5;
        var child = makeChild({ alpha: 0.8 });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(child.setAlpha).toHaveBeenCalledWith(0.8 * 0.5);
    });

    it('should restore child alpha to original value after rendering', function ()
    {
        container._alpha = 0.5;
        var originalAlpha = 0.8;
        var child = makeChild({ alpha: originalAlpha });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        var calls = child.setAlpha.mock.calls;
        expect(calls[calls.length - 1][0]).toBe(originalAlpha);
    });

    it('should multiply child scrollFactors by container scrollFactors before rendering', function ()
    {
        container.scrollFactorX = 2;
        container.scrollFactorY = 3;
        var child = makeChild({ scrollFactorX: 0.5, scrollFactorY: 0.25 });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(child.setScrollFactor).toHaveBeenCalledWith(0.5 * 2, 0.25 * 3);
    });

    it('should restore child scrollFactors to original values after rendering', function ()
    {
        container.scrollFactorX = 2;
        container.scrollFactorY = 3;
        var origX = 0.5;
        var origY = 0.25;
        var child = makeChild({ scrollFactorX: origX, scrollFactorY: origY });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        var calls = child.setScrollFactor.mock.calls;
        var lastCall = calls[calls.length - 1];
        expect(lastCall[0]).toBe(origX);
        expect(lastCall[1]).toBe(origY);
    });

    it('should set child blend mode when container blendMode is -1 and child blend mode differs from renderer', function ()
    {
        container.blendMode = -1;
        renderer.currentBlendMode = 0;
        var child = makeChild({ blendMode: 2 });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(renderer.setBlendMode).toHaveBeenCalledWith(2);
    });

    it('should not set child blend mode when container has a valid blend mode', function ()
    {
        container.blendMode = 1;
        renderer.currentBlendMode = 0;
        var child = makeChild({ blendMode: 2 });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(renderer.setBlendMode).not.toHaveBeenCalled();
    });

    it('should not set child blend mode when child blend mode matches renderer currentBlendMode', function ()
    {
        container.blendMode = -1;
        renderer.currentBlendMode = 2;
        var child = makeChild({ blendMode: 2 });
        container.list = [ child ];

        // renderer.setBlendMode(0) gets called for container, then child blend mode matches current
        ContainerCanvasRenderer(renderer, container, camera, null);

        var calls = renderer.setBlendMode.mock.calls;
        // Only the initial container call with 0 should have happened
        expect(calls.length).toBe(1);
        expect(calls[0][0]).toBe(0);
    });

    it('should call mask.preRenderCanvas before children and mask.postRenderCanvas after', function ()
    {
        var mask = {
            preRenderCanvas: vi.fn(),
            postRenderCanvas: vi.fn()
        };
        container.mask = mask;
        var child = makeChild();
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(mask.preRenderCanvas).toHaveBeenCalledWith(renderer, null, camera);
        expect(mask.postRenderCanvas).toHaveBeenCalledWith(renderer);
    });

    it('should call mask.preRenderCanvas before child.renderCanvas', function ()
    {
        var callOrder = [];
        var mask = {
            preRenderCanvas: vi.fn(function () { callOrder.push('pre'); }),
            postRenderCanvas: vi.fn(function () { callOrder.push('post'); })
        };
        container.mask = mask;
        var child = makeChild();
        child.renderCanvas = vi.fn(function () { callOrder.push('render'); });
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(callOrder).toEqual([ 'pre', 'render', 'post' ]);
    });

    it('should not call mask methods when container has no mask', function ()
    {
        container.mask = null;
        container.list = [ makeChild() ];

        // Should not throw
        expect(function ()
        {
            ContainerCanvasRenderer(renderer, container, camera, null);
        }).not.toThrow();
    });

    it('should render all children that pass willRender check', function ()
    {
        var child1 = makeChild({ willRender: true });
        var child2 = makeChild({ willRender: false });
        var child3 = makeChild({ willRender: true });
        container.list = [ child1, child2, child3 ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(child1.renderCanvas).toHaveBeenCalled();
        expect(child2.renderCanvas).not.toHaveBeenCalled();
        expect(child3.renderCanvas).toHaveBeenCalled();
    });

    it('should pass camera to each child willRender call', function ()
    {
        var child = makeChild();
        container.list = [ child ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(child.willRender).toHaveBeenCalledWith(camera);
    });

    it('should handle a container with multiple children correctly', function ()
    {
        container._alpha = 0.5;
        container.scrollFactorX = 2;
        container.scrollFactorY = 2;

        var child1 = makeChild({ alpha: 1, scrollFactorX: 1, scrollFactorY: 1 });
        var child2 = makeChild({ alpha: 0.5, scrollFactorX: 0.5, scrollFactorY: 0.5 });
        container.list = [ child1, child2 ];

        ContainerCanvasRenderer(renderer, container, camera, null);

        expect(child1.renderCanvas).toHaveBeenCalled();
        expect(child2.renderCanvas).toHaveBeenCalled();
    });
});
