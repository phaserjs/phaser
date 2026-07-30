var Settings = require('../../src/scene/Settings');

describe('Phaser.Scenes.Settings.create', function ()
{
    describe('string config', function ()
    {
        it('should use the string as the key', function ()
        {
            var result = Settings.create('my-scene');

            expect(result.key).toBe('my-scene');
        });

        it('should set active to false when only a string is passed', function ()
        {
            var result = Settings.create('my-scene');

            expect(result.active).toBe(false);
        });

        it('should set visible to true when only a string is passed', function ()
        {
            var result = Settings.create('my-scene');

            expect(result.visible).toBe(true);
        });
    });

    describe('undefined config', function ()
    {
        it('should not throw when config is undefined', function ()
        {
            expect(function () { Settings.create(undefined); }).not.toThrow();
        });

        it('should return an object with empty string key when config is undefined', function ()
        {
            var result = Settings.create(undefined);

            expect(result.key).toBe('');
        });

        it('should return default values when config is undefined', function ()
        {
            var result = Settings.create(undefined);

            expect(result.active).toBe(false);
            expect(result.visible).toBe(true);
        });
    });

    describe('empty object config', function ()
    {
        it('should not throw when config is an empty object', function ()
        {
            expect(function () { Settings.create({}); }).not.toThrow();
        });

        it('should return an object with empty string key', function ()
        {
            var result = Settings.create({});

            expect(result.key).toBe('');
        });
    });

    describe('status', function ()
    {
        it('should set status to PENDING (0)', function ()
        {
            var result = Settings.create({});

            expect(result.status).toBe(0);
        });
    });

    describe('key', function ()
    {
        it('should use the provided key from config', function ()
        {
            var result = Settings.create({ key: 'game-scene' });

            expect(result.key).toBe('game-scene');
        });

        it('should default key to empty string when not provided', function ()
        {
            var result = Settings.create({});

            expect(result.key).toBe('');
        });
    });

    describe('active', function ()
    {
        it('should use the provided active value', function ()
        {
            var result = Settings.create({ active: true });

            expect(result.active).toBe(true);
        });

        it('should default active to false', function ()
        {
            var result = Settings.create({});

            expect(result.active).toBe(false);
        });
    });

    describe('visible', function ()
    {
        it('should use the provided visible value', function ()
        {
            var result = Settings.create({ visible: false });

            expect(result.visible).toBe(false);
        });

        it('should default visible to true', function ()
        {
            var result = Settings.create({});

            expect(result.visible).toBe(true);
        });
    });

    describe('fixed properties', function ()
    {
        it('should set isBooted to false', function ()
        {
            var result = Settings.create({});

            expect(result.isBooted).toBe(false);
        });

        it('should set isTransition to false', function ()
        {
            var result = Settings.create({});

            expect(result.isTransition).toBe(false);
        });

        it('should set transitionFrom to null', function ()
        {
            var result = Settings.create({});

            expect(result.transitionFrom).toBeNull();
        });

        it('should set transitionDuration to 0', function ()
        {
            var result = Settings.create({});

            expect(result.transitionDuration).toBe(0);
        });

        it('should set transitionAllowInput to true', function ()
        {
            var result = Settings.create({});

            expect(result.transitionAllowInput).toBe(true);
        });

        it('should set data to an empty object', function ()
        {
            var result = Settings.create({});

            expect(typeof result.data).toBe('object');
            expect(Object.keys(result.data).length).toBe(0);
        });
    });

    describe('pack', function ()
    {
        it('should use the provided pack value', function ()
        {
            var pack = { files: [] };
            var result = Settings.create({ pack: pack });

            expect(result.pack).toBe(pack);
        });

        it('should default pack to false', function ()
        {
            var result = Settings.create({});

            expect(result.pack).toBe(false);
        });
    });

    describe('cameras', function ()
    {
        it('should use the provided cameras value', function ()
        {
            var cameras = [{ x: 0, y: 0 }];
            var result = Settings.create({ cameras: cameras });

            expect(result.cameras).toBe(cameras);
        });

        it('should default cameras to null', function ()
        {
            var result = Settings.create({});

            expect(result.cameras).toBeNull();
        });
    });

    describe('map', function ()
    {
        it('should use the provided map value', function ()
        {
            var customMap = { game: 'game', scene: 'scene' };
            var result = Settings.create({ map: customMap });

            expect(result.map).toBe(customMap);
        });

        it('should return a map object when not provided', function ()
        {
            var result = Settings.create({});

            expect(typeof result.map).toBe('object');
            expect(result.map).not.toBeNull();
        });

        it('should merge mapAdd entries into the default map', function ()
        {
            var result = Settings.create({ mapAdd: { myPlugin: 'myPlugin' } });

            expect(result.map.myPlugin).toBe('myPlugin');
        });

        it('should include default InjectionMap keys when mapAdd is used', function ()
        {
            var result = Settings.create({ mapAdd: { extra: 'extra' } });

            expect(result.map.extra).toBe('extra');
            expect(typeof result.map).toBe('object');
        });
    });

    describe('physics', function ()
    {
        it('should use the provided physics config', function ()
        {
            var physics = { default: 'arcade', arcade: { gravity: { y: 300 } } };
            var result = Settings.create({ physics: physics });

            expect(result.physics).toBe(physics);
        });

        it('should default physics to an empty object', function ()
        {
            var result = Settings.create({});

            expect(typeof result.physics).toBe('object');
            expect(Object.keys(result.physics).length).toBe(0);
        });
    });

    describe('loader', function ()
    {
        it('should use the provided loader config', function ()
        {
            var loader = { baseURL: 'http://example.com' };
            var result = Settings.create({ loader: loader });

            expect(result.loader).toBe(loader);
        });

        it('should default loader to an empty object', function ()
        {
            var result = Settings.create({});

            expect(typeof result.loader).toBe('object');
            expect(Object.keys(result.loader).length).toBe(0);
        });
    });

    describe('plugins', function ()
    {
        it('should use the provided plugins value', function ()
        {
            var plugins = ['PluginA', 'PluginB'];
            var result = Settings.create({ plugins: plugins });

            expect(result.plugins).toBe(plugins);
        });

        it('should default plugins to false', function ()
        {
            var result = Settings.create({});

            expect(result.plugins).toBe(false);
        });
    });

    describe('input', function ()
    {
        it('should use the provided input config', function ()
        {
            var input = { keyboard: false };
            var result = Settings.create({ input: input });

            expect(result.input).toBe(input);
        });

        it('should default input to an empty object', function ()
        {
            var result = Settings.create({});

            expect(typeof result.input).toBe('object');
            expect(Object.keys(result.input).length).toBe(0);
        });
    });

    describe('full config object', function ()
    {
        it('should correctly apply all provided config values', function ()
        {
            var config = {
                key: 'full-scene',
                active: true,
                visible: false,
                pack: { files: [] },
                cameras: [{}],
                physics: { default: 'arcade' },
                loader: { baseURL: '/' },
                plugins: ['MyPlugin'],
                input: { gamepad: true }
            };

            var result = Settings.create(config);

            expect(result.key).toBe('full-scene');
            expect(result.active).toBe(true);
            expect(result.visible).toBe(false);
            expect(result.pack).toBe(config.pack);
            expect(result.cameras).toBe(config.cameras);
            expect(result.physics).toBe(config.physics);
            expect(result.loader).toBe(config.loader);
            expect(result.plugins).toBe(config.plugins);
            expect(result.input).toBe(config.input);
        });

        it('should always initialize non-configurable fields regardless of config', function ()
        {
            var result = Settings.create({ key: 'test', active: true });

            expect(result.status).toBe(0);
            expect(result.isBooted).toBe(false);
            expect(result.isTransition).toBe(false);
            expect(result.transitionFrom).toBeNull();
            expect(result.transitionDuration).toBe(0);
            expect(result.transitionAllowInput).toBe(true);
        });
    });
});
