var Scene = require('../../src/scene/Scene');

describe('Phaser.Scene', function ()
{
    describe('constructor', function ()
    {
        it('should create a sys property that is a Systems instance', function ()
        {
            var scene = new Scene();
            expect(scene.sys).toBeDefined();
            expect(typeof scene.sys).toBe('object');
        });

        it('should set sys.scene to the scene itself', function ()
        {
            var scene = new Scene();
            expect(scene.sys.scene).toBe(scene);
        });

        it('should accept a string config key', function ()
        {
            var scene = new Scene('myScene');
            expect(scene.sys.settings.key).toBe('myScene');
        });

        it('should accept a config object with a key', function ()
        {
            var scene = new Scene({ key: 'testScene' });
            expect(scene.sys.settings.key).toBe('testScene');
        });

        it('should accept a config object with active set to true', function ()
        {
            var scene = new Scene({ key: 'active', active: true });
            expect(scene.sys.settings.active).toBe(true);
        });

        it('should default active to false when not specified', function ()
        {
            var scene = new Scene({ key: 'inactive' });
            expect(scene.sys.settings.active).toBe(false);
        });

        it('should default visible to true when not specified', function ()
        {
            var scene = new Scene({ key: 'visible' });
            expect(scene.sys.settings.visible).toBe(true);
        });

        it('should accept a config object with visible set to false', function ()
        {
            var scene = new Scene({ key: 'hidden', visible: false });
            expect(scene.sys.settings.visible).toBe(false);
        });

        it('should create without arguments', function ()
        {
            var scene = new Scene();
            expect(scene.sys).toBeDefined();
            expect(scene.sys.settings.key).toBe('');
        });

        it('should have undefined plugin properties before boot', function ()
        {
            var scene = new Scene();
            expect(scene.game).toBeUndefined();
            expect(scene.anims).toBeUndefined();
            expect(scene.cache).toBeUndefined();
            expect(scene.registry).toBeUndefined();
            expect(scene.sound).toBeUndefined();
            expect(scene.textures).toBeUndefined();
        });

        it('should have undefined scene plugin properties before boot', function ()
        {
            var scene = new Scene();
            expect(scene.events).toBeUndefined();
            expect(scene.cameras).toBeUndefined();
            expect(scene.add).toBeUndefined();
            expect(scene.make).toBeUndefined();
            expect(scene.scene).toBeUndefined();
            expect(scene.children).toBeUndefined();
        });

        it('should have undefined optional plugin properties before boot', function ()
        {
            var scene = new Scene();
            expect(scene.lights).toBeUndefined();
            expect(scene.data).toBeUndefined();
            expect(scene.input).toBeUndefined();
            expect(scene.load).toBeUndefined();
            expect(scene.time).toBeUndefined();
            expect(scene.tweens).toBeUndefined();
            expect(scene.physics).toBeUndefined();
            expect(scene.matter).toBeUndefined();
            expect(scene.scale).toBeUndefined();
            expect(scene.plugins).toBeUndefined();
            expect(scene.renderer).toBeUndefined();
        });

        it('should store the config on sys', function ()
        {
            var config = { key: 'stored' };
            var scene = new Scene(config);
            expect(scene.sys.config).toBe(config);
        });
    });

    describe('update', function ()
    {
        it('should be a function', function ()
        {
            var scene = new Scene();
            expect(typeof scene.update).toBe('function');
        });

        it('should return undefined when called with no arguments', function ()
        {
            var scene = new Scene();
            var result = scene.update();
            expect(result).toBeUndefined();
        });

        it('should return undefined when called with time and delta arguments', function ()
        {
            var scene = new Scene();
            var result = scene.update(1000, 16.67);
            expect(result).toBeUndefined();
        });

        it('should not throw when called multiple times', function ()
        {
            var scene = new Scene();
            expect(function ()
            {
                scene.update(0, 16);
                scene.update(16, 16);
                scene.update(32, 16);
            }).not.toThrow();
        });

        it('should be overridable in a subclass', function ()
        {
            var called = false;
            var time = 0;
            var delta = 0;

            var Class = require('../../src/utils/Class');

            var MyScene = new Class({
                Extends: Scene,

                initialize: function MyScene ()
                {
                    Scene.call(this, { key: 'myScene' });
                },

                update: function (t, d)
                {
                    called = true;
                    time = t;
                    delta = d;
                }
            });

            var scene = new MyScene();
            scene.update(500, 16.5);

            expect(called).toBe(true);
            expect(time).toBe(500);
            expect(delta).toBeCloseTo(16.5);
        });
    });
});
