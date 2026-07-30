var RenderNode = require('../../../../src/renderer/webgl/renderNodes/RenderNode');

describe('RenderNode', function ()
{
    var mockManager;

    beforeEach(function ()
    {
        mockManager = {
            pushDebug: vi.fn(),
            popDebug: vi.fn()
        };
    });

    describe('constructor', function ()
    {
        it('should set the name property', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(node.name).toBe('TestNode');
        });

        it('should set the manager property', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(node.manager).toBe(mockManager);
        });

        it('should initialise _run to null', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(node._run).toBeNull();
        });

        it('should accept any string as name', function ()
        {
            var node = new RenderNode('', mockManager);
            expect(node.name).toBe('');
        });

        it('should accept different manager instances', function ()
        {
            var anotherManager = { pushDebug: vi.fn(), popDebug: vi.fn() };
            var node = new RenderNode('NodeA', anotherManager);
            expect(node.manager).toBe(anotherManager);
        });
    });

    describe('run', function ()
    {
        it('should be a function', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(typeof node.run).toBe('function');
        });

        it('should return undefined by default', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var result = node.run();
            expect(result).toBeUndefined();
        });

        it('should return undefined when called with arguments', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var result = node.run(1, 2, 3);
            expect(result).toBeUndefined();
        });
    });

    describe('onRunBegin', function ()
    {
        it('should be a function', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(typeof node.onRunBegin).toBe('function');
        });

        it('should return undefined', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var result = node.onRunBegin({});
            expect(result).toBeUndefined();
        });

        it('should not throw when called with no arguments', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(function () { node.onRunBegin(); }).not.toThrow();
        });

        it('should not throw when called with a drawing context', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var ctx = { gl: {}, camera: {} };
            expect(function () { node.onRunBegin(ctx); }).not.toThrow();
        });
    });

    describe('onRunEnd', function ()
    {
        it('should be a function', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(typeof node.onRunEnd).toBe('function');
        });

        it('should return undefined', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var result = node.onRunEnd({});
            expect(result).toBeUndefined();
        });

        it('should not throw when called with no arguments', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            expect(function () { node.onRunEnd(); }).not.toThrow();
        });

        it('should not throw when called with a drawing context', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var ctx = { gl: {}, camera: {} };
            expect(function () { node.onRunEnd(ctx); }).not.toThrow();
        });
    });

    describe('setDebug', function ()
    {
        it('should replace run with a wrapper when debug is true', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var originalRun = node.run;
            node.setDebug(true);
            expect(node.run).not.toBe(originalRun);
        });

        it('should store the original run in _run when debug is true', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var originalRun = node.run;
            node.setDebug(true);
            expect(node._run).toBe(originalRun);
        });

        it('should call manager.pushDebug with the node name when debug run is called', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            node.setDebug(true);
            node.run();
            expect(mockManager.pushDebug).toHaveBeenCalledWith('TestNode');
        });

        it('should call manager.popDebug after the original run when debug is enabled', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            node.setDebug(true);
            node.run();
            expect(mockManager.popDebug).toHaveBeenCalled();
        });

        it('should call pushDebug before popDebug', function ()
        {
            var callOrder = [];
            mockManager.pushDebug = vi.fn(function () { callOrder.push('push'); });
            mockManager.popDebug = vi.fn(function () { callOrder.push('pop'); });
            var node = new RenderNode('TestNode', mockManager);
            node.setDebug(true);
            node.run();
            expect(callOrder[0]).toBe('push');
            expect(callOrder[1]).toBe('pop');
        });

        it('should invoke the original run method during debug execution', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var runCalled = false;
            node.run = function () { runCalled = true; };
            node.setDebug(true);
            node.run();
            expect(runCalled).toBe(true);
        });

        it('should pass arguments through to the original run method', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var receivedArgs;
            node.run = function () { receivedArgs = Array.prototype.slice.call(arguments); };
            node.setDebug(true);
            node.run('a', 42, true);
            expect(receivedArgs[0]).toBe('a');
            expect(receivedArgs[1]).toBe(42);
            expect(receivedArgs[2]).toBe(true);
        });

        it('should return the value from the original run method', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            node.run = function () { return 99; };
            node.setDebug(true);
            var result = node.run();
            expect(result).toBe(99);
        });

        it('should restore the original run when debug is disabled', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            var originalRun = node.run;
            node.setDebug(true);
            node.setDebug(false);
            expect(node.run).toBe(originalRun);
        });

        it('should set _run to null when debug is disabled', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            node.setDebug(true);
            node.setDebug(false);
            expect(node._run).toBeNull();
        });

        it('should not call pushDebug or popDebug after debug is disabled', function ()
        {
            var node = new RenderNode('TestNode', mockManager);
            node.setDebug(true);
            node.setDebug(false);
            node.run();
            expect(mockManager.pushDebug).not.toHaveBeenCalled();
            expect(mockManager.popDebug).not.toHaveBeenCalled();
        });

        it('should use the correct node name when multiple nodes share a manager', function ()
        {
            var nodeA = new RenderNode('NodeA', mockManager);
            var nodeB = new RenderNode('NodeB', mockManager);
            nodeA.setDebug(true);
            nodeB.setDebug(true);
            nodeA.run();
            expect(mockManager.pushDebug).toHaveBeenCalledWith('NodeA');
            nodeB.run();
            expect(mockManager.pushDebug).toHaveBeenCalledWith('NodeB');
        });
    });
});
