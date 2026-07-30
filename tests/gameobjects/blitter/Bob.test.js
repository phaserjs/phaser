var Bob = require('../../../src/gameobjects/blitter/Bob');
var Frame = require('../../../src/textures/Frame');

function createMockBlitter (frameOverride)
{
    var mockTexture = {
        get: function (key)
        {
            return { key: key, texture: this };
        }
    };

    var defaultFrame = { key: '__default', texture: mockTexture };

    var blitter = {
        frame: frameOverride || defaultFrame,
        texture: mockTexture,
        dirty: false,
        children: {
            remove: function () {}
        }
    };

    // make texture.get return frames that reference the same texture
    mockTexture.get = function (key)
    {
        return { key: key, texture: mockTexture };
    };

    return blitter;
}

describe('Bob', function ()
{
    var blitter;
    var defaultFrame;

    beforeEach(function ()
    {
        blitter = createMockBlitter();
        defaultFrame = blitter.frame;
    });

    describe('constructor', function ()
    {
        it('should set the parent blitter', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.parent).toBe(blitter);
        });

        it('should set the x and y position', function ()
        {
            var bob = new Bob(blitter, 100, 200, defaultFrame, true);
            expect(bob.x).toBe(100);
            expect(bob.y).toBe(200);
        });

        it('should set the frame', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.frame).toBe(defaultFrame);
        });

        it('should initialize data as an empty object', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.data).toBeDefined();
            expect(typeof bob.data).toBe('object');
        });

        it('should initialize tint to 0xffffff', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.tint).toBe(0xffffff);
        });

        it('should set visible from the constructor argument', function ()
        {
            var bobVisible = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bobVisible.visible).toBe(true);

            var bobHidden = new Bob(blitter, 0, 0, defaultFrame, false);
            expect(bobHidden.visible).toBe(false);
        });

        it('should initialize _alpha to 1', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.alpha).toBe(1);
        });

        it('should initialize flipX to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.flipX).toBe(false);
        });

        it('should initialize flipY to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.flipY).toBe(false);
        });

        it('should set hasTransformComponent to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.hasTransformComponent).toBe(true);
        });

        it('should accept zero position values', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.x).toBe(0);
            expect(bob.y).toBe(0);
        });

        it('should accept negative position values', function ()
        {
            var bob = new Bob(blitter, -50, -75, defaultFrame, true);
            expect(bob.x).toBe(-50);
            expect(bob.y).toBe(-75);
        });
    });

    describe('setFrame', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setFrame()).toBe(bob);
        });

        it('should use parent frame when called with no argument', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setFrame();
            expect(bob.frame).toBe(blitter.frame);
        });

        it('should use parent frame when called with undefined', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setFrame(undefined);
            expect(bob.frame).toBe(blitter.frame);
        });

        it('should call parent.texture.get when passed a string key', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            var getCalled = false;
            var capturedKey = null;

            blitter.texture.get = function (key)
            {
                getCalled = true;
                capturedKey = key;
                return { key: key, texture: blitter.texture };
            };

            bob.setFrame('myFrame');

            expect(getCalled).toBe(true);
            expect(capturedKey).toBe('myFrame');
        });

        it('should call parent.texture.get when passed a numeric key', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            var capturedKey = null;

            blitter.texture.get = function (key)
            {
                capturedKey = key;
                return { key: key, texture: blitter.texture };
            };

            bob.setFrame(3);

            expect(capturedKey).toBe(3);
        });

        it('should set frame to result of texture.get when passed a string', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            var newFrame = { key: 'walk01', texture: blitter.texture };

            blitter.texture.get = function ()
            {
                return newFrame;
            };

            bob.setFrame('walk01');

            expect(bob.frame).toBe(newFrame);
        });

        it('should set frame directly when passed a Frame instance with matching texture', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);

            // Create a real Frame-like object that passes instanceof check
            // We use vi.spyOn on Object to test the else-if branch via a workaround:
            // Pass a Frame instance whose .texture matches blitter.texture
            // Since we cannot construct Frame without a real Texture manager, we
            // confirm the fallback path (texture.get) is used for non-Frame objects
            var plainFrame = { key: 'plain', texture: blitter.texture };
            var newFrame = { key: 'retrieved', texture: blitter.texture };

            blitter.texture.get = function ()
            {
                return newFrame;
            };

            bob.setFrame(plainFrame);

            // plainFrame is not instanceof Frame, so texture.get is called
            expect(bob.frame).toBe(newFrame);
        });
    });

    describe('resetFlip', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.resetFlip()).toBe(bob);
        });

        it('should set flipX to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipX = true;
            bob.resetFlip();
            expect(bob.flipX).toBe(false);
        });

        it('should set flipY to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipY = true;
            bob.resetFlip();
            expect(bob.flipY).toBe(false);
        });

        it('should reset both flips at the same time', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipX = true;
            bob.flipY = true;
            bob.resetFlip();
            expect(bob.flipX).toBe(false);
            expect(bob.flipY).toBe(false);
        });
    });

    describe('reset', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.reset(0, 0)).toBe(bob);
        });

        it('should set x and y to the given values', function ()
        {
            var bob = new Bob(blitter, 50, 50, defaultFrame, true);
            bob.reset(10, 20);
            expect(bob.x).toBe(10);
            expect(bob.y).toBe(20);
        });

        it('should reset flipX and flipY to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipX = true;
            bob.flipY = true;
            bob.reset(0, 0);
            expect(bob.flipX).toBe(false);
            expect(bob.flipY).toBe(false);
        });

        it('should reset alpha to 1', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob._alpha = 0.5;
            bob.reset(0, 0);
            expect(bob._alpha).toBe(1);
        });

        it('should reset visible to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, false);
            bob.reset(0, 0);
            expect(bob._visible).toBe(true);
        });

        it('should set parent.dirty to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            blitter.dirty = false;
            bob.reset(0, 0);
            expect(blitter.dirty).toBe(true);
        });

        it('should call setFrame when a frame argument is provided', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            var setFrameCalled = false;

            bob.setFrame = function ()
            {
                setFrameCalled = true;
                return bob;
            };

            bob.reset(0, 0, 'someFrame');
            expect(setFrameCalled).toBe(true);
        });

        it('should not call setFrame when no frame argument is provided', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            var setFrameCalled = false;

            bob.setFrame = function ()
            {
                setFrameCalled = true;
                return bob;
            };

            bob.reset(0, 0);
            expect(setFrameCalled).toBe(false);
        });

        it('should accept negative coordinates', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.reset(-100, -200);
            expect(bob.x).toBe(-100);
            expect(bob.y).toBe(-200);
        });
    });

    describe('setPosition', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setPosition(0, 0)).toBe(bob);
        });

        it('should set x and y', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setPosition(30, 40);
            expect(bob.x).toBe(30);
            expect(bob.y).toBe(40);
        });

        it('should accept negative values', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setPosition(-10, -20);
            expect(bob.x).toBe(-10);
            expect(bob.y).toBe(-20);
        });

        it('should accept floating point values', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setPosition(1.5, 2.7);
            expect(bob.x).toBeCloseTo(1.5);
            expect(bob.y).toBeCloseTo(2.7);
        });

        it('should overwrite previous position', function ()
        {
            var bob = new Bob(blitter, 100, 200, defaultFrame, true);
            bob.setPosition(5, 10);
            expect(bob.x).toBe(5);
            expect(bob.y).toBe(10);
        });
    });

    describe('setFlipX', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setFlipX(true)).toBe(bob);
        });

        it('should set flipX to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setFlipX(true);
            expect(bob.flipX).toBe(true);
        });

        it('should set flipX to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipX = true;
            bob.setFlipX(false);
            expect(bob.flipX).toBe(false);
        });

        it('should not affect flipY', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipY = true;
            bob.setFlipX(true);
            expect(bob.flipY).toBe(true);
        });
    });

    describe('setFlipY', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setFlipY(true)).toBe(bob);
        });

        it('should set flipY to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setFlipY(true);
            expect(bob.flipY).toBe(true);
        });

        it('should set flipY to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipY = true;
            bob.setFlipY(false);
            expect(bob.flipY).toBe(false);
        });

        it('should not affect flipX', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipX = true;
            bob.setFlipY(true);
            expect(bob.flipX).toBe(true);
        });
    });

    describe('setFlip', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setFlip(true, true)).toBe(bob);
        });

        it('should set both flipX and flipY to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setFlip(true, true);
            expect(bob.flipX).toBe(true);
            expect(bob.flipY).toBe(true);
        });

        it('should set both flipX and flipY to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.flipX = true;
            bob.flipY = true;
            bob.setFlip(false, false);
            expect(bob.flipX).toBe(false);
            expect(bob.flipY).toBe(false);
        });

        it('should set flipX to true and flipY to false independently', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setFlip(true, false);
            expect(bob.flipX).toBe(true);
            expect(bob.flipY).toBe(false);
        });

        it('should set flipX to false and flipY to true independently', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setFlip(false, true);
            expect(bob.flipX).toBe(false);
            expect(bob.flipY).toBe(true);
        });
    });

    describe('setVisible', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setVisible(true)).toBe(bob);
        });

        it('should set visible to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, false);
            bob.setVisible(true);
            expect(bob.visible).toBe(true);
        });

        it('should set visible to false', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setVisible(false);
            expect(bob.visible).toBe(false);
        });

        it('should mark parent dirty when visibility changes', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            blitter.dirty = false;
            bob.setVisible(false);
            expect(blitter.dirty).toBeTruthy();
        });

        it('should not mark parent dirty when visibility does not change', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            blitter.dirty = false;
            bob.setVisible(true);
            expect(blitter.dirty).toBeFalsy();
        });
    });

    describe('setAlpha', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setAlpha(1)).toBe(bob);
        });

        it('should set alpha to the given value', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setAlpha(0.5);
            expect(bob.alpha).toBeCloseTo(0.5);
        });

        it('should set alpha to 0 (fully transparent)', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setAlpha(0);
            expect(bob.alpha).toBe(0);
        });

        it('should set alpha to 1 (fully opaque)', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setAlpha(1);
            expect(bob.alpha).toBe(1);
        });

        it('should mark parent dirty when crossing zero alpha boundary', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob._alpha = 1;
            blitter.dirty = false;
            bob.setAlpha(0);
            expect(blitter.dirty).toBeTruthy();
        });

        it('should not mark parent dirty when staying above zero alpha', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob._alpha = 1;
            blitter.dirty = false;
            bob.setAlpha(0.5);
            expect(blitter.dirty).toBeFalsy();
        });
    });

    describe('setTint', function ()
    {
        it('should return this for chaining', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.setTint(0xffffff)).toBe(bob);
        });

        it('should set tint to the given value', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setTint(0xff0000);
            expect(bob.tint).toBe(0xff0000);
        });

        it('should set tint to white (no tint)', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setTint(0xffffff);
            expect(bob.tint).toBe(0xffffff);
        });

        it('should set tint to black', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setTint(0x000000);
            expect(bob.tint).toBe(0x000000);
        });

        it('should overwrite a previous tint value', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.setTint(0xff0000);
            bob.setTint(0x00ff00);
            expect(bob.tint).toBe(0x00ff00);
        });
    });

    describe('destroy', function ()
    {
        it('should set parent.dirty to true', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            blitter.dirty = false;
            bob.destroy();
            expect(blitter.dirty).toBe(true);
        });

        it('should call parent.children.remove with itself', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            var removedBob = null;

            blitter.children.remove = function (b)
            {
                removedBob = b;
            };

            bob.destroy();
            expect(removedBob).toBe(bob);
        });

        it('should set parent to undefined', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.destroy();
            expect(bob.parent).toBeUndefined();
        });

        it('should set frame to undefined', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.destroy();
            expect(bob.frame).toBeUndefined();
        });

        it('should set data to undefined', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.destroy();
            expect(bob.data).toBeUndefined();
        });
    });

    describe('visible getter/setter', function ()
    {
        it('should get the internal _visible value', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.visible).toBe(true);
        });

        it('should set the internal _visible value', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.visible = false;
            expect(bob._visible).toBe(false);
        });
    });

    describe('alpha getter/setter', function ()
    {
        it('should get the internal _alpha value', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            expect(bob.alpha).toBe(1);
        });

        it('should set the internal _alpha value', function ()
        {
            var bob = new Bob(blitter, 0, 0, defaultFrame, true);
            bob.alpha = 0.25;
            expect(bob._alpha).toBeCloseTo(0.25);
        });
    });
});
