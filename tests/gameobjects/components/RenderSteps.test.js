var RenderSteps = require('../../../src/gameobjects/components/RenderSteps');

describe('RenderSteps', function ()
{
    var gameObject;

    beforeEach(function ()
    {
        gameObject = Object.assign({}, RenderSteps, {
            _renderSteps: null
        });
    });

    describe('module', function ()
    {
        it('should be importable', function ()
        {
            expect(RenderSteps).toBeDefined();
        });

        it('should export an object', function ()
        {
            expect(typeof RenderSteps).toBe('object');
        });

        it('should have renderWebGLStep method', function ()
        {
            expect(typeof RenderSteps.renderWebGLStep).toBe('function');
        });

        it('should have addRenderStep method', function ()
        {
            expect(typeof RenderSteps.addRenderStep).toBe('function');
        });
    });

    describe('addRenderStep', function ()
    {
        it('should initialise _renderSteps if null', function ()
        {
            var fn = function () {};
            gameObject.addRenderStep(fn);
            expect(Array.isArray(gameObject._renderSteps)).toBe(true);
        });

        it('should append the function when no index is given', function ()
        {
            var fn1 = function () {};
            var fn2 = function () {};
            gameObject.addRenderStep(fn1);
            gameObject.addRenderStep(fn2);
            expect(gameObject._renderSteps[0]).toBe(fn1);
            expect(gameObject._renderSteps[1]).toBe(fn2);
        });

        it('should insert the function at the given index', function ()
        {
            var fn1 = function () {};
            var fn2 = function () {};
            var fn3 = function () {};
            gameObject.addRenderStep(fn1);
            gameObject.addRenderStep(fn2);
            gameObject.addRenderStep(fn3, 1);
            expect(gameObject._renderSteps[0]).toBe(fn1);
            expect(gameObject._renderSteps[1]).toBe(fn3);
            expect(gameObject._renderSteps[2]).toBe(fn2);
        });

        it('should insert at index 0', function ()
        {
            var fn1 = function () {};
            var fn2 = function () {};
            gameObject.addRenderStep(fn1);
            gameObject.addRenderStep(fn2, 0);
            expect(gameObject._renderSteps[0]).toBe(fn2);
            expect(gameObject._renderSteps[1]).toBe(fn1);
        });

        it('should return this for chaining', function ()
        {
            var fn = function () {};
            var result = gameObject.addRenderStep(fn);
            expect(result).toBe(gameObject);
        });

        it('should chain multiple addRenderStep calls', function ()
        {
            var fn1 = function () {};
            var fn2 = function () {};
            gameObject.addRenderStep(fn1).addRenderStep(fn2);
            expect(gameObject._renderSteps.length).toBe(2);
        });

        it('should work when _renderSteps already has entries', function ()
        {
            gameObject._renderSteps = [];
            var fn = function () {};
            gameObject.addRenderStep(fn);
            expect(gameObject._renderSteps.length).toBe(1);
            expect(gameObject._renderSteps[0]).toBe(fn);
        });
    });

    describe('renderWebGLStep', function ()
    {
        it('should call the function at renderStep index 0 by default', function ()
        {
            var called = false;
            var fn = function (r, go, dc, pm, rs, dl, dli)
            {
                called = true;
            };
            gameObject._renderSteps = [ fn ];
            gameObject.renderWebGLStep({}, gameObject, {});
            expect(called).toBe(true);
        });

        it('should default renderStep to 0 when undefined', function ()
        {
            var receivedStep = -1;
            var fn = function (r, go, dc, pm, rs)
            {
                receivedStep = rs;
            };
            gameObject._renderSteps = [ fn ];
            gameObject.renderWebGLStep({}, gameObject, {}, null, undefined);
            expect(receivedStep).toBe(0);
        });

        it('should call the function at the specified renderStep index', function ()
        {
            var calledIndex = -1;
            var fn0 = function (r, go, dc, pm, rs)
            {
                calledIndex = 0;
            };
            var fn1 = function (r, go, dc, pm, rs)
            {
                calledIndex = 1;
            };
            gameObject._renderSteps = [ fn0, fn1 ];
            gameObject.renderWebGLStep({}, gameObject, {}, null, 1);
            expect(calledIndex).toBe(1);
        });

        it('should do nothing if no function exists at the renderStep index', function ()
        {
            gameObject._renderSteps = [];
            expect(function ()
            {
                gameObject.renderWebGLStep({}, gameObject, {}, null, 0);
            }).not.toThrow();
        });

        it('should create a displayList containing gameObject when none is provided', function ()
        {
            var receivedList = null;
            var receivedIndex = -1;
            var fn = function (r, go, dc, pm, rs, dl, dli)
            {
                receivedList = dl;
                receivedIndex = dli;
            };
            gameObject._renderSteps = [ fn ];
            gameObject.renderWebGLStep({}, gameObject, {});
            expect(Array.isArray(receivedList)).toBe(true);
            expect(receivedList[0]).toBe(gameObject);
            expect(receivedIndex).toBe(0);
        });

        it('should use the provided displayList', function ()
        {
            var receivedList = null;
            var fn = function (r, go, dc, pm, rs, dl)
            {
                receivedList = dl;
            };
            var customList = [ {}, gameObject, {} ];
            gameObject._renderSteps = [ fn ];
            gameObject.renderWebGLStep({}, gameObject, {}, null, 0, customList, 1);
            expect(receivedList).toBe(customList);
        });

        it('should default displayListIndex to 0 when displayList is provided but index is undefined', function ()
        {
            var receivedIndex = -1;
            var fn = function (r, go, dc, pm, rs, dl, dli)
            {
                receivedIndex = dli;
            };
            var customList = [ gameObject ];
            gameObject._renderSteps = [ fn ];
            gameObject.renderWebGLStep({}, gameObject, {}, null, 0, customList, undefined);
            expect(receivedIndex).toBe(0);
        });

        it('should pass renderer, gameObject, drawingContext and parentMatrix to the step function', function ()
        {
            var renderer = { id: 'renderer' };
            var drawingContext = { id: 'ctx' };
            var parentMatrix = { id: 'matrix' };
            var args = null;
            var fn = function (r, go, dc, pm)
            {
                args = { r: r, go: go, dc: dc, pm: pm };
            };
            gameObject._renderSteps = [ fn ];
            gameObject.renderWebGLStep(renderer, gameObject, drawingContext, parentMatrix, 0);
            expect(args.r).toBe(renderer);
            expect(args.go).toBe(gameObject);
            expect(args.dc).toBe(drawingContext);
            expect(args.pm).toBe(parentMatrix);
        });

        it('should return undefined (no explicit return value)', function ()
        {
            var fn = function () {};
            gameObject._renderSteps = [ fn ];
            var result = gameObject.renderWebGLStep({}, gameObject, {});
            expect(result).toBeUndefined();
        });
    });
});
