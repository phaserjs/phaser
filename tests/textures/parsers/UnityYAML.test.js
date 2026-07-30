var UnityYAML = require('../../../src/textures/parsers/UnityYAML');

describe('UnityYAML', function ()
{
    var texture;
    var sourceIndex;

    beforeEach(function ()
    {
        sourceIndex = 0;

        texture = {
            source: [
                { width: 512, height: 512 }
            ],
            add: vi.fn()
        };
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    it('should return the texture object', function ()
    {
        var result = UnityYAML(texture, sourceIndex, '');

        expect(result).toBe(texture);
    });

    it('should add a __BASE frame with the full source dimensions', function ()
    {
        UnityYAML(texture, sourceIndex, '');

        expect(texture.add).toHaveBeenCalledWith('__BASE', sourceIndex, 0, 0, 512, 512);
    });

    it('should add __BASE using the correct sourceIndex', function ()
    {
        texture.source = [
            { width: 100, height: 200 },
            { width: 256, height: 256 }
        ];

        UnityYAML(texture, 1, '');

        expect(texture.add).toHaveBeenCalledWith('__BASE', 1, 0, 0, 256, 256);
    });

    it('should parse a single sprite from YAML and add its frame', function ()
    {
        var yaml = [
            '    sprites:',
            '    - name: sprite_0',
            '      rect:',
            '        x: 10',
            '        y: 20',
            '        width: 50',
            '        height: 60'
        ].join('\n');

        UnityYAML(texture, sourceIndex, yaml);

        // y is flipped: imageHeight - frame.y - frame.height = 512 - 20 - 60 = 432
        expect(texture.add).toHaveBeenCalledWith('sprite_0', sourceIndex, 10, 432, 50, 60);
    });

    it('should correctly flip the y coordinate', function ()
    {
        texture.source = [ { width: 100, height: 100 } ];

        var yaml = [
            '    - name: mySprite',
            '      rect:',
            '        x: 0',
            '        y: 10',
            '        width: 32',
            '        height: 32'
        ].join('\n');

        UnityYAML(texture, sourceIndex, yaml);

        // y = 100 - 10 - 32 = 58
        expect(texture.add).toHaveBeenCalledWith('mySprite', sourceIndex, 0, 58, 32, 32);
    });

    it('should parse multiple sprites from YAML', function ()
    {
        texture.source = [ { width: 512, height: 512 } ];

        var yaml = [
            '    sprites:',
            '    - name: asteroids_0',
            '      rect:',
            '        x: 5',
            '        y: 328',
            '        width: 65',
            '        height: 82',
            '    - name: asteroids_1',
            '      rect:',
            '        x: 80',
            '        y: 322',
            '        width: 53',
            '        height: 88'
        ].join('\n');

        UnityYAML(texture, sourceIndex, yaml);

        // asteroids_0: y = 512 - 328 - 82 = 102
        expect(texture.add).toHaveBeenCalledWith('asteroids_0', sourceIndex, 5, 102, 65, 82);
        // asteroids_1: y = 512 - 322 - 88 = 102
        expect(texture.add).toHaveBeenCalledWith('asteroids_1', sourceIndex, 80, 102, 53, 88);
    });

    it('should call texture.add once for __BASE and once per sprite', function ()
    {
        var yaml = [
            '    - name: frame_a',
            '      rect:',
            '        x: 0',
            '        y: 0',
            '        width: 10',
            '        height: 10',
            '    - name: frame_b',
            '      rect:',
            '        x: 10',
            '        y: 0',
            '        width: 10',
            '        height: 10'
        ].join('\n');

        UnityYAML(texture, sourceIndex, yaml);

        // __BASE + frame_a + frame_b = 3 calls
        expect(texture.add).toHaveBeenCalledTimes(3);
    });

    it('should only add __BASE when YAML is empty', function ()
    {
        UnityYAML(texture, sourceIndex, '');

        expect(texture.add).toHaveBeenCalledTimes(1);
        expect(texture.add).toHaveBeenCalledWith('__BASE', sourceIndex, 0, 0, 512, 512);
    });

    it('should parse integer values for x, y, width, height', function ()
    {
        var yaml = [
            '    - name: intSprite',
            '      rect:',
            '        x: 7',
            '        y: 13',
            '        width: 100',
            '        height: 200'
        ].join('\n');

        UnityYAML(texture, sourceIndex, yaml);

        var calls = texture.add.mock.calls;
        var spriteCall = calls.find(function (c) { return c[0] === 'intSprite'; });

        expect(spriteCall).toBeDefined();
        expect(typeof spriteCall[2]).toBe('number');
        expect(typeof spriteCall[3]).toBe('number');
        expect(typeof spriteCall[4]).toBe('number');
        expect(typeof spriteCall[5]).toBe('number');
    });

    it('should handle a sprite at x=0 y=0', function ()
    {
        texture.source = [ { width: 200, height: 200 } ];

        var yaml = [
            '    - name: corner',
            '      rect:',
            '        x: 0',
            '        y: 0',
            '        width: 64',
            '        height: 64'
        ].join('\n');

        UnityYAML(texture, sourceIndex, yaml);

        // y = 200 - 0 - 64 = 136
        expect(texture.add).toHaveBeenCalledWith('corner', sourceIndex, 0, 136, 64, 64);
    });

    it('should handle YAML lines that do not match the pattern without crashing', function ()
    {
        var yaml = [
            'TextureImporter:',
            '  # a comment line',
            '',
            '  spritePackingTag: MyTag',
            '    - name: valid_sprite',
            '      rect:',
            '        x: 1',
            '        y: 2',
            '        width: 16',
            '        height: 16'
        ].join('\n');

        expect(function ()
        {
            UnityYAML(texture, sourceIndex, yaml);
        }).not.toThrow();
    });

    it('should use source dimensions from the correct sourceIndex', function ()
    {
        texture.source = [
            { width: 1024, height: 1024 },
            { width: 128, height: 128 }
        ];

        var yaml = [
            '    - name: tinySprite',
            '      rect:',
            '        x: 0',
            '        y: 0',
            '        width: 32',
            '        height: 32'
        ].join('\n');

        UnityYAML(texture, 1, yaml);

        // imageHeight = 128, y = 128 - 0 - 32 = 96
        expect(texture.add).toHaveBeenCalledWith('tinySprite', 1, 0, 96, 32, 32);
    });

    it('should add the last sprite after the loop ends', function ()
    {
        var yaml = [
            '    - name: only_sprite',
            '      rect:',
            '        x: 5',
            '        y: 5',
            '        width: 20',
            '        height: 20'
        ].join('\n');

        UnityYAML(texture, sourceIndex, yaml);

        var calls = texture.add.mock.calls;
        var found = calls.some(function (c) { return c[0] === 'only_sprite'; });

        expect(found).toBe(true);
    });
});
