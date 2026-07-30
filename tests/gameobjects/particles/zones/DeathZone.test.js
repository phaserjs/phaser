var DeathZone = require('../../../../src/gameobjects/particles/zones/DeathZone');

describe('DeathZone', function ()
{
    var containsTrue = { contains: function () { return true; } };
    var containsFalse = { contains: function () { return false; } };

    describe('Constructor', function ()
    {
        it('should set source and killOnEnter from constructor arguments', function ()
        {
            var zone = new DeathZone(containsTrue, true);
            expect(zone.source).toBe(containsTrue);
            expect(zone.killOnEnter).toBe(true);
        });

        it('should set killOnEnter to false when passed false', function ()
        {
            var zone = new DeathZone(containsFalse, false);
            expect(zone.killOnEnter).toBe(false);
        });

        it('should store the source object reference', function ()
        {
            var source = { contains: function () { return false; } };
            var zone = new DeathZone(source, true);
            expect(zone.source).toBe(source);
        });
    });

    describe('willKill', function ()
    {
        function makeParticle(x, y)
        {
            return { worldPosition: { x: x, y: y } };
        }

        it('should return true when particle is inside zone and killOnEnter is true', function ()
        {
            var zone = new DeathZone(containsTrue, true);
            var particle = makeParticle(10, 10);
            expect(zone.willKill(particle)).toBe(true);
        });

        it('should return false when particle is inside zone and killOnEnter is false', function ()
        {
            var zone = new DeathZone(containsTrue, false);
            var particle = makeParticle(10, 10);
            expect(zone.willKill(particle)).toBe(false);
        });

        it('should return false when particle is outside zone and killOnEnter is true', function ()
        {
            var zone = new DeathZone(containsFalse, true);
            var particle = makeParticle(10, 10);
            expect(zone.willKill(particle)).toBe(false);
        });

        it('should return true when particle is outside zone and killOnEnter is false', function ()
        {
            var zone = new DeathZone(containsFalse, false);
            var particle = makeParticle(10, 10);
            expect(zone.willKill(particle)).toBe(true);
        });

        it('should pass particle worldPosition x and y to source.contains', function ()
        {
            var receivedX, receivedY;
            var source = {
                contains: function (x, y)
                {
                    receivedX = x;
                    receivedY = y;
                    return true;
                }
            };
            var zone = new DeathZone(source, true);
            var particle = makeParticle(42, 99);
            zone.willKill(particle);
            expect(receivedX).toBe(42);
            expect(receivedY).toBe(99);
        });

        it('should work correctly with negative coordinates', function ()
        {
            var source = {
                contains: function (x, y)
                {
                    return x > -50 && y > -50;
                }
            };
            var zone = new DeathZone(source, true);
            expect(zone.willKill(makeParticle(-10, -10))).toBe(true);
            expect(zone.willKill(makeParticle(-100, -100))).toBe(false);
        });

        it('should work correctly with floating point coordinates', function ()
        {
            var source = {
                contains: function (x, y)
                {
                    return x * x + y * y <= 100;
                }
            };
            var zone = new DeathZone(source, true);
            expect(zone.willKill(makeParticle(5.5, 5.5))).toBe(true);
            expect(zone.willKill(makeParticle(9.9, 9.9))).toBe(false);
        });

        it('should return a boolean', function ()
        {
            var zone = new DeathZone(containsTrue, true);
            var result = zone.willKill(makeParticle(0, 0));
            expect(typeof result).toBe('boolean');
        });

        it('should work with zero coordinates', function ()
        {
            var zone = new DeathZone(containsTrue, true);
            expect(zone.willKill(makeParticle(0, 0))).toBe(true);

            var zone2 = new DeathZone(containsFalse, false);
            expect(zone2.willKill(makeParticle(0, 0))).toBe(true);
        });
    });
});
