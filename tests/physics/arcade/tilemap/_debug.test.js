vi.mock('../../../../src/physics/arcade/tilemap/TileCheckX');

var TileCheckX = require('../../../../src/physics/arcade/tilemap/TileCheckX');

describe('debug', function () {
    it('shows what TileCheckX is', function () {
        console.log('type:', typeof TileCheckX);
        console.log('isMockFn:', vi.isMockFunction(TileCheckX));
        console.log('val:', TileCheckX);
        console.log('val.toString():', TileCheckX && TileCheckX.toString && TileCheckX.toString().slice(0,100));
    });
});
