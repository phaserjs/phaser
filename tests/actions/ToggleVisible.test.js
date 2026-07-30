var ToggleVisible = require('../../src/actions/ToggleVisible');

describe('Phaser.Actions.ToggleVisible', function ()
{
    it('should toggle visible from true to false', function ()
    {
        var items = [{ visible: true }, { visible: true }];

        ToggleVisible(items);

        expect(items[0].visible).toBe(false);
        expect(items[1].visible).toBe(false);
    });

    it('should toggle visible from false to true', function ()
    {
        var items = [{ visible: false }, { visible: false }];

        ToggleVisible(items);

        expect(items[0].visible).toBe(true);
        expect(items[1].visible).toBe(true);
    });

    it('should toggle mixed visibility states independently', function ()
    {
        var items = [{ visible: true }, { visible: false }, { visible: true }];

        ToggleVisible(items);

        expect(items[0].visible).toBe(false);
        expect(items[1].visible).toBe(true);
        expect(items[2].visible).toBe(false);
    });

    it('should return the original array', function ()
    {
        var items = [{ visible: true }];
        var result = ToggleVisible(items);

        expect(result).toBe(items);
    });

    it('should return an empty array unchanged', function ()
    {
        var items = [];
        var result = ToggleVisible(items);

        expect(result).toBe(items);
        expect(result.length).toBe(0);
    });

    it('should toggle back to original state when called twice', function ()
    {
        var items = [{ visible: true }, { visible: false }];

        ToggleVisible(items);
        ToggleVisible(items);

        expect(items[0].visible).toBe(true);
        expect(items[1].visible).toBe(false);
    });

    it('should handle a single item array', function ()
    {
        var items = [{ visible: true }];

        ToggleVisible(items);

        expect(items[0].visible).toBe(false);
    });

    it('should coerce truthy values to false', function ()
    {
        var items = [{ visible: 1 }];

        ToggleVisible(items);

        expect(items[0].visible).toBe(false);
    });

    it('should coerce falsy values to true', function ()
    {
        var items = [{ visible: 0 }];

        ToggleVisible(items);

        expect(items[0].visible).toBe(true);
    });
});
