var Lighting = require('../../../src/gameobjects/components/Lighting');

describe('Lighting', function ()
{
    var obj;

    beforeEach(function ()
    {
        obj = Object.assign({}, Lighting);
        obj.selfShadow = Object.assign({}, Lighting.selfShadow);
        obj.scene = {
            sys: {
                game: {
                    config: {
                        selfShadow: true
                    }
                }
            }
        };
    });

    describe('default values', function ()
    {
        it('should have lighting set to false by default', function ()
        {
            expect(Lighting.lighting).toBe(false);
        });

        it('should have selfShadow.enabled set to null by default', function ()
        {
            expect(Lighting.selfShadow.enabled).toBeNull();
        });

        it('should have selfShadow.penumbra set to 0.5 by default', function ()
        {
            expect(Lighting.selfShadow.penumbra).toBe(0.5);
        });

        it('should have selfShadow.diffuseFlatThreshold set to 1/3 by default', function ()
        {
            expect(Lighting.selfShadow.diffuseFlatThreshold).toBeCloseTo(1 / 3);
        });
    });

    describe('setLighting', function ()
    {
        it('should set lighting to true', function ()
        {
            obj.setLighting(true);

            expect(obj.lighting).toBe(true);
        });

        it('should set lighting to false', function ()
        {
            obj.lighting = true;
            obj.setLighting(false);

            expect(obj.lighting).toBe(false);
        });

        it('should return the instance for chaining', function ()
        {
            var result = obj.setLighting(true);

            expect(result).toBe(obj);
        });

        it('should update lighting from true to false', function ()
        {
            obj.setLighting(true);
            obj.setLighting(false);

            expect(obj.lighting).toBe(false);
        });
    });

    describe('setSelfShadow', function ()
    {
        it('should return the instance for chaining', function ()
        {
            var result = obj.setSelfShadow(true, 0.5, 0.33);

            expect(result).toBe(obj);
        });

        it('should set enabled to true', function ()
        {
            obj.setSelfShadow(true);

            expect(obj.selfShadow.enabled).toBe(true);
        });

        it('should set enabled to false', function ()
        {
            obj.setSelfShadow(false);

            expect(obj.selfShadow.enabled).toBe(false);
        });

        it('should use game config selfShadow when enabled is null', function ()
        {
            obj.scene.sys.game.config.selfShadow = true;
            obj.setSelfShadow(null);

            expect(obj.selfShadow.enabled).toBe(true);
        });

        it('should use game config selfShadow false when enabled is null', function ()
        {
            obj.scene.sys.game.config.selfShadow = false;
            obj.setSelfShadow(null);

            expect(obj.selfShadow.enabled).toBe(false);
        });

        it('should not change enabled when it is undefined', function ()
        {
            obj.selfShadow.enabled = true;
            obj.setSelfShadow(undefined);

            expect(obj.selfShadow.enabled).toBe(true);
        });

        it('should set penumbra', function ()
        {
            obj.setSelfShadow(undefined, 0.8);

            expect(obj.selfShadow.penumbra).toBe(0.8);
        });

        it('should set penumbra to zero', function ()
        {
            obj.setSelfShadow(undefined, 0);

            expect(obj.selfShadow.penumbra).toBe(0);
        });

        it('should set penumbra to one', function ()
        {
            obj.setSelfShadow(undefined, 1);

            expect(obj.selfShadow.penumbra).toBe(1);
        });

        it('should not change penumbra when undefined', function ()
        {
            obj.selfShadow.penumbra = 0.25;
            obj.setSelfShadow(undefined, undefined);

            expect(obj.selfShadow.penumbra).toBe(0.25);
        });

        it('should set diffuseFlatThreshold', function ()
        {
            obj.setSelfShadow(undefined, undefined, 0.75);

            expect(obj.selfShadow.diffuseFlatThreshold).toBe(0.75);
        });

        it('should set diffuseFlatThreshold to zero', function ()
        {
            obj.setSelfShadow(undefined, undefined, 0);

            expect(obj.selfShadow.diffuseFlatThreshold).toBe(0);
        });

        it('should set diffuseFlatThreshold to one', function ()
        {
            obj.setSelfShadow(undefined, undefined, 1);

            expect(obj.selfShadow.diffuseFlatThreshold).toBe(1);
        });

        it('should not change diffuseFlatThreshold when undefined', function ()
        {
            obj.selfShadow.diffuseFlatThreshold = 0.9;
            obj.setSelfShadow(undefined, undefined, undefined);

            expect(obj.selfShadow.diffuseFlatThreshold).toBe(0.9);
        });

        it('should set all three properties at once', function ()
        {
            obj.setSelfShadow(true, 0.2, 0.6);

            expect(obj.selfShadow.enabled).toBe(true);
            expect(obj.selfShadow.penumbra).toBe(0.2);
            expect(obj.selfShadow.diffuseFlatThreshold).toBe(0.6);
        });

        it('should support floating point penumbra values', function ()
        {
            obj.setSelfShadow(undefined, 0.123456);

            expect(obj.selfShadow.penumbra).toBeCloseTo(0.123456);
        });

        it('should support floating point diffuseFlatThreshold values', function ()
        {
            obj.setSelfShadow(undefined, undefined, 1 / 3);

            expect(obj.selfShadow.diffuseFlatThreshold).toBeCloseTo(1 / 3);
        });
    });
});
