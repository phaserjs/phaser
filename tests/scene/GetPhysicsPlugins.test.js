var GetPhysicsPlugins = require('../../src/scene/GetPhysicsPlugins');

describe('Phaser.Scenes.GetPhysicsPlugins', function ()
{
    function makeSys (defaultPhysicsSystem, scenePhysics)
    {
        return {
            game: {
                config: {
                    defaultPhysicsSystem: defaultPhysicsSystem || false
                }
            },
            settings: {
                physics: scenePhysics || false
            }
        };
    }

    it('should return undefined when no default system and no scene physics', function ()
    {
        var sys = makeSys(false, false);
        expect(GetPhysicsPlugins(sys)).toBeUndefined();
    });

    it('should return undefined when defaultPhysicsSystem is an empty string', function ()
    {
        var sys = makeSys('', false);
        expect(GetPhysicsPlugins(sys)).toBeUndefined();
    });

    it('should return an array when a default physics system is set', function ()
    {
        var sys = makeSys('arcade', false);
        var result = GetPhysicsPlugins(sys);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should title-case the default physics system and append Physics', function ()
    {
        var sys = makeSys('arcade', false);
        var result = GetPhysicsPlugins(sys);
        expect(result).toContain('ArcadePhysics');
    });

    it('should handle matter as the default physics system', function ()
    {
        var sys = makeSys('matter', false);
        var result = GetPhysicsPlugins(sys);
        expect(result).toContain('MatterPhysics');
    });

    it('should return an array with one entry for a single default system and no scene physics', function ()
    {
        var sys = makeSys('arcade', false);
        var result = GetPhysicsPlugins(sys);
        expect(result.length).toBe(1);
    });

    it('should include scene-level physics keys when no default system is set', function ()
    {
        var sys = makeSys(false, { arcade: {} });
        var result = GetPhysicsPlugins(sys);
        expect(result).toContain('ArcadePhysics');
    });

    it('should return an array when only scene physics are configured', function ()
    {
        var sys = makeSys(false, { arcade: {} });
        var result = GetPhysicsPlugins(sys);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
    });

    it('should include multiple scene-level physics keys', function ()
    {
        var sys = makeSys(false, { arcade: {}, matter: {} });
        var result = GetPhysicsPlugins(sys);
        expect(result).toContain('ArcadePhysics');
        expect(result).toContain('MatterPhysics');
        expect(result.length).toBe(2);
    });

    it('should not duplicate a plugin that appears in both default and scene physics', function ()
    {
        var sys = makeSys('arcade', { arcade: {} });
        var result = GetPhysicsPlugins(sys);
        var count = result.filter(function (k) { return k === 'ArcadePhysics'; }).length;
        expect(count).toBe(1);
    });

    it('should include both default and additional scene physics without duplicates', function ()
    {
        var sys = makeSys('arcade', { matter: {} });
        var result = GetPhysicsPlugins(sys);
        expect(result).toContain('ArcadePhysics');
        expect(result).toContain('MatterPhysics');
        expect(result.length).toBe(2);
    });

    it('should title-case scene physics keys', function ()
    {
        var sys = makeSys(false, { matter: {} });
        var result = GetPhysicsPlugins(sys);
        expect(result[0]).toBe('MatterPhysics');
    });

    it('should title-case a lowercase custom physics key', function ()
    {
        var sys = makeSys(false, { custom: {} });
        var result = GetPhysicsPlugins(sys);
        expect(result).toContain('CustomPhysics');
    });

    it('should default to false for scene physics when the settings property is absent', function ()
    {
        var sys = {
            game: { config: { defaultPhysicsSystem: false } },
            settings: {}
        };
        expect(GetPhysicsPlugins(sys)).toBeUndefined();
    });

    it('should still work when scene settings has physics set to null', function ()
    {
        var sys = {
            game: { config: { defaultPhysicsSystem: false } },
            settings: { physics: null }
        };
        expect(GetPhysicsPlugins(sys)).toBeUndefined();
    });

    it('should return an array starting with the default system when both default and scene physics are set', function ()
    {
        var sys = makeSys('arcade', { matter: {} });
        var result = GetPhysicsPlugins(sys);
        expect(result[0]).toBe('ArcadePhysics');
    });
});
