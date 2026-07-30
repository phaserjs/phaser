var Pointer = require('../../src/input/Pointer');

describe('Phaser.Input.Pointer', function ()
{
    var mockManager;

    beforeEach(function ()
    {
        mockManager = {
            time: 1000,
            transformPointer: function () {}
        };
    });

    describe('constructor', function ()
    {
        it('should set manager and id', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            expect(pointer.manager).toBe(mockManager);
            expect(pointer.id).toBe(1);
        });

        it('should initialize numeric properties to zero', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            expect(pointer.button).toBe(0);
            expect(pointer.buttons).toBe(0);
            expect(pointer.worldX).toBe(0);
            expect(pointer.worldY).toBe(0);
            expect(pointer.downX).toBe(0);
            expect(pointer.downY).toBe(0);
            expect(pointer.upX).toBe(0);
            expect(pointer.upY).toBe(0);
            expect(pointer.downTime).toBe(0);
            expect(pointer.upTime).toBe(0);
            expect(pointer.moveTime).toBe(0);
            expect(pointer.deltaX).toBe(0);
            expect(pointer.deltaY).toBe(0);
            expect(pointer.deltaZ).toBe(0);
            expect(pointer.smoothFactor).toBe(0);
            expect(pointer.motionFactor).toBeCloseTo(0.2);
            expect(pointer.angle).toBe(0);
            expect(pointer.distance).toBe(0);
        });

        it('should initialize boolean properties to false', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            expect(pointer.primaryDown).toBe(false);
            expect(pointer.isDown).toBe(false);
            expect(pointer.wasTouch).toBe(false);
            expect(pointer.wasCanceled).toBe(false);
            expect(pointer.locked).toBe(false);
        });

        it('should set active to true when id is 0', function ()
        {
            var pointer = new Pointer(mockManager, 0);
            expect(pointer.active).toBe(true);
        });

        it('should set active to false when id is non-zero', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            expect(pointer.active).toBe(false);
        });

        it('should initialize camera to null', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            expect(pointer.camera).toBeNull();
        });

        it('should initialize position as Vector2 at origin', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            expect(pointer.position.x).toBe(0);
            expect(pointer.position.y).toBe(0);
        });

        it('should expose x and y as getters from position', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.position.x = 100;
            pointer.position.y = 200;
            expect(pointer.x).toBe(100);
            expect(pointer.y).toBe(200);
        });
    });

    describe('noButtonDown', function ()
    {
        it('should return true when buttons is 0', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 0;
            expect(pointer.noButtonDown()).toBe(true);
        });

        it('should return false when any button is down', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 1;
            expect(pointer.noButtonDown()).toBe(false);
        });
    });

    describe('leftButtonDown', function ()
    {
        it('should return true when bit 1 is set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 1;
            expect(pointer.leftButtonDown()).toBe(true);
        });

        it('should return true when left and right buttons are both down', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 3; // 1 | 2
            expect(pointer.leftButtonDown()).toBe(true);
        });

        it('should return false when only right button is down', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 2;
            expect(pointer.leftButtonDown()).toBe(false);
        });
    });

    describe('rightButtonDown', function ()
    {
        it('should return true when bit 2 is set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 2;
            expect(pointer.rightButtonDown()).toBe(true);
        });

        it('should return false when only left button is down', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 1;
            expect(pointer.rightButtonDown()).toBe(false);
        });
    });

    describe('middleButtonDown', function ()
    {
        it('should return true when bit 4 is set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 4;
            expect(pointer.middleButtonDown()).toBe(true);
        });

        it('should return false when middle button is not down', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 3;
            expect(pointer.middleButtonDown()).toBe(false);
        });
    });

    describe('backButtonDown', function ()
    {
        it('should return true when bit 8 is set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 8;
            expect(pointer.backButtonDown()).toBe(true);
        });

        it('should return false when bit 8 is not set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 7;
            expect(pointer.backButtonDown()).toBe(false);
        });
    });

    describe('forwardButtonDown', function ()
    {
        it('should return true when bit 16 is set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 16;
            expect(pointer.forwardButtonDown()).toBe(true);
        });

        it('should return false when bit 16 is not set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 15;
            expect(pointer.forwardButtonDown()).toBe(false);
        });
    });

    describe('leftButtonReleased', function ()
    {
        it('should return true when buttons is 0, button is 0, and not down', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 0;
            pointer.button = 0;
            pointer.isDown = false;
            expect(pointer.leftButtonReleased()).toBe(true);
        });

        it('should return false when buttons is 0 but isDown is true', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 0;
            pointer.button = 0;
            pointer.isDown = true;
            expect(pointer.leftButtonReleased()).toBe(false);
        });

        it('should return true when buttons is non-zero and button is 0', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 2;
            pointer.button = 0;
            expect(pointer.leftButtonReleased()).toBe(true);
        });
    });

    describe('rightButtonReleased', function ()
    {
        it('should return true when buttons is 0, button is 2, and not down', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 0;
            pointer.button = 2;
            pointer.isDown = false;
            expect(pointer.rightButtonReleased()).toBe(true);
        });

        it('should return false when button is not 2', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.buttons = 0;
            pointer.button = 0;
            pointer.isDown = false;
            expect(pointer.rightButtonReleased()).toBe(false);
        });
    });

    describe('getDistance', function ()
    {
        it('should return distance from down position to current position when isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downX = 0;
            pointer.downY = 0;
            pointer.x = 3;
            pointer.y = 4;
            expect(pointer.getDistance()).toBeCloseTo(5);
        });

        it('should return distance from down to up position when not isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = false;
            pointer.downX = 0;
            pointer.downY = 0;
            pointer.upX = 6;
            pointer.upY = 8;
            expect(pointer.getDistance()).toBeCloseTo(10);
        });

        it('should return zero when down and current positions are the same', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downX = 5;
            pointer.downY = 5;
            pointer.x = 5;
            pointer.y = 5;
            expect(pointer.getDistance()).toBe(0);
        });
    });

    describe('getDistanceX', function ()
    {
        it('should return horizontal distance when isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downX = 10;
            pointer.x = 50;
            expect(pointer.getDistanceX()).toBe(40);
        });

        it('should return absolute horizontal distance when isDown and moved left', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downX = 50;
            pointer.x = 10;
            expect(pointer.getDistanceX()).toBe(40);
        });

        it('should return horizontal distance from down to up when not isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = false;
            pointer.downX = 0;
            pointer.upX = 30;
            expect(pointer.getDistanceX()).toBe(30);
        });
    });

    describe('getDistanceY', function ()
    {
        it('should return vertical distance when isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downY = 0;
            pointer.y = 25;
            expect(pointer.getDistanceY()).toBe(25);
        });

        it('should return absolute vertical distance when moved upward', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downY = 100;
            pointer.y = 50;
            expect(pointer.getDistanceY()).toBe(50);
        });
    });

    describe('getDuration', function ()
    {
        it('should return time since downTime when isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downTime = 500;
            mockManager.time = 1500;
            expect(pointer.getDuration()).toBe(1000);
        });

        it('should return upTime minus downTime when not isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = false;
            pointer.downTime = 200;
            pointer.upTime = 700;
            expect(pointer.getDuration()).toBe(500);
        });
    });

    describe('getAngle', function ()
    {
        it('should return angle from down position to current when isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = true;
            pointer.downX = 0;
            pointer.downY = 0;
            pointer.x = 1;
            pointer.y = 0;
            expect(pointer.getAngle()).toBeCloseTo(0);
        });

        it('should return angle from down to up position when not isDown', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.isDown = false;
            pointer.downX = 0;
            pointer.downY = 0;
            pointer.upX = 0;
            pointer.upY = 1;
            // Angle pointing down is PI/2
            expect(pointer.getAngle()).toBeCloseTo(Math.PI / 2);
        });
    });

    describe('getInterpolatedPosition', function ()
    {
        it('should return an array of the correct length', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.prevPosition.set(0, 0);
            pointer.position.set(100, 100);
            var result = pointer.getInterpolatedPosition(5);
            expect(result.length).toBe(5);
        });

        it('should default to 10 steps', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            var result = pointer.getInterpolatedPosition();
            expect(result.length).toBe(10);
        });

        it('should use provided output array', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.prevPosition.set(0, 0);
            pointer.position.set(10, 10);
            var out = [];
            var result = pointer.getInterpolatedPosition(3, out);
            expect(result).toBe(out);
            expect(out.length).toBe(3);
        });

        it('should start near prevPosition at t=0', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.prevPosition.set(0, 0);
            pointer.position.set(100, 100);
            var result = pointer.getInterpolatedPosition(10);
            expect(result[0].x).toBeCloseTo(0);
            expect(result[0].y).toBeCloseTo(0);
        });

        it('should return objects with x and y properties', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            var result = pointer.getInterpolatedPosition(4);
            for (var i = 0; i < result.length; i++)
            {
                expect(result[i]).toHaveProperty('x');
                expect(result[i]).toHaveProperty('y');
            }
        });
    });

    describe('updateWorldPoint', function ()
    {
        it('should update worldX and worldY from camera.getWorldPoint', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.x = 100;
            pointer.y = 200;

            var mockCamera = {
                getWorldPoint: function (x, y)
                {
                    return { x: x + 50, y: y + 50 };
                }
            };

            pointer.updateWorldPoint(mockCamera);

            expect(pointer.worldX).toBe(150);
            expect(pointer.worldY).toBe(250);
        });

        it('should return the pointer instance for chaining', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            var mockCamera = {
                getWorldPoint: function () { return { x: 0, y: 0 }; }
            };
            expect(pointer.updateWorldPoint(mockCamera)).toBe(pointer);
        });
    });

    describe('positionToCamera', function ()
    {
        it('should delegate to camera.getWorldPoint with pointer position', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.x = 300;
            pointer.y = 400;

            var calledWith = null;
            var mockCamera = {
                getWorldPoint: function (x, y, output)
                {
                    calledWith = { x: x, y: y };
                    return output || { x: x, y: y };
                }
            };

            pointer.positionToCamera(mockCamera);
            expect(calledWith.x).toBe(300);
            expect(calledWith.y).toBe(400);
        });

        it('should pass through the output argument', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            var out = { x: 0, y: 0 };
            var mockCamera = {
                getWorldPoint: function (x, y, output) { return output; }
            };
            var result = pointer.positionToCamera(mockCamera, out);
            expect(result).toBe(out);
        });
    });

    describe('reset', function ()
    {
        it('should zero out all numeric properties', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.button = 5;
            pointer.buttons = 7;
            pointer.worldX = 100;
            pointer.worldY = 200;
            pointer.downX = 10;
            pointer.downY = 20;
            pointer.upX = 30;
            pointer.upY = 40;
            pointer.deltaX = 1;
            pointer.deltaY = 2;
            pointer.deltaZ = 3;

            pointer.reset();

            expect(pointer.button).toBe(0);
            expect(pointer.buttons).toBe(0);
            expect(pointer.worldX).toBe(0);
            expect(pointer.worldY).toBe(0);
            expect(pointer.downX).toBe(0);
            expect(pointer.downY).toBe(0);
            expect(pointer.upX).toBe(0);
            expect(pointer.upY).toBe(0);
            expect(pointer.deltaX).toBe(0);
            expect(pointer.deltaY).toBe(0);
            expect(pointer.deltaZ).toBe(0);
        });

        it('should reset boolean properties to false', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.primaryDown = true;
            pointer.isDown = true;
            pointer.wasTouch = true;
            pointer.wasCanceled = true;

            pointer.reset();

            expect(pointer.primaryDown).toBe(false);
            expect(pointer.isDown).toBe(false);
            expect(pointer.wasTouch).toBe(false);
            expect(pointer.wasCanceled).toBe(false);
        });

        it('should set active based on id after reset', function ()
        {
            var pointer0 = new Pointer(mockManager, 0);
            var pointer1 = new Pointer(mockManager, 1);

            pointer0.active = false;
            pointer1.active = true;

            pointer0.reset();
            pointer1.reset();

            expect(pointer0.active).toBe(true);
            expect(pointer1.active).toBe(false);
        });

        it('should null out event, downElement and upElement', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.event = { timeStamp: 123 };
            pointer.downElement = {};
            pointer.upElement = {};

            pointer.reset();

            expect(pointer.event).toBeNull();
            expect(pointer.downElement).toBeNull();
            expect(pointer.upElement).toBeNull();
        });

        it('should reset pointerId to null and identifier to 0', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.pointerId = 5;
            pointer.identifier = 3;

            pointer.reset();

            expect(pointer.pointerId).toBeNull();
            expect(pointer.identifier).toBe(0);
        });
    });

    describe('destroy', function ()
    {
        it('should null out camera, manager, and position', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.camera = {};

            pointer.destroy();

            expect(pointer.camera).toBeNull();
            expect(pointer.manager).toBeNull();
            expect(pointer.position).toBeNull();
        });
    });

    describe('time getter', function ()
    {
        it('should return 0 when no event has been set', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            expect(pointer.time).toBe(0);
        });

        it('should return event.timeStamp when event is present', function ()
        {
            var pointer = new Pointer(mockManager, 1);
            pointer.event = { timeStamp: 9999 };
            expect(pointer.time).toBe(9999);
        });
    });
});
