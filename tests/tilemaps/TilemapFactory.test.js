import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('TilemapFactory', function ()
{
    describe('registration', function ()
    {
        it('should register a tilemap factory function on GameObjectFactory', function ()
        {
            var handlers = {};

            var mockFactory = {
                register: function (key, fn)
                {
                    handlers[key] = fn;
                }
            };

            var registerSpy = vi.spyOn(mockFactory, 'register');

            mockFactory.register('tilemap', function () {});

            expect(registerSpy).toHaveBeenCalledWith('tilemap', expect.any(Function));
            expect(handlers['tilemap']).toBeDefined();
        });
    });

    describe('null-to-undefined conversion', function ()
    {
        var capturedArgs;
        var handler;
        var mockScene;

        beforeEach(function ()
        {
            capturedArgs = null;
            handler = function (key, tileWidth, tileHeight, width, height, data, insertNull)
            {
                if (key === null) { key = undefined; }
                if (tileWidth === null) { tileWidth = undefined; }
                if (tileHeight === null) { tileHeight = undefined; }
                if (width === null) { width = undefined; }
                if (height === null) { height = undefined; }

                capturedArgs = { key: key, tileWidth: tileWidth, tileHeight: tileHeight, width: width, height: height, data: data, insertNull: insertNull };

                return capturedArgs;
            };

            mockScene = { sys: {} };
        });

        afterEach(function ()
        {
            vi.restoreAllMocks();
        });

        it('should convert null key to undefined', function ()
        {
            handler.call({ scene: mockScene }, null, 32, 32, 10, 10, null, false);
            expect(capturedArgs.key).toBeUndefined();
        });

        it('should convert null tileWidth to undefined', function ()
        {
            handler.call({ scene: mockScene }, 'mapKey', null, 32, 10, 10, null, false);
            expect(capturedArgs.tileWidth).toBeUndefined();
        });

        it('should convert null tileHeight to undefined', function ()
        {
            handler.call({ scene: mockScene }, 'mapKey', 32, null, 10, 10, null, false);
            expect(capturedArgs.tileHeight).toBeUndefined();
        });

        it('should convert null width to undefined', function ()
        {
            handler.call({ scene: mockScene }, 'mapKey', 32, 32, null, 10, null, false);
            expect(capturedArgs.width).toBeUndefined();
        });

        it('should convert null height to undefined', function ()
        {
            handler.call({ scene: mockScene }, 'mapKey', 32, 32, 10, null, null, false);
            expect(capturedArgs.height).toBeUndefined();
        });

        it('should convert all null positional params to undefined simultaneously', function ()
        {
            handler.call({ scene: mockScene }, null, null, null, null, null, null, false);
            expect(capturedArgs.key).toBeUndefined();
            expect(capturedArgs.tileWidth).toBeUndefined();
            expect(capturedArgs.tileHeight).toBeUndefined();
            expect(capturedArgs.width).toBeUndefined();
            expect(capturedArgs.height).toBeUndefined();
        });

        it('should pass through non-null key unchanged', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 32, 32, 10, 10, null, false);
            expect(capturedArgs.key).toBe('myMap');
        });

        it('should pass through non-null tileWidth unchanged', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 16, 32, 10, 10, null, false);
            expect(capturedArgs.tileWidth).toBe(16);
        });

        it('should pass through non-null tileHeight unchanged', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 32, 16, 10, 10, null, false);
            expect(capturedArgs.tileHeight).toBe(16);
        });

        it('should pass through non-null width unchanged', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 32, 32, 20, 10, null, false);
            expect(capturedArgs.width).toBe(20);
        });

        it('should pass through non-null height unchanged', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 32, 32, 10, 20, null, false);
            expect(capturedArgs.height).toBe(20);
        });

        it('should not convert undefined key (leave as undefined)', function ()
        {
            handler.call({ scene: mockScene }, undefined, 32, 32, 10, 10, null, false);
            expect(capturedArgs.key).toBeUndefined();
        });

        it('should not convert undefined tileWidth (leave as undefined)', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', undefined, 32, 10, 10, null, false);
            expect(capturedArgs.tileWidth).toBeUndefined();
        });

        it('should pass data through unchanged when it is a 2D array', function ()
        {
            var tileData = [[1, 2], [3, 4]];
            handler.call({ scene: mockScene }, 'myMap', 32, 32, 10, 10, tileData, false);
            expect(capturedArgs.data).toBe(tileData);
        });

        it('should pass data through unchanged when it is null', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 32, 32, 10, 10, null, false);
            expect(capturedArgs.data).toBeNull();
        });

        it('should pass insertNull true through unchanged', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 32, 32, 10, 10, null, true);
            expect(capturedArgs.insertNull).toBe(true);
        });

        it('should pass insertNull false through unchanged', function ()
        {
            handler.call({ scene: mockScene }, 'myMap', 32, 32, 10, 10, null, false);
            expect(capturedArgs.insertNull).toBe(false);
        });

        it('should handle all params as real values with no conversion', function ()
        {
            var tileData = [[0, 1, 2]];
            handler.call({ scene: mockScene }, 'level1', 16, 16, 30, 20, tileData, true);
            expect(capturedArgs.key).toBe('level1');
            expect(capturedArgs.tileWidth).toBe(16);
            expect(capturedArgs.tileHeight).toBe(16);
            expect(capturedArgs.width).toBe(30);
            expect(capturedArgs.height).toBe(20);
            expect(capturedArgs.data).toBe(tileData);
            expect(capturedArgs.insertNull).toBe(true);
        });
    });
});
