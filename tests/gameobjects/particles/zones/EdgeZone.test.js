var EdgeZone = require('../../../../src/gameobjects/particles/zones/EdgeZone');

function makeSource (points)
{
    return {
        getPoints: function (quantity, stepRate)
        {
            return points.map(function (p)
            {
                return { x: p.x, y: p.y };
            });
        }
    };
}

function makeParticle ()
{
    return { x: 0, y: 0 };
}

describe('EdgeZone', function ()
{
    describe('constructor', function ()
    {
        it('should set source, quantity, and stepRate from arguments', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 5, 2);

            expect(zone.source).toBe(source);
            expect(zone.quantity).toBe(5);
            expect(zone.stepRate).toBe(2);
        });

        it('should default yoyo to false', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 2);

            expect(zone.yoyo).toBe(false);
        });

        it('should default seamless to true', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 2);

            expect(zone.seamless).toBe(true);
        });

        it('should default total to -1', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 2);

            expect(zone.total).toBe(-1);
        });

        it('should accept explicit yoyo, seamless, and total values', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 2, 1, true, false, 5);

            expect(zone.yoyo).toBe(true);
            expect(zone.seamless).toBe(false);
            expect(zone.total).toBe(5);
        });

        it('should initialise counter to -1', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 2);

            expect(zone.counter).toBe(-1);
        });

        it('should populate points by calling updateSource', function ()
        {
            var pts = [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 10, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3);

            expect(zone.points.length).toBeGreaterThan(0);
        });

        it('should remove duplicate endpoint when seamless is true', function ()
        {
            var pts = [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, false, true);

            expect(zone.points.length).toBe(2);
        });

        it('should not remove endpoint when seamless is false', function ()
        {
            var pts = [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, false, false);

            expect(zone.points.length).toBe(3);
        });

        it('should not remove endpoint when endpoints differ', function ()
        {
            var pts = [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 10, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, false, true);

            expect(zone.points.length).toBe(3);
        });
    });

    describe('updateSource', function ()
    {
        it('should return this for chaining', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 2);

            expect(zone.updateSource()).toBe(zone);
        });

        it('should refresh points from the source', function ()
        {
            var pts = [{ x: 0, y: 0 }, { x: 5, y: 0 }];
            var source = {
                callCount: 0,
                getPoints: function ()
                {
                    this.callCount++;
                    return pts.map(function (p) { return { x: p.x, y: p.y }; });
                }
            };
            var zone = new EdgeZone(source, 2);
            var callsBefore = source.callCount;

            zone.updateSource();

            expect(source.callCount).toBe(callsBefore + 1);
        });

        it('should update _length to match point count', function ()
        {
            var source = makeSource([{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 10, y: 0 }]);
            var zone = new EdgeZone(source, 3);

            expect(zone._length).toBe(zone.points.length);
        });

        it('should clamp counter when point count decreases', function ()
        {
            var pts = [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 10, y: 0 }, { x: 15, y: 0 }];
            var source = {
                pts: pts,
                getPoints: function ()
                {
                    return this.pts.map(function (p) { return { x: p.x, y: p.y }; });
                }
            };
            var zone = new EdgeZone(source, 4, undefined, false, false);

            // Advance counter to index 3
            zone.counter = 3;

            // Now reduce the point list
            source.pts = [{ x: 0, y: 0 }, { x: 5, y: 0 }];
            zone.updateSource();

            expect(zone.counter).toBeLessThanOrEqual(zone._length - 1);
        });

        it('should remove seamless duplicate after source refresh', function ()
        {
            var source = {
                pts: [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 0 }],
                getPoints: function ()
                {
                    return this.pts.map(function (p) { return { x: p.x, y: p.y }; });
                }
            };
            var zone = new EdgeZone(source, 3, undefined, false, true);

            expect(zone.points.length).toBe(2);
        });
    });

    describe('changeSource', function ()
    {
        it('should replace the source', function ()
        {
            var source1 = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var source2 = makeSource([{ x: 1, y: 1 }, { x: 2, y: 2 }]);
            var zone = new EdgeZone(source1, 2);

            zone.changeSource(source2);

            expect(zone.source).toBe(source2);
        });

        it('should return this for chaining', function ()
        {
            var source1 = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var source2 = makeSource([{ x: 1, y: 1 }, { x: 2, y: 2 }]);
            var zone = new EdgeZone(source1, 2);

            expect(zone.changeSource(source2)).toBe(zone);
        });

        it('should update points from the new source', function ()
        {
            var source1 = makeSource([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
            var source2 = makeSource([{ x: 99, y: 88 }, { x: 77, y: 66 }]);
            var zone = new EdgeZone(source1, 2);

            zone.changeSource(source2);

            expect(zone.points[0].x).toBe(99);
            expect(zone.points[0].y).toBe(88);
        });
    });

    describe('getPoint', function ()
    {
        it('should set particle x and y to the first point on first call', function ()
        {
            var pts = [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, false, false);
            var particle = makeParticle();

            zone.getPoint(particle);

            expect(particle.x).toBe(10);
            expect(particle.y).toBe(20);
        });

        it('should advance to the next point on each call', function ()
        {
            var pts = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, false, false);
            var particle = makeParticle();

            zone.getPoint(particle);
            expect(particle.x).toBe(1);

            zone.getPoint(particle);
            expect(particle.x).toBe(2);

            zone.getPoint(particle);
            expect(particle.x).toBe(3);
        });

        it('should wrap counter back to 0 when yoyo is false', function ()
        {
            var pts = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, false, false);
            var particle = makeParticle();

            zone.getPoint(particle); // index 0
            zone.getPoint(particle); // index 1
            zone.getPoint(particle); // index 2
            zone.getPoint(particle); // wraps to 0

            expect(particle.x).toBe(1);
            expect(particle.y).toBe(1);
        });

        it('should reverse direction at end when yoyo is true', function ()
        {
            // When counter reaches _length in forward direction, direction flips
            // and counter is reset to _length-1 (repeating the last point once).
            var pts = [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, true, false);
            var particle = makeParticle();

            zone.getPoint(particle); // forward: index 0 → x=1
            zone.getPoint(particle); // forward: index 1 → x=2
            zone.getPoint(particle); // forward: index 2 → x=3
            // counter++ → 3 >= 3: direction flips to 1, counter = 2 → reads x=3
            zone.getPoint(particle);
            expect(particle.x).toBe(3);

            // Now going backward: counter-- → 1 → x=2
            zone.getPoint(particle);
            expect(particle.x).toBe(2);
        });

        it('should reverse direction at start when yoyo is true', function ()
        {
            // When counter reaches -1 in reverse direction, direction flips
            // and counter is reset to 0 (repeating the first point once).
            var pts = [{ x: 10, y: 0 }, { x: 20, y: 0 }, { x: 30, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, true, false);
            var particle = makeParticle();

            zone.getPoint(particle); // 0 → x=10
            zone.getPoint(particle); // 1 → x=20
            zone.getPoint(particle); // 2 → x=30
            zone.getPoint(particle); // flip: dir=1, counter=2 → x=30
            zone.getPoint(particle); // dir=1: counter-- → 1 → x=20
            zone.getPoint(particle); // dir=1: counter-- → 0 → x=10
            // counter-- → -1: flip dir=0, counter=0 → reads x=10
            zone.getPoint(particle);
            expect(particle.x).toBe(10);

            // Now going forward again: counter++ → 1 → x=20
            zone.getPoint(particle);
            expect(particle.x).toBe(20);
        });

        it('should cycle all points correctly without yoyo over multiple loops', function ()
        {
            var pts = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 3, undefined, false, false);
            var particle = makeParticle();
            var xs = [];

            for (var i = 0; i < 9; i++)
            {
                zone.getPoint(particle);
                xs.push(particle.x);
            }

            expect(xs).toEqual([0, 1, 2, 0, 1, 2, 0, 1, 2]);
        });

        it('should handle a single-point source', function ()
        {
            var source = makeSource([{ x: 7, y: 13 }]);
            var zone = new EdgeZone(source, 1, undefined, false, false);
            var particle = makeParticle();

            zone.getPoint(particle);
            expect(particle.x).toBe(7);
            expect(particle.y).toBe(13);

            zone.getPoint(particle);
            expect(particle.x).toBe(7);
            expect(particle.y).toBe(13);
        });

        it('should not mutate particle when points array is empty', function ()
        {
            var source = { getPoints: function () { return []; } };
            var zone = new EdgeZone(source, 0, undefined, false, false);
            var particle = { x: 42, y: 99 };

            zone.getPoint(particle);

            expect(particle.x).toBe(42);
            expect(particle.y).toBe(99);
        });

        it('should produce a yoyo sequence over a full back-and-forth cycle', function ()
        {
            // With 4 points and yoyo=true, when forward traversal reaches the last
            // point the direction flips but counter stays at _length-1, so that
            // last point is emitted again before moving backward.
            var pts = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }];
            var source = makeSource(pts);
            var zone = new EdgeZone(source, 4, undefined, true, false);
            var particle = makeParticle();
            var xs = [];

            for (var i = 0; i < 6; i++)
            {
                zone.getPoint(particle);
                xs.push(particle.x);
            }

            // 0, 1, 2, 3 (forward), then flip: 3 (repeated), 2 (backward)
            expect(xs).toEqual([0, 1, 2, 3, 3, 2]);
        });
    });
});
