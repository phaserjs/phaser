var GetScenePlugins = require('../../src/scene/GetScenePlugins');

describe('Phaser.Scenes.GetScenePlugins', function ()
{
    function makeSys(defaultPlugins, scenePlugins)
    {
        return {
            plugins: {
                getDefaultScenePlugins: function () { return defaultPlugins; }
            },
            settings: scenePlugins !== undefined ? { plugins: scenePlugins } : {}
        };
    }

    it('should return scene-level plugins when defined as an array', function ()
    {
        var scenePlugins = ['PluginA', 'PluginB'];
        var sys = makeSys(['DefaultPlugin'], scenePlugins);

        expect(GetScenePlugins(sys)).toBe(scenePlugins);
    });

    it('should return default plugins when no scene plugins are defined', function ()
    {
        var defaultPlugins = ['DefaultPlugin1', 'DefaultPlugin2'];
        var sys = makeSys(defaultPlugins);

        expect(GetScenePlugins(sys)).toBe(defaultPlugins);
    });

    it('should return empty array when no scene plugins and no default plugins', function ()
    {
        var sys = makeSys(null);

        expect(GetScenePlugins(sys)).toEqual([]);
    });

    it('should return empty array when default plugins is undefined and no scene plugins', function ()
    {
        var sys = makeSys(undefined);

        expect(GetScenePlugins(sys)).toEqual([]);
    });

    it('should prioritise scene plugins over default plugins', function ()
    {
        var scenePlugins = ['SceneOnly'];
        var defaultPlugins = ['DefaultOnly'];
        var sys = makeSys(defaultPlugins, scenePlugins);

        expect(GetScenePlugins(sys)).toBe(scenePlugins);
        expect(GetScenePlugins(sys)).not.toBe(defaultPlugins);
    });

    it('should not treat a string plugins value as scene plugins', function ()
    {
        var defaultPlugins = ['DefaultPlugin'];
        var sys = makeSys(defaultPlugins, 'SomePlugin');

        expect(GetScenePlugins(sys)).toBe(defaultPlugins);
    });

    it('should not treat a boolean false plugins value as scene plugins', function ()
    {
        var defaultPlugins = ['DefaultPlugin'];
        var sys = makeSys(defaultPlugins, false);

        expect(GetScenePlugins(sys)).toBe(defaultPlugins);
    });

    it('should not treat a plain object plugins value as scene plugins', function ()
    {
        var defaultPlugins = ['DefaultPlugin'];
        var sys = makeSys(defaultPlugins, { key: 'value' });

        expect(GetScenePlugins(sys)).toBe(defaultPlugins);
    });

    it('should return an empty scene plugins array when scene plugins is an empty array', function ()
    {
        var sys = makeSys(['DefaultPlugin'], []);
        var result = GetScenePlugins(sys);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return empty array when both default plugins is falsy and scene plugins is not an array', function ()
    {
        var sys = makeSys(false, 'not-an-array');

        expect(GetScenePlugins(sys)).toEqual([]);
    });

    it('should return default plugins when default plugins is an empty array and no scene plugins', function ()
    {
        var defaultPlugins = [];
        var sys = makeSys(defaultPlugins);

        expect(GetScenePlugins(sys)).toBe(defaultPlugins);
    });
});
