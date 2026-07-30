var Visible = require('../../../src/gameobjects/components/Visible');

describe('Visible', function ()
{
    var obj;

    beforeEach(function ()
    {
        obj = Object.assign({}, Visible, {
            renderFlags: 15
        });

        Object.defineProperty(obj, 'visible', {
            get: Visible.visible.get.bind(obj),
            set: Visible.visible.set.bind(obj),
            configurable: true
        });

        obj._visible = true;
    });

    describe('default state', function ()
    {
        it('should have _visible set to true by default', function ()
        {
            expect(Visible._visible).toBe(true);
        });
    });

    describe('visible getter', function ()
    {
        it('should return true when _visible is true', function ()
        {
            obj._visible = true;
            expect(obj.visible).toBe(true);
        });

        it('should return false when _visible is false', function ()
        {
            obj._visible = false;
            expect(obj.visible).toBe(false);
        });
    });

    describe('visible setter', function ()
    {
        it('should set _visible to true when given true', function ()
        {
            obj.visible = true;
            expect(obj._visible).toBe(true);
        });

        it('should set _visible to false when given false', function ()
        {
            obj.visible = false;
            expect(obj._visible).toBe(false);
        });

        it('should set the renderFlags bit 1 when set to true', function ()
        {
            obj.renderFlags = 0;
            obj.visible = true;
            expect(obj.renderFlags & 1).toBe(1);
        });

        it('should clear the renderFlags bit 1 when set to false', function ()
        {
            obj.renderFlags = 15;
            obj.visible = false;
            expect(obj.renderFlags & 1).toBe(0);
        });

        it('should not affect other renderFlags bits when set to true', function ()
        {
            obj.renderFlags = 14;
            obj.visible = true;
            expect(obj.renderFlags).toBe(15);
        });

        it('should not affect other renderFlags bits when set to false', function ()
        {
            obj.renderFlags = 15;
            obj.visible = false;
            expect(obj.renderFlags).toBe(14);
        });

        it('should treat truthy values as true', function ()
        {
            obj.visible = 1;
            expect(obj._visible).toBe(true);
            expect(obj.renderFlags & 1).toBe(1);
        });

        it('should treat falsy values as false', function ()
        {
            obj.visible = 0;
            expect(obj._visible).toBe(false);
            expect(obj.renderFlags & 1).toBe(0);
        });

        it('should treat null as false', function ()
        {
            obj.visible = null;
            expect(obj._visible).toBe(false);
        });

        it('should treat undefined as false', function ()
        {
            obj.visible = undefined;
            expect(obj._visible).toBe(false);
        });
    });

    describe('setVisible', function ()
    {
        it('should set visible to true', function ()
        {
            obj.visible = false;
            obj.setVisible(true);
            expect(obj.visible).toBe(true);
        });

        it('should set visible to false', function ()
        {
            obj.visible = true;
            obj.setVisible(false);
            expect(obj.visible).toBe(false);
        });

        it('should return the object instance for chaining', function ()
        {
            var result = obj.setVisible(true);
            expect(result).toBe(obj);
        });

        it('should return the object instance when set to false', function ()
        {
            var result = obj.setVisible(false);
            expect(result).toBe(obj);
        });

        it('should update renderFlags when setting visible true', function ()
        {
            obj.renderFlags = 0;
            obj.setVisible(true);
            expect(obj.renderFlags & 1).toBe(1);
        });

        it('should update renderFlags when setting visible false', function ()
        {
            obj.renderFlags = 15;
            obj.setVisible(false);
            expect(obj.renderFlags & 1).toBe(0);
        });

        it('should support chained calls', function ()
        {
            var result = obj.setVisible(true).setVisible(false);
            expect(obj.visible).toBe(false);
            expect(result).toBe(obj);
        });
    });
});
