var StrokePath = require('../../../../src/renderer/webgl/renderNodes/StrokePath');

describe('StrokePath', function ()
{
    var drawLineNode;
    var manager;
    var instance;

    function makeManager ()
    {
        drawLineNode = {
            run: vi.fn(function (drawingContext, currentMatrix, x0, y0, x1, y1, hw0, hw1, vertices)
            {
                // Push 8 floats (4 vertices * 2 components) per call
                vertices.push(x0, y0, x1, y1, x0, y0, x1, y1);
            })
        };

        return {
            getNode: function (name)
            {
                if (name === 'DrawLine')
                {
                    return drawLineNode;
                }
                return null;
            }
        };
    }

    function makeMatrix ()
    {
        return {
            tx: 0,
            ty: 0,
            getX: function (dx, dy) { return dx; },
            getY: function (dx, dy) { return dy; }
        };
    }

    function makeDrawingContext ()
    {
        return {};
    }

    function makeSubmitter ()
    {
        return {
            batch: vi.fn()
        };
    }

    function makePoint (x, y, width)
    {
        return { x: x, y: y, width: width !== undefined ? width : 2 };
    }

    beforeEach(function ()
    {
        manager = makeManager();
        instance = new StrokePath(manager);
    });

    describe('constructor', function ()
    {
        it('should set name to StrokePath', function ()
        {
            expect(instance.name).toBe('StrokePath');
        });

        it('should store the manager reference', function ()
        {
            expect(instance.manager).toBe(manager);
        });

        it('should retrieve the DrawLine node from the manager', function ()
        {
            expect(instance.drawLineNode).toBe(drawLineNode);
        });

        it('should have null _run by default', function ()
        {
            expect(instance._run).toBeNull();
        });
    });

    describe('run', function ()
    {
        it('should call submitterNode.batch once per run', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0) ];

            instance.run(ctx, submitter, path, 4, true, matrix, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0, false);

            expect(submitter.batch).toHaveBeenCalledTimes(1);
        });

        it('should call drawLineNode.run once per path segment', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0) ];

            instance.run(ctx, submitter, path, 4, true, matrix, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0, false);

            // 3 points = 2 segments
            expect(drawLineNode.run).toHaveBeenCalledTimes(2);
        });

        it('should call drawLineNode.run once for a two-point path', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0) ];

            instance.run(ctx, submitter, path, 4, true, matrix, 0, 0, 0, 0, 0, false);

            expect(drawLineNode.run).toHaveBeenCalledTimes(1);
        });

        it('should produce 6 indices per segment for a thin line (lineWidth <= 2)', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            // 3 points = 2 segments, lineWidth = 1
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var indices = callArgs[1];

            // 2 segments × 6 indices each = 12, no connecting quads
            expect(indices.length).toBe(12);
        });

        it('should produce extra connecting indices for thick open path', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            // 3 points = 2 segments, lineWidth = 4 → connect=true
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0) ];

            instance.run(ctx, submitter, path, 4, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var indices = callArgs[1];

            // 2 segments × 6 + 1 connecting quad × 6 = 18
            expect(indices.length).toBe(18);
        });

        it('should produce loop-closing indices for a thick closed path', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            // 3 points = 2 segments, closed (open=false), lineWidth = 4
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0) ];

            instance.run(ctx, submitter, path, 4, false, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var indices = callArgs[1];

            // 2 segments × 6 + 1 connecting quad × 6 + 1 closing quad × 6 = 24
            expect(indices.length).toBe(24);
        });

        it('should not add connecting quads when lineWidth equals 2', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0) ];

            instance.run(ctx, submitter, path, 2, false, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var indices = callArgs[1];

            // lineWidth <= 2 → no connecting quads, 2 × 6 = 12
            expect(indices.length).toBe(12);
        });

        it('should not add loop-closing quad when path has only two points', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            // 2 points = 1 segment only; connectLoop requires pathLength > 1 AND !first on last
            var path = [ makePoint(0, 0), makePoint(10, 0) ];

            instance.run(ctx, submitter, path, 4, false, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var indices = callArgs[1];

            // Only 1 segment, no second segment means no connecting quad; 6 indices
            expect(indices.length).toBe(6);
        });

        it('should assign tint colors to the colors array in correct order', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0xAA, 0xBB, 0xCC, 0xDD, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var colors = callArgs[3];

            // Order: tintTL, tintBL, tintBR, tintTR
            expect(colors[0]).toBe(0xAA);
            expect(colors[1]).toBe(0xCC);
            expect(colors[2]).toBe(0xDD);
            expect(colors[3]).toBe(0xBB);
        });

        it('should produce 4 color entries per segment', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0), makePoint(30, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var colors = callArgs[3];

            // 3 segments × 4 colors = 12
            expect(colors.length).toBe(12);
        });

        it('should pass lighting argument to submitterNode.batch', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, true);

            var callArgs = submitter.batch.mock.calls[0];
            expect(callArgs[4]).toBe(true);
        });

        it('should skip intermediate points when detail causes close points to be culled', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            // Matrix with identity-like transform but non-zero tx/ty offsets do not affect delta
            var matrix = makeMatrix();
            // Large detail value so intermediate points get skipped
            var detail = 100;
            // 4 points = 3 potential segments; the first intermediate is very close to
            // the start and gets skipped, reducing to 2 actual drawLineNode calls.
            // Note: the while-loop guard prevents skipping to the very last point,
            // so a minimum of 4 points is needed to demonstrate LOD culling.
            var path = [
                makePoint(0, 0),
                makePoint(1, 0),    // very close to first → skipped by LOD
                makePoint(2, 0),    // becomes the end of the merged first segment
                makePoint(200, 0)   // final point
            ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, detail, false);

            // LOD skipping merges the first two segments into one,
            // reducing 3 potential segments to 2 drawLineNode calls
            expect(drawLineNode.run).toHaveBeenCalledTimes(2);
        });

        it('should not skip points when detail is 0', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [
                makePoint(0, 0),
                makePoint(1, 0),
                makePoint(2, 0)
            ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            // detail = 0 disables LOD, all points rendered: 2 segments
            expect(drawLineNode.run).toHaveBeenCalledTimes(2);
        });

        it('should call drawLineNode.run with correct point coordinates', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(5, 10, 4), makePoint(15, 20, 6) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = drawLineNode.run.mock.calls[0];
            // args: drawingContext, currentMatrix, x0, y0, x1, y1, hw0, hw1, vertices
            expect(callArgs[2]).toBe(5);
            expect(callArgs[3]).toBe(10);
            expect(callArgs[4]).toBe(15);
            expect(callArgs[5]).toBe(20);
            expect(callArgs[6]).toBe(2); // point.width / 2
            expect(callArgs[7]).toBe(3); // nextPoint.width / 2
        });

        it('should produce vertices array with 8 entries per segment (from drawLineNode mock)', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0), makePoint(20, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var vertices = callArgs[2];

            // 2 segments × 8 floats = 16
            expect(vertices.length).toBe(16);
        });

        it('should pass drawingContext to submitterNode.batch as first argument', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            expect(callArgs[0]).toBe(ctx);
        });

        it('should use first triangle winding: TL, BL, BR', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var indices = callArgs[1];

            // vertexCount = 4 after first segment
            // TL=0, BL=1, BR=2, TR=3
            expect(indices[0]).toBe(0); // TL
            expect(indices[1]).toBe(1); // BL
            expect(indices[2]).toBe(2); // BR
        });

        it('should use second triangle winding: BR, TR, TL', function ()
        {
            var ctx = makeDrawingContext();
            var submitter = makeSubmitter();
            var matrix = makeMatrix();
            var path = [ makePoint(0, 0), makePoint(10, 0) ];

            instance.run(ctx, submitter, path, 1, true, matrix, 0, 0, 0, 0, 0, false);

            var callArgs = submitter.batch.mock.calls[0];
            var indices = callArgs[1];

            expect(indices[3]).toBe(2); // BR
            expect(indices[4]).toBe(3); // TR
            expect(indices[5]).toBe(0); // TL
        });
    });
});
