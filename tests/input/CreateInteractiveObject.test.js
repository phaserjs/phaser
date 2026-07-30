var CreateInteractiveObject = require('../../src/input/CreateInteractiveObject');

describe('Phaser.Input.CreateInteractiveObject', function ()
{
    var mockGameObject;
    var mockHitArea;
    var mockHitAreaCallback;

    beforeEach(function ()
    {
        mockGameObject = { id: 1, name: 'testObject' };
        mockHitArea = { type: 'rectangle', width: 100, height: 100 };
        mockHitAreaCallback = function (shape, x, y) { return true; };
    });

    it('should return an object', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(typeof result).toBe('object');
        expect(result).not.toBeNull();
    });

    it('should bind the gameObject to the interactive object', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.gameObject).toBe(mockGameObject);
    });

    it('should bind the hitArea to the interactive object', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.hitArea).toBe(mockHitArea);
    });

    it('should bind the hitAreaCallback to the interactive object', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.hitAreaCallback).toBe(mockHitAreaCallback);
    });

    it('should default enabled to true', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.enabled).toBe(true);
    });

    it('should default draggable to false', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.draggable).toBe(false);
    });

    it('should default dropZone to false', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dropZone).toBe(false);
    });

    it('should default cursor to false', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.cursor).toBe(false);
    });

    it('should default target to null', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.target).toBeNull();
    });

    it('should default camera to null', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.camera).toBeNull();
    });

    it('should default hitAreaDebug to null', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.hitAreaDebug).toBeNull();
    });

    it('should default customHitArea to false', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.customHitArea).toBe(false);
    });

    it('should default localX to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.localX).toBe(0);
    });

    it('should default localY to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.localY).toBe(0);
    });

    it('should default dragState to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragState).toBe(0);
    });

    it('should default dragStartX to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragStartX).toBe(0);
    });

    it('should default dragStartY to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragStartY).toBe(0);
    });

    it('should default dragStartXGlobal to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragStartXGlobal).toBe(0);
    });

    it('should default dragStartYGlobal to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragStartYGlobal).toBe(0);
    });

    it('should default dragStartCamera to null', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragStartCamera).toBeNull();
    });

    it('should default dragX to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragX).toBe(0);
    });

    it('should default dragY to 0', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.dragY).toBe(0);
    });

    it('should accept null as hitArea', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, null, mockHitAreaCallback);
        expect(result.hitArea).toBeNull();
    });

    it('should accept null as hitAreaCallback', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, null);
        expect(result.hitAreaCallback).toBeNull();
    });

    it('should accept undefined gameObject', function ()
    {
        var result = CreateInteractiveObject(undefined, mockHitArea, mockHitAreaCallback);
        expect(result.gameObject).toBeUndefined();
    });

    it('should return a new object each call', function ()
    {
        var result1 = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        var result2 = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        expect(result1).not.toBe(result2);
    });

    it('should not share state between two interactive objects', function ()
    {
        var result1 = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        var result2 = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        result1.dragState = 2;
        result1.localX = 50;
        expect(result2.dragState).toBe(0);
        expect(result2.localX).toBe(0);
    });

    it('should allow properties to be mutated after creation', function ()
    {
        var result = CreateInteractiveObject(mockGameObject, mockHitArea, mockHitAreaCallback);
        result.enabled = false;
        result.draggable = true;
        result.dragState = 2;
        expect(result.enabled).toBe(false);
        expect(result.draggable).toBe(true);
        expect(result.dragState).toBe(2);
    });

    it('should accept a different game object reference', function ()
    {
        var anotherGameObject = { id: 2, name: 'anotherObject' };
        var result = CreateInteractiveObject(anotherGameObject, mockHitArea, mockHitAreaCallback);
        expect(result.gameObject).toBe(anotherGameObject);
        expect(result.gameObject).not.toBe(mockGameObject);
    });
});
