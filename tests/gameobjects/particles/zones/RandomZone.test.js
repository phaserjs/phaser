var RandomZone = require('../../../../src/gameobjects/particles/zones/RandomZone');

describe('RandomZone', function ()
{
    var mockSource;

    beforeEach(function ()
    {
        mockSource = {
            getRandomPoint: function (point)
            {
                point.x = 10;
                point.y = 20;
                return point;
            }
        };
    });

    describe('constructor', function ()
    {
        it('should store the source object', function ()
        {
            var zone = new RandomZone(mockSource);
            expect(zone.source).toBe(mockSource);
        });

        it('should initialize total to -1', function ()
        {
            var zone = new RandomZone(mockSource);
            expect(zone.total).toBe(-1);
        });

        it('should create an internal _tempVec Vector2', function ()
        {
            var zone = new RandomZone(mockSource);
            expect(zone._tempVec).toBeDefined();
            expect(typeof zone._tempVec.x).toBe('number');
            expect(typeof zone._tempVec.y).toBe('number');
        });

        it('should initialize _tempVec to zero', function ()
        {
            var zone = new RandomZone(mockSource);
            expect(zone._tempVec.x).toBe(0);
            expect(zone._tempVec.y).toBe(0);
        });
    });

    describe('getPoint', function ()
    {
        it('should set particle x and y from the source getRandomPoint result', function ()
        {
            var zone = new RandomZone(mockSource);
            var particle = { x: 0, y: 0 };

            zone.getPoint(particle);

            expect(particle.x).toBe(10);
            expect(particle.y).toBe(20);
        });

        it('should call source.getRandomPoint once per call', function ()
        {
            var callCount = 0;
            var source = {
                getRandomPoint: function (point)
                {
                    callCount++;
                    point.x = 5;
                    point.y = 5;
                    return point;
                }
            };
            var zone = new RandomZone(source);
            var particle = { x: 0, y: 0 };

            zone.getPoint(particle);
            expect(callCount).toBe(1);

            zone.getPoint(particle);
            expect(callCount).toBe(2);
        });

        it('should pass the internal _tempVec to source.getRandomPoint', function ()
        {
            var receivedPoint = null;
            var source = {
                getRandomPoint: function (point)
                {
                    receivedPoint = point;
                    point.x = 0;
                    point.y = 0;
                    return point;
                }
            };
            var zone = new RandomZone(source);
            var particle = { x: 0, y: 0 };

            zone.getPoint(particle);

            expect(receivedPoint).toBe(zone._tempVec);
        });

        it('should handle negative coordinates from source', function ()
        {
            var source = {
                getRandomPoint: function (point)
                {
                    point.x = -50;
                    point.y = -100;
                    return point;
                }
            };
            var zone = new RandomZone(source);
            var particle = { x: 0, y: 0 };

            zone.getPoint(particle);

            expect(particle.x).toBe(-50);
            expect(particle.y).toBe(-100);
        });

        it('should handle floating point coordinates from source', function ()
        {
            var source = {
                getRandomPoint: function (point)
                {
                    point.x = 3.14159;
                    point.y = 2.71828;
                    return point;
                }
            };
            var zone = new RandomZone(source);
            var particle = { x: 0, y: 0 };

            zone.getPoint(particle);

            expect(particle.x).toBeCloseTo(3.14159);
            expect(particle.y).toBeCloseTo(2.71828);
        });

        it('should handle zero coordinates from source', function ()
        {
            var source = {
                getRandomPoint: function (point)
                {
                    point.x = 0;
                    point.y = 0;
                    return point;
                }
            };
            var zone = new RandomZone(source);
            var particle = { x: 99, y: 99 };

            zone.getPoint(particle);

            expect(particle.x).toBe(0);
            expect(particle.y).toBe(0);
        });

        it('should overwrite existing particle coordinates', function ()
        {
            var zone = new RandomZone(mockSource);
            var particle = { x: 500, y: 500 };

            zone.getPoint(particle);

            expect(particle.x).toBe(10);
            expect(particle.y).toBe(20);
        });

        it('should reflect updated source output on subsequent calls', function ()
        {
            var counter = 0;
            var source = {
                getRandomPoint: function (point)
                {
                    counter++;
                    point.x = counter * 10;
                    point.y = counter * 20;
                    return point;
                }
            };
            var zone = new RandomZone(source);
            var particle = { x: 0, y: 0 };

            zone.getPoint(particle);
            expect(particle.x).toBe(10);
            expect(particle.y).toBe(20);

            zone.getPoint(particle);
            expect(particle.x).toBe(20);
            expect(particle.y).toBe(40);
        });

        it('should distribute points within bounds over many iterations', function ()
        {
            var source = {
                getRandomPoint: function (point)
                {
                    point.x = Math.random() * 100;
                    point.y = Math.random() * 200;
                    return point;
                }
            };
            var zone = new RandomZone(source);
            var particle = { x: 0, y: 0 };

            for (var i = 0; i < 100; i++)
            {
                zone.getPoint(particle);
                expect(particle.x).toBeGreaterThanOrEqual(0);
                expect(particle.x).toBeLessThan(100);
                expect(particle.y).toBeGreaterThanOrEqual(0);
                expect(particle.y).toBeLessThan(200);
            }
        });
    });
});
