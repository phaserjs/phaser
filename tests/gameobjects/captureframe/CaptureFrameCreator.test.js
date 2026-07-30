describe('CaptureFrameCreator', function ()
{
    var GameObjectCreator;
    var CaptureFrame;
    var mockScene;
    var mockDisplayList;
    var mockThis;

    var captureFramePath;
    var captureFrameCreatorPath;

    beforeAll(function ()
    {
        captureFramePath = require.resolve('../../../src/gameobjects/captureframe/CaptureFrame');
        captureFrameCreatorPath = require.resolve('../../../src/gameobjects/captureframe/CaptureFrameCreator');
    });

    beforeEach(function ()
    {
        // Create a fresh mock constructor each test
        CaptureFrame = vi.fn(function (scene, key)
        {
            this.scene = scene;
            this.key = key;
            this.setDepth = vi.fn().mockReturnThis();
            this.setVisible = vi.fn().mockReturnThis();
        });

        // Inject mock into require cache
        require.cache[captureFramePath] = {
            id: captureFramePath,
            filename: captureFramePath,
            loaded: true,
            exports: CaptureFrame,
            parent: null,
            children: []
        };

        // Force CaptureFrameCreator to re-evaluate so it captures the mock CaptureFrame
        delete require.cache[captureFrameCreatorPath];

        GameObjectCreator = require('../../../src/gameobjects/GameObjectCreator');

        // register() guards against re-registration, so remove the method first
        delete GameObjectCreator.prototype.captureFrame;

        require('../../../src/gameobjects/captureframe/CaptureFrameCreator');

        mockDisplayList = { add: vi.fn() };
        mockScene = {
            sys: {
                displayList: mockDisplayList
            }
        };
        mockThis = {
            scene: mockScene
        };
    });

    afterEach(function ()
    {
        // Restore real module
        delete require.cache[captureFramePath];
        delete require.cache[captureFrameCreatorPath];
    });

    it('should register captureFrame on GameObjectCreator prototype', function ()
    {
        expect(typeof GameObjectCreator.prototype.captureFrame).toBe('function');
    });

    it('should return a CaptureFrame instance', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, {});

        expect(result).toBeInstanceOf(CaptureFrame);
    });

    it('should construct CaptureFrame with the scene context', function ()
    {
        GameObjectCreator.prototype.captureFrame.call(mockThis, {});

        expect(CaptureFrame.mock.calls[0][0]).toBe(mockScene);
    });

    it('should use null as the default key', function ()
    {
        GameObjectCreator.prototype.captureFrame.call(mockThis, {});

        expect(CaptureFrame).toHaveBeenCalledWith(mockScene, null);
    });

    it('should pass the key from config to CaptureFrame', function ()
    {
        GameObjectCreator.prototype.captureFrame.call(mockThis, { key: 'myTexture' });

        expect(CaptureFrame).toHaveBeenCalledWith(mockScene, 'myTexture');
    });

    it('should set depth to 0 by default', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, {});

        expect(result.setDepth).toHaveBeenCalledWith(0);
    });

    it('should set depth from config', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, { depth: 5 });

        expect(result.setDepth).toHaveBeenCalledWith(5);
    });

    it('should set depth to a negative value from config', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, { depth: -10 });

        expect(result.setDepth).toHaveBeenCalledWith(-10);
    });

    it('should set visible to true by default', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, {});

        expect(result.setVisible).toHaveBeenCalledWith(true);
    });

    it('should set visible to false when config specifies false', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, { visible: false });

        expect(result.setVisible).toHaveBeenCalledWith(false);
    });

    it('should not add to display list when config.add is not set', function ()
    {
        GameObjectCreator.prototype.captureFrame.call(mockThis, {});

        expect(mockDisplayList.add).not.toHaveBeenCalled();
    });

    it('should add to display list when config.add is true', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, { add: true });

        expect(mockDisplayList.add).toHaveBeenCalledWith(result);
    });

    it('should not add to display list when config.add is false', function ()
    {
        GameObjectCreator.prototype.captureFrame.call(mockThis, { add: false });

        expect(mockDisplayList.add).not.toHaveBeenCalled();
    });

    it('should override config.add with addToScene parameter when addToScene is true', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, { add: false }, true);

        expect(mockDisplayList.add).toHaveBeenCalledWith(result);
    });

    it('should override config.add with addToScene parameter when addToScene is false', function ()
    {
        GameObjectCreator.prototype.captureFrame.call(mockThis, { add: true }, false);

        expect(mockDisplayList.add).not.toHaveBeenCalled();
    });

    it('should not override config.add when addToScene is undefined', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, { add: true }, undefined);

        expect(mockDisplayList.add).toHaveBeenCalledWith(result);
    });

    it('should handle undefined config by applying all defaults', function ()
    {
        var result = GameObjectCreator.prototype.captureFrame.call(mockThis, undefined);

        expect(CaptureFrame).toHaveBeenCalledWith(mockScene, null);
        expect(result.setDepth).toHaveBeenCalledWith(0);
        expect(result.setVisible).toHaveBeenCalledWith(true);
        expect(mockDisplayList.add).not.toHaveBeenCalled();
    });

    it('should call setDepth before setVisible via method chaining', function ()
    {
        var callOrder = [];

        // Re-inject a mock with call-order tracking
        CaptureFrame = vi.fn(function (scene, key)
        {
            this.scene = scene;
            this.key = key;
            this.setDepth = vi.fn(function ()
            {
                callOrder.push('setDepth');
                return this;
            });
            this.setVisible = vi.fn(function ()
            {
                callOrder.push('setVisible');
                return this;
            });
        });

        require.cache[captureFramePath].exports = CaptureFrame;
        delete require.cache[captureFrameCreatorPath];
        delete GameObjectCreator.prototype.captureFrame;
        require('../../../src/gameobjects/captureframe/CaptureFrameCreator');

        GameObjectCreator.prototype.captureFrame.call(mockThis, { depth: 3, visible: false });

        expect(callOrder).toEqual([ 'setDepth', 'setVisible' ]);
    });
});
