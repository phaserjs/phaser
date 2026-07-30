var InjectionMap = require('../../src/scene/InjectionMap');

describe('InjectionMap', function ()
{
    it('should be importable', function ()
    {
        expect(InjectionMap).toBeDefined();
    });

    it('should be a plain object', function ()
    {
        expect(typeof InjectionMap).toBe('object');
        expect(InjectionMap).not.toBeNull();
    });

    it('should map game to game', function ()
    {
        expect(InjectionMap.game).toBe('game');
    });

    it('should map renderer to renderer', function ()
    {
        expect(InjectionMap.renderer).toBe('renderer');
    });

    it('should map anims to anims', function ()
    {
        expect(InjectionMap.anims).toBe('anims');
    });

    it('should map cache to cache', function ()
    {
        expect(InjectionMap.cache).toBe('cache');
    });

    it('should map plugins to plugins', function ()
    {
        expect(InjectionMap.plugins).toBe('plugins');
    });

    it('should map registry to registry', function ()
    {
        expect(InjectionMap.registry).toBe('registry');
    });

    it('should map scale to scale', function ()
    {
        expect(InjectionMap.scale).toBe('scale');
    });

    it('should map sound to sound', function ()
    {
        expect(InjectionMap.sound).toBe('sound');
    });

    it('should map textures to textures', function ()
    {
        expect(InjectionMap.textures).toBe('textures');
    });

    it('should map events to events', function ()
    {
        expect(InjectionMap.events).toBe('events');
    });

    it('should map cameras to cameras', function ()
    {
        expect(InjectionMap.cameras).toBe('cameras');
    });

    it('should map add to add', function ()
    {
        expect(InjectionMap.add).toBe('add');
    });

    it('should map make to make', function ()
    {
        expect(InjectionMap.make).toBe('make');
    });

    it('should map scenePlugin to scene', function ()
    {
        expect(InjectionMap.scenePlugin).toBe('scene');
    });

    it('should map displayList to children', function ()
    {
        expect(InjectionMap.displayList).toBe('children');
    });

    it('should map lights to lights', function ()
    {
        expect(InjectionMap.lights).toBe('lights');
    });

    it('should map data to data', function ()
    {
        expect(InjectionMap.data).toBe('data');
    });

    it('should map input to input', function ()
    {
        expect(InjectionMap.input).toBe('input');
    });

    it('should map load to load', function ()
    {
        expect(InjectionMap.load).toBe('load');
    });

    it('should map time to time', function ()
    {
        expect(InjectionMap.time).toBe('time');
    });

    it('should map tweens to tweens', function ()
    {
        expect(InjectionMap.tweens).toBe('tweens');
    });

    it('should map arcadePhysics to physics', function ()
    {
        expect(InjectionMap.arcadePhysics).toBe('physics');
    });

    it('should map matterPhysics to matter', function ()
    {
        expect(InjectionMap.matterPhysics).toBe('matter');
    });

    it('should contain all expected keys', function ()
    {
        var expectedKeys = [
            'game', 'renderer', 'anims', 'cache', 'plugins', 'registry',
            'scale', 'sound', 'textures', 'events', 'cameras', 'add',
            'make', 'scenePlugin', 'displayList', 'lights', 'data',
            'input', 'load', 'time', 'tweens', 'arcadePhysics', 'matterPhysics'
        ];

        expectedKeys.forEach(function (key)
        {
            expect(InjectionMap).toHaveProperty(key);
        });
    });

    it('should have exactly the expected number of entries', function ()
    {
        expect(Object.keys(InjectionMap).length).toBe(23);
    });

    it('should have all string values', function ()
    {
        Object.keys(InjectionMap).forEach(function (key)
        {
            expect(typeof InjectionMap[key]).toBe('string');
        });
    });
});
