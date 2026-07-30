var ToJSON = require('../../../src/gameobjects/components/ToJSON');

describe('ToJSON', function ()
{
    var mockGameObject;

    beforeEach(function ()
    {
        mockGameObject = {
            name: 'testObject',
            type: 'Sprite',
            x: 100,
            y: 200,
            depth: 5,
            scaleX: 1,
            scaleY: 1,
            originX: 0.5,
            originY: 0.5,
            flipX: false,
            flipY: false,
            rotation: 0,
            alpha: 1,
            visible: true,
            blendMode: 0,
            texture: null,
            frame: null
        };
    });

    it('should return an object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
    });

    it('should copy name from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.name).toBe('testObject');
    });

    it('should copy type from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.type).toBe('Sprite');
    });

    it('should copy x position from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.x).toBe(100);
    });

    it('should copy y position from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.y).toBe(200);
    });

    it('should copy depth from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.depth).toBe(5);
    });

    it('should include scale as an object with x and y', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(typeof result.scale).toBe('object');
        expect(result.scale.x).toBe(1);
        expect(result.scale.y).toBe(1);
    });

    it('should copy scaleX and scaleY into the scale object', function ()
    {
        mockGameObject.scaleX = 2;
        mockGameObject.scaleY = 3;
        var result = ToJSON(mockGameObject);
        expect(result.scale.x).toBe(2);
        expect(result.scale.y).toBe(3);
    });

    it('should include origin as an object with x and y', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(typeof result.origin).toBe('object');
        expect(result.origin.x).toBe(0.5);
        expect(result.origin.y).toBe(0.5);
    });

    it('should copy originX and originY into the origin object', function ()
    {
        mockGameObject.originX = 0;
        mockGameObject.originY = 1;
        var result = ToJSON(mockGameObject);
        expect(result.origin.x).toBe(0);
        expect(result.origin.y).toBe(1);
    });

    it('should copy flipX from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.flipX).toBe(false);
    });

    it('should copy flipY from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.flipY).toBe(false);
    });

    it('should reflect flipped state when flipX is true', function ()
    {
        mockGameObject.flipX = true;
        var result = ToJSON(mockGameObject);
        expect(result.flipX).toBe(true);
    });

    it('should reflect flipped state when flipY is true', function ()
    {
        mockGameObject.flipY = true;
        var result = ToJSON(mockGameObject);
        expect(result.flipY).toBe(true);
    });

    it('should copy rotation from the game object', function ()
    {
        mockGameObject.rotation = 1.5708;
        var result = ToJSON(mockGameObject);
        expect(result.rotation).toBeCloseTo(1.5708);
    });

    it('should copy alpha from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.alpha).toBe(1);
    });

    it('should copy visible from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.visible).toBe(true);
    });

    it('should copy blendMode from the game object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.blendMode).toBe(0);
    });

    it('should set textureKey to empty string when no texture', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.textureKey).toBe('');
    });

    it('should set frameKey to empty string when no texture', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(result.frameKey).toBe('');
    });

    it('should set textureKey from texture.key when texture exists', function ()
    {
        mockGameObject.texture = { key: 'myAtlas' };
        mockGameObject.frame = { name: 'frame01' };
        var result = ToJSON(mockGameObject);
        expect(result.textureKey).toBe('myAtlas');
    });

    it('should set frameKey from frame.name when texture exists', function ()
    {
        mockGameObject.texture = { key: 'myAtlas' };
        mockGameObject.frame = { name: 'frame01' };
        var result = ToJSON(mockGameObject);
        expect(result.frameKey).toBe('frame01');
    });

    it('should include an empty data object', function ()
    {
        var result = ToJSON(mockGameObject);
        expect(typeof result.data).toBe('object');
        expect(Object.keys(result.data).length).toBe(0);
    });

    it('should handle zero values for position', function ()
    {
        mockGameObject.x = 0;
        mockGameObject.y = 0;
        var result = ToJSON(mockGameObject);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('should handle negative position values', function ()
    {
        mockGameObject.x = -50;
        mockGameObject.y = -100;
        var result = ToJSON(mockGameObject);
        expect(result.x).toBe(-50);
        expect(result.y).toBe(-100);
    });

    it('should handle zero rotation', function ()
    {
        mockGameObject.rotation = 0;
        var result = ToJSON(mockGameObject);
        expect(result.rotation).toBe(0);
    });

    it('should handle negative rotation', function ()
    {
        mockGameObject.rotation = -1.5708;
        var result = ToJSON(mockGameObject);
        expect(result.rotation).toBeCloseTo(-1.5708);
    });

    it('should handle zero alpha', function ()
    {
        mockGameObject.alpha = 0;
        var result = ToJSON(mockGameObject);
        expect(result.alpha).toBe(0);
    });

    it('should handle visible false', function ()
    {
        mockGameObject.visible = false;
        var result = ToJSON(mockGameObject);
        expect(result.visible).toBe(false);
    });

    it('should handle empty string name', function ()
    {
        mockGameObject.name = '';
        var result = ToJSON(mockGameObject);
        expect(result.name).toBe('');
    });

    it('should not include texture properties in output when texture is falsy', function ()
    {
        mockGameObject.texture = undefined;
        var result = ToJSON(mockGameObject);
        expect(result.textureKey).toBe('');
        expect(result.frameKey).toBe('');
    });

    it('should return a new object each call', function ()
    {
        var result1 = ToJSON(mockGameObject);
        var result2 = ToJSON(mockGameObject);
        expect(result1).not.toBe(result2);
    });

    it('should return scale as a separate nested object not shared between calls', function ()
    {
        var result1 = ToJSON(mockGameObject);
        var result2 = ToJSON(mockGameObject);
        expect(result1.scale).not.toBe(result2.scale);
    });

    it('should return origin as a separate nested object not shared between calls', function ()
    {
        var result1 = ToJSON(mockGameObject);
        var result2 = ToJSON(mockGameObject);
        expect(result1.origin).not.toBe(result2.origin);
    });
});
