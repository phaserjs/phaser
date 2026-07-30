var Size = require('../../../src/gameobjects/components/Size');

function createGameObject (frameWidth, frameHeight)
{
    if (frameWidth === undefined) { frameWidth = 100; }
    if (frameHeight === undefined) { frameHeight = 50; }

    var go = {
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        frame: {
            realWidth: frameWidth,
            realHeight: frameHeight
        },
        input: null
    };

    go.setSizeToFrame = Size.setSizeToFrame;
    go.setSize = Size.setSize;
    go.setDisplaySize = Size.setDisplaySize;

    Object.defineProperty(go, 'displayWidth', Size.displayWidth);
    Object.defineProperty(go, 'displayHeight', Size.displayHeight);

    return go;
}

describe('Size', function ()
{
    describe('module', function ()
    {
        it('should export an object', function ()
        {
            expect(typeof Size).toBe('object');
        });

        it('should have default width of 0', function ()
        {
            expect(Size.width).toBe(0);
        });

        it('should have default height of 0', function ()
        {
            expect(Size.height).toBe(0);
        });

        it('should expose setSizeToFrame as a function', function ()
        {
            expect(typeof Size.setSizeToFrame).toBe('function');
        });

        it('should expose setSize as a function', function ()
        {
            expect(typeof Size.setSize).toBe('function');
        });

        it('should expose setDisplaySize as a function', function ()
        {
            expect(typeof Size.setDisplaySize).toBe('function');
        });

        it('should expose displayWidth as a descriptor object with get and set', function ()
        {
            expect(typeof Size.displayWidth).toBe('object');
            expect(typeof Size.displayWidth.get).toBe('function');
            expect(typeof Size.displayWidth.set).toBe('function');
        });

        it('should expose displayHeight as a descriptor object with get and set', function ()
        {
            expect(typeof Size.displayHeight).toBe('object');
            expect(typeof Size.displayHeight.get).toBe('function');
            expect(typeof Size.displayHeight.set).toBe('function');
        });
    });

    describe('setSize', function ()
    {
        it('should set width and height', function ()
        {
            var go = createGameObject();

            go.setSize(200, 100);

            expect(go.width).toBe(200);
            expect(go.height).toBe(100);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();
            var result = go.setSize(10, 10);

            expect(result).toBe(go);
        });

        it('should set width and height to zero', function ()
        {
            var go = createGameObject();

            go.setSize(0, 0);

            expect(go.width).toBe(0);
            expect(go.height).toBe(0);
        });

        it('should set width and height to negative values', function ()
        {
            var go = createGameObject();

            go.setSize(-50, -25);

            expect(go.width).toBe(-50);
            expect(go.height).toBe(-25);
        });

        it('should set width and height to floating point values', function ()
        {
            var go = createGameObject();

            go.setSize(12.5, 7.75);

            expect(go.width).toBeCloseTo(12.5);
            expect(go.height).toBeCloseTo(7.75);
        });

        it('should overwrite previously set values', function ()
        {
            var go = createGameObject();

            go.setSize(100, 200);
            go.setSize(300, 400);

            expect(go.width).toBe(300);
            expect(go.height).toBe(400);
        });

        it('should not affect scaleX or scaleY', function ()
        {
            var go = createGameObject();

            go.scaleX = 2;
            go.scaleY = 3;
            go.setSize(100, 50);

            expect(go.scaleX).toBe(2);
            expect(go.scaleY).toBe(3);
        });
    });

    describe('setSizeToFrame', function ()
    {
        it('should set width and height from the provided frame', function ()
        {
            var go = createGameObject();
            var frame = { realWidth: 128, realHeight: 64 };

            go.setSizeToFrame(frame);

            expect(go.width).toBe(128);
            expect(go.height).toBe(64);
        });

        it('should fall back to this.frame when no argument is provided', function ()
        {
            var go = createGameObject(200, 150);

            go.setSizeToFrame();

            expect(go.width).toBe(200);
            expect(go.height).toBe(150);
        });

        it('should fall back to this.frame when false is passed', function ()
        {
            var go = createGameObject(80, 40);

            go.setSizeToFrame(false);

            expect(go.width).toBe(80);
            expect(go.height).toBe(40);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject();
            var result = go.setSizeToFrame();

            expect(result).toBe(go);
        });

        it('should update input hitArea when input exists and customHitArea is false', function ()
        {
            var go = createGameObject();

            go.input = {
                customHitArea: false,
                hitArea: { width: 0, height: 0 }
            };

            var frame = { realWidth: 64, realHeight: 32 };

            go.setSizeToFrame(frame);

            expect(go.input.hitArea.width).toBe(64);
            expect(go.input.hitArea.height).toBe(32);
        });

        it('should not update input hitArea when customHitArea is true', function ()
        {
            var go = createGameObject();

            go.input = {
                customHitArea: true,
                hitArea: { width: 999, height: 888 }
            };

            var frame = { realWidth: 64, realHeight: 32 };

            go.setSizeToFrame(frame);

            expect(go.input.hitArea.width).toBe(999);
            expect(go.input.hitArea.height).toBe(888);
        });

        it('should not throw when input is null', function ()
        {
            var go = createGameObject();

            go.input = null;

            expect(function ()
            {
                go.setSizeToFrame();
            }).not.toThrow();
        });

        it('should set width and height even when input exists', function ()
        {
            var go = createGameObject();

            go.input = {
                customHitArea: false,
                hitArea: { width: 0, height: 0 }
            };

            var frame = { realWidth: 48, realHeight: 96 };

            go.setSizeToFrame(frame);

            expect(go.width).toBe(48);
            expect(go.height).toBe(96);
        });
    });

    describe('displayWidth getter', function ()
    {
        it('should return scaleX multiplied by frame realWidth', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleX = 2;

            expect(go.displayWidth).toBe(200);
        });

        it('should return frame realWidth when scaleX is 1', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleX = 1;

            expect(go.displayWidth).toBe(100);
        });

        it('should return absolute value when scaleX is negative', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleX = -2;

            expect(go.displayWidth).toBe(200);
        });

        it('should return zero when scaleX is zero', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleX = 0;

            expect(go.displayWidth).toBe(0);
        });

        it('should work with fractional scale', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleX = 0.5;

            expect(go.displayWidth).toBeCloseTo(50);
        });
    });

    describe('displayWidth setter', function ()
    {
        it('should adjust scaleX to produce the desired pixel width', function ()
        {
            var go = createGameObject(100, 50);

            go.displayWidth = 200;

            expect(go.scaleX).toBeCloseTo(2);
        });

        it('should set scaleX to 1 when displayWidth equals frame realWidth', function ()
        {
            var go = createGameObject(100, 50);

            go.displayWidth = 100;

            expect(go.scaleX).toBeCloseTo(1);
        });

        it('should set scaleX to fractional value for smaller display width', function ()
        {
            var go = createGameObject(100, 50);

            go.displayWidth = 50;

            expect(go.scaleX).toBeCloseTo(0.5);
        });

        it('should set scaleX to zero when displayWidth is zero', function ()
        {
            var go = createGameObject(100, 50);

            go.displayWidth = 0;

            expect(go.scaleX).toBe(0);
        });

        it('should set scaleX to negative when displayWidth is negative', function ()
        {
            var go = createGameObject(100, 50);

            go.displayWidth = -100;

            expect(go.scaleX).toBeCloseTo(-1);
        });
    });

    describe('displayHeight getter', function ()
    {
        it('should return scaleY multiplied by frame realHeight', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleY = 2;

            expect(go.displayHeight).toBe(100);
        });

        it('should return frame realHeight when scaleY is 1', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleY = 1;

            expect(go.displayHeight).toBe(50);
        });

        it('should return absolute value when scaleY is negative', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleY = -3;

            expect(go.displayHeight).toBe(150);
        });

        it('should return zero when scaleY is zero', function ()
        {
            var go = createGameObject(100, 50);

            go.scaleY = 0;

            expect(go.displayHeight).toBe(0);
        });

        it('should work with fractional scale', function ()
        {
            var go = createGameObject(100, 80);

            go.scaleY = 0.25;

            expect(go.displayHeight).toBeCloseTo(20);
        });
    });

    describe('displayHeight setter', function ()
    {
        it('should adjust scaleY to produce the desired pixel height', function ()
        {
            var go = createGameObject(100, 50);

            go.displayHeight = 100;

            expect(go.scaleY).toBeCloseTo(2);
        });

        it('should set scaleY to 1 when displayHeight equals frame realHeight', function ()
        {
            var go = createGameObject(100, 50);

            go.displayHeight = 50;

            expect(go.scaleY).toBeCloseTo(1);
        });

        it('should set scaleY to fractional value for smaller display height', function ()
        {
            var go = createGameObject(100, 50);

            go.displayHeight = 25;

            expect(go.scaleY).toBeCloseTo(0.5);
        });

        it('should set scaleY to zero when displayHeight is zero', function ()
        {
            var go = createGameObject(100, 50);

            go.displayHeight = 0;

            expect(go.scaleY).toBe(0);
        });

        it('should set scaleY to negative when displayHeight is negative', function ()
        {
            var go = createGameObject(100, 50);

            go.displayHeight = -50;

            expect(go.scaleY).toBeCloseTo(-1);
        });
    });

    describe('setDisplaySize', function ()
    {
        it('should set displayWidth and displayHeight by adjusting scale', function ()
        {
            var go = createGameObject(100, 50);

            go.setDisplaySize(200, 100);

            expect(go.scaleX).toBeCloseTo(2);
            expect(go.scaleY).toBeCloseTo(2);
        });

        it('should return the game object for chaining', function ()
        {
            var go = createGameObject(100, 50);
            var result = go.setDisplaySize(100, 50);

            expect(result).toBe(go);
        });

        it('should not affect native width and height', function ()
        {
            var go = createGameObject(100, 50);

            go.width = 100;
            go.height = 50;
            go.setDisplaySize(200, 200);

            expect(go.width).toBe(100);
            expect(go.height).toBe(50);
        });

        it('should set scale to 1 when display size matches frame size', function ()
        {
            var go = createGameObject(100, 50);

            go.setDisplaySize(100, 50);

            expect(go.scaleX).toBeCloseTo(1);
            expect(go.scaleY).toBeCloseTo(1);
        });

        it('should set scale to fractional values for smaller display size', function ()
        {
            var go = createGameObject(100, 50);

            go.setDisplaySize(50, 25);

            expect(go.scaleX).toBeCloseTo(0.5);
            expect(go.scaleY).toBeCloseTo(0.5);
        });

        it('should handle non-uniform scaling', function ()
        {
            var go = createGameObject(100, 50);

            go.setDisplaySize(300, 25);

            expect(go.scaleX).toBeCloseTo(3);
            expect(go.scaleY).toBeCloseTo(0.5);
        });

        it('should set scale to zero when display size is zero', function ()
        {
            var go = createGameObject(100, 50);

            go.setDisplaySize(0, 0);

            expect(go.scaleX).toBe(0);
            expect(go.scaleY).toBe(0);
        });

        it('should correctly reflect the new displayWidth and displayHeight after call', function ()
        {
            var go = createGameObject(100, 50);

            go.setDisplaySize(250, 75);

            expect(go.displayWidth).toBeCloseTo(250);
            expect(go.displayHeight).toBeCloseTo(75);
        });
    });

    describe('chaining', function ()
    {
        it('should allow setSize and setDisplaySize to be chained', function ()
        {
            var go = createGameObject(100, 50);
            var result = go.setSize(100, 50).setDisplaySize(200, 100);

            expect(result).toBe(go);
            expect(go.width).toBe(100);
            expect(go.height).toBe(50);
            expect(go.scaleX).toBeCloseTo(2);
            expect(go.scaleY).toBeCloseTo(2);
        });

        it('should allow setSizeToFrame and setSize to be chained', function ()
        {
            var go = createGameObject(64, 32);
            var result = go.setSizeToFrame().setSize(128, 64);

            expect(result).toBe(go);
            expect(go.width).toBe(128);
            expect(go.height).toBe(64);
        });
    });
});
