var DefaultPlugins = require('../../src/plugins/DefaultPlugins');

describe('DefaultPlugins', function ()
{
    describe('structure', function ()
    {
        it('should be an object', function ()
        {
            expect(typeof DefaultPlugins).toBe('object');
            expect(DefaultPlugins).not.toBeNull();
        });

        it('should have a Global property', function ()
        {
            expect(DefaultPlugins).toHaveProperty('Global');
        });

        it('should have a CoreScene property', function ()
        {
            expect(DefaultPlugins).toHaveProperty('CoreScene');
        });

        it('should have a DefaultScene property', function ()
        {
            expect(DefaultPlugins).toHaveProperty('DefaultScene');
        });

        it('should have Global as an array', function ()
        {
            expect(Array.isArray(DefaultPlugins.Global)).toBe(true);
        });

        it('should have CoreScene as an array', function ()
        {
            expect(Array.isArray(DefaultPlugins.CoreScene)).toBe(true);
        });

        it('should have DefaultScene as an array', function ()
        {
            expect(Array.isArray(DefaultPlugins.DefaultScene)).toBe(true);
        });
    });

    describe('Global plugins', function ()
    {
        it('should contain game', function ()
        {
            expect(DefaultPlugins.Global).toContain('game');
        });

        it('should contain anims', function ()
        {
            expect(DefaultPlugins.Global).toContain('anims');
        });

        it('should contain cache', function ()
        {
            expect(DefaultPlugins.Global).toContain('cache');
        });

        it('should contain plugins', function ()
        {
            expect(DefaultPlugins.Global).toContain('plugins');
        });

        it('should contain registry', function ()
        {
            expect(DefaultPlugins.Global).toContain('registry');
        });

        it('should contain scale', function ()
        {
            expect(DefaultPlugins.Global).toContain('scale');
        });

        it('should contain sound', function ()
        {
            expect(DefaultPlugins.Global).toContain('sound');
        });

        it('should contain textures', function ()
        {
            expect(DefaultPlugins.Global).toContain('textures');
        });

        it('should contain renderer', function ()
        {
            expect(DefaultPlugins.Global).toContain('renderer');
        });

        it('should have string entries only', function ()
        {
            DefaultPlugins.Global.forEach(function (entry)
            {
                expect(typeof entry).toBe('string');
            });
        });
    });

    describe('CoreScene plugins', function ()
    {
        it('should contain EventEmitter', function ()
        {
            expect(DefaultPlugins.CoreScene).toContain('EventEmitter');
        });

        it('should contain CameraManager', function ()
        {
            expect(DefaultPlugins.CoreScene).toContain('CameraManager');
        });

        it('should contain GameObjectCreator', function ()
        {
            expect(DefaultPlugins.CoreScene).toContain('GameObjectCreator');
        });

        it('should contain GameObjectFactory', function ()
        {
            expect(DefaultPlugins.CoreScene).toContain('GameObjectFactory');
        });

        it('should contain ScenePlugin', function ()
        {
            expect(DefaultPlugins.CoreScene).toContain('ScenePlugin');
        });

        it('should contain DisplayList', function ()
        {
            expect(DefaultPlugins.CoreScene).toContain('DisplayList');
        });

        it('should contain UpdateList', function ()
        {
            expect(DefaultPlugins.CoreScene).toContain('UpdateList');
        });

        it('should have EventEmitter as the first entry', function ()
        {
            expect(DefaultPlugins.CoreScene[0]).toBe('EventEmitter');
        });

        it('should have string entries only', function ()
        {
            DefaultPlugins.CoreScene.forEach(function (entry)
            {
                expect(typeof entry).toBe('string');
            });
        });
    });

    describe('DefaultScene plugins', function ()
    {
        it('should contain Clock', function ()
        {
            expect(DefaultPlugins.DefaultScene).toContain('Clock');
        });

        it('should contain DataManagerPlugin', function ()
        {
            expect(DefaultPlugins.DefaultScene).toContain('DataManagerPlugin');
        });

        it('should contain InputPlugin', function ()
        {
            expect(DefaultPlugins.DefaultScene).toContain('InputPlugin');
        });

        it('should contain Loader', function ()
        {
            expect(DefaultPlugins.DefaultScene).toContain('Loader');
        });

        it('should contain TweenManager', function ()
        {
            expect(DefaultPlugins.DefaultScene).toContain('TweenManager');
        });

        it('should contain LightsPlugin', function ()
        {
            expect(DefaultPlugins.DefaultScene).toContain('LightsPlugin');
        });

        it('should have string entries only', function ()
        {
            DefaultPlugins.DefaultScene.forEach(function (entry)
            {
                expect(typeof entry).toBe('string');
            });
        });
    });

    describe('array integrity', function ()
    {
        it('should not have duplicate entries in Global', function ()
        {
            var seen = {};
            DefaultPlugins.Global.forEach(function (entry)
            {
                expect(seen[entry]).toBeUndefined();
                seen[entry] = true;
            });
        });

        it('should not have duplicate entries in CoreScene', function ()
        {
            var seen = {};
            DefaultPlugins.CoreScene.forEach(function (entry)
            {
                expect(seen[entry]).toBeUndefined();
                seen[entry] = true;
            });
        });

        it('should not have duplicate entries in DefaultScene', function ()
        {
            var seen = {};
            DefaultPlugins.DefaultScene.forEach(function (entry)
            {
                expect(seen[entry]).toBeUndefined();
                seen[entry] = true;
            });
        });

        it('should not share entries between CoreScene and DefaultScene', function ()
        {
            DefaultPlugins.CoreScene.forEach(function (entry)
            {
                expect(DefaultPlugins.DefaultScene).not.toContain(entry);
            });
        });
    });
});
