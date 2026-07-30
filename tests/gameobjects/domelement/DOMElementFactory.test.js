var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

describe('DOMElementFactory', function ()
{
    it('should be importable', function ()
    {
        expect(function ()
        {
            require('../../../src/gameobjects/domelement/DOMElementFactory');
        }).not.toThrow();
    });

    it('should register a dom factory method on GameObjectFactory', function ()
    {
        require('../../../src/gameobjects/domelement/DOMElementFactory');

        expect(typeof GameObjectFactory.prototype.dom).toBe('function');
    });
});
