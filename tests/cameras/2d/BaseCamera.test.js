var BaseCamera = require('../../../src/cameras/2d/BaseCamera');

describe('BaseCamera', function ()
{
    describe('constructor', function ()
    {
        it('should create a camera with default values when no arguments given', function ()
        {
            var camera = new BaseCamera();

            expect(camera.x).toBe(0);
            expect(camera.y).toBe(0);
            expect(camera.width).toBe(0);
            expect(camera.height).toBe(0);
        });

        it('should create a camera with given values', function ()
        {
            var camera = new BaseCamera(100, 200, 800, 600);

            expect(camera.x).toBe(100);
            expect(camera.y).toBe(200);
            expect(camera.width).toBe(800);
            expect(camera.height).toBe(600);
        });

        it('should set default property values', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.name).toBe('');
            expect(camera.id).toBe(0);
            expect(camera.roundPixels).toBe(false);
            expect(camera.useBounds).toBe(false);
            expect(camera.dirty).toBe(true);
            expect(camera.transparent).toBe(true);
            expect(camera.disableCull).toBe(false);
            expect(camera.isSceneCamera).toBe(true);
            expect(camera.forceComposite).toBe(false);
            expect(camera.renderRoundPixels).toBe(true);
        });

        it('should initialize scroll to zero', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.scrollX).toBe(0);
            expect(camera.scrollY).toBe(0);
        });

        it('should initialize zoom to one', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.zoom).toBe(1);
            expect(camera.zoomX).toBe(1);
            expect(camera.zoomY).toBe(1);
        });

        it('should initialize rotation to zero', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.rotation).toBe(0);
        });

        it('should initialize origin to 0.5', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.originX).toBe(0.5);
            expect(camera.originY).toBe(0.5);
        });

        it('should initialize midPoint to half of width and height', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.midPoint.x).toBe(400);
            expect(camera.midPoint.y).toBe(300);
        });

        it('should initialize renderList and culledObjects as empty arrays', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(Array.isArray(camera.renderList)).toBe(true);
            expect(camera.renderList.length).toBe(0);
            expect(Array.isArray(camera.culledObjects)).toBe(true);
            expect(camera.culledObjects.length).toBe(0);
        });

        it('should initialize mask to null', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.mask).toBeNull();
        });

        it('should compute centerX and centerY from position and size', function ()
        {
            var camera = new BaseCamera(100, 50, 800, 600);

            expect(camera.centerX).toBe(500);
            expect(camera.centerY).toBe(350);
        });

        it('should compute displayWidth and displayHeight at default zoom', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.displayWidth).toBe(800);
            expect(camera.displayHeight).toBe(600);
        });
    });

    describe('addToRenderList', function ()
    {
        it('should push a game object to the renderList', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var obj = { id: 1 };

            camera.addToRenderList(obj);

            expect(camera.renderList.length).toBe(1);
            expect(camera.renderList[0]).toBe(obj);
        });

        it('should append multiple objects in order', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var obj1 = { id: 1 };
            var obj2 = { id: 2 };

            camera.addToRenderList(obj1);
            camera.addToRenderList(obj2);

            expect(camera.renderList.length).toBe(2);
            expect(camera.renderList[0]).toBe(obj1);
            expect(camera.renderList[1]).toBe(obj2);
        });
    });

    describe('setOrigin', function ()
    {
        it('should set both origins to default 0.5 when called with no arguments', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setOrigin();

            expect(camera.originX).toBe(0.5);
            expect(camera.originY).toBe(0.5);
        });

        it('should set both origins to the given x value when y is omitted', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setOrigin(0.25);

            expect(camera.originX).toBe(0.25);
            expect(camera.originY).toBe(0.25);
        });

        it('should set origins independently when both are provided', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setOrigin(0.1, 0.9);

            expect(camera.originX).toBe(0.1);
            expect(camera.originY).toBe(0.9);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setOrigin(0.5, 0.5)).toBe(camera);
        });
    });

    describe('getScroll', function ()
    {
        it('should return scroll values that would center the camera on the given coordinates', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var out = camera.getScroll(400, 300);

            expect(out.x).toBe(0);
            expect(out.y).toBe(0);
        });

        it('should offset scroll by half the viewport dimensions', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var out = camera.getScroll(800, 600);

            expect(out.x).toBe(400);
            expect(out.y).toBe(300);
        });

        it('should store results in a provided output object', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var out = { x: 0, y: 0 };

            var result = camera.getScroll(100, 200, out);

            expect(result).toBe(out);
            expect(out.x).toBe(-300);
            expect(out.y).toBe(-100);
        });

        it('should create a new Vector2 when no output is provided', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var out = camera.getScroll(0, 0);

            expect(typeof out.x).toBe('number');
            expect(typeof out.y).toBe('number');
        });
    });

    describe('centerOnX', function ()
    {
        it('should set scrollX so the camera is horizontally centered on x', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOnX(400);

            expect(camera.scrollX).toBe(0);
        });

        it('should set midPoint.x to the given x value', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOnX(500);

            expect(camera.midPoint.x).toBe(500);
        });

        it('should account for viewport width when computing scroll', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOnX(1000);

            expect(camera.scrollX).toBe(600);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.centerOnX(0)).toBe(camera);
        });
    });

    describe('centerOnY', function ()
    {
        it('should set scrollY so the camera is vertically centered on y', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOnY(300);

            expect(camera.scrollY).toBe(0);
        });

        it('should set midPoint.y to the given y value', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOnY(500);

            expect(camera.midPoint.y).toBe(500);
        });

        it('should account for viewport height when computing scroll', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOnY(900);

            expect(camera.scrollY).toBe(600);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.centerOnY(0)).toBe(camera);
        });
    });

    describe('centerOn', function ()
    {
        it('should center the camera on both x and y', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOn(400, 300);

            expect(camera.scrollX).toBe(0);
            expect(camera.scrollY).toBe(0);
        });

        it('should set midPoint to given coordinates', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerOn(200, 150);

            expect(camera.midPoint.x).toBe(200);
            expect(camera.midPoint.y).toBe(150);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.centerOn(0, 0)).toBe(camera);
        });
    });

    describe('centerToBounds', function ()
    {
        it('should do nothing when useBounds is false', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerToBounds();

            expect(camera.scrollX).toBe(0);
            expect(camera.scrollY).toBe(0);
        });

        it('should center scroll on the bounds center when useBounds is true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setBounds(0, 0, 2000, 1500);
            camera.centerToBounds();

            expect(camera.scrollX).toBe(600);
            expect(camera.scrollY).toBe(450);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.centerToBounds()).toBe(camera);
        });
    });

    describe('centerToSize', function ()
    {
        it('should set scrollX and scrollY to half the viewport dimensions', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.centerToSize();

            expect(camera.scrollX).toBe(400);
            expect(camera.scrollY).toBe(300);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.centerToSize()).toBe(camera);
        });
    });

    describe('cull', function ()
    {
        it('should return all objects when disableCull is true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.disableCull = true;

            var objects = [{ id: 1 }, { id: 2 }];
            var result = camera.cull(objects);

            expect(result).toBe(objects);
        });

        it('should include objects without a width property', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var obj = { id: 1 };
            var result = camera.cull([obj]);

            expect(result).toContain(obj);
        });

        it('should include objects that have a parentContainer', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var obj = {
                width: 100, height: 100,
                x: 0, y: 0,
                originX: 0, originY: 0,
                scrollFactorX: 1, scrollFactorY: 1,
                parentContainer: {}
            };
            var result = camera.cull([obj]);

            expect(result).toContain(obj);
        });

        it('should include a visible object within the camera viewport', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var obj = {
                width: 100, height: 100,
                x: 100, y: 100,
                originX: 0, originY: 0,
                scrollFactorX: 1, scrollFactorY: 1
            };
            var result = camera.cull([obj]);

            expect(result).toContain(obj);
        });

        it('should return empty array when all objects are off-screen', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var obj = {
                width: 10, height: 10,
                x: 10000, y: 10000,
                originX: 0, originY: 0,
                scrollFactorX: 1, scrollFactorY: 1
            };
            var result = camera.cull([obj]);

            expect(result).not.toContain(obj);
        });
    });

    describe('getWorldPoint', function ()
    {
        it('should return a Vector2-like object', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var result = camera.getWorldPoint(100, 200);

            expect(typeof result.x).toBe('number');
            expect(typeof result.y).toBe('number');
        });

        it('should store results in a provided output object', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var out = { x: 0, y: 0 };
            var result = camera.getWorldPoint(100, 200, out);

            expect(result).toBe(out);
        });

        it('should return the same point when the matrix is identity', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var result = camera.getWorldPoint(100, 200);

            expect(result.x).toBeCloseTo(100);
            expect(result.y).toBeCloseTo(200);
        });

        it('should fall back to input coordinates when determinant is zero', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            // Force a zero determinant by zeroing the matrix
            camera.matrixCombined.matrix[0] = 0;
            camera.matrixCombined.matrix[3] = 0;

            var result = camera.getWorldPoint(50, 75);

            expect(result.x).toBe(50);
            expect(result.y).toBe(75);
        });
    });

    describe('ignore', function ()
    {
        it('should set the cameraFilter bitmask on a single object', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.id = 4;

            var obj = { cameraFilter: 0 };
            camera.ignore(obj);

            expect(obj.cameraFilter).toBe(4);
        });

        it('should set cameraFilter on each object in an array', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.id = 2;

            var obj1 = { cameraFilter: 0 };
            var obj2 = { cameraFilter: 0 };
            camera.ignore([obj1, obj2]);

            expect(obj1.cameraFilter).toBe(2);
            expect(obj2.cameraFilter).toBe(2);
        });

        it('should OR the bitmask with existing cameraFilter value', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.id = 4;

            var obj = { cameraFilter: 2 };
            camera.ignore(obj);

            expect(obj.cameraFilter).toBe(6);
        });

        it('should recurse into nested arrays', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.id = 1;

            var obj = { cameraFilter: 0 };
            camera.ignore([[obj]]);

            expect(obj.cameraFilter).toBe(1);
        });

        it('should recurse into group children via isParent + getChildren', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.id = 1;

            var child = { cameraFilter: 0 };
            var group = {
                isParent: true,
                getChildren: function () { return [child]; }
            };
            camera.ignore(group);

            expect(child.cameraFilter).toBe(1);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var obj = { cameraFilter: 0 };

            expect(camera.ignore(obj)).toBe(camera);
        });
    });

    describe('clampX', function ()
    {
        it('should clamp x to the lower bound', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 2000, 2000);

            var result = camera.clampX(-100);

            expect(result).toBe(0);
        });

        it('should clamp x to the upper bound', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 2000, 2000);

            var result = camera.clampX(9999);

            expect(result).toBeLessThanOrEqual(9999);
        });

        it('should return x unchanged when within bounds', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 2000, 2000);

            var result = camera.clampX(500);

            expect(result).toBe(500);
        });
    });

    describe('clampY', function ()
    {
        it('should clamp y to the lower bound', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 2000, 2000);

            var result = camera.clampY(-100);

            expect(result).toBe(0);
        });

        it('should clamp y to the upper bound', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 2000, 2000);

            var result = camera.clampY(9999);

            expect(result).toBeLessThanOrEqual(9999);
        });

        it('should return y unchanged when within bounds', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 2000, 2000);

            var result = camera.clampY(400);

            expect(result).toBe(400);
        });
    });

    describe('removeBounds', function ()
    {
        it('should set useBounds to false', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 2000, 2000);

            camera.removeBounds();

            expect(camera.useBounds).toBe(false);
        });

        it('should mark the camera as dirty', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.dirty = false;

            camera.removeBounds();

            expect(camera.dirty).toBe(true);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.removeBounds()).toBe(camera);
        });
    });

    describe('setAngle', function ()
    {
        it('should convert degrees to radians and set rotation', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setAngle(90);

            expect(camera.rotation).toBeCloseTo(Math.PI / 2);
        });

        it('should set rotation to zero when called with no arguments', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.rotation = 1;

            camera.setAngle();

            expect(camera.rotation).toBe(0);
        });

        it('should handle negative angles', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setAngle(-90);

            expect(camera.rotation).toBeCloseTo(-Math.PI / 2);
        });

        it('should handle 180 degrees', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setAngle(180);

            expect(camera.rotation).toBeCloseTo(Math.PI);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setAngle(45)).toBe(camera);
        });
    });

    describe('setBackgroundColor', function ()
    {
        it('should set transparent to true for fully transparent color', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setBackgroundColor('rgba(0,0,0,0)');

            expect(camera.transparent).toBe(true);
        });

        it('should set transparent to false for opaque color', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setBackgroundColor(0xff0000);

            expect(camera.transparent).toBe(false);
        });

        it('should use default transparent color when called with no arguments', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.transparent = false;

            camera.setBackgroundColor();

            expect(camera.transparent).toBe(true);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setBackgroundColor(0x000000)).toBe(camera);
        });
    });

    describe('setBounds', function ()
    {
        it('should enable bounds and set useBounds to true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setBounds(0, 0, 2000, 1500);

            expect(camera.useBounds).toBe(true);
        });

        it('should store the bounds dimensions', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setBounds(10, 20, 2000, 1500);
            var bounds = camera.getBounds();

            expect(bounds.x).toBe(10);
            expect(bounds.y).toBe(20);
            expect(bounds.width).toBe(2000);
            expect(bounds.height).toBe(1500);
        });

        it('should mark the camera as dirty', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.dirty = false;

            camera.setBounds(0, 0, 2000, 1500);

            expect(camera.dirty).toBe(true);
        });

        it('should center on bounds when centerOn is true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setBounds(0, 0, 2000, 1500, true);

            expect(camera.scrollX).toBe(600);
            expect(camera.scrollY).toBe(450);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setBounds(0, 0, 2000, 1500)).toBe(camera);
        });
    });

    describe('setForceComposite', function ()
    {
        it('should set forceComposite to true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setForceComposite(true);

            expect(camera.forceComposite).toBe(true);
        });

        it('should set forceComposite to false', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.forceComposite = true;

            camera.setForceComposite(false);

            expect(camera.forceComposite).toBe(false);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setForceComposite(true)).toBe(camera);
        });
    });

    describe('getBounds', function ()
    {
        it('should return a rectangle with empty bounds when no bounds are set', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var bounds = camera.getBounds();

            expect(bounds.x).toBe(0);
            expect(bounds.y).toBe(0);
            expect(bounds.width).toBe(0);
            expect(bounds.height).toBe(0);
        });

        it('should return a copy of the set bounds', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(50, 75, 1000, 800);

            var bounds = camera.getBounds();

            expect(bounds.x).toBe(50);
            expect(bounds.y).toBe(75);
            expect(bounds.width).toBe(1000);
            expect(bounds.height).toBe(800);
        });

        it('should store bounds in a provided rectangle', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 500, 400);

            var Rectangle = require('../../../src/geom/rectangle/Rectangle');
            var out = new Rectangle();
            var result = camera.getBounds(out);

            expect(result).toBe(out);
            expect(out.width).toBe(500);
        });

        it('should return a copy that is independent from internal bounds', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(0, 0, 500, 400);

            var bounds = camera.getBounds();
            bounds.width = 9999;

            var boundsAgain = camera.getBounds();
            expect(boundsAgain.width).toBe(500);
        });
    });

    describe('setName', function ()
    {
        it('should set the camera name', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setName('main');

            expect(camera.name).toBe('main');
        });

        it('should set name to empty string when called with no arguments', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.name = 'something';

            camera.setName();

            expect(camera.name).toBe('');
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setName('cam')).toBe(camera);
        });
    });

    describe('setPosition', function ()
    {
        it('should set x and y position', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setPosition(100, 200);

            expect(camera.x).toBe(100);
            expect(camera.y).toBe(200);
        });

        it('should set y equal to x when y is omitted', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setPosition(150);

            expect(camera.x).toBe(150);
            expect(camera.y).toBe(150);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setPosition(0, 0)).toBe(camera);
        });
    });

    describe('setRotation', function ()
    {
        it('should set rotation in radians', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setRotation(Math.PI);

            expect(camera.rotation).toBeCloseTo(Math.PI);
        });

        it('should set rotation to zero when called with no arguments', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.rotation = 1.5;

            camera.setRotation();

            expect(camera.rotation).toBe(0);
        });

        it('should handle negative rotation values', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setRotation(-Math.PI / 4);

            expect(camera.rotation).toBeCloseTo(-Math.PI / 4);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setRotation(1)).toBe(camera);
        });
    });

    describe('setRoundPixels', function ()
    {
        it('should set roundPixels to true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setRoundPixels(true);

            expect(camera.roundPixels).toBe(true);
        });

        it('should set roundPixels to false', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.roundPixels = true;

            camera.setRoundPixels(false);

            expect(camera.roundPixels).toBe(false);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setRoundPixels(true)).toBe(camera);
        });
    });

    describe('setScroll', function ()
    {
        it('should set scrollX and scrollY', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setScroll(100, 200);

            expect(camera.scrollX).toBe(100);
            expect(camera.scrollY).toBe(200);
        });

        it('should set scrollY equal to scrollX when y is omitted', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setScroll(150);

            expect(camera.scrollX).toBe(150);
            expect(camera.scrollY).toBe(150);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setScroll(0, 0)).toBe(camera);
        });
    });

    describe('setSize', function ()
    {
        it('should set width and height', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setSize(400, 300);

            expect(camera.width).toBe(400);
            expect(camera.height).toBe(300);
        });

        it('should set height equal to width when height is omitted', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setSize(500);

            expect(camera.width).toBe(500);
            expect(camera.height).toBe(500);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setSize(100, 100)).toBe(camera);
        });
    });

    describe('setViewport', function ()
    {
        it('should set x, y, width and height', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setViewport(10, 20, 400, 300);

            expect(camera.x).toBe(10);
            expect(camera.y).toBe(20);
            expect(camera.width).toBe(400);
            expect(camera.height).toBe(300);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setViewport(0, 0, 800, 600)).toBe(camera);
        });
    });

    describe('setZoom', function ()
    {
        it('should set zoom to 1 by default', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.zoom = 2;

            camera.setZoom();

            expect(camera.zoom).toBe(1);
        });

        it('should set both zoomX and zoomY to the given value', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setZoom(2);

            expect(camera.zoomX).toBe(2);
            expect(camera.zoomY).toBe(2);
        });

        it('should set zoomX and zoomY independently', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setZoom(2, 3);

            expect(camera.zoomX).toBe(2);
            expect(camera.zoomY).toBe(3);
        });

        it('should clamp zero x zoom to 0.001', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setZoom(0, 1);

            expect(camera.zoomX).toBe(0.001);
        });

        it('should clamp zero y zoom to 0.001', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setZoom(1, 0);

            expect(camera.zoomY).toBe(0.001);
        });

        it('should handle fractional zoom values', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setZoom(0.5);

            expect(camera.zoomX).toBe(0.5);
            expect(camera.zoomY).toBe(0.5);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setZoom(1)).toBe(camera);
        });
    });

    describe('clearMask', function ()
    {
        it('should set mask to null', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.mask = { destroy: function () {} };

            camera.clearMask();

            expect(camera.mask).toBeNull();
        });

        it('should call destroy on the mask when destroyMask is true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var destroyed = false;
            camera.mask = {
                destroy: function () { destroyed = true; }
            };

            camera.clearMask(true);

            expect(destroyed).toBe(true);
            expect(camera.mask).toBeNull();
        });

        it('should not throw when mask is null and destroyMask is true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.mask = null;

            expect(function () { camera.clearMask(true); }).not.toThrow();
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.clearMask()).toBe(camera);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with the expected properties', function ()
        {
            var camera = new BaseCamera(10, 20, 800, 600);
            var json = camera.toJSON();

            expect(json.name).toBe('');
            expect(json.x).toBe(10);
            expect(json.y).toBe(20);
            expect(json.width).toBe(800);
            expect(json.height).toBe(600);
            expect(json.zoom).toBe(1);
            expect(json.rotation).toBe(0);
            expect(json.roundPixels).toBe(false);
            expect(json.scrollX).toBe(0);
            expect(json.scrollY).toBe(0);
        });

        it('should include bounds in output when useBounds is true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setBounds(10, 20, 500, 400);

            var json = camera.toJSON();

            expect(json.bounds).toBeDefined();
            expect(json.bounds.x).toBe(10);
            expect(json.bounds.y).toBe(20);
            expect(json.bounds.width).toBe(500);
            expect(json.bounds.height).toBe(400);
        });

        it('should not include bounds when useBounds is false', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var json = camera.toJSON();

            expect(json.bounds).toBeUndefined();
        });

        it('should reflect updated name', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setName('mycam');

            var json = camera.toJSON();

            expect(json.name).toBe('mycam');
        });

        it('should reflect updated scroll values', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.setScroll(100, 200);

            var json = camera.toJSON();

            expect(json.scrollX).toBe(100);
            expect(json.scrollY).toBe(200);
        });
    });

    describe('update', function ()
    {
        it('should be a no-op and not throw', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(function () { camera.update(0, 16); }).not.toThrow();
        });
    });

    describe('setIsSceneCamera', function ()
    {
        it('should set isSceneCamera to false', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.setIsSceneCamera(false);

            expect(camera.isSceneCamera).toBe(false);
        });

        it('should set isSceneCamera to true', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.isSceneCamera = false;

            camera.setIsSceneCamera(true);

            expect(camera.isSceneCamera).toBe(true);
        });

        it('should return the camera instance for chaining', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            expect(camera.setIsSceneCamera(true)).toBe(camera);
        });
    });

    describe('destroy', function ()
    {
        it('should set scene-related references to null', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.destroy();

            expect(camera.scene).toBeNull();
            expect(camera.scaleManager).toBeNull();
            expect(camera.sceneManager).toBeNull();
            expect(camera.cameraManager).toBeNull();
        });

        it('should clear renderList and culledObjects', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.renderList.push({});
            camera.culledObjects.push({});

            camera.destroy();

            expect(camera.renderList.length).toBe(0);
            expect(camera.culledObjects.length).toBe(0);
        });

        it('should set _bounds to null', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);

            camera.destroy();

            expect(camera._bounds).toBeNull();
        });

        it('should emit a DESTROY event before cleaning up', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            var fired = false;

            camera.on('cameradestroy', function (cam)
            {
                fired = true;
                expect(cam).toBe(camera);
            });

            camera.destroy();

            expect(fired).toBe(true);
        });
    });

    describe('zoom property', function ()
    {
        it('should return the average of zoomX and zoomY', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.zoomX = 2;
            camera.zoomY = 4;

            expect(camera.zoom).toBe(3);
        });

        it('should set both zoomX and zoomY when assigned', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.zoom = 3;

            expect(camera.zoomX).toBe(3);
            expect(camera.zoomY).toBe(3);
        });

        it('should mark camera as dirty when zoom is set', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.dirty = false;

            camera.zoom = 2;

            expect(camera.dirty).toBe(true);
        });
    });

    describe('scrollX property', function ()
    {
        it('should mark camera as dirty when changed', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.dirty = false;

            camera.scrollX = 100;

            expect(camera.dirty).toBe(true);
        });

        it('should not mark dirty when assigned the same value', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.scrollX = 50;
            camera.dirty = false;

            camera.scrollX = 50;

            expect(camera.dirty).toBe(false);
        });
    });

    describe('scrollY property', function ()
    {
        it('should mark camera as dirty when changed', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.dirty = false;

            camera.scrollY = 100;

            expect(camera.dirty).toBe(true);
        });

        it('should not mark dirty when assigned the same value', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.scrollY = 50;
            camera.dirty = false;

            camera.scrollY = 50;

            expect(camera.dirty).toBe(false);
        });
    });

    describe('centerX and centerY', function ()
    {
        it('should return x plus half of width', function ()
        {
            var camera = new BaseCamera(100, 0, 800, 600);

            expect(camera.centerX).toBe(500);
        });

        it('should return y plus half of height', function ()
        {
            var camera = new BaseCamera(0, 50, 800, 600);

            expect(camera.centerY).toBe(350);
        });
    });

    describe('displayWidth and displayHeight', function ()
    {
        it('should return width divided by zoomX', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.zoomX = 2;

            expect(camera.displayWidth).toBe(400);
        });

        it('should return height divided by zoomY', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.zoomY = 2;

            expect(camera.displayHeight).toBe(300);
        });

        it('should return larger values when zoomed out', function ()
        {
            var camera = new BaseCamera(0, 0, 800, 600);
            camera.zoomX = 0.5;
            camera.zoomY = 0.5;

            expect(camera.displayWidth).toBe(1600);
            expect(camera.displayHeight).toBe(1200);
        });
    });
});
