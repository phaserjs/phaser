vi.mock('../../../src/const', function ()
{
    return {
        BlendModes: {
            SKIP_CHECK: -1,
            NORMAL: 0
        }
    };
});

var ContainerWebGLRenderer = require('../../../src/gameobjects/container/ContainerWebGLRenderer');

function makeTransformMatrix ()
{
    return {
        loadIdentity: vi.fn(),
        multiply: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        scale: vi.fn(),
        applyITRS: vi.fn()
    };
}

function makeCamera ()
{
    return {
        addToRenderList: vi.fn()
    };
}

function makeContext (blendMode)
{
    var ctx = {
        camera: makeCamera(),
        blendMode: blendMode !== undefined ? blendMode : 0,
        setBlendMode: vi.fn(),
        use: vi.fn(),
        release: vi.fn(),
        getClone: vi.fn()
    };

    ctx.getClone.mockReturnValue(ctx);

    return ctx;
}

function makeContainer (children, overrides)
{
    var base = {
        list: children || [],
        localTransform: makeTransformMatrix(),
        blendMode: -1,
        alpha: 1,
        scrollFactorX: 1,
        scrollFactorY: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            base[key] = overrides[key];
        }
    }

    return base;
}

function makeChild (overrides)
{
    var child = {
        willRender: vi.fn().mockReturnValue(true),
        alphaTopLeft: 1,
        alphaTopRight: 1,
        alphaBottomLeft: 1,
        alphaBottomRight: 1,
        scrollFactorX: 1,
        scrollFactorY: 1,
        blendMode: 0,
        setAlpha: vi.fn(),
        setScrollFactor: vi.fn(),
        renderWebGLStep: vi.fn()
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            child[key] = overrides[key];
        }
    }

    return child;
}

describe('ContainerWebGLRenderer', function ()
{
    it('should be a function', function ()
    {
        expect(typeof ContainerWebGLRenderer).toBe('function');
    });

    describe('camera and early exit', function ()
    {
        it('should always call camera.addToRenderList with the container', function ()
        {
            var ctx = makeContext();
            var container = makeContainer([]);
            var renderer = {};

            ContainerWebGLRenderer(renderer, container, ctx, null, 0, [], 0);

            expect(ctx.camera.addToRenderList).toHaveBeenCalledWith(container);
        });

        it('should return early when the container has no children', function ()
        {
            var ctx = makeContext();
            var container = makeContainer([]);
            var renderer = {};

            ContainerWebGLRenderer(renderer, container, ctx, null, 0, [], 0);

            expect(container.localTransform.applyITRS).not.toHaveBeenCalled();
            expect(container.localTransform.loadIdentity).not.toHaveBeenCalled();
        });

        it('should call camera.addToRenderList even when there are no children', function ()
        {
            var ctx = makeContext();
            var container = makeContainer([]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(ctx.camera.addToRenderList).toHaveBeenCalledTimes(1);
        });
    });

    describe('transform matrix without parentMatrix', function ()
    {
        it('should call applyITRS when no parentMatrix is provided', function ()
        {
            var ctx = makeContext();
            var child = makeChild();
            var container = makeContainer([ child ], { x: 10, y: 20, rotation: 0.5, scaleX: 2, scaleY: 3 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(container.localTransform.applyITRS).toHaveBeenCalledWith(10, 20, 0.5, 2, 3);
        });

        it('should not call loadIdentity or multiply when no parentMatrix is provided', function ()
        {
            var ctx = makeContext();
            var child = makeChild();
            var container = makeContainer([ child ]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(container.localTransform.loadIdentity).not.toHaveBeenCalled();
            expect(container.localTransform.multiply).not.toHaveBeenCalled();
        });
    });

    describe('transform matrix with parentMatrix', function ()
    {
        it('should call loadIdentity, multiply, translate, rotate, scale when parentMatrix is provided', function ()
        {
            var ctx = makeContext();
            var child = makeChild();
            var container = makeContainer([ child ], { x: 5, y: 10, rotation: 1, scaleX: 2, scaleY: 2 });
            var parentMatrix = {};

            ContainerWebGLRenderer({}, container, ctx, parentMatrix, 0, [], 0);

            var tm = container.localTransform;

            expect(tm.loadIdentity).toHaveBeenCalledTimes(1);
            expect(tm.multiply).toHaveBeenCalledWith(parentMatrix);
            expect(tm.translate).toHaveBeenCalledWith(5, 10);
            expect(tm.rotate).toHaveBeenCalledWith(1);
            expect(tm.scale).toHaveBeenCalledWith(2, 2);
        });

        it('should not call applyITRS when parentMatrix is provided', function ()
        {
            var ctx = makeContext();
            var child = makeChild();
            var container = makeContainer([ child ]);
            var parentMatrix = {};

            ContainerWebGLRenderer({}, container, ctx, parentMatrix, 0, [], 0);

            expect(container.localTransform.applyITRS).not.toHaveBeenCalled();
        });
    });

    describe('child willRender filtering', function ()
    {
        it('should skip children where willRender returns false', function ()
        {
            var ctx = makeContext();
            var child = makeChild({ willRender: vi.fn().mockReturnValue(false) });
            var container = makeContainer([ child ]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(child.renderWebGLStep).not.toHaveBeenCalled();
            expect(child.setAlpha).not.toHaveBeenCalled();
        });

        it('should pass the camera to child.willRender', function ()
        {
            var ctx = makeContext();
            var child = makeChild();
            var container = makeContainer([ child ]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(child.willRender).toHaveBeenCalledWith(ctx.camera);
        });

        it('should render children where willRender returns true', function ()
        {
            var ctx = makeContext();
            var child = makeChild({ willRender: vi.fn().mockReturnValue(true) });
            var container = makeContainer([ child ]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(child.renderWebGLStep).toHaveBeenCalledTimes(1);
        });
    });

    describe('child alpha handling with alphaTopLeft defined', function ()
    {
        it('should multiply each corner alpha by container alpha before rendering', function ()
        {
            var ctx = makeContext();
            var child = makeChild({
                alphaTopLeft: 0.5,
                alphaTopRight: 0.6,
                alphaBottomLeft: 0.7,
                alphaBottomRight: 0.8
            });
            var container = makeContainer([ child ], { alpha: 0.5 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            var setAlphaCalls = child.setAlpha.mock.calls;

            // First call: multiplied values
            expect(setAlphaCalls[0][0]).toBeCloseTo(0.25);
            expect(setAlphaCalls[0][1]).toBeCloseTo(0.30);
            expect(setAlphaCalls[0][2]).toBeCloseTo(0.35);
            expect(setAlphaCalls[0][3]).toBeCloseTo(0.40);
        });

        it('should restore original corner alpha values after rendering', function ()
        {
            var ctx = makeContext();
            var child = makeChild({
                alphaTopLeft: 0.5,
                alphaTopRight: 0.6,
                alphaBottomLeft: 0.7,
                alphaBottomRight: 0.8
            });
            var container = makeContainer([ child ], { alpha: 0.5 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            var setAlphaCalls = child.setAlpha.mock.calls;

            // Second call: restored original values
            expect(setAlphaCalls[1][0]).toBeCloseTo(0.5);
            expect(setAlphaCalls[1][1]).toBeCloseTo(0.6);
            expect(setAlphaCalls[1][2]).toBeCloseTo(0.7);
            expect(setAlphaCalls[1][3]).toBeCloseTo(0.8);
        });
    });

    describe('child alpha handling without alphaTopLeft (uniform alpha)', function ()
    {
        it('should use child.alpha for all corners when alphaTopLeft is undefined', function ()
        {
            var ctx = makeContext();
            var child = makeChild();

            // Remove alphaTopLeft so the else branch is taken
            delete child.alphaTopLeft;
            child.alpha = 0.4;

            var container = makeContainer([ child ], { alpha: 0.5 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            var setAlphaCalls = child.setAlpha.mock.calls;

            // All four corners should be 0.4 * 0.5 = 0.2
            expect(setAlphaCalls[0][0]).toBeCloseTo(0.2);
            expect(setAlphaCalls[0][1]).toBeCloseTo(0.2);
            expect(setAlphaCalls[0][2]).toBeCloseTo(0.2);
            expect(setAlphaCalls[0][3]).toBeCloseTo(0.2);
        });

        it('should restore uniform alpha value after rendering', function ()
        {
            var ctx = makeContext();
            var child = makeChild();

            delete child.alphaTopLeft;
            child.alpha = 0.4;

            var container = makeContainer([ child ], { alpha: 0.5 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            var setAlphaCalls = child.setAlpha.mock.calls;

            // Restored values should all be the original uniform alpha
            expect(setAlphaCalls[1][0]).toBeCloseTo(0.4);
            expect(setAlphaCalls[1][1]).toBeCloseTo(0.4);
            expect(setAlphaCalls[1][2]).toBeCloseTo(0.4);
            expect(setAlphaCalls[1][3]).toBeCloseTo(0.4);
        });
    });

    describe('child scroll factor handling', function ()
    {
        it('should multiply child scrollFactor by container scrollFactor before rendering', function ()
        {
            var ctx = makeContext();
            var child = makeChild({ scrollFactorX: 0.5, scrollFactorY: 0.25 });
            var container = makeContainer([ child ], { scrollFactorX: 2, scrollFactorY: 4 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            var calls = child.setScrollFactor.mock.calls;

            // First call: multiplied
            expect(calls[0][0]).toBeCloseTo(1.0);
            expect(calls[0][1]).toBeCloseTo(1.0);
        });

        it('should restore original child scrollFactor values after rendering', function ()
        {
            var ctx = makeContext();
            var child = makeChild({ scrollFactorX: 0.5, scrollFactorY: 0.25 });
            var container = makeContainer([ child ], { scrollFactorX: 2, scrollFactorY: 4 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            var calls = child.setScrollFactor.mock.calls;

            // Second call: restored originals
            expect(calls[1][0]).toBeCloseTo(0.5);
            expect(calls[1][1]).toBeCloseTo(0.25);
        });
    });

    describe('renderWebGLStep call', function ()
    {
        it('should call child.renderWebGLStep with correct arguments', function ()
        {
            var renderer = {};
            var ctx = makeContext();
            var child = makeChild();
            var container = makeContainer([ child ]);

            ContainerWebGLRenderer(renderer, container, ctx, null, 0, [], 0);

            expect(child.renderWebGLStep).toHaveBeenCalledTimes(1);

            var callArgs = child.renderWebGLStep.mock.calls[0];

            expect(callArgs[0]).toBe(renderer);
            expect(callArgs[1]).toBe(child);
            expect(callArgs[2]).toBe(ctx); // currentContext
            expect(callArgs[3]).toBe(container.localTransform); // transformMatrix
            expect(callArgs[4]).toBeUndefined();
            expect(callArgs[5]).toBe(container.list); // children array
            expect(callArgs[6]).toBe(0); // index
        });

        it('should pass correct child index when multiple children exist', function ()
        {
            var renderer = {};
            var ctx = makeContext();
            var child0 = makeChild();
            var child1 = makeChild();
            var child2 = makeChild();
            var container = makeContainer([ child0, child1, child2 ]);

            ContainerWebGLRenderer(renderer, container, ctx, null, 0, [], 0);

            expect(child0.renderWebGLStep.mock.calls[0][6]).toBe(0);
            expect(child1.renderWebGLStep.mock.calls[0][6]).toBe(1);
            expect(child2.renderWebGLStep.mock.calls[0][6]).toBe(2);
        });
    });

    describe('blend mode: container has no blend mode (SKIP_CHECK = -1)', function ()
    {
        it('should clone context and set blend mode to 0 when container blendMode is -1 and context blendMode is not 0', function ()
        {
            var clonedCtx = makeContext(0);
            var ctx = makeContext(1);
            ctx.getClone.mockReturnValue(clonedCtx);

            var child = makeChild({ blendMode: 0 });
            var container = makeContainer([ child ], { blendMode: -1 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(ctx.getClone).toHaveBeenCalled();
            expect(clonedCtx.setBlendMode).toHaveBeenCalledWith(0);
            expect(clonedCtx.use).toHaveBeenCalled();
        });

        it('should not clone context when container blendMode is -1 and context blendMode is already 0', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild({ blendMode: 0 });
            var container = makeContainer([ child ], { blendMode: -1 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            // getClone should not be called for the baseContext normalisation
            // (child.blendMode === currentContext.blendMode so no child clone either)
            expect(ctx.getClone).not.toHaveBeenCalled();
        });

        it('should clone context for a child whose blendMode differs from currentContext blendMode when container has no blend mode', function ()
        {
            var childCtx = makeContext(2);
            var ctx = makeContext(0);
            ctx.getClone.mockReturnValue(childCtx);

            var child = makeChild({ blendMode: 2 });
            var container = makeContainer([ child ], { blendMode: -1 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(ctx.getClone).toHaveBeenCalled();
            expect(childCtx.setBlendMode).toHaveBeenCalledWith(2);
            expect(childCtx.use).toHaveBeenCalled();
        });

        it('should not clone context for child when container has its own blend mode', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild({ blendMode: 2 });
            var container = makeContainer([ child ], { blendMode: 1 }); // container has a real blend mode

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(ctx.getClone).not.toHaveBeenCalled();
        });

        it('should not clone context for child when child blendMode is SKIP_CHECK (-1)', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild({ blendMode: -1 }); // SKIP_CHECK
            var container = makeContainer([ child ], { blendMode: -1 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(ctx.getClone).not.toHaveBeenCalled();
        });
    });

    describe('context release', function ()
    {
        it('should release currentContext when it differs from the original drawingContext', function ()
        {
            var clonedCtx = makeContext(2);
            clonedCtx.getClone = vi.fn().mockReturnValue(clonedCtx);
            var ctx = makeContext(0);
            ctx.getClone.mockReturnValue(clonedCtx);

            var child = makeChild({ blendMode: 2 });
            var container = makeContainer([ child ], { blendMode: -1 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(clonedCtx.release).toHaveBeenCalledTimes(1);
        });

        it('should not call release when currentContext is the same as drawingContext', function ()
        {
            var ctx = makeContext(0);
            var child = makeChild({ blendMode: 0 });
            var container = makeContainer([ child ], { blendMode: -1 });

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(ctx.release).not.toHaveBeenCalled();
        });

        it('should not call release when container has no children', function ()
        {
            var ctx = makeContext(0);
            var container = makeContainer([]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(ctx.release).not.toHaveBeenCalled();
        });
    });

    describe('multiple children', function ()
    {
        it('should call renderWebGLStep for every child that passes willRender', function ()
        {
            var ctx = makeContext();
            var children = [ makeChild(), makeChild(), makeChild() ];
            var container = makeContainer(children);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            children.forEach(function (child)
            {
                expect(child.renderWebGLStep).toHaveBeenCalledTimes(1);
            });
        });

        it('should skip only children where willRender returns false among many children', function ()
        {
            var ctx = makeContext();
            var visibleChild = makeChild();
            var hiddenChild = makeChild({ willRender: vi.fn().mockReturnValue(false) });
            var container = makeContainer([ visibleChild, hiddenChild ]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(visibleChild.renderWebGLStep).toHaveBeenCalledTimes(1);
            expect(hiddenChild.renderWebGLStep).not.toHaveBeenCalled();
        });

        it('should call setAlpha and setScrollFactor twice per rendered child (set + restore)', function ()
        {
            var ctx = makeContext();
            var child = makeChild();
            var container = makeContainer([ child ]);

            ContainerWebGLRenderer({}, container, ctx, null, 0, [], 0);

            expect(child.setAlpha).toHaveBeenCalledTimes(2);
            expect(child.setScrollFactor).toHaveBeenCalledTimes(2);
        });
    });
});
