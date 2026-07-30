var LayerWebGLRenderer = require('../../../src/gameobjects/layer/LayerWebGLRenderer');
var CONST = require('../../../src/const');

var SKIP_CHECK = -1; // CONST.BlendModes.SKIP_CHECK

function makeDrawingContext (blendMode)
{
    var ctx = {
        camera: {},
        blendMode: blendMode !== undefined ? blendMode : 0,
        clones: [],
        setBlendModeCalled: false,
        useCalled: false,
        releaseCalled: false,
        setBlendMode: function (mode)
        {
            this.blendMode = mode;
            this.setBlendModeCalled = true;
        },
        use: function ()
        {
            this.useCalled = true;
        },
        release: function ()
        {
            this.releaseCalled = true;
        },
        getClone: function ()
        {
            var clone = makeDrawingContext(this.blendMode);
            clone.isClone = true;
            this.clones.push(clone);
            return clone;
        }
    };
    return ctx;
}

function makeChild (options)
{
    options = options || {};
    var blendMode = options.blendMode !== undefined ? options.blendMode : 0;
    var willRender = options.willRender !== undefined ? options.willRender : true;

    var child = {
        blendMode: blendMode,
        setAlphaCalls: [],
        renderWebGLStepCalled: false,
        willRender: function ()
        {
            return willRender;
        },
        setAlpha: function (tl, tr, bl, br)
        {
            this.setAlphaCalls.push({ tl: tl, tr: tr, bl: bl, br: br });
        },
        renderWebGLStep: function ()
        {
            this.renderWebGLStepCalled = true;
        }
    };

    if (options.useCornerAlpha)
    {
        child.alphaTopLeft = options.alphaTopLeft !== undefined ? options.alphaTopLeft : 1;
        child.alphaTopRight = options.alphaTopRight !== undefined ? options.alphaTopRight : 1;
        child.alphaBottomLeft = options.alphaBottomLeft !== undefined ? options.alphaBottomLeft : 1;
        child.alphaBottomRight = options.alphaBottomRight !== undefined ? options.alphaBottomRight : 1;
    }
    else
    {
        child.alpha = options.alpha !== undefined ? options.alpha : 1;
    }

    return child;
}

function makeLayer (options)
{
    options = options || {};
    var layer = {
        list: options.list || [],
        alpha: options.alpha !== undefined ? options.alpha : 1,
        blendMode: options.blendMode !== undefined ? options.blendMode : SKIP_CHECK,
        depthSortCalled: false,
        depthSort: function ()
        {
            this.depthSortCalled = true;
        }
    };
    return layer;
}

describe('LayerWebGLRenderer', function ()
{
    it('should be a function', function ()
    {
        expect(typeof LayerWebGLRenderer).toBe('function');
    });

    describe('early exit when no children', function ()
    {
        it('should return without calling depthSort when layer has no children', function ()
        {
            var layer = makeLayer({ list: [] });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(layer.depthSortCalled).toBe(false);
        });

        it('should not release context when layer has no children', function ()
        {
            var layer = makeLayer({ list: [] });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(ctx.releaseCalled).toBe(false);
        });
    });

    describe('depthSort', function ()
    {
        it('should call depthSort on the layer when children exist', function ()
        {
            var child = makeChild();
            var layer = makeLayer({ list: [ child ] });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(layer.depthSortCalled).toBe(true);
        });
    });

    describe('child rendering', function ()
    {
        it('should call renderWebGLStep on a child that will render', function ()
        {
            var child = makeChild({ willRender: true });
            var layer = makeLayer({ list: [ child ] });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(child.renderWebGLStepCalled).toBe(true);
        });

        it('should not call renderWebGLStep on a child that will not render', function ()
        {
            var child = makeChild({ willRender: false });
            var layer = makeLayer({ list: [ child ] });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(child.renderWebGLStepCalled).toBe(false);
        });

        it('should call setAlpha twice on a rendered child (apply and restore)', function ()
        {
            var child = makeChild({ willRender: true, alpha: 1 });
            var layer = makeLayer({ list: [ child ], alpha: 1 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(child.setAlphaCalls.length).toBe(2);
        });

        it('should not call setAlpha on a skipped child', function ()
        {
            var child = makeChild({ willRender: false, alpha: 1 });
            var layer = makeLayer({ list: [ child ], alpha: 1 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(child.setAlphaCalls.length).toBe(0);
        });

        it('should restore original alpha values after rendering', function ()
        {
            var child = makeChild({ willRender: true, alpha: 0.8 });
            var layer = makeLayer({ list: [ child ], alpha: 0.5 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            // Second call restores originals
            var restore = child.setAlphaCalls[1];
            expect(restore.tl).toBeCloseTo(0.8);
            expect(restore.tr).toBeCloseTo(0.8);
            expect(restore.bl).toBeCloseTo(0.8);
            expect(restore.br).toBeCloseTo(0.8);
        });
    });

    describe('alpha multiplication', function ()
    {
        it('should multiply uniform child alpha by layer alpha', function ()
        {
            var child = makeChild({ willRender: true, alpha: 0.5 });
            var layer = makeLayer({ list: [ child ], alpha: 0.4 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            var applied = child.setAlphaCalls[0];
            expect(applied.tl).toBeCloseTo(0.2);
            expect(applied.tr).toBeCloseTo(0.2);
            expect(applied.bl).toBeCloseTo(0.2);
            expect(applied.br).toBeCloseTo(0.2);
        });

        it('should multiply corner alpha values by layer alpha', function ()
        {
            var child = makeChild({
                willRender: true,
                useCornerAlpha: true,
                alphaTopLeft: 0.5,
                alphaTopRight: 0.6,
                alphaBottomLeft: 0.7,
                alphaBottomRight: 0.8
            });
            var layer = makeLayer({ list: [ child ], alpha: 0.5 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            var applied = child.setAlphaCalls[0];
            expect(applied.tl).toBeCloseTo(0.25);
            expect(applied.tr).toBeCloseTo(0.30);
            expect(applied.bl).toBeCloseTo(0.35);
            expect(applied.br).toBeCloseTo(0.40);
        });

        it('should restore corner alpha values after rendering', function ()
        {
            var child = makeChild({
                willRender: true,
                useCornerAlpha: true,
                alphaTopLeft: 0.5,
                alphaTopRight: 0.6,
                alphaBottomLeft: 0.7,
                alphaBottomRight: 0.8
            });
            var layer = makeLayer({ list: [ child ], alpha: 0.5 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            var restore = child.setAlphaCalls[1];
            expect(restore.tl).toBeCloseTo(0.5);
            expect(restore.tr).toBeCloseTo(0.6);
            expect(restore.bl).toBeCloseTo(0.7);
            expect(restore.br).toBeCloseTo(0.8);
        });

        it('should handle layer alpha of 0', function ()
        {
            var child = makeChild({ willRender: true, alpha: 1 });
            var layer = makeLayer({ list: [ child ], alpha: 0 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            var applied = child.setAlphaCalls[0];
            expect(applied.tl).toBeCloseTo(0);
            expect(applied.tr).toBeCloseTo(0);
            expect(applied.bl).toBeCloseTo(0);
            expect(applied.br).toBeCloseTo(0);
        });

        it('should handle layer alpha of 1 leaving child alpha unchanged', function ()
        {
            var child = makeChild({ willRender: true, alpha: 0.75 });
            var layer = makeLayer({ list: [ child ], alpha: 1 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            var applied = child.setAlphaCalls[0];
            expect(applied.tl).toBeCloseTo(0.75);
        });
    });

    describe('blend mode handling — layer without blend mode (SKIP_CHECK)', function ()
    {
        it('should clone context and set blend mode 0 when context blend mode is non-zero and layer is SKIP_CHECK', function ()
        {
            var child = makeChild({ willRender: true });
            var layer = makeLayer({ list: [ child ], blendMode: SKIP_CHECK });
            var ctx = makeDrawingContext(2); // non-zero blend mode

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(ctx.clones.length).toBe(1);
            expect(ctx.clones[0].blendMode).toBe(0);
            expect(ctx.clones[0].useCalled).toBe(true);
        });

        it('should not clone context when context blend mode is already 0 and layer is SKIP_CHECK', function ()
        {
            var child = makeChild({ willRender: true });
            var layer = makeLayer({ list: [ child ], blendMode: SKIP_CHECK });
            var ctx = makeDrawingContext(0);

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(ctx.clones.length).toBe(0);
        });

        it('should clone context for child with non-matching blend mode when layer is SKIP_CHECK', function ()
        {
            var child = makeChild({ willRender: true, blendMode: 3 });
            var layer = makeLayer({ list: [ child ], blendMode: SKIP_CHECK });
            var ctx = makeDrawingContext(0); // starts at 0, child wants 3

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            // One clone for child's blend mode
            expect(ctx.clones.length).toBe(1);
            expect(ctx.clones[0].blendMode).toBe(3);
        });

        it('should not clone context for child with SKIP_CHECK blend mode when layer is SKIP_CHECK', function ()
        {
            var child = makeChild({ willRender: true, blendMode: SKIP_CHECK });
            var layer = makeLayer({ list: [ child ], blendMode: SKIP_CHECK });
            var ctx = makeDrawingContext(0);

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(ctx.clones.length).toBe(0);
        });
    });

    describe('blend mode handling — layer with explicit blend mode', function ()
    {
        it('should not clone context for children when layer has its own blend mode', function ()
        {
            var child = makeChild({ willRender: true, blendMode: 3 });
            var layer = makeLayer({ list: [ child ], blendMode: 1 }); // explicit blend mode
            var ctx = makeDrawingContext(0);

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            // Layer has blend mode so child blend modes are ignored
            expect(ctx.clones.length).toBe(0);
        });
    });

    describe('context release', function ()
    {
        it('should release cloned context after rendering all children', function ()
        {
            var child = makeChild({ willRender: true });
            var layer = makeLayer({ list: [ child ], blendMode: SKIP_CHECK });
            var ctx = makeDrawingContext(2); // forces a clone

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            // The clone should have been released
            expect(ctx.clones[0].releaseCalled).toBe(true);
        });

        it('should not release original context when no clone was created', function ()
        {
            var child = makeChild({ willRender: true });
            var layer = makeLayer({ list: [ child ], blendMode: SKIP_CHECK });
            var ctx = makeDrawingContext(0);

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(ctx.releaseCalled).toBe(false);
        });
    });

    describe('multiple children', function ()
    {
        it('should render all children that pass willRender', function ()
        {
            var child1 = makeChild({ willRender: true });
            var child2 = makeChild({ willRender: false });
            var child3 = makeChild({ willRender: true });
            var layer = makeLayer({ list: [ child1, child2, child3 ] });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(child1.renderWebGLStepCalled).toBe(true);
            expect(child2.renderWebGLStepCalled).toBe(false);
            expect(child3.renderWebGLStepCalled).toBe(true);
        });

        it('should apply layer alpha to each child independently', function ()
        {
            var child1 = makeChild({ willRender: true, alpha: 0.5 });
            var child2 = makeChild({ willRender: true, alpha: 0.8 });
            var layer = makeLayer({ list: [ child1, child2 ], alpha: 0.5 });
            var ctx = makeDrawingContext();

            LayerWebGLRenderer({}, layer, ctx, undefined, 0, [], 0);

            expect(child1.setAlphaCalls[0].tl).toBeCloseTo(0.25);
            expect(child2.setAlphaCalls[0].tl).toBeCloseTo(0.40);
        });
    });
});
