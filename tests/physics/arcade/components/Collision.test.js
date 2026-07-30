var Collision = require('../../../../src/physics/arcade/components/Collision');

describe('Collision', function ()
{
    var obj;

    beforeEach(function ()
    {
        obj = {
            collisionCategory: 0x0001,
            collisionMask: 2147483647,
            setCollisionCategory: Collision.setCollisionCategory,
            willCollideWith: Collision.willCollideWith,
            addCollidesWith: Collision.addCollidesWith,
            removeCollidesWith: Collision.removeCollidesWith,
            setCollidesWith: Collision.setCollidesWith,
            resetCollisionCategory: Collision.resetCollisionCategory
        };

        // No body property, so methods operate directly on obj
        obj.body = null;
    });

    // --- setCollisionCategory ---

    describe('setCollisionCategory', function ()
    {
        it('should set the collisionCategory on the object when no body', function ()
        {
            obj.setCollisionCategory(4);
            expect(obj.collisionCategory).toBe(4);
        });

        it('should set the collisionCategory on the body when body exists', function ()
        {
            obj.body = { collisionCategory: 0x0001, collisionMask: 2147483647 };
            obj.setCollisionCategory(8);
            expect(obj.body.collisionCategory).toBe(8);
            expect(obj.collisionCategory).toBe(0x0001);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.setCollisionCategory(2);
            expect(result).toBe(obj);
        });

        it('should allow setting category to 1', function ()
        {
            obj.setCollisionCategory(1);
            expect(obj.collisionCategory).toBe(1);
        });

        it('should allow setting category to a high power of 2', function ()
        {
            obj.setCollisionCategory(1024);
            expect(obj.collisionCategory).toBe(1024);
        });
    });

    // --- willCollideWith ---

    describe('willCollideWith', function ()
    {
        it('should return true when the category is in the collision mask', function ()
        {
            obj.collisionMask = 0b0111;
            expect(obj.willCollideWith(0b0001)).toBe(true);
            expect(obj.willCollideWith(0b0010)).toBe(true);
            expect(obj.willCollideWith(0b0100)).toBe(true);
        });

        it('should return false when the category is not in the collision mask', function ()
        {
            obj.collisionMask = 0b0011;
            expect(obj.willCollideWith(0b0100)).toBe(false);
        });

        it('should check the body mask when body exists', function ()
        {
            obj.body = { collisionCategory: 0x0001, collisionMask: 0b0010 };
            expect(obj.willCollideWith(0b0010)).toBe(true);
            expect(obj.willCollideWith(0b0001)).toBe(false);
        });

        it('should return false when mask is 0', function ()
        {
            obj.collisionMask = 0;
            expect(obj.willCollideWith(1)).toBe(false);
        });

        it('should return true for the default mask (2147483647) with any positive category', function ()
        {
            obj.collisionMask = 2147483647;
            expect(obj.willCollideWith(1)).toBe(true);
            expect(obj.willCollideWith(2)).toBe(true);
            expect(obj.willCollideWith(1024)).toBe(true);
        });
    });

    // --- addCollidesWith ---

    describe('addCollidesWith', function ()
    {
        it('should add a category to the collision mask', function ()
        {
            obj.collisionMask = 0b0001;
            obj.addCollidesWith(0b0010);
            expect(obj.collisionMask).toBe(0b0011);
        });

        it('should not duplicate a category already in the mask', function ()
        {
            obj.collisionMask = 0b0011;
            obj.addCollidesWith(0b0001);
            expect(obj.collisionMask).toBe(0b0011);
        });

        it('should add to the body mask when body exists', function ()
        {
            obj.body = { collisionCategory: 0x0001, collisionMask: 0b0001 };
            obj.addCollidesWith(0b0100);
            expect(obj.body.collisionMask).toBe(0b0101);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.addCollidesWith(2);
            expect(result).toBe(obj);
        });

        it('should handle adding multiple distinct bits sequentially', function ()
        {
            obj.collisionMask = 0;
            obj.addCollidesWith(1);
            obj.addCollidesWith(4);
            obj.addCollidesWith(16);
            expect(obj.collisionMask).toBe(21);
        });
    });

    // --- removeCollidesWith ---

    describe('removeCollidesWith', function ()
    {
        it('should remove a category from the collision mask', function ()
        {
            obj.collisionMask = 0b0111;
            obj.removeCollidesWith(0b0010);
            expect(obj.collisionMask).toBe(0b0101);
        });

        it('should be a no-op when category is not in the mask', function ()
        {
            obj.collisionMask = 0b0001;
            obj.removeCollidesWith(0b0010);
            expect(obj.collisionMask).toBe(0b0001);
        });

        it('should remove from the body mask when body exists', function ()
        {
            obj.body = { collisionCategory: 0x0001, collisionMask: 0b0111 };
            obj.removeCollidesWith(0b0100);
            expect(obj.body.collisionMask).toBe(0b0011);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.removeCollidesWith(2);
            expect(result).toBe(obj);
        });

        it('should clear all bits when removing a full mask', function ()
        {
            obj.collisionMask = 0b1111;
            obj.removeCollidesWith(0b1111);
            expect(obj.collisionMask).toBe(0);
        });
    });

    // --- setCollidesWith ---

    describe('setCollidesWith', function ()
    {
        it('should set the collision mask to a single category value', function ()
        {
            obj.setCollidesWith(4);
            expect(obj.collisionMask).toBe(4);
        });

        it('should set the collision mask from an array of categories', function ()
        {
            obj.setCollidesWith([1, 2, 4]);
            expect(obj.collisionMask).toBe(7);
        });

        it('should reset any previous mask when called again', function ()
        {
            obj.collisionMask = 0b1111;
            obj.setCollidesWith(0b0001);
            expect(obj.collisionMask).toBe(0b0001);
        });

        it('should set on the body when body exists', function ()
        {
            obj.body = { collisionCategory: 0x0001, collisionMask: 0b1111 };
            obj.setCollidesWith([2, 8]);
            expect(obj.body.collisionMask).toBe(10);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.setCollidesWith(1);
            expect(result).toBe(obj);
        });

        it('should handle an empty array resulting in mask of 0', function ()
        {
            obj.setCollidesWith([]);
            expect(obj.collisionMask).toBe(0);
        });
    });

    // --- resetCollisionCategory ---

    describe('resetCollisionCategory', function ()
    {
        it('should reset collisionCategory to 0x0001', function ()
        {
            obj.collisionCategory = 16;
            obj.resetCollisionCategory();
            expect(obj.collisionCategory).toBe(0x0001);
        });

        it('should reset collisionMask to 2147483647', function ()
        {
            obj.collisionMask = 0b0001;
            obj.resetCollisionCategory();
            expect(obj.collisionMask).toBe(2147483647);
        });

        it('should reset on the body when body exists', function ()
        {
            obj.body = { collisionCategory: 32, collisionMask: 0b0010 };
            obj.resetCollisionCategory();
            expect(obj.body.collisionCategory).toBe(0x0001);
            expect(obj.body.collisionMask).toBe(2147483647);
        });

        it('should return this for chaining', function ()
        {
            var result = obj.resetCollisionCategory();
            expect(result).toBe(obj);
        });
    });

    // --- chaining ---

    describe('method chaining', function ()
    {
        it('should support chaining multiple collision methods', function ()
        {
            obj.collisionMask = 0;
            obj
                .setCollisionCategory(2)
                .addCollidesWith(1)
                .addCollidesWith(4)
                .removeCollidesWith(1);

            expect(obj.collisionCategory).toBe(2);
            expect(obj.collisionMask).toBe(4);
        });

        it('should support chaining ending in reset', function ()
        {
            obj
                .setCollisionCategory(8)
                .setCollidesWith([4, 16])
                .resetCollisionCategory();

            expect(obj.collisionCategory).toBe(0x0001);
            expect(obj.collisionMask).toBe(2147483647);
        });
    });
});
