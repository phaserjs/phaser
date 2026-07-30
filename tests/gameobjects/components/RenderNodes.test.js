var RenderNodes = require('../../../src/gameobjects/components/RenderNodes');

describe('RenderNodes', function ()
{
    var gameObject;
    var mockNode;
    var mockManager;
    var mockRenderer;

    beforeEach(function ()
    {
        mockNode = { name: 'MockNode' };

        mockManager = {
            getNode: function (name)
            {
                if (name === 'MockNode') { return mockNode; }
                return null;
            }
        };

        mockRenderer = {
            renderNodes: mockManager
        };

        gameObject = Object.assign({}, RenderNodes, {
            customRenderNodes: null,
            defaultRenderNodes: null,
            renderNodeData: null,
            scene: {
                sys: {
                    renderer: mockRenderer
                }
            }
        });
    });

    // --- Module shape ---

    describe('module', function ()
    {
        it('should export an object', function ()
        {
            expect(typeof RenderNodes).toBe('object');
        });

        it('should have customRenderNodes property defaulting to null', function ()
        {
            expect(RenderNodes.customRenderNodes).toBeNull();
        });

        it('should have defaultRenderNodes property defaulting to null', function ()
        {
            expect(RenderNodes.defaultRenderNodes).toBeNull();
        });

        it('should have renderNodeData property defaulting to null', function ()
        {
            expect(RenderNodes.renderNodeData).toBeNull();
        });

        it('should expose initRenderNodes as a function', function ()
        {
            expect(typeof RenderNodes.initRenderNodes).toBe('function');
        });

        it('should expose setRenderNodeRole as a function', function ()
        {
            expect(typeof RenderNodes.setRenderNodeRole).toBe('function');
        });

        it('should expose setRenderNodeData as a function', function ()
        {
            expect(typeof RenderNodes.setRenderNodeData).toBe('function');
        });
    });

    // --- initRenderNodes ---

    describe('initRenderNodes', function ()
    {
        it('should initialise customRenderNodes as empty object', function ()
        {
            gameObject.initRenderNodes(null);
            expect(typeof gameObject.customRenderNodes).toBe('object');
            expect(gameObject.customRenderNodes).not.toBeNull();
        });

        it('should initialise defaultRenderNodes as empty object', function ()
        {
            gameObject.initRenderNodes(null);
            expect(typeof gameObject.defaultRenderNodes).toBe('object');
            expect(gameObject.defaultRenderNodes).not.toBeNull();
        });

        it('should initialise renderNodeData as empty object', function ()
        {
            gameObject.initRenderNodes(null);
            expect(typeof gameObject.renderNodeData).toBe('object');
            expect(gameObject.renderNodeData).not.toBeNull();
        });

        it('should return early without populating defaultRenderNodes when renderer is missing', function ()
        {
            gameObject.scene.sys.renderer = null;
            var defaultNodes = { each: function (cb) { cb('Submitter', 'MockNode'); } };
            gameObject.initRenderNodes(defaultNodes);
            expect(Object.keys(gameObject.defaultRenderNodes).length).toBe(0);
        });

        it('should return early when renderNodes manager is missing', function ()
        {
            mockRenderer.renderNodes = null;
            var defaultNodes = { each: function (cb) { cb('Submitter', 'MockNode'); } };
            gameObject.initRenderNodes(defaultNodes);
            expect(Object.keys(gameObject.defaultRenderNodes).length).toBe(0);
        });

        it('should return early when defaultNodes argument is null', function ()
        {
            gameObject.initRenderNodes(null);
            expect(Object.keys(gameObject.defaultRenderNodes).length).toBe(0);
        });

        it('should populate defaultRenderNodes from the Map using getNode', function ()
        {
            var defaultNodes = {
                each: function (cb) { cb('Submitter', 'MockNode'); }
            };
            gameObject.initRenderNodes(defaultNodes);
            expect(gameObject.defaultRenderNodes['Submitter']).toBe(mockNode);
        });

        it('should populate multiple roles from the Map', function ()
        {
            var secondNode = { name: 'SecondNode' };
            mockManager.getNode = function (name)
            {
                if (name === 'MockNode') { return mockNode; }
                if (name === 'SecondNode') { return secondNode; }
                return null;
            };
            var defaultNodes = {
                each: function (cb)
                {
                    cb('Submitter', 'MockNode');
                    cb('Transformer', 'SecondNode');
                }
            };
            gameObject.initRenderNodes(defaultNodes);
            expect(gameObject.defaultRenderNodes['Submitter']).toBe(mockNode);
            expect(gameObject.defaultRenderNodes['Transformer']).toBe(secondNode);
        });
    });

    // --- setRenderNodeRole ---

    describe('setRenderNodeRole', function ()
    {
        beforeEach(function ()
        {
            gameObject.customRenderNodes = {};
            gameObject.defaultRenderNodes = {};
            gameObject.renderNodeData = {};
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setRenderNodeRole('Submitter', mockNode);
            expect(result).toBe(gameObject);
        });

        it('should return this when renderer is missing', function ()
        {
            gameObject.scene.sys.renderer = null;
            var result = gameObject.setRenderNodeRole('Submitter', mockNode);
            expect(result).toBe(gameObject);
        });

        it('should not modify nodes when renderer is missing', function ()
        {
            gameObject.scene.sys.renderer = null;
            gameObject.setRenderNodeRole('Submitter', mockNode);
            expect(gameObject.customRenderNodes['Submitter']).toBeUndefined();
        });

        it('should return this when renderNodes manager is missing', function ()
        {
            mockRenderer.renderNodes = null;
            var result = gameObject.setRenderNodeRole('Submitter', mockNode);
            expect(result).toBe(gameObject);
        });

        it('should set a render node instance directly by object', function ()
        {
            gameObject.setRenderNodeRole('Submitter', mockNode);
            expect(gameObject.customRenderNodes['Submitter']).toBe(mockNode);
        });

        it('should resolve a render node by string name', function ()
        {
            gameObject.setRenderNodeRole('Submitter', 'MockNode');
            expect(gameObject.customRenderNodes['Submitter']).toBe(mockNode);
        });

        it('should return this without changes when string resolves to no node', function ()
        {
            var result = gameObject.setRenderNodeRole('Submitter', 'NonExistentNode');
            expect(result).toBe(gameObject);
            expect(gameObject.customRenderNodes['Submitter']).toBeUndefined();
        });

        it('should store empty renderNodeData when none is provided', function ()
        {
            gameObject.setRenderNodeRole('Submitter', mockNode);
            expect(gameObject.renderNodeData['MockNode']).toBeDefined();
            expect(typeof gameObject.renderNodeData['MockNode']).toBe('object');
        });

        it('should assign renderNodeData by reference when copyData is false', function ()
        {
            var data = { alpha: 1 };
            gameObject.setRenderNodeRole('Submitter', mockNode, data, false);
            expect(gameObject.renderNodeData['MockNode']).toBe(data);
        });

        it('should deep copy renderNodeData when copyData is true', function ()
        {
            var data = { alpha: 1, nested: { x: 2 } };
            gameObject.setRenderNodeRole('Submitter', mockNode, data, true);
            var stored = gameObject.renderNodeData['MockNode'];
            expect(stored).not.toBe(data);
            expect(stored.alpha).toBe(1);
            expect(stored.nested.x).toBe(2);
            expect(stored.nested).not.toBe(data.nested);
        });

        it('should remove the node when renderNode is null', function ()
        {
            gameObject.customRenderNodes['Submitter'] = mockNode;
            gameObject.renderNodeData['MockNode'] = { alpha: 1 };
            gameObject.setRenderNodeRole('Submitter', null);
            expect(gameObject.customRenderNodes['Submitter']).toBeUndefined();
        });

        it('should remove renderNodeData when renderNode is null', function ()
        {
            gameObject.customRenderNodes['Submitter'] = mockNode;
            gameObject.renderNodeData['MockNode'] = { alpha: 1 };
            gameObject.setRenderNodeRole('Submitter', null);
            expect(gameObject.renderNodeData['MockNode']).toBeUndefined();
        });

        it('should do nothing silently when removing a role that was never set', function ()
        {
            expect(function ()
            {
                gameObject.setRenderNodeRole('NonExistent', null);
            }).not.toThrow();
        });

        it('should return this when removing a role that was never set', function ()
        {
            var result = gameObject.setRenderNodeRole('NonExistent', null);
            expect(result).toBe(gameObject);
        });
    });

    // --- setRenderNodeData ---

    describe('setRenderNodeData', function ()
    {
        beforeEach(function ()
        {
            gameObject.customRenderNodes = {};
            gameObject.defaultRenderNodes = {};
            gameObject.renderNodeData = {
                MockNode: {}
            };
        });

        it('should return this for chaining', function ()
        {
            var result = gameObject.setRenderNodeData('MockNode', 'alpha', 1);
            expect(result).toBe(gameObject);
        });

        it('should set a property on the data object when given a string node name', function ()
        {
            gameObject.setRenderNodeData('MockNode', 'alpha', 0.5);
            expect(gameObject.renderNodeData['MockNode']['alpha']).toBe(0.5);
        });

        it('should resolve node name from an object with a name property', function ()
        {
            gameObject.setRenderNodeData(mockNode, 'tint', 0xff0000);
            expect(gameObject.renderNodeData['MockNode']['tint']).toBe(0xff0000);
        });

        it('should update an existing property', function ()
        {
            gameObject.renderNodeData['MockNode']['alpha'] = 0.5;
            gameObject.setRenderNodeData('MockNode', 'alpha', 1);
            expect(gameObject.renderNodeData['MockNode']['alpha']).toBe(1);
        });

        it('should delete the key when value is undefined', function ()
        {
            gameObject.renderNodeData['MockNode']['alpha'] = 0.5;
            gameObject.setRenderNodeData('MockNode', 'alpha', undefined);
            expect(gameObject.renderNodeData['MockNode'].hasOwnProperty('alpha')).toBe(false);
        });

        it('should set a boolean value correctly', function ()
        {
            gameObject.setRenderNodeData('MockNode', 'enabled', false);
            expect(gameObject.renderNodeData['MockNode']['enabled']).toBe(false);
        });

        it('should set a null value correctly', function ()
        {
            gameObject.setRenderNodeData('MockNode', 'texture', null);
            expect(gameObject.renderNodeData['MockNode']['texture']).toBeNull();
        });

        it('should set an object value correctly', function ()
        {
            var obj = { x: 1, y: 2 };
            gameObject.setRenderNodeData('MockNode', 'offset', obj);
            expect(gameObject.renderNodeData['MockNode']['offset']).toBe(obj);
        });

        it('should set a zero value correctly and not treat it as falsy removal', function ()
        {
            gameObject.setRenderNodeData('MockNode', 'count', 0);
            expect(gameObject.renderNodeData['MockNode']['count']).toBe(0);
        });
    });
});
