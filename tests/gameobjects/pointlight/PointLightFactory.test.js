var path = require('path');

var mockCalls = [];

function MockPointLight (scene, x, y, color, radius, intensity, attenuation)
{
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.color = (color === undefined) ? 0xffffff : color;
    this.radius = (radius === undefined) ? 128 : radius;
    this.intensity = (intensity === undefined) ? 1 : intensity;
    this.attenuation = (attenuation === undefined) ? 0.1 : attenuation;
    this._mockPointLight = true;
    mockCalls.push([ scene, x, y, color, radius, intensity, attenuation ]);
}

// Inject MockPointLight into the require cache before PointLightFactory loads PointLight
var pointLightPath = path.resolve(__dirname, '../../../src/gameobjects/pointlight/PointLight.js');
var factoryPath = path.resolve(__dirname, '../../../src/gameobjects/pointlight/PointLightFactory.js');

delete require.cache[pointLightPath];
delete require.cache[factoryPath];

require.cache[pointLightPath] = {
    id: pointLightPath,
    filename: pointLightPath,
    loaded: true,
    exports: MockPointLight
};

var GameObjectFactory = require('../../../src/gameobjects/GameObjectFactory');

// Force re-registration so the factory function closes over MockPointLight
delete GameObjectFactory.prototype.pointlight;

require('../../../src/gameobjects/pointlight/PointLightFactory');

beforeEach(function ()
{
    mockCalls.length = 0;
});

describe('PointLightFactory', function ()
{
    it('should register pointlight on GameObjectFactory prototype', function ()
    {
        expect(typeof GameObjectFactory.prototype.pointlight).toBe('function');
    });

    it('should add a new PointLight to the display list and return it', function ()
    {
        var added = null;
        var mockFactory = {
            scene: {},
            displayList: {
                add: function (obj)
                {
                    added = obj;
                    return obj;
                }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 100, 200);

        expect(result).toBe(added);
        expect(result._mockPointLight).toBe(true);
    });

    it('should pass x and y to the PointLight constructor', function ()
    {
        var mockFactory = {
            scene: {},
            displayList: {
                add: function (obj) { return obj; }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 300, 400);

        expect(result.x).toBe(300);
        expect(result.y).toBe(400);
    });

    it('should pass color to the PointLight constructor', function ()
    {
        var mockFactory = {
            scene: {},
            displayList: {
                add: function (obj) { return obj; }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 0, 0, 0xff0000);

        expect(result.color).toBe(0xff0000);
    });

    it('should pass radius to the PointLight constructor', function ()
    {
        var mockFactory = {
            scene: {},
            displayList: {
                add: function (obj) { return obj; }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 0, 0, 0xffffff, 256);

        expect(result.radius).toBe(256);
    });

    it('should pass intensity to the PointLight constructor', function ()
    {
        var mockFactory = {
            scene: {},
            displayList: {
                add: function (obj) { return obj; }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 0, 0, 0xffffff, 128, 2);

        expect(result.intensity).toBe(2);
    });

    it('should pass attenuation to the PointLight constructor', function ()
    {
        var mockFactory = {
            scene: {},
            displayList: {
                add: function (obj) { return obj; }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 0, 0, 0xffffff, 128, 1, 0.5);

        expect(result.attenuation).toBe(0.5);
    });

    it('should pass the scene reference to the PointLight constructor', function ()
    {
        var mockScene = { id: 'test-scene' };
        var mockFactory = {
            scene: mockScene,
            displayList: {
                add: function (obj) { return obj; }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 0, 0);

        expect(result.scene).toBe(mockScene);
    });

    it('should call displayList.add exactly once', function ()
    {
        var callCount = 0;
        var mockFactory = {
            scene: {},
            displayList: {
                add: function (obj)
                {
                    callCount++;
                    return obj;
                }
            }
        };

        GameObjectFactory.prototype.pointlight.call(mockFactory, 10, 20);

        expect(callCount).toBe(1);
    });

    it('should return the object returned by displayList.add', function ()
    {
        var sentinel = { _sentinel: true };
        var mockFactory = {
            scene: {},
            displayList: {
                add: function ()
                {
                    return sentinel;
                }
            }
        };

        var result = GameObjectFactory.prototype.pointlight.call(mockFactory, 0, 0);

        expect(result).toBe(sentinel);
    });
});
