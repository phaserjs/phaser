var ParseWangsets = require('../../../../src/tilemaps/parsers/tiled/ParseWangsets');

describe('Phaser.Tilemaps.Parsers.Tiled.ParseWangsets', function ()
{
    it('should do nothing when wangsets array is empty', function ()
    {
        var datas = {};
        ParseWangsets([], datas);
        expect(Object.keys(datas).length).toBe(0);
    });

    it('should skip wangset with no wangtiles array', function ()
    {
        var wangsets = [{ name: 'test' }];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(Object.keys(datas).length).toBe(0);
    });

    it('should skip wangset with empty wangtiles array', function ()
    {
        var wangsets = [{ name: 'test', wangtiles: [] }];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(Object.keys(datas).length).toBe(0);
    });

    it('should use wangset index as identifier when name is absent', function ()
    {
        var wangsets = [
            {
                wangtiles: [{ tileid: 0, wangid: [1, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(datas[0].wangid[0]).toBeDefined();
    });

    it('should use wangset index as identifier when name is empty string', function ()
    {
        var wangsets = [
            {
                name: '',
                wangtiles: [{ tileid: 5, wangid: [1, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(datas[5].wangid[0]).toBeDefined();
    });

    it('should use wangset name as identifier when name is set', function ()
    {
        var wangsets = [
            {
                name: 'myWangset',
                wangtiles: [{ tileid: 3, wangid: [1, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(datas[3].wangid['myWangset']).toBeDefined();
    });

    it('should push undefined for wangid entries of 0', function ()
    {
        var wangsets = [
            {
                name: 'test',
                wangtiles: [{ tileid: 1, wangid: [0, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[1].wangid['test'];
        expect(wangid.length).toBe(8);
        for (var i = 0; i < wangid.length; i++)
        {
            expect(wangid[i]).toBeUndefined();
        }
    });

    it('should push the raw color index when no color name is defined', function ()
    {
        var wangsets = [
            {
                name: 'raw',
                wangtiles: [{ tileid: 2, wangid: [2, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(datas[2].wangid['raw'][0]).toBe(2);
    });

    it('should resolve edge colors from edgecolors array (pre-2020 format)', function ()
    {
        var wangsets = [
            {
                name: 'edges',
                edgecolors: [{ name: 'red' }, { name: 'blue' }],
                wangtiles: [{ tileid: 0, wangid: [1, 0, 2, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['edges'];
        expect(wangid[0]).toBe('red');
        expect(wangid[1]).toBeUndefined();
        expect(wangid[2]).toBe('blue');
    });

    it('should resolve corner colors from cornercolors array (pre-2020 format)', function ()
    {
        var wangsets = [
            {
                name: 'corners',
                cornercolors: [{ name: 'green' }, { name: 'yellow' }],
                wangtiles: [{ tileid: 0, wangid: [0, 1, 0, 2, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['corners'];
        expect(wangid[0]).toBeUndefined();
        expect(wangid[1]).toBe('green');
        expect(wangid[3]).toBe('yellow');
    });

    it('should resolve colors from colors array (post-2020 format) for both edge and corner slots', function ()
    {
        var wangsets = [
            {
                name: 'unified',
                colors: [{ name: 'purple' }, { name: 'orange' }],
                wangtiles: [{ tileid: 0, wangid: [1, 1, 2, 2, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['unified'];
        // positions 0,2 are edge slots; positions 1,3 are corner slots
        expect(wangid[0]).toBe('purple');
        expect(wangid[1]).toBe('purple');
        expect(wangid[2]).toBe('orange');
        expect(wangid[3]).toBe('orange');
    });

    it('should skip edgecolors entries with empty name', function ()
    {
        var wangsets = [
            {
                name: 'test',
                edgecolors: [{ name: '' }, { name: 'blue' }],
                wangtiles: [{ tileid: 0, wangid: [1, 0, 2, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['test'];
        // colorIndex 1 has empty name, so raw value 1 is used
        expect(wangid[0]).toBe(1);
        // colorIndex 2 is 'blue'
        expect(wangid[2]).toBe('blue');
    });

    it('should skip cornercolors entries with empty name', function ()
    {
        var wangsets = [
            {
                name: 'test',
                cornercolors: [{ name: '' }, { name: 'teal' }],
                wangtiles: [{ tileid: 0, wangid: [0, 1, 0, 2, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['test'];
        expect(wangid[1]).toBe(1);
        expect(wangid[3]).toBe('teal');
    });

    it('should skip colors entries with empty name', function ()
    {
        var wangsets = [
            {
                name: 'test',
                colors: [{ name: '' }, { name: 'cyan' }],
                wangtiles: [{ tileid: 0, wangid: [1, 1, 2, 2, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['test'];
        expect(wangid[0]).toBe(1);
        expect(wangid[1]).toBe(1);
        expect(wangid[2]).toBe('cyan');
        expect(wangid[3]).toBe('cyan');
    });

    it('should populate datas for multiple wangtiles in a single wangset', function ()
    {
        var wangsets = [
            {
                name: 'multi',
                wangtiles: [
                    { tileid: 10, wangid: [1, 0, 0, 0, 0, 0, 0, 0] },
                    { tileid: 11, wangid: [2, 0, 0, 0, 0, 0, 0, 0] },
                    { tileid: 12, wangid: [0, 0, 0, 0, 0, 0, 0, 0] }
                ]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(datas[10]).toBeDefined();
        expect(datas[11]).toBeDefined();
        expect(datas[12]).toBeDefined();
    });

    it('should merge wangid data from multiple wangsets onto the same tile', function ()
    {
        var wangsets = [
            {
                name: 'setA',
                wangtiles: [{ tileid: 7, wangid: [1, 0, 0, 0, 0, 0, 0, 0] }]
            },
            {
                name: 'setB',
                wangtiles: [{ tileid: 7, wangid: [0, 1, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(datas[7].wangid['setA']).toBeDefined();
        expect(datas[7].wangid['setB']).toBeDefined();
    });

    it('should not overwrite existing datas entries for a tile', function ()
    {
        var wangsets = [
            {
                name: 'ws',
                wangtiles: [{ tileid: 4, wangid: [1, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = { 4: { someOtherProp: true } };
        ParseWangsets(wangsets, datas);
        expect(datas[4].someOtherProp).toBe(true);
        expect(datas[4].wangid).toBeDefined();
    });

    it('should handle wangid shorter than 8 entries', function ()
    {
        var wangsets = [
            {
                name: 'short',
                wangtiles: [{ tileid: 0, wangid: [1, 2] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['short'];
        expect(wangid.length).toBe(2);
        expect(wangid[0]).toBe(1);
        expect(wangid[1]).toBe(2);
    });

    it('should use numeric index as identifier for multiple unnamed wangsets', function ()
    {
        var wangsets = [
            {
                wangtiles: [{ tileid: 0, wangid: [1, 0, 0, 0, 0, 0, 0, 0] }]
            },
            {
                wangtiles: [{ tileid: 0, wangid: [2, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(datas[0].wangid[0]).toBeDefined();
        expect(datas[0].wangid[1]).toBeDefined();
        expect(datas[0].wangid[0][0]).toBe(1);
        expect(datas[0].wangid[1][0]).toBe(2);
    });

    it('should follow idLayout: even positions are edge, odd positions are corner', function ()
    {
        var wangsets = [
            {
                name: 'layout',
                edgecolors: [{ name: 'E1' }],
                cornercolors: [{ name: 'C1' }],
                wangtiles: [{ tileid: 0, wangid: [1, 1, 1, 1, 1, 1, 1, 1] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        var wangid = datas[0].wangid['layout'];
        // positions 0,2,4,6 are edge slots → 'E1'
        expect(wangid[0]).toBe('E1');
        expect(wangid[2]).toBe('E1');
        expect(wangid[4]).toBe('E1');
        expect(wangid[6]).toBe('E1');
        // positions 1,3,5,7 are corner slots → 'C1'
        expect(wangid[1]).toBe('C1');
        expect(wangid[3]).toBe('C1');
        expect(wangid[5]).toBe('C1');
        expect(wangid[7]).toBe('C1');
    });

    it('should create the wangid object on the tile entry if not present', function ()
    {
        var wangsets = [
            {
                name: 'newEntry',
                wangtiles: [{ tileid: 99, wangid: [0, 0, 0, 0, 0, 0, 0, 0] }]
            }
        ];
        var datas = {};
        ParseWangsets(wangsets, datas);
        expect(typeof datas[99]).toBe('object');
        expect(typeof datas[99].wangid).toBe('object');
    });
});
