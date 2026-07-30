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

var IsoBox = require('../../../../src/gameobjects/shape/isobox/IsoBox');

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

function createIsoBox (x, y, size, height, fillTop, fillLeft, fillRight)
{
    var scene = createMockScene();

    return new IsoBox(scene, x, y, size, height, fillTop, fillLeft, fillRight);
}

describe('IsoBox', function ()
{
    describe('constructor', function ()
    {
        it('should create an isobox with default values', function ()
        {
            var box = createIsoBox();

            expect(box.x).toBe(0);
            expect(box.y).toBe(0);
            expect(box.width).toBe(48);
            expect(box.height).toBe(32);
            expect(box.fillTop).toBe(0xeeeeee);
            expect(box.fillLeft).toBe(0x999999);
            expect(box.fillRight).toBe(0xcccccc);
        });

        it('should set position from constructor arguments', function ()
        {
            var box = createIsoBox(100, 200);

            expect(box.x).toBe(100);
            expect(box.y).toBe(200);
        });

        it('should set custom size and height', function ()
        {
            var box = createIsoBox(0, 0, 64, 48);

            expect(box.width).toBe(64);
            expect(box.height).toBe(48);
        });

        it('should set custom fill colors', function ()
        {
            var box = createIsoBox(0, 0, 48, 32, 0xff0000, 0x00ff00, 0x0000ff);

            expect(box.fillTop).toBe(0xff0000);
            expect(box.fillLeft).toBe(0x00ff00);
            expect(box.fillRight).toBe(0x0000ff);
        });

        it('should have default projection value of 4', function ()
        {
            var box = createIsoBox();

            expect(box.projection).toBe(4);
        });

        it('should have showTop, showLeft, showRight all true by default', function ()
        {
            var box = createIsoBox();

            expect(box.showTop).toBe(true);
            expect(box.showLeft).toBe(true);
            expect(box.showRight).toBe(true);
        });

        it('should have isFilled set to true', function ()
        {
            var box = createIsoBox();

            expect(box.isFilled).toBe(true);
        });

        it('should set type to IsoBox', function ()
        {
            var box = createIsoBox();

            expect(box.type).toBe('IsoBox');
        });

        it('should accept zero for position', function ()
        {
            var box = createIsoBox(0, 0);

            expect(box.x).toBe(0);
            expect(box.y).toBe(0);
        });

        it('should accept negative position values', function ()
        {
            var box = createIsoBox(-50, -100);

            expect(box.x).toBe(-50);
            expect(box.y).toBe(-100);
        });

        it('should accept zero fill colors', function ()
        {
            var box = createIsoBox(0, 0, 48, 32, 0x000000, 0x000000, 0x000000);

            expect(box.fillTop).toBe(0x000000);
            expect(box.fillLeft).toBe(0x000000);
            expect(box.fillRight).toBe(0x000000);
        });
    });

    describe('setProjection', function ()
    {
        it('should set the projection value', function ()
        {
            var box = createIsoBox();

            box.setProjection(8);

            expect(box.projection).toBe(8);
        });

        it('should return the isobox instance for chaining', function ()
        {
            var box = createIsoBox();

            var result = box.setProjection(8);

            expect(result).toBe(box);
        });

        it('should accept zero as projection', function ()
        {
            var box = createIsoBox();

            box.setProjection(0);

            expect(box.projection).toBe(0);
        });

        it('should accept negative projection values', function ()
        {
            var box = createIsoBox();

            box.setProjection(-2);

            expect(box.projection).toBe(-2);
        });

        it('should accept floating point projection values', function ()
        {
            var box = createIsoBox();

            box.setProjection(2.5);

            expect(box.projection).toBeCloseTo(2.5);
        });

        it('should overwrite an existing projection value', function ()
        {
            var box = createIsoBox();
            box.setProjection(2);

            box.setProjection(6);

            expect(box.projection).toBe(6);
        });
    });

    describe('setFaces', function ()
    {
        it('should set all faces to true by default', function ()
        {
            var box = createIsoBox();
            box.showTop = false;
            box.showLeft = false;
            box.showRight = false;

            box.setFaces();

            expect(box.showTop).toBe(true);
            expect(box.showLeft).toBe(true);
            expect(box.showRight).toBe(true);
        });

        it('should set showTop to false', function ()
        {
            var box = createIsoBox();

            box.setFaces(false, true, true);

            expect(box.showTop).toBe(false);
            expect(box.showLeft).toBe(true);
            expect(box.showRight).toBe(true);
        });

        it('should set showLeft to false', function ()
        {
            var box = createIsoBox();

            box.setFaces(true, false, true);

            expect(box.showTop).toBe(true);
            expect(box.showLeft).toBe(false);
            expect(box.showRight).toBe(true);
        });

        it('should set showRight to false', function ()
        {
            var box = createIsoBox();

            box.setFaces(true, true, false);

            expect(box.showTop).toBe(true);
            expect(box.showLeft).toBe(true);
            expect(box.showRight).toBe(false);
        });

        it('should hide all faces when all set to false', function ()
        {
            var box = createIsoBox();

            box.setFaces(false, false, false);

            expect(box.showTop).toBe(false);
            expect(box.showLeft).toBe(false);
            expect(box.showRight).toBe(false);
        });

        it('should return the isobox instance for chaining', function ()
        {
            var box = createIsoBox();

            var result = box.setFaces(true, true, true);

            expect(result).toBe(box);
        });

        it('should use default true when individual args are undefined', function ()
        {
            var box = createIsoBox();
            box.showTop = false;
            box.showLeft = false;
            box.showRight = false;

            box.setFaces(undefined, undefined, undefined);

            expect(box.showTop).toBe(true);
            expect(box.showLeft).toBe(true);
            expect(box.showRight).toBe(true);
        });
    });

    describe('setFillStyle', function ()
    {
        it('should set all three fill colors', function ()
        {
            var box = createIsoBox();

            box.setFillStyle(0xff0000, 0x00ff00, 0x0000ff);

            expect(box.fillTop).toBe(0xff0000);
            expect(box.fillLeft).toBe(0x00ff00);
            expect(box.fillRight).toBe(0x0000ff);
        });

        it('should set isFilled to true', function ()
        {
            var box = createIsoBox();
            box.isFilled = false;

            box.setFillStyle(0xffffff, 0xffffff, 0xffffff);

            expect(box.isFilled).toBe(true);
        });

        it('should return the isobox instance for chaining', function ()
        {
            var box = createIsoBox();

            var result = box.setFillStyle(0xff0000, 0x00ff00, 0x0000ff);

            expect(result).toBe(box);
        });

        it('should accept zero as fill colors', function ()
        {
            var box = createIsoBox();

            box.setFillStyle(0x000000, 0x000000, 0x000000);

            expect(box.fillTop).toBe(0x000000);
            expect(box.fillLeft).toBe(0x000000);
            expect(box.fillRight).toBe(0x000000);
        });

        it('should accept undefined fill colors', function ()
        {
            var box = createIsoBox();

            box.setFillStyle(undefined, undefined, undefined);

            expect(box.fillTop).toBeUndefined();
            expect(box.fillLeft).toBeUndefined();
            expect(box.fillRight).toBeUndefined();
            expect(box.isFilled).toBe(true);
        });

        it('should overwrite existing fill colors', function ()
        {
            var box = createIsoBox(0, 0, 48, 32, 0xaaaaaa, 0xbbbbbb, 0xcccccc);

            box.setFillStyle(0x111111, 0x222222, 0x333333);

            expect(box.fillTop).toBe(0x111111);
            expect(box.fillLeft).toBe(0x222222);
            expect(box.fillRight).toBe(0x333333);
        });

        it('should accept max hex color values', function ()
        {
            var box = createIsoBox();

            box.setFillStyle(0xffffff, 0xffffff, 0xffffff);

            expect(box.fillTop).toBe(0xffffff);
            expect(box.fillLeft).toBe(0xffffff);
            expect(box.fillRight).toBe(0xffffff);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining setProjection, setFaces, and setFillStyle', function ()
        {
            var box = createIsoBox();

            var result = box
                .setProjection(6)
                .setFaces(true, false, true)
                .setFillStyle(0xff0000, 0x00ff00, 0x0000ff);

            expect(result).toBe(box);
            expect(box.projection).toBe(6);
            expect(box.showTop).toBe(true);
            expect(box.showLeft).toBe(false);
            expect(box.showRight).toBe(true);
            expect(box.fillTop).toBe(0xff0000);
            expect(box.fillLeft).toBe(0x00ff00);
            expect(box.fillRight).toBe(0x0000ff);
        });
    });
});
