// Phaser's device detection modules access browser globals at require-time.
// Stub the minimum needed for Node.js.

if (typeof HTMLCanvasElement === 'undefined')
{
    global.HTMLCanvasElement = function () {};
}

if (typeof Image === 'undefined')
{
    global.Image = function () { return { onload: null, src: '' }; };
}

if (typeof window === 'undefined')
{
    global.window = {
        cordova: undefined,
        ejecta: undefined,
        devicePixelRatio: 1,
        Worker: undefined,
        URL: undefined,
        webkitURL: undefined,
        mozURL: undefined,
        msURL: undefined,
        addEventListener: function () {}
    };
}

if (typeof navigator === 'undefined')
{
    global.navigator = {
        userAgent: '',
        appVersion: '',
        maxTouchPoints: 0,
        standalone: false,
        getUserMedia: undefined,
        webkitGetUserMedia: undefined,
        mozGetUserMedia: undefined,
        msGetUserMedia: undefined,
        oGetUserMedia: undefined,
        vibrate: undefined,
        msPointerEnabled: false,
        pointerEnabled: false,
        getGamepads: undefined
    };
}

if (typeof document === 'undefined')
{
    var mockContext = {
        fillStyle: '',
        fillRect: function () {},
        getImageData: function () { return { data: [ 0, 0, 0, 0 ] }; },
        putImageData: function () {},
        drawImage: function () {},
        measureText: function () { return { width: 0 }; },
        save: function () {},
        restore: function () {}
    };

    var mockCanvas = {
        getContext: function () { return mockContext; },
        style: {},
        width: 1,
        height: 1
    };

    global.document = {
        documentElement: {},
        pointerLockElement: undefined,
        mozPointerLockElement: undefined,
        webkitPointerLockElement: undefined,
        createElement: function (tag)
        {
            if (tag === 'canvas') { return mockCanvas; }

            return { style: {} };
        },
        addEventListener: function () {}
    };
}

var Arc = require('../../../../src/gameobjects/shape/arc/Arc');

function createMockScene ()
{
    return {
        sys: {
            queueDepthSort: function () {},
            renderer: null,
            displayList: {
                getIndex: function () { return 0; },
                exists: function () { return false; },
                add: function () {},
                remove: function () {},
                queueDepthSort: function () {},
                events: { emit: function () {} },
                active: true,
                willRender: function () { return true; },
                list: []
            },
            updateList: {
                add: function () {},
                remove: function () {}
            },
            input: {
                enable: function () {},
                disable: function () {},
                clear: function () {},
                resetCursor: function () {}
            }
        }
    };
}

function createArc (x, y, radius, startAngle, endAngle, anticlockwise, fillColor, fillAlpha)
{
    var scene = createMockScene();

    return new Arc(scene, x, y, radius, startAngle, endAngle, anticlockwise, fillColor, fillAlpha);
}

describe('Arc', function ()
{
    describe('constructor', function ()
    {
        it('should create an arc with default values', function ()
        {
            var arc = createArc();

            expect(arc.x).toBe(0);
            expect(arc.y).toBe(0);
            expect(arc.radius).toBe(128);
            expect(arc.startAngle).toBe(0);
            expect(arc.endAngle).toBe(360);
            expect(arc.anticlockwise).toBe(false);
            expect(arc._iterations).toBeCloseTo(0.01);
        });

        it('should set the correct width and height from radius', function ()
        {
            var arc = createArc(0, 0, 64);

            expect(arc.width).toBe(128);
            expect(arc.height).toBe(128);
        });

        it('should set position from constructor arguments', function ()
        {
            var arc = createArc(100, 200);

            expect(arc.x).toBe(100);
            expect(arc.y).toBe(200);
        });

        it('should set custom radius', function ()
        {
            var arc = createArc(0, 0, 50);

            expect(arc.radius).toBe(50);
        });

        it('should set custom start and end angles', function ()
        {
            var arc = createArc(0, 0, 128, 45, 180);

            expect(arc.startAngle).toBe(45);
            expect(arc.endAngle).toBe(180);
        });

        it('should set anticlockwise winding order', function ()
        {
            var arc = createArc(0, 0, 128, 0, 360, true);

            expect(arc.anticlockwise).toBe(true);
        });

        it('should set fill style when fillColor is provided', function ()
        {
            var arc = createArc(0, 0, 128, 0, 360, false, 0xff0000, 1);

            expect(arc.isFilled).toBe(true);
            expect(arc.fillColor).toBe(0xff0000);
            expect(arc.fillAlpha).toBe(1);
        });

        it('should not fill when no fillColor is given', function ()
        {
            var arc = createArc();

            expect(arc.isFilled).toBe(false);
        });

        it('should have pathData populated after construction', function ()
        {
            var arc = createArc();

            expect(Array.isArray(arc.pathData)).toBe(true);
            expect(arc.pathData.length).toBeGreaterThan(0);
        });

        it('should have pathIndexes populated after construction', function ()
        {
            var arc = createArc();

            expect(Array.isArray(arc.pathIndexes)).toBe(true);
        });

        it('should set type to Arc', function ()
        {
            var arc = createArc();

            expect(arc.type).toBe('Arc');
        });
    });

    describe('setRadius', function ()
    {
        it('should set the radius', function ()
        {
            var arc = createArc();

            arc.setRadius(64);

            expect(arc.radius).toBe(64);
        });

        it('should update width and height based on new radius', function ()
        {
            var arc = createArc();

            arc.setRadius(50);

            expect(arc.width).toBe(100);
            expect(arc.height).toBe(100);
        });

        it('should return the arc instance for chaining', function ()
        {
            var arc = createArc();

            var result = arc.setRadius(64);

            expect(result).toBe(arc);
        });

        it('should accept zero radius', function ()
        {
            var arc = createArc();

            arc.setRadius(0);

            expect(arc.radius).toBe(0);
            expect(arc.width).toBe(0);
            expect(arc.height).toBe(0);
        });

        it('should accept large radius values', function ()
        {
            var arc = createArc();

            arc.setRadius(1000);

            expect(arc.radius).toBe(1000);
            expect(arc.width).toBe(2000);
            expect(arc.height).toBe(2000);
        });

        it('should update pathData after changing radius', function ()
        {
            var arc = createArc(0, 0, 64);
            var oldPathData = arc.pathData.slice();

            arc.setRadius(32);

            expect(arc.pathData).not.toEqual(oldPathData);
        });
    });

    describe('setIterations', function ()
    {
        it('should set the iterations value', function ()
        {
            var arc = createArc();

            arc.setIterations(0.05);

            expect(arc.iterations).toBeCloseTo(0.05);
        });

        it('should default to 0.01 when called with no arguments', function ()
        {
            var arc = createArc();
            arc.iterations = 0.05;

            arc.setIterations();

            expect(arc.iterations).toBeCloseTo(0.01);
        });

        it('should return the arc instance for chaining', function ()
        {
            var arc = createArc();

            var result = arc.setIterations(0.02);

            expect(result).toBe(arc);
        });

        it('should affect smoothness by changing number of path points', function ()
        {
            var arc = createArc(0, 0, 128, 0, 360, false);
            arc.setIterations(0.1);
            var coarseLength = arc.pathData.length;

            arc.setIterations(0.01);
            var fineLength = arc.pathData.length;

            expect(fineLength).toBeGreaterThan(coarseLength);
        });

        it('should accept very small iteration values', function ()
        {
            var arc = createArc();

            arc.setIterations(0.001);

            expect(arc.iterations).toBeCloseTo(0.001);
        });
    });

    describe('setStartAngle', function ()
    {
        it('should set the start angle', function ()
        {
            var arc = createArc();

            arc.setStartAngle(90);

            expect(arc.startAngle).toBe(90);
        });

        it('should return the arc instance for chaining', function ()
        {
            var arc = createArc();

            var result = arc.setStartAngle(45);

            expect(result).toBe(arc);
        });

        it('should set anticlockwise when provided', function ()
        {
            var arc = createArc();

            arc.setStartAngle(45, true);

            expect(arc.startAngle).toBe(45);
            expect(arc.anticlockwise).toBe(true);
        });

        it('should set anticlockwise to false when provided as false', function ()
        {
            var arc = createArc(0, 0, 128, 0, 360, true);

            arc.setStartAngle(45, false);

            expect(arc.anticlockwise).toBe(false);
        });

        it('should not change anticlockwise when not provided', function ()
        {
            var arc = createArc(0, 0, 128, 0, 360, true);

            arc.setStartAngle(90);

            expect(arc.anticlockwise).toBe(true);
        });

        it('should accept zero as start angle', function ()
        {
            var arc = createArc(0, 0, 128, 90);

            arc.setStartAngle(0);

            expect(arc.startAngle).toBe(0);
        });

        it('should accept negative start angles', function ()
        {
            var arc = createArc();

            arc.setStartAngle(-45);

            expect(arc.startAngle).toBe(-45);
        });

        it('should accept angles greater than 360', function ()
        {
            var arc = createArc();

            arc.setStartAngle(720);

            expect(arc.startAngle).toBe(720);
        });

        it('should update pathData after changing start angle', function ()
        {
            var arc = createArc();
            var oldPathData = arc.pathData.slice();

            arc.setStartAngle(90);

            expect(arc.pathData).not.toEqual(oldPathData);
        });
    });

    describe('setEndAngle', function ()
    {
        it('should set the end angle', function ()
        {
            var arc = createArc();

            arc.setEndAngle(180);

            expect(arc.endAngle).toBe(180);
        });

        it('should return the arc instance for chaining', function ()
        {
            var arc = createArc();

            var result = arc.setEndAngle(180);

            expect(result).toBe(arc);
        });

        it('should set anticlockwise when provided', function ()
        {
            var arc = createArc();

            arc.setEndAngle(270, true);

            expect(arc.endAngle).toBe(270);
            expect(arc.anticlockwise).toBe(true);
        });

        it('should set anticlockwise to false when provided as false', function ()
        {
            var arc = createArc(0, 0, 128, 0, 360, true);

            arc.setEndAngle(180, false);

            expect(arc.anticlockwise).toBe(false);
        });

        it('should not change anticlockwise when not provided', function ()
        {
            var arc = createArc(0, 0, 128, 0, 360, true);

            arc.setEndAngle(180);

            expect(arc.anticlockwise).toBe(true);
        });

        it('should accept zero as end angle', function ()
        {
            var arc = createArc();

            arc.setEndAngle(0);

            expect(arc.endAngle).toBe(0);
        });

        it('should accept negative end angles', function ()
        {
            var arc = createArc();

            arc.setEndAngle(-90);

            expect(arc.endAngle).toBe(-90);
        });

        it('should accept angles greater than 360', function ()
        {
            var arc = createArc();

            arc.setEndAngle(540);

            expect(arc.endAngle).toBe(540);
        });

        it('should update pathData after changing end angle', function ()
        {
            var arc = createArc();
            var oldPathData = arc.pathData.slice();

            arc.setEndAngle(180);

            expect(arc.pathData).not.toEqual(oldPathData);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining setRadius, setIterations, setStartAngle, setEndAngle', function ()
        {
            var arc = createArc();

            var result = arc
                .setRadius(64)
                .setIterations(0.02)
                .setStartAngle(45)
                .setEndAngle(270);

            expect(result).toBe(arc);
            expect(arc.radius).toBe(64);
            expect(arc.iterations).toBeCloseTo(0.02);
            expect(arc.startAngle).toBe(45);
            expect(arc.endAngle).toBe(270);
        });
    });
});
