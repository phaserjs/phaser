var Size = require('../../../../src/physics/arcade/components/Size');

describe('Size', function ()
{
    var gameObject;
    var mockBody;

    beforeEach(function ()
    {
        mockBody = {
            setOffset: vi.fn(),
            setSize: vi.fn(),
            setCircle: vi.fn()
        };

        gameObject = Object.assign({}, Size, { body: mockBody });
    });

    describe('setOffset', function ()
    {
        it('should call body.setOffset with the given x and y values', function ()
        {
            gameObject.setOffset(10, 20);

            expect(mockBody.setOffset).toHaveBeenCalledWith(10, 20);
        });

        it('should call body.setOffset with only x when y is omitted', function ()
        {
            gameObject.setOffset(15);

            expect(mockBody.setOffset).toHaveBeenCalledWith(15, undefined);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setOffset(5, 5);

            expect(result).toBe(gameObject);
        });

        it('should pass zero values to body.setOffset', function ()
        {
            gameObject.setOffset(0, 0);

            expect(mockBody.setOffset).toHaveBeenCalledWith(0, 0);
        });

        it('should pass negative values to body.setOffset', function ()
        {
            gameObject.setOffset(-10, -20);

            expect(mockBody.setOffset).toHaveBeenCalledWith(-10, -20);
        });

        it('should pass floating point values to body.setOffset', function ()
        {
            gameObject.setOffset(1.5, 2.75);

            expect(mockBody.setOffset).toHaveBeenCalledWith(1.5, 2.75);
        });
    });

    describe('setSize', function ()
    {
        it('should call body.setSize with the given width and height', function ()
        {
            gameObject.setSize(100, 200);

            expect(mockBody.setSize).toHaveBeenCalledWith(100, 200, undefined);
        });

        it('should call body.setSize with center parameter', function ()
        {
            gameObject.setSize(50, 50, true);

            expect(mockBody.setSize).toHaveBeenCalledWith(50, 50, true);
        });

        it('should call body.setSize with center set to false', function ()
        {
            gameObject.setSize(80, 40, false);

            expect(mockBody.setSize).toHaveBeenCalledWith(80, 40, false);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setSize(32, 32);

            expect(result).toBe(gameObject);
        });

        it('should pass zero dimensions to body.setSize', function ()
        {
            gameObject.setSize(0, 0);

            expect(mockBody.setSize).toHaveBeenCalledWith(0, 0, undefined);
        });

        it('should pass floating point dimensions to body.setSize', function ()
        {
            gameObject.setSize(16.5, 32.25);

            expect(mockBody.setSize).toHaveBeenCalledWith(16.5, 32.25, undefined);
        });
    });

    describe('setBodySize', function ()
    {
        it('should call body.setSize with the given width and height', function ()
        {
            gameObject.setBodySize(100, 200);

            expect(mockBody.setSize).toHaveBeenCalledWith(100, 200, undefined);
        });

        it('should call body.setSize with center parameter', function ()
        {
            gameObject.setBodySize(50, 50, true);

            expect(mockBody.setSize).toHaveBeenCalledWith(50, 50, true);
        });

        it('should call body.setSize with center set to false', function ()
        {
            gameObject.setBodySize(80, 40, false);

            expect(mockBody.setSize).toHaveBeenCalledWith(80, 40, false);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setBodySize(32, 32);

            expect(result).toBe(gameObject);
        });

        it('should pass zero dimensions to body.setSize', function ()
        {
            gameObject.setBodySize(0, 0);

            expect(mockBody.setSize).toHaveBeenCalledWith(0, 0, undefined);
        });

        it('should pass large dimensions to body.setSize', function ()
        {
            gameObject.setBodySize(1024, 768);

            expect(mockBody.setSize).toHaveBeenCalledWith(1024, 768, undefined);
        });
    });

    describe('setBodySize vs setSize', function ()
    {
        it('should both delegate to body.setSize identically', function ()
        {
            gameObject.setSize(64, 64, true);
            var setSizeCall = mockBody.setSize.mock.calls[0];

            mockBody.setSize.mockClear();

            gameObject.setBodySize(64, 64, true);
            var setBodySizeCall = mockBody.setSize.mock.calls[0];

            expect(setSizeCall).toEqual(setBodySizeCall);
        });
    });

    describe('setCircle', function ()
    {
        it('should call body.setCircle with the given radius', function ()
        {
            gameObject.setCircle(16);

            expect(mockBody.setCircle).toHaveBeenCalledWith(16, undefined, undefined);
        });

        it('should call body.setCircle with radius and offsets', function ()
        {
            gameObject.setCircle(16, 8, 8);

            expect(mockBody.setCircle).toHaveBeenCalledWith(16, 8, 8);
        });

        it('should call body.setCircle with only x offset', function ()
        {
            gameObject.setCircle(10, 5);

            expect(mockBody.setCircle).toHaveBeenCalledWith(10, 5, undefined);
        });

        it('should return the game object for chaining', function ()
        {
            var result = gameObject.setCircle(20);

            expect(result).toBe(gameObject);
        });

        it('should pass zero radius to body.setCircle', function ()
        {
            gameObject.setCircle(0);

            expect(mockBody.setCircle).toHaveBeenCalledWith(0, undefined, undefined);
        });

        it('should pass negative offsets to body.setCircle', function ()
        {
            gameObject.setCircle(12, -4, -8);

            expect(mockBody.setCircle).toHaveBeenCalledWith(12, -4, -8);
        });

        it('should pass floating point radius to body.setCircle', function ()
        {
            gameObject.setCircle(7.5, 0, 0);

            expect(mockBody.setCircle).toHaveBeenCalledWith(7.5, 0, 0);
        });
    });

    describe('method chaining', function ()
    {
        it('should allow chaining setOffset, setBodySize, and setCircle', function ()
        {
            var result = gameObject.setOffset(5, 5);

            expect(result).toBe(gameObject);

            result = gameObject.setBodySize(32, 32, true);

            expect(result).toBe(gameObject);

            result = gameObject.setCircle(16, 0, 0);

            expect(result).toBe(gameObject);
        });
    });
});
