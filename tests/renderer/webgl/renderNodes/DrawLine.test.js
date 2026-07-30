var DrawLine = require('../../../../src/renderer/webgl/renderNodes/DrawLine');

describe('DrawLine', function ()
{
    var mockManager;
    var node;
    var mockContext;

    beforeEach(function ()
    {
        mockManager = {};
        node = new DrawLine(mockManager);
        mockContext = {};
    });

    describe('constructor', function ()
    {
        it('should set the name to DrawLine', function ()
        {
            expect(node.name).toBe('DrawLine');
        });

        it('should store the manager reference', function ()
        {
            expect(node.manager).toBe(mockManager);
        });

        it('should initialise _run to null', function ()
        {
            expect(node._run).toBeNull();
        });
    });

    describe('run', function ()
    {
        it('should append 8 values to an empty vertices array for a horizontal line', function ()
        {
            var vertices = [];
            // Horizontal line from (0,0) to (10,0), uniform width 2
            node.run(mockContext, null, 0, 0, 10, 0, 2, 2, vertices);
            expect(vertices.length).toBe(8);
        });

        it('should append 8 values to an already-populated vertices array', function ()
        {
            var vertices = [1, 2, 3, 4];
            node.run(mockContext, null, 0, 0, 10, 0, 2, 2, vertices);
            expect(vertices.length).toBe(12);
        });

        it('should compute correct quad vertices for a horizontal rightward line without matrix', function ()
        {
            // ax=0, ay=0, bx=10, by=0, width=2
            // dx=10, dy=0, len=10
            // al0 = 2*(0-0)/10 = 0, al1 = 2*(0-10)/10 = -2
            // bl0 = 2*(0-0)/10 = 0, bl1 = 2*(0-10)/10 = -2
            // lx0=10, ly0=2, lx1=0, ly1=2, lx2=10, ly2=-2, lx3=0, ly3=-2
            // output order: [lx3,ly3, lx1,ly1, lx0,ly0, lx2,ly2]
            var vertices = [];
            node.run(mockContext, null, 0, 0, 10, 0, 2, 2, vertices);
            expect(vertices[0]).toBeCloseTo(0);   // lx3
            expect(vertices[1]).toBeCloseTo(-2);  // ly3
            expect(vertices[2]).toBeCloseTo(0);   // lx1
            expect(vertices[3]).toBeCloseTo(2);   // ly1
            expect(vertices[4]).toBeCloseTo(10);  // lx0
            expect(vertices[5]).toBeCloseTo(2);   // ly0
            expect(vertices[6]).toBeCloseTo(10);  // lx2
            expect(vertices[7]).toBeCloseTo(-2);  // ly2
        });

        it('should compute correct quad vertices for a vertical downward line without matrix', function ()
        {
            // ax=0, ay=0, bx=0, by=10, width=2
            // dx=0, dy=10, len=10
            // al0 = 2*(10-0)/10 = 2, al1 = 2*(0-0)/10 = 0
            // bl0 = 2*(10-0)/10 = 2, bl1 = 2*(0-0)/10 = 0
            // lx0=0-2=-2, ly0=10-0=10, lx1=0-2=-2, ly1=0-0=0
            // lx2=0+2=2, ly2=10+0=10, lx3=0+2=2, ly3=0+0=0
            // output order: [lx3,ly3, lx1,ly1, lx0,ly0, lx2,ly2]
            var vertices = [];
            node.run(mockContext, null, 0, 0, 0, 10, 2, 2, vertices);
            expect(vertices[0]).toBeCloseTo(2);   // lx3
            expect(vertices[1]).toBeCloseTo(0);   // ly3
            expect(vertices[2]).toBeCloseTo(-2);  // lx1
            expect(vertices[3]).toBeCloseTo(0);   // ly1
            expect(vertices[4]).toBeCloseTo(-2);  // lx0
            expect(vertices[5]).toBeCloseTo(10);  // ly0
            expect(vertices[6]).toBeCloseTo(2);   // lx2
            expect(vertices[7]).toBeCloseTo(10);  // ly2
        });

        it('should produce a tapered quad when start and end widths differ', function ()
        {
            // Horizontal line, aLineWidth=4, bLineWidth=2
            // al1 = 4*(0-10)/10 = -4, bl1 = 2*(0-10)/10 = -2
            // al0=0, bl0=0
            // lx0=10, ly0=2, lx1=0, ly1=4, lx2=10, ly2=-2, lx3=0, ly3=-4
            var vertices = [];
            node.run(mockContext, null, 0, 0, 10, 0, 4, 2, vertices);
            expect(vertices[0]).toBeCloseTo(0);   // lx3 (start side TR)
            expect(vertices[1]).toBeCloseTo(-4);  // ly3
            expect(vertices[2]).toBeCloseTo(0);   // lx1 (start side TL)
            expect(vertices[3]).toBeCloseTo(4);   // ly1
            expect(vertices[4]).toBeCloseTo(10);  // lx0 (end side BL)
            expect(vertices[5]).toBeCloseTo(2);   // ly0
            expect(vertices[6]).toBeCloseTo(10);  // lx2 (end side BR)
            expect(vertices[7]).toBeCloseTo(-2);  // ly2
        });

        it('should append at the correct offset when vertices already contains data', function ()
        {
            var vertices = [99, 98];
            node.run(mockContext, null, 0, 0, 10, 0, 2, 2, vertices);
            // First two values unchanged
            expect(vertices[0]).toBe(99);
            expect(vertices[1]).toBe(98);
            // New values start at index 2
            expect(vertices[2]).toBeCloseTo(0);   // lx3
            expect(vertices[3]).toBeCloseTo(-2);  // ly3
        });

        it('should apply currentMatrix getX and getY when matrix is provided', function ()
        {
            var calls = [];
            var mockMatrix = {
                getX: function (x, y)
                {
                    calls.push({ fn: 'getX', x: x, y: y });
                    return x + 100;
                },
                getY: function (x, y)
                {
                    calls.push({ fn: 'getY', x: x, y: y });
                    return y + 200;
                }
            };
            var vertices = [];
            node.run(mockContext, mockMatrix, 0, 0, 10, 0, 2, 2, vertices);

            // 8 matrix calls expected (4 getX + 4 getY)
            expect(calls.length).toBe(8);

            // Returned values are transformed (x+100, y+200)
            expect(vertices[0]).toBeCloseTo(100);  // lx3 + 100
            expect(vertices[1]).toBeCloseTo(198);  // ly3 + 200 = -2 + 200
            expect(vertices[2]).toBeCloseTo(100);  // lx1 + 100
            expect(vertices[3]).toBeCloseTo(202);  // ly1 + 200 = 2 + 200
            expect(vertices[4]).toBeCloseTo(110);  // lx0 + 100
            expect(vertices[5]).toBeCloseTo(202);  // ly0 + 200 = 2 + 200
            expect(vertices[6]).toBeCloseTo(110);  // lx2 + 100
            expect(vertices[7]).toBeCloseTo(198);  // ly2 + 200 = -2 + 200
        });

        it('should call onRunBegin and onRunEnd with the drawing context', function ()
        {
            var beginCalled = false;
            var endCalled = false;
            var capturedCtxBegin;
            var capturedCtxEnd;

            node.onRunBegin = function (ctx)
            {
                beginCalled = true;
                capturedCtxBegin = ctx;
            };
            node.onRunEnd = function (ctx)
            {
                endCalled = true;
                capturedCtxEnd = ctx;
            };

            node.run(mockContext, null, 0, 0, 10, 0, 2, 2, []);

            expect(beginCalled).toBe(true);
            expect(endCalled).toBe(true);
            expect(capturedCtxBegin).toBe(mockContext);
            expect(capturedCtxEnd).toBe(mockContext);
        });

        it('should handle a diagonal line at 45 degrees', function ()
        {
            // ax=0, ay=0, bx=10, by=10, width=2
            // dx=10, dy=10, len=~14.142
            // The perpendicular offset should be equal in x and y
            var vertices = [];
            node.run(mockContext, null, 0, 0, 10, 10, 2, 2, vertices);
            expect(vertices.length).toBe(8);

            // All computed values should be finite numbers
            for (var i = 0; i < 8; i++)
            {
                expect(isFinite(vertices[i])).toBe(true);
            }

            // For a symmetric 45-degree line the perpendicular offset is uniform
            // al0 = 2*(10-0)/14.142 ~= 1.414, al1 = 2*(0-10)/14.142 ~= -1.414
            var sqrt2over2 = Math.sqrt(2) / 2;
            var halfWidth = 2 * sqrt2over2; // ~1.414
            // lx3 = ax + al0 = 0 + 1.414, ly3 = ay + al1 = 0 - 1.414
            expect(vertices[0]).toBeCloseTo(halfWidth);   // lx3
            expect(vertices[1]).toBeCloseTo(-halfWidth);  // ly3
        });

        it('should handle negative direction line (going left)', function ()
        {
            // ax=10, ay=0, bx=0, by=0 — line pointing left
            var vertices = [];
            node.run(mockContext, null, 10, 0, 0, 0, 2, 2, vertices);
            expect(vertices.length).toBe(8);
            for (var i = 0; i < 8; i++)
            {
                expect(isFinite(vertices[i])).toBe(true);
            }
        });

        it('should handle a line with floating point coordinates', function ()
        {
            var vertices = [];
            node.run(mockContext, null, 0.5, 0.25, 10.5, 0.25, 1.5, 1.5, vertices);
            expect(vertices.length).toBe(8);
            for (var i = 0; i < 8; i++)
            {
                expect(isFinite(vertices[i])).toBe(true);
            }
        });

        it('should handle negative coordinates', function ()
        {
            var vertices = [];
            node.run(mockContext, null, -10, -5, -20, -5, 2, 2, vertices);
            expect(vertices.length).toBe(8);
            for (var i = 0; i < 8; i++)
            {
                expect(isFinite(vertices[i])).toBe(true);
            }
        });

        it('should ignore matrix when currentMatrix is null', function ()
        {
            var vertices = [];
            node.run(mockContext, null, 0, 0, 10, 0, 2, 2, vertices);
            // Raw values with no transformation applied
            expect(vertices[0]).toBeCloseTo(0);
            expect(vertices[1]).toBeCloseTo(-2);
        });

        it('should ignore matrix when currentMatrix is undefined', function ()
        {
            var vertices = [];
            node.run(mockContext, undefined, 0, 0, 10, 0, 2, 2, vertices);
            expect(vertices[0]).toBeCloseTo(0);
            expect(vertices[1]).toBeCloseTo(-2);
        });
    });
});
