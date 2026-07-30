var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

describe('CurveFactory', function ()
{
    it('should be importable', function ()
    {
        require('../../../../src/gameobjects/shape/curve/CurveFactory');
    });

    it('should register a curve factory function on GameObjectFactory prototype', function ()
    {
        require('../../../../src/gameobjects/shape/curve/CurveFactory');

        expect(typeof GameObjectFactory.prototype.curve).toBe('function');
    });
});
