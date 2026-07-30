var Extern = require('../../../src/gameobjects/extern/Extern');

describe('Extern', function ()
{
    var mockScene;
    var extern;

    beforeEach(function ()
    {
        mockScene = {
            sys: {
                queueDepthSort: function () {},
                updateList: {
                    add: vi.fn(),
                    remove: vi.fn()
                }
            }
        };

        extern = new Extern(mockScene);
    });

    describe('constructor', function ()
    {
        it('should set the type to Extern', function ()
        {
            expect(extern.type).toBe('Extern');
        });

        it('should store a reference to the scene', function ()
        {
            expect(extern.scene).toBe(mockScene);
        });

        it('should be active by default', function ()
        {
            expect(extern.active).toBe(true);
        });

        it('should have renderFlags set to 15', function ()
        {
            expect(extern.renderFlags).toBe(15);
        });

        it('should have ignoreDestroy set to false', function ()
        {
            expect(extern.ignoreDestroy).toBe(false);
        });

        it('should have isDestroyed set to false', function ()
        {
            expect(extern.isDestroyed).toBe(false);
        });
    });

    describe('addedToScene', function ()
    {
        it('should add the extern to the scene update list', function ()
        {
            mockScene.sys.updateList.add.mockClear();
            extern.addedToScene();
            expect(mockScene.sys.updateList.add).toHaveBeenCalledWith(extern);
        });

        it('should call add exactly once', function ()
        {
            mockScene.sys.updateList.add.mockClear();
            extern.addedToScene();
            expect(mockScene.sys.updateList.add).toHaveBeenCalledTimes(1);
        });
    });

    describe('removedFromScene', function ()
    {
        it('should remove the extern from the scene update list', function ()
        {
            mockScene.sys.updateList.remove.mockClear();
            extern.removedFromScene();
            expect(mockScene.sys.updateList.remove).toHaveBeenCalledWith(extern);
        });

        it('should call remove exactly once', function ()
        {
            mockScene.sys.updateList.remove.mockClear();
            extern.removedFromScene();
            expect(mockScene.sys.updateList.remove).toHaveBeenCalledTimes(1);
        });
    });

    describe('preUpdate', function ()
    {
        it('should be a function', function ()
        {
            expect(typeof extern.preUpdate).toBe('function');
        });

        it('should return undefined', function ()
        {
            expect(extern.preUpdate(1000, 16)).toBeUndefined();
        });

        it('should do nothing by default when called with time and delta', function ()
        {
            expect(function ()
            {
                extern.preUpdate(0, 0);
                extern.preUpdate(1000, 16.6);
                extern.preUpdate(-1, -1);
            }).not.toThrow();
        });

        it('should be overridable', function ()
        {
            var called = false;
            extern.preUpdate = function ()
            {
                called = true;
            };
            extern.preUpdate(0, 16);
            expect(called).toBe(true);
        });
    });

    describe('render', function ()
    {
        it('should be a function', function ()
        {
            expect(typeof extern.render).toBe('function');
        });

        it('should return undefined', function ()
        {
            expect(extern.render()).toBeUndefined();
        });

        it('should do nothing by default when called with arguments', function ()
        {
            var mockRenderer = {};
            var mockContext = {};
            var mockMatrix = {};
            var mockList = [];

            expect(function ()
            {
                extern.render(mockRenderer, mockContext, mockMatrix, mockList, 0);
            }).not.toThrow();
        });

        it('should be overridable', function ()
        {
            var receivedArgs = null;
            extern.render = function (renderer, drawingContext, calcMatrix, displayList, displayListIndex)
            {
                receivedArgs = { renderer: renderer, drawingContext: drawingContext, calcMatrix: calcMatrix, displayList: displayList, displayListIndex: displayListIndex };
            };

            var mockRenderer = { id: 'renderer' };
            var mockContext = { id: 'context' };
            var mockMatrix = { id: 'matrix' };
            var mockList = [ {}, {} ];

            extern.render(mockRenderer, mockContext, mockMatrix, mockList, 1);

            expect(receivedArgs).not.toBeNull();
            expect(receivedArgs.renderer).toBe(mockRenderer);
            expect(receivedArgs.drawingContext).toBe(mockContext);
            expect(receivedArgs.calcMatrix).toBe(mockMatrix);
            expect(receivedArgs.displayList).toBe(mockList);
            expect(receivedArgs.displayListIndex).toBe(1);
        });
    });
});
