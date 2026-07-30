var TransformerStamp = require('../../../../../src/renderer/webgl/renderNodes/transformer/TransformerStamp.js');

// Helper: create a minimal manager mock
function createManager ()
{
    return {};
}

// Helper: create a minimal drawing context mock
function createDrawingContext ()
{
    return {
        camera: {}
    };
}

// Helper: create a minimal texturer node mock
function createTexturerNode (options)
{
    options = options || {};
    return {
        frame: {
            customPivot: options.customPivot !== undefined ? options.customPivot : false,
            realWidth: options.realWidth !== undefined ? options.realWidth : 100,
            realHeight: options.realHeight !== undefined ? options.realHeight : 200
        },
        uvSource: {
            x: options.uvX !== undefined ? options.uvX : 0,
            y: options.uvY !== undefined ? options.uvY : 0
        },
        frameWidth: options.frameWidth !== undefined ? options.frameWidth : 100,
        frameHeight: options.frameHeight !== undefined ? options.frameHeight : 200
    };
}

// Helper: create a minimal game object mock
function createGameObject (options)
{
    options = options || {};
    return {
        x: options.x !== undefined ? options.x : 0,
        y: options.y !== undefined ? options.y : 0,
        rotation: options.rotation !== undefined ? options.rotation : 0,
        scaleX: options.scaleX !== undefined ? options.scaleX : 1,
        scaleY: options.scaleY !== undefined ? options.scaleY : 1,
        flipX: options.flipX !== undefined ? options.flipX : false,
        flipY: options.flipY !== undefined ? options.flipY : false,
        displayOriginX: options.displayOriginX !== undefined ? options.displayOriginX : 0,
        displayOriginY: options.displayOriginY !== undefined ? options.displayOriginY : 0,
        willRoundVertices: options.willRoundVertices !== undefined ? options.willRoundVertices : function () { return false; }
    };
}

describe('TransformerStamp', function ()
{
    describe('constructor', function ()
    {
        it('should create a node with the default name', function ()
        {
            var node = new TransformerStamp(createManager());
            expect(node.name).toBe('TransformerStamp');
        });

        it('should create a node with the given custom name', function ()
        {
            var node = new TransformerStamp(createManager(), { name: 'CustomStamp' });
            expect(node.name).toBe('CustomStamp');
        });

        it('should store the manager reference', function ()
        {
            var manager = createManager();
            var node = new TransformerStamp(manager);
            expect(node.manager).toBe(manager);
        });

        it('should expose a Float32Array quad property', function ()
        {
            var node = new TransformerStamp(createManager());
            expect(node.quad).toBeInstanceOf(Float32Array);
        });

        it('should expose a quad with 8 elements', function ()
        {
            var node = new TransformerStamp(createManager());
            expect(node.quad.length).toBe(8);
        });

        it('should have the quad pointing to the internal sprite matrix quad', function ()
        {
            var node = new TransformerStamp(createManager());
            expect(node.quad).toBe(node._spriteMatrix.quad);
        });

        it('should have the default role in defaultConfig', function ()
        {
            var node = new TransformerStamp(createManager());
            expect(TransformerStamp.prototype.defaultConfig.role).toBe('Transformer');
        });
    });

    describe('run', function ()
    {
        it('should write 8 vertex coordinates into quad for an identity transform', function ()
        {
            var node = new TransformerStamp(createManager());
            var drawingContext = createDrawingContext();
            var gameObject = createGameObject();
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 200 });

            node.run(drawingContext, gameObject, texturerNode);

            var quad = node.quad;
            // At origin, identity transform, no flip, no display origin:
            // quad[0..1] = top-left, quad[2..3] = bottom-left,
            // quad[4..5] = bottom-right, quad[6..7] = top-right
            expect(quad[0]).toBeCloseTo(0);
            expect(quad[1]).toBeCloseTo(0);
            expect(quad[2]).toBeCloseTo(0);
            expect(quad[3]).toBeCloseTo(200);
            expect(quad[4]).toBeCloseTo(100);
            expect(quad[5]).toBeCloseTo(200);
            expect(quad[6]).toBeCloseTo(100);
            expect(quad[7]).toBeCloseTo(0);
        });

        it('should translate the quad by the game object position', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({ x: 50, y: 75 });
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 200 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            var quad = node.quad;
            expect(quad[0]).toBeCloseTo(50);
            expect(quad[1]).toBeCloseTo(75);
            expect(quad[4]).toBeCloseTo(150);
            expect(quad[5]).toBeCloseTo(275);
        });

        it('should offset the quad by the uvSource origin', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject();
            var texturerNode = createTexturerNode({ uvX: 10, uvY: 20, frameWidth: 100, frameHeight: 200 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            var quad = node.quad;
            expect(quad[0]).toBeCloseTo(10);
            expect(quad[1]).toBeCloseTo(20);
        });

        it('should offset the quad by the negative display origin', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({ displayOriginX: 50, displayOriginY: 100 });
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 200 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            var quad = node.quad;
            // x = -displayOriginX + uvX = -50 + 0 = -50
            // y = -displayOriginY + uvY = -100 + 0 = -100
            expect(quad[0]).toBeCloseTo(-50);
            expect(quad[1]).toBeCloseTo(-100);
        });

        it('should apply flipX without customPivot by adjusting the x offset', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({
                flipX: true,
                displayOriginX: 50,
                scaleX: 1
            });
            var texturerNode = createTexturerNode({
                frameWidth: 100,
                frameHeight: 200,
                customPivot: false,
                realWidth: 100
            });

            node.run(createDrawingContext(), gameObject, texturerNode);

            // x = -50 + 0 = -50
            // flipX, no customPivot: x += -realWidth + displayOriginX*2 = -100 + 100 = 0
            // so x = -50 + 0 = -50
            // flipX = -1, so scaleX = 1 * -1 = -1
            // applyITRS(0, 0, 0, -1, 1)
            // matrix: a=-1, b=0, c=0, d=1, e=0, f=0
            // quad[0] = x*a + y*c + e = -50*-1 + 0 + 0 = 50
            var quad = node.quad;
            expect(quad[0]).toBeCloseTo(50);
        });

        it('should apply flipY without customPivot by adjusting the y offset', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({
                flipY: true,
                displayOriginY: 100,
                scaleY: 1
            });
            var texturerNode = createTexturerNode({
                frameWidth: 100,
                frameHeight: 200,
                customPivot: false,
                realHeight: 200
            });

            node.run(createDrawingContext(), gameObject, texturerNode);

            // y = -100 + 0 = -100
            // flipY, no customPivot: y += -realHeight + displayOriginY*2 = -200 + 200 = 0
            // so y = -100 + 0 = -100
            // flipY = -1, scaleY = 1 * -1 = -1
            // applyITRS(0, 0, 0, 1, -1)
            // matrix: a=1, b=0, c=0, d=-1, e=0, f=0
            // quad[1] = x*b + y*d + f = 0 + (-100)*(-1) + 0 = 100
            var quad = node.quad;
            expect(quad[1]).toBeCloseTo(100);
        });

        it('should not adjust offset when flipX is true and customPivot is set', function ()
        {
            var node = new TransformerStamp(createManager());
            var nodeNoCustomPivot = new TransformerStamp(createManager());

            // Use displayOriginX=25, realWidth=100 so the no-pivot adjustment
            // (-100 + 50 = -50) makes results differ from the custom-pivot case
            var gameObjectFlipXCustomPivot = createGameObject({ flipX: true, displayOriginX: 25 });
            var gameObjectFlipXNoPivot = createGameObject({ flipX: true, displayOriginX: 25 });

            var texturerWithPivot = createTexturerNode({ frameWidth: 100, frameHeight: 200, customPivot: true, realWidth: 100 });
            var texturerNoPivot = createTexturerNode({ frameWidth: 100, frameHeight: 200, customPivot: false, realWidth: 100 });

            node.run(createDrawingContext(), gameObjectFlipXCustomPivot, texturerWithPivot);
            nodeNoCustomPivot.run(createDrawingContext(), gameObjectFlipXNoPivot, texturerNoPivot);

            // customPivot=true: x=-25, flipX=-1, quad[0] = -25*-1 = 25
            // customPivot=false: x=-25 + (-100+50) = -75, flipX=-1, quad[0] = -75*-1 = 75
            expect(node.quad[0]).toBeCloseTo(25);
            expect(nodeNoCustomPivot.quad[0]).toBeCloseTo(75);
        });

        it('should not adjust offset when flipY is true and customPivot is set', function ()
        {
            var node = new TransformerStamp(createManager());
            var nodeNoCustomPivot = new TransformerStamp(createManager());

            // Use displayOriginY=50, realHeight=200 so the no-pivot adjustment
            // (-200 + 100 = -100) makes results differ from the custom-pivot case
            var gameObjectFlipYCustomPivot = createGameObject({ flipY: true, displayOriginY: 50 });
            var gameObjectFlipYNoPivot = createGameObject({ flipY: true, displayOriginY: 50 });

            var texturerWithPivot = createTexturerNode({ frameWidth: 100, frameHeight: 200, customPivot: true, realHeight: 200 });
            var texturerNoPivot = createTexturerNode({ frameWidth: 100, frameHeight: 200, customPivot: false, realHeight: 200 });

            node.run(createDrawingContext(), gameObjectFlipYCustomPivot, texturerWithPivot);
            nodeNoCustomPivot.run(createDrawingContext(), gameObjectFlipYNoPivot, texturerNoPivot);

            // customPivot=true: y=-50, flipY=-1, quad[1] = -50*-1 = 50
            // customPivot=false: y=-50 + (-200+100) = -150, flipY=-1, quad[1] = -150*-1 = 150
            expect(node.quad[1]).toBeCloseTo(50);
            expect(nodeNoCustomPivot.quad[1]).toBeCloseTo(150);
        });

        it('should apply scale to the quad', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({ scaleX: 2, scaleY: 3 });
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 200 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            // applyITRS(0,0,0,2,3): a=2, b=0, c=0, d=3, e=0, f=0
            // setQuad(0, 0, 100, 200):
            // quad[4] = xw*a + yh*c + e = 100*2 = 200
            // quad[5] = xw*b + yh*d + f = 200*3 = 600
            var quad = node.quad;
            expect(quad[4]).toBeCloseTo(200);
            expect(quad[5]).toBeCloseTo(600);
        });

        it('should apply rotation to the quad', function ()
        {
            var node = new TransformerStamp(createManager());
            var angle = Math.PI / 2; // 90 degrees
            var gameObject = createGameObject({ rotation: angle });
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 0 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            // applyITRS(0, 0, PI/2, 1, 1):
            // sin(PI/2) = 1, cos(PI/2) = 0
            // a=0, b=1, c=-1, d=0, e=0, f=0
            // setQuad(0, 0, 100, 0):
            // quad[6] = xw*a + y*c + e = 100*0 + 0*(-1) + 0 = 0
            // quad[7] = xw*b + y*d + f = 100*1 + 0*0 + 0 = 100
            var quad = node.quad;
            expect(quad[6]).toBeCloseTo(0, 5);
            expect(quad[7]).toBeCloseTo(100, 5);
        });

        it('should round quad vertices when willRoundVertices returns true', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({
                x: 10.7,
                y: 20.3,
                willRoundVertices: function () { return true; }
            });
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 200 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            var quad = node.quad;
            for (var i = 0; i < 8; i++)
            {
                expect(quad[i]).toBe(Math.round(quad[i]));
            }
        });

        it('should not round quad vertices when willRoundVertices returns false', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({
                x: 10.7,
                y: 20.3,
                willRoundVertices: function () { return false; }
            });
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 200 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            // x=10.7, no rotation/scale/flip/displayOrigin, so quad[0] should be 10.7
            expect(node.quad[0]).toBeCloseTo(10.7);
            expect(node.quad[1]).toBeCloseTo(20.3);
        });

        it('should pass the camera to willRoundVertices', function ()
        {
            var node = new TransformerStamp(createManager());
            var camera = { id: 'testCamera' };
            var drawingContext = { camera: camera };
            var passedCamera = null;

            var gameObject = createGameObject({
                willRoundVertices: function (cam) { passedCamera = cam; return false; }
            });
            var texturerNode = createTexturerNode();

            node.run(drawingContext, gameObject, texturerNode);

            expect(passedCamera).toBe(camera);
        });

        it('should set onlyTranslate to true for identity transform', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({ scaleX: 1, scaleY: 1, rotation: 0 });
            var texturerNode = createTexturerNode();

            node.run(createDrawingContext(), gameObject, texturerNode);

            expect(node.onlyTranslate).toBe(true);
        });

        it('should set onlyTranslate to false when rotation is applied', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({ rotation: Math.PI / 4 });
            var texturerNode = createTexturerNode();

            node.run(createDrawingContext(), gameObject, texturerNode);

            expect(node.onlyTranslate).toBe(false);
        });

        it('should set onlyTranslate to false when scale is not 1', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject({ scaleX: 2, rotation: 0 });
            var texturerNode = createTexturerNode();

            node.run(createDrawingContext(), gameObject, texturerNode);

            expect(node.onlyTranslate).toBe(false);
        });

        it('should produce correct quad width for given frameWidth', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject();
            var texturerNode = createTexturerNode({ frameWidth: 64, frameHeight: 64 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            // Width from quad[6] - quad[0] (top-right x - top-left x)
            var width = node.quad[6] - node.quad[0];
            expect(width).toBeCloseTo(64);
        });

        it('should produce correct quad height for given frameHeight', function ()
        {
            var node = new TransformerStamp(createManager());
            var gameObject = createGameObject();
            var texturerNode = createTexturerNode({ frameWidth: 64, frameHeight: 128 });

            node.run(createDrawingContext(), gameObject, texturerNode);

            // Height from quad[3] - quad[1] (bottom-left y - top-left y)
            var height = node.quad[3] - node.quad[1];
            expect(height).toBeCloseTo(128);
        });

        it('should update the quad on repeated calls with different positions', function ()
        {
            var node = new TransformerStamp(createManager());
            var texturerNode = createTexturerNode({ frameWidth: 100, frameHeight: 200 });

            var gameObject1 = createGameObject({ x: 0, y: 0 });
            node.run(createDrawingContext(), gameObject1, texturerNode);
            var firstQuad0 = node.quad[0];

            var gameObject2 = createGameObject({ x: 300, y: 400 });
            node.run(createDrawingContext(), gameObject2, texturerNode);

            expect(node.quad[0]).not.toBeCloseTo(firstQuad0);
            expect(node.quad[0]).toBeCloseTo(300);
            expect(node.quad[1]).toBeCloseTo(400);
        });
    });
});
