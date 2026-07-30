var Drag = require('../../../../src/physics/arcade/components/Drag');

describe('Drag', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = {
            body: {
                drag: {
                    x: 0,
                    y: 0,
                    set: function (x, y)
                    {
                        this.x = x;
                        this.y = (y === undefined) ? x : y;
                    }
                },
                useDamping: false
            }
        };

        Object.assign(gameObject, Drag);
    });

    describe('setDrag', function ()
    {
        it('should set both x and y drag when both values are provided', function ()
        {
            gameObject.setDrag(100, 200);

            expect(gameObject.body.drag.x).toBe(100);
            expect(gameObject.body.drag.y).toBe(200);
        });

        it('should set x and y drag to the same value when only x is provided', function ()
        {
            gameObject.setDrag(150);

            expect(gameObject.body.drag.x).toBe(150);
            expect(gameObject.body.drag.y).toBe(150);
        });

        it('should set drag to zero', function ()
        {
            gameObject.setDrag(0, 0);

            expect(gameObject.body.drag.x).toBe(0);
            expect(gameObject.body.drag.y).toBe(0);
        });

        it('should set drag to negative values', function ()
        {
            gameObject.setDrag(-50, -75);

            expect(gameObject.body.drag.x).toBe(-50);
            expect(gameObject.body.drag.y).toBe(-75);
        });

        it('should set drag to floating point values', function ()
        {
            gameObject.setDrag(0.95, 0.5);

            expect(gameObject.body.drag.x).toBeCloseTo(0.95);
            expect(gameObject.body.drag.y).toBeCloseTo(0.5);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setDrag(100, 200);

            expect(result).toBe(gameObject);
        });
    });

    describe('setDragX', function ()
    {
        it('should set the horizontal drag value', function ()
        {
            gameObject.setDragX(300);

            expect(gameObject.body.drag.x).toBe(300);
        });

        it('should not affect the vertical drag value', function ()
        {
            gameObject.body.drag.y = 999;
            gameObject.setDragX(300);

            expect(gameObject.body.drag.y).toBe(999);
        });

        it('should set horizontal drag to zero', function ()
        {
            gameObject.body.drag.x = 100;
            gameObject.setDragX(0);

            expect(gameObject.body.drag.x).toBe(0);
        });

        it('should set horizontal drag to a negative value', function ()
        {
            gameObject.setDragX(-100);

            expect(gameObject.body.drag.x).toBe(-100);
        });

        it('should set horizontal drag to a floating point value', function ()
        {
            gameObject.setDragX(0.95);

            expect(gameObject.body.drag.x).toBeCloseTo(0.95);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setDragX(100);

            expect(result).toBe(gameObject);
        });
    });

    describe('setDragY', function ()
    {
        it('should set the vertical drag value', function ()
        {
            gameObject.setDragY(400);

            expect(gameObject.body.drag.y).toBe(400);
        });

        it('should not affect the horizontal drag value', function ()
        {
            gameObject.body.drag.x = 999;
            gameObject.setDragY(400);

            expect(gameObject.body.drag.x).toBe(999);
        });

        it('should set vertical drag to zero', function ()
        {
            gameObject.body.drag.y = 100;
            gameObject.setDragY(0);

            expect(gameObject.body.drag.y).toBe(0);
        });

        it('should set vertical drag to a negative value', function ()
        {
            gameObject.setDragY(-200);

            expect(gameObject.body.drag.y).toBe(-200);
        });

        it('should set vertical drag to a floating point value', function ()
        {
            gameObject.setDragY(0.5);

            expect(gameObject.body.drag.y).toBeCloseTo(0.5);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setDragY(100);

            expect(result).toBe(gameObject);
        });
    });

    describe('setDamping', function ()
    {
        it('should enable damping when set to true', function ()
        {
            gameObject.setDamping(true);

            expect(gameObject.body.useDamping).toBe(true);
        });

        it('should disable damping when set to false', function ()
        {
            gameObject.body.useDamping = true;
            gameObject.setDamping(false);

            expect(gameObject.body.useDamping).toBe(false);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setDamping(true);

            expect(result).toBe(gameObject);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining setDrag, setDragX, setDragY, and setDamping', function ()
        {
            gameObject.setDrag(100, 200).setDragX(50).setDragY(75).setDamping(true);

            expect(gameObject.body.drag.x).toBe(50);
            expect(gameObject.body.drag.y).toBe(75);
            expect(gameObject.body.useDamping).toBe(true);
        });
    });
});
