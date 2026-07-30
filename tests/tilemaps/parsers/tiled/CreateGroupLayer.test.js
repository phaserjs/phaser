var CreateGroupLayer = require('../../../../src/tilemaps/parsers/tiled/CreateGroupLayer');

describe('Phaser.Tilemaps.Parsers.Tiled.CreateGroupLayer', function ()
{
    var json;

    beforeEach(function ()
    {
        json = {
            tilewidth: 32,
            tileheight: 32,
            layers: [ { name: 'layer1' }, { name: 'layer2' } ]
        };
    });

    describe('default state (no group provided)', function ()
    {
        it('should return a default state object when no group is given', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result).toBeDefined();
        });

        it('should set i to 0', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result.i).toBe(0);
        });

        it('should set layers to json.layers', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result.layers).toBe(json.layers);
        });

        it('should set name to empty string', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result.name).toBe('');
        });

        it('should set opacity to 1', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result.opacity).toBe(1);
        });

        it('should set visible to true', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result.visible).toBe(true);
        });

        it('should set x to 0', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result.x).toBe(0);
        });

        it('should set y to 0', function ()
        {
            var result = CreateGroupLayer(json);
            expect(result.y).toBe(0);
        });

        it('should return default state when group is null', function ()
        {
            var result = CreateGroupLayer(json, null);
            expect(result.name).toBe('');
            expect(result.opacity).toBe(1);
            expect(result.visible).toBe(true);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should return default state when group is undefined', function ()
        {
            var result = CreateGroupLayer(json, undefined);
            expect(result.name).toBe('');
            expect(result.opacity).toBe(1);
        });
    });

    describe('group state computation', function ()
    {
        var parentState;
        var group;

        beforeEach(function ()
        {
            parentState = {
                name: '',
                opacity: 1,
                visible: true,
                x: 0,
                y: 0
            };

            group = {
                name: 'GroupA',
                opacity: 0.5,
                visible: true,
                x: 10,
                y: 20,
                layers: [ { name: 'child1' } ]
            };
        });

        it('should set i to 0', function ()
        {
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.i).toBe(0);
        });

        it('should set layers to the group layers', function ()
        {
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.layers).toBe(group.layers);
        });

        it('should prefix the name with the parent name and append a slash', function ()
        {
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.name).toBe('GroupA/');
        });

        it('should accumulate name prefix across nested groups', function ()
        {
            parentState.name = 'Root/';
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.name).toBe('Root/GroupA/');
        });

        it('should multiply opacity with parent opacity', function ()
        {
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.opacity).toBeCloseTo(0.5);
        });

        it('should multiply nested opacity values', function ()
        {
            parentState.opacity = 0.5;
            group.opacity = 0.5;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.opacity).toBeCloseTo(0.25);
        });

        it('should be visible when both parent and group are visible', function ()
        {
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.visible).toBe(true);
        });

        it('should be invisible when group is not visible', function ()
        {
            group.visible = false;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.visible).toBe(false);
        });

        it('should be invisible when parent is not visible', function ()
        {
            parentState.visible = false;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.visible).toBe(false);
        });

        it('should be invisible when both parent and group are not visible', function ()
        {
            parentState.visible = false;
            group.visible = false;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.visible).toBe(false);
        });

        it('should add group x to parent x', function ()
        {
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.x).toBe(10);
        });

        it('should add group y to parent y', function ()
        {
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.y).toBe(20);
        });

        it('should accumulate x offset across nested groups', function ()
        {
            parentState.x = 5;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.x).toBe(15);
        });

        it('should accumulate y offset across nested groups', function ()
        {
            parentState.y = 8;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.y).toBe(28);
        });

        it('should include startx * tilewidth in x calculation', function ()
        {
            group.startx = 2;
            var result = CreateGroupLayer(json, group, parentState);
            // x = 10 + 2 * 32 + 0 = 74
            expect(result.x).toBe(74);
        });

        it('should include starty * tileheight in y calculation', function ()
        {
            group.starty = 3;
            var result = CreateGroupLayer(json, group, parentState);
            // y = 20 + 3 * 32 + 0 = 116
            expect(result.y).toBe(116);
        });

        it('should include offsetx in x calculation', function ()
        {
            group.offsetx = 16;
            var result = CreateGroupLayer(json, group, parentState);
            // x = 10 + 0 + 16 = 26
            expect(result.x).toBe(26);
        });

        it('should include offsety in y calculation', function ()
        {
            group.offsety = 8;
            var result = CreateGroupLayer(json, group, parentState);
            // y = 20 + 0 + 8 = 28
            expect(result.y).toBe(28);
        });

        it('should combine startx, offsetx, and group x together', function ()
        {
            group.startx = 1;
            group.offsetx = 4;
            var result = CreateGroupLayer(json, group, parentState);
            // x = 10 + 1 * 32 + 4 = 46
            expect(result.x).toBe(46);
        });

        it('should combine starty, offsety, and group y together', function ()
        {
            group.starty = 1;
            group.offsety = 4;
            var result = CreateGroupLayer(json, group, parentState);
            // y = 20 + 1 * 32 + 4 = 56
            expect(result.y).toBe(56);
        });

        it('should default startx to 0 when not present', function ()
        {
            delete group.startx;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.x).toBe(10);
        });

        it('should default starty to 0 when not present', function ()
        {
            delete group.starty;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.y).toBe(20);
        });

        it('should default offsetx to 0 when not present', function ()
        {
            delete group.offsetx;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.x).toBe(10);
        });

        it('should default offsety to 0 when not present', function ()
        {
            delete group.offsety;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.y).toBe(20);
        });

        it('should handle zero x and y on group', function ()
        {
            group.x = 0;
            group.y = 0;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should handle full opacity chain', function ()
        {
            parentState.opacity = 1;
            group.opacity = 1;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.opacity).toBe(1);
        });

        it('should handle zero opacity', function ()
        {
            group.opacity = 0;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.opacity).toBe(0);
        });

        it('should handle negative coordinates', function ()
        {
            group.x = -5;
            group.y = -10;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.x).toBe(-5);
            expect(result.y).toBe(-10);
        });

        it('should handle parent with non-zero offset', function ()
        {
            parentState.x = 100;
            parentState.y = 200;
            group.x = 50;
            group.y = 75;
            var result = CreateGroupLayer(json, group, parentState);
            expect(result.x).toBe(150);
            expect(result.y).toBe(275);
        });
    });
});
