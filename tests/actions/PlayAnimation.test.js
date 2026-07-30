var PlayAnimation = require('../../src/actions/PlayAnimation');

describe('Phaser.Actions.PlayAnimation', function ()
{
    var mockGameObject;
    var mockItems;

    beforeEach(function ()
    {
        mockGameObject = {
            anims: {
                play: vi.fn()
            }
        };

        mockItems = [ mockGameObject ];
    });

    it('should return the items array', function ()
    {
        var result = PlayAnimation(mockItems, 'walk');

        expect(result).toBe(mockItems);
    });

    it('should call anims.play on each game object with the given key', function ()
    {
        PlayAnimation(mockItems, 'walk');

        expect(mockGameObject.anims.play).toHaveBeenCalledWith('walk', undefined);
    });

    it('should pass ignoreIfPlaying to anims.play', function ()
    {
        PlayAnimation(mockItems, 'run', true);

        expect(mockGameObject.anims.play).toHaveBeenCalledWith('run', true);
    });

    it('should pass ignoreIfPlaying=false explicitly', function ()
    {
        PlayAnimation(mockItems, 'idle', false);

        expect(mockGameObject.anims.play).toHaveBeenCalledWith('idle', false);
    });

    it('should call anims.play on multiple game objects', function ()
    {
        var obj1 = { anims: { play: vi.fn() } };
        var obj2 = { anims: { play: vi.fn() } };
        var obj3 = { anims: { play: vi.fn() } };
        var items = [ obj1, obj2, obj3 ];

        PlayAnimation(items, 'jump');

        expect(obj1.anims.play).toHaveBeenCalledWith('jump', undefined);
        expect(obj2.anims.play).toHaveBeenCalledWith('jump', undefined);
        expect(obj3.anims.play).toHaveBeenCalledWith('jump', undefined);
    });

    it('should skip game objects without an anims component', function ()
    {
        var withAnims = { anims: { play: vi.fn() } };
        var withoutAnims = {};
        var items = [ withAnims, withoutAnims ];

        expect(function () { PlayAnimation(items, 'walk'); }).not.toThrow();
        expect(withAnims.anims.play).toHaveBeenCalledTimes(1);
    });

    it('should handle an empty items array', function ()
    {
        var result = PlayAnimation([], 'walk');

        expect(result).toEqual([]);
    });

    it('should accept an animation config object as the key', function ()
    {
        var config = { key: 'walk', repeat: -1, frameRate: 12 };

        PlayAnimation(mockItems, config);

        expect(mockGameObject.anims.play).toHaveBeenCalledWith(config, undefined);
    });

    it('should return the same array reference passed in', function ()
    {
        var items = [ mockGameObject ];
        var result = PlayAnimation(items, 'walk');

        expect(result).toBe(items);
    });

    it('should call anims.play once per game object', function ()
    {
        var obj1 = { anims: { play: vi.fn() } };
        var obj2 = { anims: { play: vi.fn() } };
        var items = [ obj1, obj2 ];

        PlayAnimation(items, 'run', true);

        expect(obj1.anims.play).toHaveBeenCalledTimes(1);
        expect(obj2.anims.play).toHaveBeenCalledTimes(1);
    });

    it('should handle mixed items where some have anims and some do not', function ()
    {
        var obj1 = { anims: { play: vi.fn() } };
        var obj2 = { name: 'no-anims' };
        var obj3 = { anims: { play: vi.fn() } };
        var items = [ obj1, obj2, obj3 ];

        PlayAnimation(items, 'dance');

        expect(obj1.anims.play).toHaveBeenCalledWith('dance', undefined);
        expect(obj3.anims.play).toHaveBeenCalledWith('dance', undefined);
    });
});
