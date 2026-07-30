var YieldContext = require('../../../../src/renderer/webgl/renderNodes/YieldContext');

function createMockManager ()
{
    var blendMode = { src: 1, dst: 0 };

    return {
        renderer: {
            blendModes: [ blendMode ],
            glWrapper: {
                update: vi.fn()
            },
            glTextureUnits: {
                unbindAllUnits: vi.fn()
            }
        },
        startStandAloneRender: vi.fn()
    };
}

describe('YieldContext', function ()
{
    var manager;
    var node;

    beforeEach(function ()
    {
        manager = createMockManager();
        node = new YieldContext(manager);
    });

    describe('constructor', function ()
    {
        it('should set the name to YieldContext', function ()
        {
            expect(node.name).toBe('YieldContext');
        });

        it('should assign the manager', function ()
        {
            expect(node.manager).toBe(manager);
        });

        it('should initialise _state with the first blend mode', function ()
        {
            expect(node._state.blend).toBe(manager.renderer.blendModes[0]);
        });

        it('should initialise _state.vao to null', function ()
        {
            expect(node._state.vao).toBeNull();
        });

        it('should not set _run by default', function ()
        {
            expect(node._run).toBeNull();
        });
    });

    describe('run', function ()
    {
        var displayContext;

        beforeEach(function ()
        {
            displayContext = {};
            vi.spyOn(node, 'onRunBegin');
            vi.spyOn(node, 'onRunEnd');
        });

        it('should call onRunBegin with the display context', function ()
        {
            node.run(displayContext);

            expect(node.onRunBegin).toHaveBeenCalledWith(displayContext);
        });

        it('should call manager.startStandAloneRender', function ()
        {
            node.run(displayContext);

            expect(manager.startStandAloneRender).toHaveBeenCalledOnce();
        });

        it('should call renderer.glWrapper.update with the node state', function ()
        {
            node.run(displayContext);

            expect(manager.renderer.glWrapper.update).toHaveBeenCalledWith(node._state);
        });

        it('should call renderer.glTextureUnits.unbindAllUnits', function ()
        {
            node.run(displayContext);

            expect(manager.renderer.glTextureUnits.unbindAllUnits).toHaveBeenCalledOnce();
        });

        it('should call onRunEnd with the display context', function ()
        {
            node.run(displayContext);

            expect(node.onRunEnd).toHaveBeenCalledWith(displayContext);
        });

        it('should call onRunBegin before startStandAloneRender', function ()
        {
            var callOrder = [];

            node.onRunBegin = vi.fn(function () { callOrder.push('onRunBegin'); });
            manager.startStandAloneRender = vi.fn(function () { callOrder.push('startStandAloneRender'); });

            node.run(displayContext);

            expect(callOrder[0]).toBe('onRunBegin');
            expect(callOrder[1]).toBe('startStandAloneRender');
        });

        it('should call onRunEnd after unbindAllUnits', function ()
        {
            var callOrder = [];

            manager.renderer.glTextureUnits.unbindAllUnits = vi.fn(function () { callOrder.push('unbindAllUnits'); });
            node.onRunEnd = vi.fn(function () { callOrder.push('onRunEnd'); });

            node.run(displayContext);

            expect(callOrder[0]).toBe('unbindAllUnits');
            expect(callOrder[1]).toBe('onRunEnd');
        });

        it('should work with different display context objects', function ()
        {
            var ctx1 = { id: 1 };
            var ctx2 = { id: 2 };

            node.run(ctx1);
            node.run(ctx2);

            expect(manager.startStandAloneRender).toHaveBeenCalledTimes(2);
            expect(manager.renderer.glTextureUnits.unbindAllUnits).toHaveBeenCalledTimes(2);
        });
    });
});
