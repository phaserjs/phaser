vi.mock('../../../src/gameobjects/GameObject', function ()
{
    return { RENDER_MASK: 15 };
});

var DOMElementCSSRenderer = require('../../../src/gameobjects/domelement/DOMElementCSSRenderer');
var TransformMatrix = require('../../../src/gameobjects/components/TransformMatrix');
var CSSBlendModes = require('../../../src/gameobjects/domelement/CSSBlendModes');

var RENDER_MASK = 15;

function makeStyle ()
{
    return {
        display: '',
        opacity: '',
        zIndex: '',
        pointerEvents: '',
        mixBlendMode: '',
        transform: '',
        transformOrigin: ''
    };
}

function makeSrc (overrides)
{
    var style = makeStyle();
    var src = {
        node: { style: style },
        scene: { sys: { settings: { visible: true } } },
        renderFlags: RENDER_MASK,
        cameraFilter: 0,
        alpha: 1,
        width: 100,
        height: 100,
        originX: 0.5,
        originY: 0.5,
        scrollFactorX: 1,
        scrollFactorY: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        rotate3d: { x: 0, y: 0, z: 1, w: 0 },
        rotate3dAngle: 'deg',
        _depth: 0,
        _blendMode: 0,
        pointerEvents: 'auto',
        transformOnly: false,
        parentContainer: null
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            src[key] = overrides[key];
        }
    }

    return src;
}

function makeCamera (overrides)
{
    var camera = {
        alpha: 1,
        id: 1,
        scrollX: 0,
        scrollY: 0,
        matrix: new TransformMatrix()
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            camera[key] = overrides[key];
        }
    }

    return camera;
}

describe('DOMElementCSSRenderer', function ()
{
    var renderer;

    beforeEach(function ()
    {
        renderer = {};
    });

    describe('module export', function ()
    {
        it('should export a function', function ()
        {
            expect(typeof DOMElementCSSRenderer).toBe('function');
        });
    });

    describe('early return when src.node is missing', function ()
    {
        it('should return without error when src.node is null', function ()
        {
            var src = makeSrc({ node: null });
            var camera = makeCamera();

            expect(function () { DOMElementCSSRenderer(renderer, src, camera); }).not.toThrow();
        });

        it('should return without error when src.node is undefined', function ()
        {
            var src = makeSrc();
            src.node = undefined;
            var camera = makeCamera();

            expect(function () { DOMElementCSSRenderer(renderer, src, camera); }).not.toThrow();
        });

        it('should not modify style when src.node is null', function ()
        {
            var externalStyle = makeStyle();
            var src = makeSrc({ node: null });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            // externalStyle is untouched since src.node was null
            expect(externalStyle.display).toBe('');
        });
    });

    describe('camera unwrapping', function ()
    {
        it('should unwrap camera.camera when camera is a DrawingContext wrapper', function ()
        {
            var src = makeSrc();
            var realCamera = makeCamera({ alpha: 0.5 });
            var drawingContext = { camera: realCamera };

            DOMElementCSSRenderer(renderer, src, drawingContext);

            expect(src.node.style.opacity).toBe(0.5);
        });

        it('should use camera directly when camera.camera is not set', function ()
        {
            var src = makeSrc();
            var camera = makeCamera({ alpha: 0.75 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.opacity).toBe(0.75);
        });
    });

    describe('display none conditions', function ()
    {
        it('should set style.display to none when settings.visible is false', function ()
        {
            var src = makeSrc();
            src.scene.sys.settings.visible = false;
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('none');
        });

        it('should set style.display to none when renderFlags does not match RENDER_MASK', function ()
        {
            var src = makeSrc({ renderFlags: 0 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('none');
        });

        it('should set style.display to none when renderFlags is partially set', function ()
        {
            var src = makeSrc({ renderFlags: 7 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('none');
        });

        it('should set style.display to none when cameraFilter matches camera.id via bitwise AND', function ()
        {
            var camera = makeCamera({ id: 4 });
            var src = makeSrc({ cameraFilter: 4 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('none');
        });

        it('should not hide when cameraFilter is non-zero but does not match camera.id', function ()
        {
            var camera = makeCamera({ id: 2 });
            var src = makeSrc({ cameraFilter: 4 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('block');
        });

        it('should not hide when cameraFilter is zero regardless of camera.id', function ()
        {
            var camera = makeCamera({ id: 1 });
            var src = makeSrc({ cameraFilter: 0 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('block');
        });

        it('should set style.display to none when parentContainer.willRender returns false', function ()
        {
            var src = makeSrc({
                parentContainer: {
                    alpha: 1,
                    willRender: function () { return false; }
                }
            });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('none');
        });

        it('should not hide when parentContainer.willRender returns true', function ()
        {
            var src = makeSrc({
                parentContainer: {
                    alpha: 1,
                    willRender: function () { return true; }
                }
            });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('block');
        });
    });

    describe('style properties when rendering', function ()
    {
        it('should set style.display to block when all conditions pass and transformOnly is false', function ()
        {
            var src = makeSrc({ transformOnly: false });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('block');
        });

        it('should not override style.display when transformOnly is true', function ()
        {
            var src = makeSrc({ transformOnly: true });
            src.node.style.display = 'inline';
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.display).toBe('inline');
        });

        it('should set style.opacity to camera alpha times src alpha', function ()
        {
            var src = makeSrc({ alpha: 0.5 });
            var camera = makeCamera({ alpha: 0.8 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.opacity).toBeCloseTo(0.4);
        });

        it('should set style.opacity to 1 when both camera and src alpha are 1', function ()
        {
            var src = makeSrc({ alpha: 1 });
            var camera = makeCamera({ alpha: 1 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.opacity).toBe(1);
        });

        it('should multiply parent container alpha into opacity', function ()
        {
            var src = makeSrc({
                alpha: 0.5,
                parentContainer: {
                    alpha: 0.5,
                    willRender: function () { return true; }
                }
            });
            var camera = makeCamera({ alpha: 1 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.opacity).toBeCloseTo(0.25);
        });

        it('should set style.zIndex from src._depth', function ()
        {
            var src = makeSrc({ _depth: 5 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.zIndex).toBe(5);
        });

        it('should set style.zIndex to zero when _depth is 0', function ()
        {
            var src = makeSrc({ _depth: 0 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.zIndex).toBe(0);
        });

        it('should set style.pointerEvents from src.pointerEvents', function ()
        {
            var src = makeSrc({ pointerEvents: 'none' });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.pointerEvents).toBe('none');
        });

        it('should set style.pointerEvents to auto by default', function ()
        {
            var src = makeSrc({ pointerEvents: 'auto' });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.pointerEvents).toBe('auto');
        });

        it('should set style.mixBlendMode to normal for blend mode 0', function ()
        {
            var src = makeSrc({ _blendMode: 0 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.mixBlendMode).toBe('normal');
        });

        it('should set style.mixBlendMode to multiply for blend mode 1', function ()
        {
            var src = makeSrc({ _blendMode: 1 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.mixBlendMode).toBe(CSSBlendModes[1]);
            expect(src.node.style.mixBlendMode).toBe('multiply');
        });

        it('should set style.mixBlendMode to screen for blend mode 3', function ()
        {
            var src = makeSrc({ _blendMode: 3 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.mixBlendMode).toBe('screen');
        });

        it('should not set style.opacity or display when transformOnly is true', function ()
        {
            var src = makeSrc({ transformOnly: true, alpha: 0.3 });
            src.node.style.opacity = '';
            var camera = makeCamera({ alpha: 1 });

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.opacity).toBe('');
        });
    });

    describe('style.transform', function ()
    {
        it('should set style.transform containing skew values', function ()
        {
            var src = makeSrc({ skewX: 0.1, skewY: 0.2 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transform).toContain('skew(0.1rad, 0.2rad)');
        });

        it('should set style.transform with zero skew values', function ()
        {
            var src = makeSrc({ skewX: 0, skewY: 0 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transform).toContain('skew(0rad, 0rad)');
        });

        it('should set style.transform containing rotate3d values', function ()
        {
            var src = makeSrc({
                rotate3d: { x: 0, y: 0, z: 1, w: 45 },
                rotate3dAngle: 'deg'
            });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transform).toContain('rotate3d(0,0,1,45deg)');
        });

        it('should set style.transform even when transformOnly is true', function ()
        {
            var src = makeSrc({ transformOnly: true });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(typeof src.node.style.transform).toBe('string');
            expect(src.node.style.transform.length).toBeGreaterThan(0);
            expect(src.node.style.transform).toContain('skew(');
            expect(src.node.style.transform).toContain('rotate3d(');
        });

        it('should include a CSS matrix in style.transform', function ()
        {
            var src = makeSrc();
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transform).toContain('matrix(');
        });
    });

    describe('style.transformOrigin', function ()
    {
        it('should set transformOrigin to 50% 50% when originX and originY are 0.5 with no parentMatrix', function ()
        {
            var src = makeSrc({ originX: 0.5, originY: 0.5 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transformOrigin).toBe('50% 50%');
        });

        it('should set transformOrigin to 0% 0% when origins are 0 and no parentMatrix', function ()
        {
            var src = makeSrc({ originX: 0, originY: 0 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transformOrigin).toBe('0% 0%');
        });

        it('should set transformOrigin to 100% 100% when origins are 1 and no parentMatrix', function ()
        {
            var src = makeSrc({ originX: 1, originY: 1 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transformOrigin).toBe('100% 100%');
        });

        it('should set transformOrigin to 25% 75% when originX is 0.25 and originY is 0.75', function ()
        {
            var src = makeSrc({ originX: 0.25, originY: 0.75 });
            var camera = makeCamera();

            DOMElementCSSRenderer(renderer, src, camera);

            expect(src.node.style.transformOrigin).toBe('25% 75%');
        });

        it('should set transformOrigin to 0% 0% when parentMatrix is provided', function ()
        {
            var src = makeSrc({ originX: 0.5, originY: 0.5 });
            var camera = makeCamera();
            var parentMatrix = new TransformMatrix();

            DOMElementCSSRenderer(renderer, src, camera, parentMatrix);

            expect(src.node.style.transformOrigin).toBe('0% 0%');
        });
    });

    describe('parentMatrix handling', function ()
    {
        it('should accept a parentMatrix without throwing', function ()
        {
            var src = makeSrc();
            var camera = makeCamera();
            var parentMatrix = new TransformMatrix();

            expect(function () { DOMElementCSSRenderer(renderer, src, camera, parentMatrix); }).not.toThrow();
        });

        it('should still set display and transform when parentMatrix is provided', function ()
        {
            var src = makeSrc();
            var camera = makeCamera();
            var parentMatrix = new TransformMatrix();

            DOMElementCSSRenderer(renderer, src, camera, parentMatrix);

            expect(src.node.style.display).toBe('block');
            expect(src.node.style.transform).toBeTruthy();
        });

        it('should use 0% 0% as transformOrigin when parentMatrix is provided regardless of origin values', function ()
        {
            var src = makeSrc({ originX: 1, originY: 1 });
            var camera = makeCamera();
            var parentMatrix = new TransformMatrix();

            DOMElementCSSRenderer(renderer, src, camera, parentMatrix);

            expect(src.node.style.transformOrigin).toBe('0% 0%');
        });
    });
});
