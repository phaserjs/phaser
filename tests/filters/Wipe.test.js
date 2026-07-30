var Wipe = require('../../src/filters/Wipe');

describe('Wipe', function ()
{
    var mockTexture;
    var mockCamera;

    beforeEach(function ()
    {
        mockTexture = { key: '__DEFAULT' };
        mockCamera = {
            scene: {
                sys: {
                    textures: {
                        get: function (key)
                        {
                            return { key: key || '__DEFAULT' };
                        }
                    }
                }
            }
        };
    });

    function createWipe (wipeWidth, direction, axis, reveal, wipeTexture)
    {
        return new Wipe(mockCamera, wipeWidth, direction, axis, reveal, wipeTexture);
    }

    describe('Constructor', function ()
    {
        it('should set default wipeWidth to 0.1', function ()
        {
            var wipe = createWipe();
            expect(wipe.wipeWidth).toBeCloseTo(0.1);
        });

        it('should set default progress to 0', function ()
        {
            var wipe = createWipe();
            expect(wipe.progress).toBe(0);
        });

        it('should set default direction to 0', function ()
        {
            var wipe = createWipe();
            expect(wipe.direction).toBe(0);
        });

        it('should set default axis to 0', function ()
        {
            var wipe = createWipe();
            expect(wipe.axis).toBe(0);
        });

        it('should set default reveal to 0', function ()
        {
            var wipe = createWipe();
            expect(wipe.reveal).toBe(0);
        });

        it('should set wipeTexture from camera textures manager', function ()
        {
            var wipe = createWipe();
            expect(wipe.wipeTexture).not.toBeNull();
        });

        it('should use provided wipeWidth', function ()
        {
            var wipe = createWipe(0.5);
            expect(wipe.wipeWidth).toBeCloseTo(0.5);
        });

        it('should use provided direction', function ()
        {
            var wipe = createWipe(0.1, 1);
            expect(wipe.direction).toBe(1);
        });

        it('should use provided axis', function ()
        {
            var wipe = createWipe(0.1, 0, 1);
            expect(wipe.axis).toBe(1);
        });

        it('should use provided reveal value', function ()
        {
            var wipe = createWipe(0.1, 0, 0, 1);
            expect(wipe.reveal).toBe(1);
        });

        it('should set renderNode to FilterWipe', function ()
        {
            var wipe = createWipe();
            expect(wipe.renderNode).toBe('FilterWipe');
        });

        it('should set camera reference', function ()
        {
            var wipe = createWipe();
            expect(wipe.camera).toBe(mockCamera);
        });

        it('should set active to true', function ()
        {
            var wipe = createWipe();
            expect(wipe.active).toBe(true);
        });
    });

    describe('setWipeWidth', function ()
    {
        it('should set the wipeWidth to the given value', function ()
        {
            var wipe = createWipe();
            wipe.setWipeWidth(0.5);
            expect(wipe.wipeWidth).toBeCloseTo(0.5);
        });

        it('should default to 0.1 when called with no arguments', function ()
        {
            var wipe = createWipe(0.9);
            wipe.setWipeWidth();
            expect(wipe.wipeWidth).toBeCloseTo(0.1);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setWipeWidth(0.2);
            expect(result).toBe(wipe);
        });

        it('should accept zero', function ()
        {
            var wipe = createWipe();
            wipe.setWipeWidth(0);
            expect(wipe.wipeWidth).toBe(0);
        });

        it('should accept 1', function ()
        {
            var wipe = createWipe();
            wipe.setWipeWidth(1);
            expect(wipe.wipeWidth).toBe(1);
        });

        it('should accept floating point values', function ()
        {
            var wipe = createWipe();
            wipe.setWipeWidth(0.333);
            expect(wipe.wipeWidth).toBeCloseTo(0.333);
        });
    });

    describe('setLeftToRight', function ()
    {
        it('should set direction to 0', function ()
        {
            var wipe = createWipe(0.1, 1, 1);
            wipe.setLeftToRight();
            expect(wipe.direction).toBe(0);
        });

        it('should set axis to 0', function ()
        {
            var wipe = createWipe(0.1, 1, 1);
            wipe.setLeftToRight();
            expect(wipe.axis).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setLeftToRight();
            expect(result).toBe(wipe);
        });
    });

    describe('setRightToLeft', function ()
    {
        it('should set direction to 1', function ()
        {
            var wipe = createWipe();
            wipe.setRightToLeft();
            expect(wipe.direction).toBe(1);
        });

        it('should set axis to 0', function ()
        {
            var wipe = createWipe(0.1, 0, 1);
            wipe.setRightToLeft();
            expect(wipe.axis).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setRightToLeft();
            expect(result).toBe(wipe);
        });
    });

    describe('setTopToBottom', function ()
    {
        it('should set direction to 1', function ()
        {
            var wipe = createWipe();
            wipe.setTopToBottom();
            expect(wipe.direction).toBe(1);
        });

        it('should set axis to 1', function ()
        {
            var wipe = createWipe();
            wipe.setTopToBottom();
            expect(wipe.axis).toBe(1);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setTopToBottom();
            expect(result).toBe(wipe);
        });
    });

    describe('setBottomToTop', function ()
    {
        it('should set direction to 0', function ()
        {
            var wipe = createWipe(0.1, 1, 0);
            wipe.setBottomToTop();
            expect(wipe.direction).toBe(0);
        });

        it('should set axis to 1', function ()
        {
            var wipe = createWipe();
            wipe.setBottomToTop();
            expect(wipe.axis).toBe(1);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setBottomToTop();
            expect(result).toBe(wipe);
        });
    });

    describe('setWipeEffect', function ()
    {
        it('should set reveal to 0', function ()
        {
            var wipe = createWipe(0.1, 0, 0, 1);
            wipe.setWipeEffect();
            expect(wipe.reveal).toBe(0);
        });

        it('should reset progress to 0', function ()
        {
            var wipe = createWipe();
            wipe.progress = 0.7;
            wipe.setWipeEffect();
            expect(wipe.progress).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setWipeEffect();
            expect(result).toBe(wipe);
        });
    });

    describe('setRevealEffect', function ()
    {
        it('should set reveal to 1', function ()
        {
            var wipe = createWipe();
            wipe.setRevealEffect();
            expect(wipe.reveal).toBe(1);
        });

        it('should reset progress to 0', function ()
        {
            var wipe = createWipe();
            wipe.progress = 0.5;
            wipe.setRevealEffect();
            expect(wipe.progress).toBe(0);
        });

        it('should reset wipeTexture to the default texture', function ()
        {
            var wipe = createWipe();
            wipe.setRevealEffect();
            expect(wipe.wipeTexture).not.toBeNull();
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setRevealEffect();
            expect(result).toBe(wipe);
        });
    });

    describe('setTexture', function ()
    {
        it('should use __DEFAULT texture when called with no arguments', function ()
        {
            var wipe = createWipe();
            wipe.setTexture();
            expect(wipe.wipeTexture).not.toBeNull();
            expect(wipe.wipeTexture.key).toBe('__DEFAULT');
        });

        it('should look up a string key from the textures manager', function ()
        {
            var wipe = createWipe();
            wipe.setTexture('myTexture');
            expect(wipe.wipeTexture.key).toBe('myTexture');
        });

        it('should assign a Texture instance directly without going through the manager', function ()
        {
            var Texture = require('../../src/textures/Texture');
            var tex = Object.create(Texture.prototype);
            tex.key = 'fakeKey';
            var wipe = createWipe();
            wipe.setTexture(tex);
            expect(wipe.wipeTexture).toBe(tex);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setTexture();
            expect(result).toBe(wipe);
        });
    });

    describe('setProgress', function ()
    {
        it('should set the progress to the given value', function ()
        {
            var wipe = createWipe();
            wipe.setProgress(0.5);
            expect(wipe.progress).toBeCloseTo(0.5);
        });

        it('should accept 0', function ()
        {
            var wipe = createWipe();
            wipe.setProgress(0);
            expect(wipe.progress).toBe(0);
        });

        it('should accept 1', function ()
        {
            var wipe = createWipe();
            wipe.setProgress(1);
            expect(wipe.progress).toBe(1);
        });

        it('should accept floating point values', function ()
        {
            var wipe = createWipe();
            wipe.setProgress(0.123);
            expect(wipe.progress).toBeCloseTo(0.123);
        });

        it('should return this for chaining', function ()
        {
            var wipe = createWipe();
            var result = wipe.setProgress(0.5);
            expect(result).toBe(wipe);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining multiple direction and effect methods', function ()
        {
            var wipe = createWipe();
            var result = wipe.setRightToLeft().setWipeEffect().setWipeWidth(0.2).setProgress(0.5);
            expect(result).toBe(wipe);
            expect(wipe.direction).toBe(1);
            expect(wipe.axis).toBe(0);
            expect(wipe.reveal).toBe(0);
            expect(wipe.wipeWidth).toBeCloseTo(0.2);
            expect(wipe.progress).toBeCloseTo(0.5);
        });
    });
});
