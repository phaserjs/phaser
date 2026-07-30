var FillRect = require('../../../../src/renderer/webgl/renderNodes/FillRect');

describe('FillRect', function ()
{
    var mockManager;
    var mockBatchHandler;

    beforeEach(function ()
    {
        mockBatchHandler = {
            batch: vi.fn()
        };

        mockManager = {
            getNode: function (name)
            {
                if (name === 'BatchHandlerTriFlat')
                {
                    return mockBatchHandler;
                }
                return null;
            }
        };
    });

    describe('constructor', function ()
    {
        it('should set the name to FillRect', function ()
        {
            var node = new FillRect(mockManager);
            expect(node.name).toBe('FillRect');
        });

        it('should store the manager reference', function ()
        {
            var node = new FillRect(mockManager);
            expect(node.manager).toBe(mockManager);
        });

        it('should retrieve and store the BatchHandlerTriFlat node', function ()
        {
            var node = new FillRect(mockManager);
            expect(node._batchHandlerDefault).toBe(mockBatchHandler);
        });

        it('should create an identity matrix', function ()
        {
            var node = new FillRect(mockManager);
            expect(node._identityMatrix).toBeDefined();
            expect(typeof node._identityMatrix.setQuad).toBe('function');
        });

        it('should initialise _indexedTriangles to [0,1,2,2,3,0]', function ()
        {
            var node = new FillRect(mockManager);
            expect(node._indexedTriangles).toEqual([0, 1, 2, 2, 3, 0]);
        });
    });

    describe('run', function ()
    {
        var node;
        var mockDrawingContext;
        var mockMatrix;
        var mockSubmitter;

        beforeEach(function ()
        {
            node = new FillRect(mockManager);

            mockDrawingContext = {};

            mockMatrix = {
                setQuad: vi.fn(function ()
                {
                    return new Float32Array(8);
                })
            };

            mockSubmitter = {
                batch: vi.fn()
            };
        });

        it('should call submitterNode.batch once per call', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 0, 0, 100, 50, 0xff0000, 0x00ff00, 0x0000ff, 0xffffff, false);
            expect(mockSubmitter.batch).toHaveBeenCalledTimes(1);
        });

        it('should pass drawingContext as first argument to batch', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 0, 0, 100, 50, 0xff0000, 0x00ff00, 0x0000ff, 0xffffff, false);
            var args = mockSubmitter.batch.mock.calls[0];
            expect(args[0]).toBe(mockDrawingContext);
        });

        it('should pass _indexedTriangles as second argument to batch', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 0, 0, 100, 50, 0xff0000, 0x00ff00, 0x0000ff, 0xffffff, false);
            var args = mockSubmitter.batch.mock.calls[0];
            expect(args[1]).toBe(node._indexedTriangles);
        });

        it('should pass tint colors in TL/BL/BR/TR order to batch', function ()
        {
            var tintTL = 0x11111111;
            var tintTR = 0x22222222;
            var tintBL = 0x33333333;
            var tintBR = 0x44444444;
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 0, 0, 100, 50, tintTL, tintTR, tintBL, tintBR, false);
            var args = mockSubmitter.batch.mock.calls[0];
            expect(args[3]).toEqual([tintTL, tintBL, tintBR, tintTR]);
        });

        it('should pass the lighting flag to batch', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 0, 0, 100, 50, 0, 0, 0, 0, true);
            var args = mockSubmitter.batch.mock.calls[0];
            expect(args[4]).toBe(true);
        });

        it('should use the identity matrix when currentMatrix is null', function ()
        {
            vi.spyOn(node._identityMatrix, 'setQuad');
            node.run(mockDrawingContext, null, mockSubmitter, 10, 20, 100, 50, 0, 0, 0, 0, false);
            expect(node._identityMatrix.setQuad).toHaveBeenCalled();
        });

        it('should use the identity matrix when currentMatrix is undefined', function ()
        {
            vi.spyOn(node._identityMatrix, 'setQuad');
            node.run(mockDrawingContext, undefined, mockSubmitter, 10, 20, 100, 50, 0, 0, 0, 0, false);
            expect(node._identityMatrix.setQuad).toHaveBeenCalled();
        });

        it('should use the provided currentMatrix when given', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 10, 20, 100, 50, 0, 0, 0, 0, false);
            expect(mockMatrix.setQuad).toHaveBeenCalled();
        });

        it('should use the default batch handler when submitterNode is null', function ()
        {
            node.run(mockDrawingContext, mockMatrix, null, 0, 0, 100, 50, 0, 0, 0, 0, false);
            expect(mockBatchHandler.batch).toHaveBeenCalledTimes(1);
        });

        it('should use the default batch handler when submitterNode is undefined', function ()
        {
            node.run(mockDrawingContext, mockMatrix, undefined, 0, 0, 100, 50, 0, 0, 0, 0, false);
            expect(mockBatchHandler.batch).toHaveBeenCalledTimes(1);
        });

        it('should call setQuad with x, y, x+width, y+height', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 10, 20, 100, 50, 0, 0, 0, 0, false);
            expect(mockMatrix.setQuad).toHaveBeenCalledWith(10, 20, 110, 70);
        });

        it('should call setQuad with zero-sized rectangle', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 5, 5, 0, 0, 0, 0, 0, 0, false);
            expect(mockMatrix.setQuad).toHaveBeenCalledWith(5, 5, 5, 5);
        });

        it('should call setQuad with negative coordinates', function ()
        {
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, -50, -30, 100, 60, 0, 0, 0, 0, false);
            expect(mockMatrix.setQuad).toHaveBeenCalledWith(-50, -30, 50, 30);
        });

        it('should pass quad result from setQuad as third argument to batch', function ()
        {
            var fakeQuad = new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]);
            mockMatrix.setQuad.mockReturnValue(fakeQuad);
            node.run(mockDrawingContext, mockMatrix, mockSubmitter, 0, 0, 100, 50, 0, 0, 0, 0, false);
            var args = mockSubmitter.batch.mock.calls[0];
            expect(args[2]).toBe(fakeQuad);
        });
    });
});
