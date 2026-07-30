var FillCamera = require('../../../../src/renderer/webgl/renderNodes/FillCamera');

describe('FillCamera', function ()
{
    var manager;
    var fillRectNode;

    beforeEach(function ()
    {
        fillRectNode = {
            run: vi.fn()
        };

        manager = {
            getNode: vi.fn(function (name)
            {
                if (name === 'FillRect')
                {
                    return fillRectNode;
                }
                return null;
            })
        };
    });

    describe('constructor', function ()
    {
        it('should set the name to FillCamera', function ()
        {
            var node = new FillCamera(manager);
            expect(node.name).toBe('FillCamera');
        });

        it('should store the manager reference', function ()
        {
            var node = new FillCamera(manager);
            expect(node.manager).toBe(manager);
        });

        it('should retrieve the FillRect node from the manager', function ()
        {
            var node = new FillCamera(manager);
            expect(manager.getNode).toHaveBeenCalledWith('FillRect');
        });

        it('should assign the FillRect node to fillRectNode', function ()
        {
            var node = new FillCamera(manager);
            expect(node.fillRectNode).toBe(fillRectNode);
        });
    });

    describe('run', function ()
    {
        var node;
        var drawingContext;
        var camera;

        beforeEach(function ()
        {
            node = new FillCamera(manager);

            node.onRunBegin = vi.fn();
            node.onRunEnd = vi.fn();

            camera = {
                x: 100,
                y: 200,
                width: 800,
                height: 600
            };

            drawingContext = {
                camera: camera
            };
        });

        it('should call onRunBegin with the drawing context', function ()
        {
            node.run(drawingContext, 0xffffff);
            expect(node.onRunBegin).toHaveBeenCalledWith(drawingContext);
        });

        it('should call onRunEnd with the drawing context', function ()
        {
            node.run(drawingContext, 0xffffff);
            expect(node.onRunEnd).toHaveBeenCalledWith(drawingContext);
        });

        it('should call fillRectNode.run with camera position when not a framebuffer camera', function ()
        {
            node.run(drawingContext, 0xff0000, false);
            expect(fillRectNode.run).toHaveBeenCalledWith(
                drawingContext, null, null,
                100, 200, 800, 600,
                0xff0000, 0xff0000, 0xff0000, 0xff0000
            );
        });

        it('should call fillRectNode.run with zero position when isFramebufferCamera is true', function ()
        {
            node.run(drawingContext, 0xff0000, true);
            expect(fillRectNode.run).toHaveBeenCalledWith(
                drawingContext, null, null,
                0, 0, 800, 600,
                0xff0000, 0xff0000, 0xff0000, 0xff0000
            );
        });

        it('should default to using camera position when isFramebufferCamera is undefined', function ()
        {
            node.run(drawingContext, 0xaabbcc);
            expect(fillRectNode.run).toHaveBeenCalledWith(
                drawingContext, null, null,
                100, 200, 800, 600,
                0xaabbcc, 0xaabbcc, 0xaabbcc, 0xaabbcc
            );
        });

        it('should pass the same color value for all four color arguments', function ()
        {
            var color = 0x112233;
            node.run(drawingContext, color, false);
            var args = fillRectNode.run.mock.calls[0];
            expect(args[7]).toBe(color);
            expect(args[8]).toBe(color);
            expect(args[9]).toBe(color);
            expect(args[10]).toBe(color);
        });

        it('should use camera width and height regardless of framebuffer mode', function ()
        {
            camera.width = 1024;
            camera.height = 768;

            node.run(drawingContext, 0xffffff, true);
            var argsFramebuffer = fillRectNode.run.mock.calls[0];
            expect(argsFramebuffer[5]).toBe(1024);
            expect(argsFramebuffer[6]).toBe(768);

            fillRectNode.run.mockClear();

            node.run(drawingContext, 0xffffff, false);
            var argsNormal = fillRectNode.run.mock.calls[0];
            expect(argsNormal[5]).toBe(1024);
            expect(argsNormal[6]).toBe(768);
        });

        it('should pass null for the second and third arguments to fillRectNode.run', function ()
        {
            node.run(drawingContext, 0xffffff, false);
            var args = fillRectNode.run.mock.calls[0];
            expect(args[1]).toBeNull();
            expect(args[2]).toBeNull();
        });

        it('should handle a camera at position zero', function ()
        {
            camera.x = 0;
            camera.y = 0;
            node.run(drawingContext, 0xffffff, false);
            expect(fillRectNode.run).toHaveBeenCalledWith(
                drawingContext, null, null,
                0, 0, 800, 600,
                0xffffff, 0xffffff, 0xffffff, 0xffffff
            );
        });

        it('should handle negative camera positions', function ()
        {
            camera.x = -50;
            camera.y = -75;
            node.run(drawingContext, 0xffffff, false);
            expect(fillRectNode.run).toHaveBeenCalledWith(
                drawingContext, null, null,
                -50, -75, 800, 600,
                0xffffff, 0xffffff, 0xffffff, 0xffffff
            );
        });
    });
});
