var Flip = require('../../../src/gameobjects/components/Flip');

describe('Flip', function ()
{
    var obj;

    beforeEach(function ()
    {
        obj = Object.assign({}, Flip);
        obj.flipX = false;
        obj.flipY = false;
    });

    describe('default values', function ()
    {
        it('should have flipX default to false', function ()
        {
            expect(Flip.flipX).toBe(false);
        });

        it('should have flipY default to false', function ()
        {
            expect(Flip.flipY).toBe(false);
        });
    });

    describe('toggleFlipX', function ()
    {
        it('should toggle flipX from false to true', function ()
        {
            obj.flipX = false;
            obj.toggleFlipX();
            expect(obj.flipX).toBe(true);
        });

        it('should toggle flipX from true to false', function ()
        {
            obj.flipX = true;
            obj.toggleFlipX();
            expect(obj.flipX).toBe(false);
        });

        it('should toggle flipX multiple times', function ()
        {
            obj.flipX = false;
            obj.toggleFlipX();
            obj.toggleFlipX();
            expect(obj.flipX).toBe(false);
        });

        it('should return the object instance', function ()
        {
            var result = obj.toggleFlipX();
            expect(result).toBe(obj);
        });

        it('should not affect flipY', function ()
        {
            obj.flipY = true;
            obj.toggleFlipX();
            expect(obj.flipY).toBe(true);
        });
    });

    describe('toggleFlipY', function ()
    {
        it('should toggle flipY from false to true', function ()
        {
            obj.flipY = false;
            obj.toggleFlipY();
            expect(obj.flipY).toBe(true);
        });

        it('should toggle flipY from true to false', function ()
        {
            obj.flipY = true;
            obj.toggleFlipY();
            expect(obj.flipY).toBe(false);
        });

        it('should toggle flipY multiple times', function ()
        {
            obj.flipY = false;
            obj.toggleFlipY();
            obj.toggleFlipY();
            expect(obj.flipY).toBe(false);
        });

        it('should return the object instance', function ()
        {
            var result = obj.toggleFlipY();
            expect(result).toBe(obj);
        });

        it('should not affect flipX', function ()
        {
            obj.flipX = true;
            obj.toggleFlipY();
            expect(obj.flipX).toBe(true);
        });
    });

    describe('setFlipX', function ()
    {
        it('should set flipX to true', function ()
        {
            obj.setFlipX(true);
            expect(obj.flipX).toBe(true);
        });

        it('should set flipX to false', function ()
        {
            obj.flipX = true;
            obj.setFlipX(false);
            expect(obj.flipX).toBe(false);
        });

        it('should return the object instance', function ()
        {
            var result = obj.setFlipX(true);
            expect(result).toBe(obj);
        });

        it('should not affect flipY', function ()
        {
            obj.flipY = true;
            obj.setFlipX(true);
            expect(obj.flipY).toBe(true);
        });
    });

    describe('setFlipY', function ()
    {
        it('should set flipY to true', function ()
        {
            obj.setFlipY(true);
            expect(obj.flipY).toBe(true);
        });

        it('should set flipY to false', function ()
        {
            obj.flipY = true;
            obj.setFlipY(false);
            expect(obj.flipY).toBe(false);
        });

        it('should return the object instance', function ()
        {
            var result = obj.setFlipY(true);
            expect(result).toBe(obj);
        });

        it('should not affect flipX', function ()
        {
            obj.flipX = true;
            obj.setFlipY(true);
            expect(obj.flipX).toBe(true);
        });
    });

    describe('setFlip', function ()
    {
        it('should set both flipX and flipY to true', function ()
        {
            obj.setFlip(true, true);
            expect(obj.flipX).toBe(true);
            expect(obj.flipY).toBe(true);
        });

        it('should set both flipX and flipY to false', function ()
        {
            obj.flipX = true;
            obj.flipY = true;
            obj.setFlip(false, false);
            expect(obj.flipX).toBe(false);
            expect(obj.flipY).toBe(false);
        });

        it('should set flipX to true and flipY to false', function ()
        {
            obj.setFlip(true, false);
            expect(obj.flipX).toBe(true);
            expect(obj.flipY).toBe(false);
        });

        it('should set flipX to false and flipY to true', function ()
        {
            obj.setFlip(false, true);
            expect(obj.flipX).toBe(false);
            expect(obj.flipY).toBe(true);
        });

        it('should return the object instance', function ()
        {
            var result = obj.setFlip(true, true);
            expect(result).toBe(obj);
        });
    });

    describe('resetFlip', function ()
    {
        it('should reset flipX to false', function ()
        {
            obj.flipX = true;
            obj.resetFlip();
            expect(obj.flipX).toBe(false);
        });

        it('should reset flipY to false', function ()
        {
            obj.flipY = true;
            obj.resetFlip();
            expect(obj.flipY).toBe(false);
        });

        it('should reset both flipX and flipY when both are true', function ()
        {
            obj.flipX = true;
            obj.flipY = true;
            obj.resetFlip();
            expect(obj.flipX).toBe(false);
            expect(obj.flipY).toBe(false);
        });

        it('should return the object instance', function ()
        {
            var result = obj.resetFlip();
            expect(result).toBe(obj);
        });

        it('should have no effect when already at defaults', function ()
        {
            obj.flipX = false;
            obj.flipY = false;
            obj.resetFlip();
            expect(obj.flipX).toBe(false);
            expect(obj.flipY).toBe(false);
        });
    });
});
