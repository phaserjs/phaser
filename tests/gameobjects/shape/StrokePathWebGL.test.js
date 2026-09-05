var StrokePathWebGL = require('../../../src/gameobjects/shape/StrokePathWebGL');

describe('StrokePathWebGL', function ()
{
    var src;
    var strokePath;

    beforeEach(function ()
    {
        strokePath = { run: vi.fn() };

        src = {
            pathData: [ 3, 0, 6, 3, 3, 6, 0, 3, 3, 0 ],
            closePath: true,
            lineWidth: 2,
            strokeColor: 0x000000,
            strokeAlpha: 1,
            customRenderNodes: {},
            defaultRenderNodes: { StrokePath: strokePath }
        };
    });

    it('preserves every corner and the closing point of a centered diamond', function ()
    {
        StrokePathWebGL({}, {}, {}, src, 1, 3, 3);

        expect(strokePath.run.mock.calls[0][2]).toEqual([
            { x: 0, y: -3, width: 2 },
            { x: 3, y: 0, width: 2 },
            { x: 0, y: 3, width: 2 },
            { x: -3, y: 0, width: 2 },
            { x: 0, y: -3, width: 2 }
        ]);
    });

    it('removes consecutive duplicate vertices with a non-zero display origin', function ()
    {
        src.pathData = [ 3, 0, 3, 0, 3, 0, 6, 3, 3, 6, 0, 3, 3, 0 ];

        StrokePathWebGL({}, {}, {}, src, 1, 3, 3);

        expect(strokePath.run.mock.calls[0][2]).toEqual([
            { x: 0, y: -3, width: 2 },
            { x: 3, y: 0, width: 2 },
            { x: 0, y: 3, width: 2 },
            { x: -3, y: 0, width: 2 },
            { x: 0, y: -3, width: 2 }
        ]);
    });

    it('still removes consecutive duplicate vertices with a zero display origin', function ()
    {
        src.pathData = [ 3, 0, 3, 0, 3, 0, 6, 3, 3, 6, 0, 3, 3, 0 ];

        StrokePathWebGL({}, {}, {}, src, 1, 0, 0);

        expect(strokePath.run.mock.calls[0][2]).toEqual([
            { x: 3, y: 0, width: 2 },
            { x: 6, y: 3, width: 2 },
            { x: 3, y: 6, width: 2 },
            { x: 0, y: 3, width: 2 },
            { x: 3, y: 0, width: 2 }
        ]);
    });

    it('preserves distinct vertices while omitting the closing point of an open path', function ()
    {
        src.closePath = false;

        StrokePathWebGL({}, {}, {}, src, 1, 3, 3);

        expect(strokePath.run.mock.calls[0][2]).toEqual([
            { x: 0, y: -3, width: 2 },
            { x: 3, y: 0, width: 2 },
            { x: 0, y: 3, width: 2 },
            { x: -3, y: 0, width: 2 }
        ]);
        expect(strokePath.run.mock.calls[0][4]).toBe(true);
    });
});
