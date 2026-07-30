var PathFollower = require('../../../src/gameobjects/pathfollower/PathFollower');

describe('PathFollower', function ()
{
    it('should be importable', function ()
    {
        expect(PathFollower).toBeDefined();
    });

    it('should expose a preUpdate method on its prototype', function ()
    {
        expect(typeof PathFollower.prototype.preUpdate).toBe('function');
    });

    describe('preUpdate', function ()
    {
        it('should call anims.update with time and delta', function ()
        {
            var animsUpdateSpy = vi.fn();
            var pathUpdateSpy = vi.fn();

            var mockContext = {
                anims: {
                    update: animsUpdateSpy
                },
                pathUpdate: pathUpdateSpy
            };

            PathFollower.prototype.preUpdate.call(mockContext, 1000, 16);

            expect(animsUpdateSpy).toHaveBeenCalledOnce();
            expect(animsUpdateSpy).toHaveBeenCalledWith(1000, 16);
        });

        it('should call pathUpdate with time', function ()
        {
            var animsUpdateSpy = vi.fn();
            var pathUpdateSpy = vi.fn();

            var mockContext = {
                anims: {
                    update: animsUpdateSpy
                },
                pathUpdate: pathUpdateSpy
            };

            PathFollower.prototype.preUpdate.call(mockContext, 1000, 16);

            expect(pathUpdateSpy).toHaveBeenCalledOnce();
            expect(pathUpdateSpy).toHaveBeenCalledWith(1000);
        });

        it('should call anims.update before pathUpdate', function ()
        {
            var callOrder = [];

            var mockContext = {
                anims: {
                    update: function () { callOrder.push('anims'); }
                },
                pathUpdate: function () { callOrder.push('pathUpdate'); }
            };

            PathFollower.prototype.preUpdate.call(mockContext, 500, 8);

            expect(callOrder[0]).toBe('anims');
            expect(callOrder[1]).toBe('pathUpdate');
        });

        it('should pass delta only to anims.update, not to pathUpdate', function ()
        {
            var animsArgs = null;
            var pathUpdateArgs = null;

            var mockContext = {
                anims: {
                    update: function (time, delta)
                    {
                        animsArgs = { time: time, delta: delta };
                    }
                },
                pathUpdate: function (time)
                {
                    pathUpdateArgs = { time: time };
                }
            };

            PathFollower.prototype.preUpdate.call(mockContext, 2000, 32);

            expect(animsArgs.time).toBe(2000);
            expect(animsArgs.delta).toBe(32);
            expect(pathUpdateArgs.time).toBe(2000);
        });

        it('should work with zero time and delta values', function ()
        {
            var animsUpdateSpy = vi.fn();
            var pathUpdateSpy = vi.fn();

            var mockContext = {
                anims: {
                    update: animsUpdateSpy
                },
                pathUpdate: pathUpdateSpy
            };

            PathFollower.prototype.preUpdate.call(mockContext, 0, 0);

            expect(animsUpdateSpy).toHaveBeenCalledWith(0, 0);
            expect(pathUpdateSpy).toHaveBeenCalledWith(0);
        });

        it('should work with large time and delta values', function ()
        {
            var animsUpdateSpy = vi.fn();
            var pathUpdateSpy = vi.fn();

            var mockContext = {
                anims: {
                    update: animsUpdateSpy
                },
                pathUpdate: pathUpdateSpy
            };

            PathFollower.prototype.preUpdate.call(mockContext, 9999999, 1000);

            expect(animsUpdateSpy).toHaveBeenCalledWith(9999999, 1000);
            expect(pathUpdateSpy).toHaveBeenCalledWith(9999999);
        });

        it('should work with floating point time and delta values', function ()
        {
            var animsUpdateSpy = vi.fn();
            var pathUpdateSpy = vi.fn();

            var mockContext = {
                anims: {
                    update: animsUpdateSpy
                },
                pathUpdate: pathUpdateSpy
            };

            PathFollower.prototype.preUpdate.call(mockContext, 1234.567, 16.667);

            expect(animsUpdateSpy).toHaveBeenCalledWith(1234.567, 16.667);
            expect(pathUpdateSpy).toHaveBeenCalledWith(1234.567);
        });
    });
});
