var Tile = require('../../src/tilemaps/Tile');
describe('Tile', function() {
    it('should instantiate with orthogonal layer', function() {
        var mockLayer = { orientation: 0 };
        var t = new Tile(mockLayer, 1, 0, 0, 32, 32);
        expect(t.index).toBe(1);
        expect(t.width).toBe(32);
        expect(t.collides).toBe(false);
    });
});
