var Transform = require('../../../src/gameobjects/components/Transform');
var TransformMatrix = require('../../../src/gameobjects/components/TransformMatrix');
var MATH_CONST = require('../../../src/math/const');

var _FLAG = 4;

function createGameObject ()
{
    var obj = {
        x: 0,
        y: 0,
        z: 0,
        w: 0,
        _scaleX: 1,
        _scaleY: 1,
        _rotation: 0,
        renderFlags: 15,
        parentContainer: null,
        scrollFactorX: 1,
        scrollFactorY: 1,
        _originComponent: false,
        _displayOriginX: 0,
        _displayOriginY: 0
    };

    obj.setPosition = Transform.setPosition;
    obj.copyPosition = Transform.copyPosition;
    obj.setRandomPosition = Transform.setRandomPosition;
    obj.setRotation = Transform.setRotation;
    obj.setAngle = Transform.setAngle;
    obj.setScale = Transform.setScale;
    obj.setX = Transform.setX;
    obj.setY = Transform.setY;
    obj.setZ = Transform.setZ;
    obj.setW = Transform.setW;
    obj.getLocalTransformMatrix = Transform.getLocalTransformMatrix;
    obj.getWorldTransformMatrix = Transform.getWorldTransformMatrix;
    obj.getLocalPoint = Transform.getLocalPoint;
    obj.getWorldPoint = Transform.getWorldPoint;
    obj.getParentRotation = Transform.getParentRotation;

    Object.defineProperties(obj, {
        scale: Transform.scale,
        scaleX: Transform.scaleX,
        scaleY: Transform.scaleY,
        angle: Transform.angle,
        rotation: Transform.rotation
    });

    return obj;
}

describe('Transform', function ()
{
    var go;

    beforeEach(function ()
    {
        go = createGameObject();
    });

    // -------------------------------------------------------------------------
    // Module shape
    // -------------------------------------------------------------------------

    describe('module', function ()
    {
        it('should export an object', function ()
        {
            expect(typeof Transform).toBe('object');
        });

        it('should have hasTransformComponent set to true', function ()
        {
            expect(Transform.hasTransformComponent).toBe(true);
        });

        it('should have default _scaleX of 1', function ()
        {
            expect(Transform._scaleX).toBe(1);
        });

        it('should have default _scaleY of 1', function ()
        {
            expect(Transform._scaleY).toBe(1);
        });

        it('should have default _rotation of 0', function ()
        {
            expect(Transform._rotation).toBe(0);
        });

        it('should have default x, y, z, w of 0', function ()
        {
            expect(Transform.x).toBe(0);
            expect(Transform.y).toBe(0);
            expect(Transform.z).toBe(0);
            expect(Transform.w).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // scale getter / setter
    // -------------------------------------------------------------------------

    describe('scale', function ()
    {
        it('should return the average of scaleX and scaleY', function ()
        {
            go._scaleX = 2;
            go._scaleY = 4;
            expect(go.scale).toBe(3);
        });

        it('should return 1 when both scales are 1', function ()
        {
            expect(go.scale).toBe(1);
        });

        it('should set both _scaleX and _scaleY', function ()
        {
            go.scale = 3;
            expect(go._scaleX).toBe(3);
            expect(go._scaleY).toBe(3);
        });

        it('should clear _FLAG when set to zero', function ()
        {
            go.renderFlags = 15;
            go.scale = 0;
            expect(go.renderFlags & _FLAG).toBe(0);
        });

        it('should set _FLAG when set to a non-zero value', function ()
        {
            go.renderFlags = 0;
            go.scale = 2;
            expect(go.renderFlags & _FLAG).toBe(_FLAG);
        });

        it('should set _FLAG when set back to 1 after being zeroed', function ()
        {
            go.scale = 0;
            go.scale = 1;
            expect(go.renderFlags & _FLAG).toBe(_FLAG);
        });
    });

    // -------------------------------------------------------------------------
    // scaleX getter / setter
    // -------------------------------------------------------------------------

    describe('scaleX', function ()
    {
        it('should get _scaleX', function ()
        {
            go._scaleX = 5;
            expect(go.scaleX).toBe(5);
        });

        it('should set _scaleX', function ()
        {
            go.scaleX = 2;
            expect(go._scaleX).toBe(2);
        });

        it('should clear _FLAG when set to zero', function ()
        {
            go.renderFlags = 15;
            go.scaleX = 0;
            expect(go.renderFlags & _FLAG).toBe(0);
        });

        it('should set _FLAG when non-zero and scaleY is non-zero', function ()
        {
            go.renderFlags = 0;
            go._scaleY = 1;
            go.scaleX = 2;
            expect(go.renderFlags & _FLAG).toBe(_FLAG);
        });

        it('should not set _FLAG when non-zero but scaleY is zero', function ()
        {
            go.renderFlags = 0;
            go._scaleY = 0;
            go.scaleX = 2;
            expect(go.renderFlags & _FLAG).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // scaleY getter / setter
    // -------------------------------------------------------------------------

    describe('scaleY', function ()
    {
        it('should get _scaleY', function ()
        {
            go._scaleY = 7;
            expect(go.scaleY).toBe(7);
        });

        it('should set _scaleY', function ()
        {
            go.scaleY = 3;
            expect(go._scaleY).toBe(3);
        });

        it('should clear _FLAG when set to zero', function ()
        {
            go.renderFlags = 15;
            go.scaleY = 0;
            expect(go.renderFlags & _FLAG).toBe(0);
        });

        it('should set _FLAG when non-zero and scaleX is non-zero', function ()
        {
            go.renderFlags = 0;
            go._scaleX = 1;
            go.scaleY = 2;
            expect(go.renderFlags & _FLAG).toBe(_FLAG);
        });

        it('should not set _FLAG when non-zero but scaleX is zero', function ()
        {
            go.renderFlags = 0;
            go._scaleX = 0;
            go.scaleY = 2;
            expect(go.renderFlags & _FLAG).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // angle getter / setter
    // -------------------------------------------------------------------------

    describe('angle', function ()
    {
        it('should return 0 when rotation is 0', function ()
        {
            go._rotation = 0;
            expect(go.angle).toBe(0);
        });

        it('should return degrees corresponding to the rotation in radians', function ()
        {
            go._rotation = Math.PI / 2;
            expect(go.angle).toBeCloseTo(90, 5);
        });

        it('should return -180 or 180 for PI rotation (wrapped)', function ()
        {
            go._rotation = Math.PI;
            var a = go.angle;
            expect(Math.abs(a)).toBeCloseTo(180, 5);
        });

        it('should set rotation from degrees', function ()
        {
            go.angle = 90;
            expect(go._rotation).toBeCloseTo(Math.PI / 2, 5);
        });

        it('should wrap angle values above 180 into the -180..180 range', function ()
        {
            go.angle = 270;
            expect(go.angle).toBeCloseTo(-90, 5);
        });

        it('should wrap angle values below -180 into the -180..180 range', function ()
        {
            go.angle = -270;
            expect(go.angle).toBeCloseTo(90, 5);
        });

        it('should handle 0 degrees', function ()
        {
            go.angle = 0;
            expect(go.angle).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // rotation getter / setter
    // -------------------------------------------------------------------------

    describe('rotation', function ()
    {
        it('should return 0 by default', function ()
        {
            expect(go.rotation).toBe(0);
        });

        it('should set _rotation via WrapAngle', function ()
        {
            go.rotation = Math.PI / 4;
            expect(go._rotation).toBeCloseTo(Math.PI / 4, 10);
        });

        it('should wrap values greater than PI', function ()
        {
            go.rotation = Math.PI * 3;
            // 3*PI wraps to PI (or -PI boundary)
            expect(Math.abs(go._rotation)).toBeLessThanOrEqual(Math.PI + 0.0001);
        });

        it('should wrap values less than -PI', function ()
        {
            go.rotation = -Math.PI * 3;
            expect(Math.abs(go._rotation)).toBeLessThanOrEqual(Math.PI + 0.0001);
        });

        it('should return the stored _rotation', function ()
        {
            go._rotation = 1.23;
            expect(go.rotation).toBe(1.23);
        });
    });

    // -------------------------------------------------------------------------
    // setPosition
    // -------------------------------------------------------------------------

    describe('setPosition', function ()
    {
        it('should set all coordinates to 0 when called with no arguments', function ()
        {
            go.x = 10;
            go.y = 20;
            go.z = 30;
            go.w = 40;
            go.setPosition();
            expect(go.x).toBe(0);
            expect(go.y).toBe(0);
            expect(go.z).toBe(0);
            expect(go.w).toBe(0);
        });

        it('should set x and use it for y when only x is provided', function ()
        {
            go.setPosition(5);
            expect(go.x).toBe(5);
            expect(go.y).toBe(5);
            expect(go.z).toBe(0);
            expect(go.w).toBe(0);
        });

        it('should set x and y independently when both are provided', function ()
        {
            go.setPosition(3, 7);
            expect(go.x).toBe(3);
            expect(go.y).toBe(7);
        });

        it('should set all four coordinates when provided', function ()
        {
            go.setPosition(1, 2, 3, 4);
            expect(go.x).toBe(1);
            expect(go.y).toBe(2);
            expect(go.z).toBe(3);
            expect(go.w).toBe(4);
        });

        it('should return the game object (chainable)', function ()
        {
            var result = go.setPosition(1, 2);
            expect(result).toBe(go);
        });

        it('should work with negative values', function ()
        {
            go.setPosition(-10, -20, -30, -40);
            expect(go.x).toBe(-10);
            expect(go.y).toBe(-20);
            expect(go.z).toBe(-30);
            expect(go.w).toBe(-40);
        });

        it('should work with floating point values', function ()
        {
            go.setPosition(1.5, 2.7, 0.1, -3.3);
            expect(go.x).toBeCloseTo(1.5);
            expect(go.y).toBeCloseTo(2.7);
            expect(go.z).toBeCloseTo(0.1);
            expect(go.w).toBeCloseTo(-3.3);
        });
    });

    // -------------------------------------------------------------------------
    // copyPosition
    // -------------------------------------------------------------------------

    describe('copyPosition', function ()
    {
        it('should copy x and y from a Vector2-like source', function ()
        {
            go.copyPosition({ x: 10, y: 20 });
            expect(go.x).toBe(10);
            expect(go.y).toBe(20);
        });

        it('should copy x, y, z from a Vector3-like source', function ()
        {
            go.copyPosition({ x: 1, y: 2, z: 3 });
            expect(go.x).toBe(1);
            expect(go.y).toBe(2);
            expect(go.z).toBe(3);
        });

        it('should copy all four components from a Vector4-like source', function ()
        {
            go.copyPosition({ x: 1, y: 2, z: 3, w: 4 });
            expect(go.x).toBe(1);
            expect(go.y).toBe(2);
            expect(go.z).toBe(3);
            expect(go.w).toBe(4);
        });

        it('should not modify coordinates absent from source', function ()
        {
            go.x = 99;
            go.y = 88;
            go.z = 77;
            go.w = 66;
            go.copyPosition({ x: 10 });
            expect(go.x).toBe(10);
            expect(go.y).toBe(88);
            expect(go.z).toBe(77);
            expect(go.w).toBe(66);
        });

        it('should not modify any coordinate when source has no matching properties', function ()
        {
            go.x = 5;
            go.y = 6;
            go.copyPosition({});
            expect(go.x).toBe(5);
            expect(go.y).toBe(6);
        });

        it('should return the game object (chainable)', function ()
        {
            var result = go.copyPosition({ x: 1 });
            expect(result).toBe(go);
        });
    });

    // -------------------------------------------------------------------------
    // setRandomPosition
    // -------------------------------------------------------------------------

    describe('setRandomPosition', function ()
    {
        it('should place the object within the given area', function ()
        {
            var mockScene = {
                sys: {
                    scale: { width: 800, height: 600 }
                }
            };
            go.scene = mockScene;

            for (var i = 0; i < 20; i++)
            {
                go.setRandomPosition(100, 200, 300, 400);
                expect(go.x).toBeGreaterThanOrEqual(100);
                expect(go.x).toBeLessThan(400);
                expect(go.y).toBeGreaterThanOrEqual(200);
                expect(go.y).toBeLessThan(600);
            }
        });

        it('should fall back to scene dimensions when width/height are omitted', function ()
        {
            var mockScene = {
                sys: {
                    scale: { width: 800, height: 600 }
                }
            };
            go.scene = mockScene;

            for (var i = 0; i < 20; i++)
            {
                go.setRandomPosition();
                expect(go.x).toBeGreaterThanOrEqual(0);
                expect(go.x).toBeLessThan(800);
                expect(go.y).toBeGreaterThanOrEqual(0);
                expect(go.y).toBeLessThan(600);
            }
        });

        it('should return the game object (chainable)', function ()
        {
            go.scene = { sys: { scale: { width: 800, height: 600 } } };
            var result = go.setRandomPosition(0, 0, 100, 100);
            expect(result).toBe(go);
        });
    });

    // -------------------------------------------------------------------------
    // setRotation
    // -------------------------------------------------------------------------

    describe('setRotation', function ()
    {
        it('should default rotation to 0 when called with no arguments', function ()
        {
            go.rotation = 1.5;
            go.setRotation();
            expect(go._rotation).toBe(0);
        });

        it('should set rotation to given radians', function ()
        {
            go.setRotation(Math.PI / 4);
            expect(go._rotation).toBeCloseTo(Math.PI / 4, 10);
        });

        it('should wrap rotation values (via rotation setter)', function ()
        {
            go.setRotation(Math.PI * 3);
            expect(Math.abs(go._rotation)).toBeLessThanOrEqual(Math.PI + 0.0001);
        });

        it('should return the game object (chainable)', function ()
        {
            var result = go.setRotation(1);
            expect(result).toBe(go);
        });
    });

    // -------------------------------------------------------------------------
    // setAngle
    // -------------------------------------------------------------------------

    describe('setAngle', function ()
    {
        it('should default angle to 0 when called with no arguments', function ()
        {
            go.setAngle(90);
            go.setAngle();
            expect(go._rotation).toBe(0);
        });

        it('should set the angle in degrees', function ()
        {
            go.setAngle(90);
            expect(go._rotation).toBeCloseTo(Math.PI / 2, 5);
        });

        it('should wrap degrees outside -180..180', function ()
        {
            go.setAngle(450);
            expect(go.angle).toBeCloseTo(90, 5);
        });

        it('should return the game object (chainable)', function ()
        {
            var result = go.setAngle(45);
            expect(result).toBe(go);
        });
    });

    // -------------------------------------------------------------------------
    // setScale
    // -------------------------------------------------------------------------

    describe('setScale', function ()
    {
        it('should default to 1 when called with no arguments', function ()
        {
            go.setScale();
            expect(go._scaleX).toBe(1);
            expect(go._scaleY).toBe(1);
        });

        it('should set both scales when only x is provided', function ()
        {
            go.setScale(3);
            expect(go._scaleX).toBe(3);
            expect(go._scaleY).toBe(3);
        });

        it('should set x and y scales independently when both are provided', function ()
        {
            go.setScale(2, 5);
            expect(go._scaleX).toBe(2);
            expect(go._scaleY).toBe(5);
        });

        it('should return the game object (chainable)', function ()
        {
            var result = go.setScale(1, 2);
            expect(result).toBe(go);
        });

        it('should clear _FLAG when scale is set to zero', function ()
        {
            go.renderFlags = 15;
            go.setScale(0, 0);
            expect(go.renderFlags & _FLAG).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // setX / setY / setZ / setW
    // -------------------------------------------------------------------------

    describe('setX', function ()
    {
        it('should default to 0 when called with no argument', function ()
        {
            go.x = 99;
            go.setX();
            expect(go.x).toBe(0);
        });

        it('should set x to the given value', function ()
        {
            go.setX(42);
            expect(go.x).toBe(42);
        });

        it('should return the game object (chainable)', function ()
        {
            expect(go.setX(1)).toBe(go);
        });
    });

    describe('setY', function ()
    {
        it('should default to 0 when called with no argument', function ()
        {
            go.y = 99;
            go.setY();
            expect(go.y).toBe(0);
        });

        it('should set y to the given value', function ()
        {
            go.setY(-7);
            expect(go.y).toBe(-7);
        });

        it('should return the game object (chainable)', function ()
        {
            expect(go.setY(1)).toBe(go);
        });
    });

    describe('setZ', function ()
    {
        it('should default to 0 when called with no argument', function ()
        {
            go.z = 99;
            go.setZ();
            expect(go.z).toBe(0);
        });

        it('should set z to the given value', function ()
        {
            go.setZ(100);
            expect(go.z).toBe(100);
        });

        it('should return the game object (chainable)', function ()
        {
            expect(go.setZ(1)).toBe(go);
        });
    });

    describe('setW', function ()
    {
        it('should default to 0 when called with no argument', function ()
        {
            go.w = 99;
            go.setW();
            expect(go.w).toBe(0);
        });

        it('should set w to the given value', function ()
        {
            go.setW(55);
            expect(go.w).toBe(55);
        });

        it('should return the game object (chainable)', function ()
        {
            expect(go.setW(1)).toBe(go);
        });
    });

    // -------------------------------------------------------------------------
    // getLocalTransformMatrix
    // -------------------------------------------------------------------------

    describe('getLocalTransformMatrix', function ()
    {
        it('should return a TransformMatrix', function ()
        {
            var matrix = go.getLocalTransformMatrix();
            expect(matrix).toBeInstanceOf(TransformMatrix);
        });

        it('should accept an existing TransformMatrix and populate it', function ()
        {
            var tm = new TransformMatrix();
            var result = go.getLocalTransformMatrix(tm);
            expect(result).toBe(tm);
        });

        it('should encode the current position and scale', function ()
        {
            go.setPosition(10, 20);
            go.setScale(2, 3);
            go.setRotation(0);
            var matrix = go.getLocalTransformMatrix();
            expect(matrix.tx).toBeCloseTo(10, 5);
            expect(matrix.ty).toBeCloseTo(20, 5);
        });

        it('should create a new matrix when none is provided', function ()
        {
            var m1 = go.getLocalTransformMatrix();
            var m2 = go.getLocalTransformMatrix();
            expect(m1).not.toBe(m2);
        });
    });

    // -------------------------------------------------------------------------
    // getWorldTransformMatrix
    // -------------------------------------------------------------------------

    describe('getWorldTransformMatrix', function ()
    {
        it('should return the local matrix when there is no parent container', function ()
        {
            go.x = 5;
            go.y = 10;
            go.parentContainer = null;
            var matrix = go.getWorldTransformMatrix();
            expect(matrix.tx).toBeCloseTo(5, 5);
            expect(matrix.ty).toBeCloseTo(10, 5);
        });

        it('should accept an existing tempMatrix and return it', function ()
        {
            var tm = new TransformMatrix();
            var result = go.getWorldTransformMatrix(tm);
            expect(result).toBe(tm);
        });

        it('should factor in a single parent container', function ()
        {
            var parent = createGameObject();
            parent.x = 100;
            parent.y = 200;
            parent._rotation = 0;
            parent._scaleX = 1;
            parent._scaleY = 1;
            parent.parentContainer = null;

            go.x = 10;
            go.y = 20;
            go._rotation = 0;
            go._scaleX = 1;
            go._scaleY = 1;
            go.parentContainer = parent;

            var matrix = go.getWorldTransformMatrix();
            // At zero rotation and scale=1, world position is child + parent
            expect(matrix.tx).toBeCloseTo(110, 4);
            expect(matrix.ty).toBeCloseTo(220, 4);
        });

        it('should handle a chain of two parent containers', function ()
        {
            var grandparent = createGameObject();
            grandparent.x = 50;
            grandparent.y = 50;
            grandparent._rotation = 0;
            grandparent._scaleX = 1;
            grandparent._scaleY = 1;
            grandparent.parentContainer = null;

            var parent = createGameObject();
            parent.x = 50;
            parent.y = 50;
            parent._rotation = 0;
            parent._scaleX = 1;
            parent._scaleY = 1;
            parent.parentContainer = grandparent;

            go.x = 0;
            go.y = 0;
            go._rotation = 0;
            go._scaleX = 1;
            go._scaleY = 1;
            go.parentContainer = parent;

            var matrix = go.getWorldTransformMatrix();
            expect(matrix.tx).toBeCloseTo(100, 4);
            expect(matrix.ty).toBeCloseTo(100, 4);
        });
    });

    // -------------------------------------------------------------------------
    // getWorldPoint
    // -------------------------------------------------------------------------

    describe('getWorldPoint', function ()
    {
        it('should return x and y directly when no parent container', function ()
        {
            go.x = 123;
            go.y = 456;
            go.parentContainer = null;
            var point = go.getWorldPoint();
            expect(point.x).toBe(123);
            expect(point.y).toBe(456);
        });

        it('should accept a point object and populate it', function ()
        {
            var point = { x: 0, y: 0 };
            go.x = 10;
            go.y = 20;
            go.parentContainer = null;
            var result = go.getWorldPoint(point);
            expect(result).toBe(point);
            expect(point.x).toBe(10);
            expect(point.y).toBe(20);
        });

        it('should use world transform matrix when parent container exists', function ()
        {
            var parent = createGameObject();
            parent.x = 100;
            parent.y = 100;
            parent._rotation = 0;
            parent._scaleX = 1;
            parent._scaleY = 1;
            parent.parentContainer = null;

            go.x = 50;
            go.y = 50;
            go._rotation = 0;
            go._scaleX = 1;
            go._scaleY = 1;
            go.parentContainer = parent;

            var point = go.getWorldPoint();
            expect(point.x).toBeCloseTo(150, 4);
            expect(point.y).toBeCloseTo(150, 4);
        });
    });

    // -------------------------------------------------------------------------
    // getParentRotation
    // -------------------------------------------------------------------------

    describe('getParentRotation', function ()
    {
        it('should return 0 when there is no parent container', function ()
        {
            go.parentContainer = null;
            expect(go.getParentRotation()).toBe(0);
        });

        it('should return the parent rotation when there is one parent', function ()
        {
            var parent = createGameObject();
            parent.rotation = Math.PI / 4;
            parent.parentContainer = null;
            go.parentContainer = parent;
            expect(go.getParentRotation()).toBeCloseTo(Math.PI / 4, 10);
        });

        it('should sum rotations from a chain of parents', function ()
        {
            var grandparent = createGameObject();
            grandparent.rotation = Math.PI / 4;
            grandparent.parentContainer = null;

            var parent = createGameObject();
            parent.rotation = Math.PI / 4;
            parent.parentContainer = grandparent;

            go.parentContainer = parent;
            expect(go.getParentRotation()).toBeCloseTo(Math.PI / 2, 10);
        });

        it('should handle negative parent rotations', function ()
        {
            var parent = createGameObject();
            parent.rotation = -Math.PI / 3;
            parent.parentContainer = null;
            go.parentContainer = parent;
            expect(go.getParentRotation()).toBeCloseTo(-Math.PI / 3, 10);
        });
    });
});
