var Barrel = require('../../src/filters/Barrel');

describe('Barrel', function ()
{
    var mockCamera;

    beforeEach(function ()
    {
        mockCamera = { id: 'mockCamera' };
    });

    describe('constructor', function ()
    {
        it('should create a Barrel with default amount of 1', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.amount).toBe(1);
        });

        it('should create a Barrel with a custom amount', function ()
        {
            var barrel = new Barrel(mockCamera, 0.5);
            expect(barrel.amount).toBe(0.5);
        });

        it('should create a Barrel with amount greater than 1 (barrel distortion)', function ()
        {
            var barrel = new Barrel(mockCamera, 2);
            expect(barrel.amount).toBe(2);
        });

        it('should create a Barrel with amount less than 1 (pincushion distortion)', function ()
        {
            var barrel = new Barrel(mockCamera, 0.2);
            expect(barrel.amount).toBe(0.2);
        });

        it('should create a Barrel with a negative amount', function ()
        {
            var barrel = new Barrel(mockCamera, -1);
            expect(barrel.amount).toBe(-1);
        });

        it('should create a Barrel with amount of zero', function ()
        {
            var barrel = new Barrel(mockCamera, 0);
            expect(barrel.amount).toBe(0);
        });

        it('should set active to true by default (inherited from Controller)', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.active).toBe(true);
        });

        it('should store the camera reference (inherited from Controller)', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.camera).toBe(mockCamera);
        });

        it('should set renderNode to FilterBarrel (inherited from Controller)', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.renderNode).toBe('FilterBarrel');
        });

        it('should set allowBaseDraw to true by default (inherited from Controller)', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.allowBaseDraw).toBe(true);
        });

        it('should set ignoreDestroy to false by default (inherited from Controller)', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.ignoreDestroy).toBe(false);
        });

        it('should initialise paddingOverride as a Rectangle (inherited from Controller)', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.paddingOverride).not.toBeNull();
            expect(typeof barrel.paddingOverride).toBe('object');
        });

        it('should initialise currentPadding as a Rectangle (inherited from Controller)', function ()
        {
            var barrel = new Barrel(mockCamera);
            expect(barrel.currentPadding).not.toBeNull();
            expect(typeof barrel.currentPadding).toBe('object');
        });
    });

    describe('amount property', function ()
    {
        it('should allow amount to be reassigned', function ()
        {
            var barrel = new Barrel(mockCamera, 1);
            barrel.amount = 0.5;
            expect(barrel.amount).toBe(0.5);
        });

        it('should allow amount to be set to a floating point value', function ()
        {
            var barrel = new Barrel(mockCamera, 1.75);
            expect(barrel.amount).toBeCloseTo(1.75);
        });
    });

    describe('setActive (inherited from Controller)', function ()
    {
        it('should set active to false', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.setActive(false);
            expect(barrel.active).toBe(false);
        });

        it('should set active to true', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.setActive(false);
            barrel.setActive(true);
            expect(barrel.active).toBe(true);
        });

        it('should return the instance for chaining', function ()
        {
            var barrel = new Barrel(mockCamera);
            var result = barrel.setActive(false);
            expect(result).toBe(barrel);
        });
    });

    describe('getPadding (inherited from Controller)', function ()
    {
        it('should return the paddingOverride when set', function ()
        {
            var barrel = new Barrel(mockCamera);
            var padding = barrel.getPadding();
            expect(padding).toBe(barrel.paddingOverride);
        });

        it('should return currentPadding when paddingOverride is null', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.setPaddingOverride(null);
            var padding = barrel.getPadding();
            expect(padding).toBe(barrel.currentPadding);
        });
    });

    describe('setPaddingOverride (inherited from Controller)', function ()
    {
        it('should set paddingOverride to null when called with null', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.setPaddingOverride(null);
            expect(barrel.paddingOverride).toBeNull();
        });

        it('should create a new Rectangle when called with no arguments', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.setPaddingOverride(null);
            barrel.setPaddingOverride();
            expect(barrel.paddingOverride).not.toBeNull();
        });

        it('should return the instance for chaining', function ()
        {
            var barrel = new Barrel(mockCamera);
            var result = barrel.setPaddingOverride(null);
            expect(result).toBe(barrel);
        });
    });

    describe('destroy (inherited from Controller)', function ()
    {
        it('should set active to false on destroy', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.destroy();
            expect(barrel.active).toBe(false);
        });

        it('should set renderNode to null on destroy', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.destroy();
            expect(barrel.renderNode).toBeNull();
        });

        it('should set camera to null on destroy', function ()
        {
            var barrel = new Barrel(mockCamera);
            barrel.destroy();
            expect(barrel.camera).toBeNull();
        });
    });
});
