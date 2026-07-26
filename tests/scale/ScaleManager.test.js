var ScaleManager = require('../../src/scale/ScaleManager');

describe('ScaleManager', function ()
{
    var pageXOffsetDescriptor;
    var pageYOffsetDescriptor;
    var clientLeftDescriptor;
    var clientTopDescriptor;

    var setPageOffset = function (x, y)
    {
        Object.defineProperty(window, 'pageXOffset', { value: x, configurable: true });
        Object.defineProperty(window, 'pageYOffset', { value: y, configurable: true });
    };

    var setDocumentClientOffset = function (x, y)
    {
        Object.defineProperty(document.documentElement, 'clientLeft', { value: x, configurable: true });
        Object.defineProperty(document.documentElement, 'clientTop', { value: y, configurable: true });
    };

    var createScale = function (options)
    {
        var refreshCount = 0;
        var parentRect = options.parentRect || { width: 800, height: 600 };
        var canvasRect = options.canvasRect;

        var scale = {
            parent: {
                getBoundingClientRect: function ()
                {
                    return parentRect;
                }
            },
            parentSize: {
                width: 800,
                height: 600,
                setSize: function (width, height)
                {
                    this.width = width;
                    this.height = height;
                }
            },
            parentIsWindow: false,
            canvas: {
                getBoundingClientRect: function ()
                {
                    return canvasRect;
                }
            },
            canvasBounds: options.canvasBounds,
            dirty: false,
            _lastCheck: 0,
            resizeInterval: 500,
            getParentBounds: function ()
            {
                return ScaleManager.prototype.getParentBounds.call(this);
            },
            refresh: function ()
            {
                refreshCount++;

                ScaleManager.prototype.updateBounds.call(this);
            }
        };

        scale.getRefreshCount = function ()
        {
            return refreshCount;
        };

        return scale;
    };

    beforeEach(function ()
    {
        pageXOffsetDescriptor = Object.getOwnPropertyDescriptor(window, 'pageXOffset');
        pageYOffsetDescriptor = Object.getOwnPropertyDescriptor(window, 'pageYOffset');
        clientLeftDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'clientLeft');
        clientTopDescriptor = Object.getOwnPropertyDescriptor(document.documentElement, 'clientTop');

        setDocumentClientOffset(0, 0);
    });

    afterEach(function ()
    {
        if (pageXOffsetDescriptor)
        {
            Object.defineProperty(window, 'pageXOffset', pageXOffsetDescriptor);
        }
        else
        {
            delete window.pageXOffset;
        }

        if (pageYOffsetDescriptor)
        {
            Object.defineProperty(window, 'pageYOffset', pageYOffsetDescriptor);
        }
        else
        {
            delete window.pageYOffset;
        }

        if (clientLeftDescriptor)
        {
            Object.defineProperty(document.documentElement, 'clientLeft', clientLeftDescriptor);
        }
        else
        {
            delete document.documentElement.clientLeft;
        }

        if (clientTopDescriptor)
        {
            Object.defineProperty(document.documentElement, 'clientTop', clientTopDescriptor);
        }
        else
        {
            delete document.documentElement.clientTop;
        }
    });

    it('does not refresh repeatedly after horizontal scrolling', function ()
    {
        setPageOffset(0, 0);

        var canvasRect = { x: 40, y: 120, left: 40, top: 120, width: 640, height: 360 };
        var scale = createScale({
            canvasRect: canvasRect,
            canvasBounds: { x: 40, y: 120, width: 640, height: 360 }
        });

        ScaleManager.prototype.step.call(scale, 501, 501);

        setPageOffset(25, 0);
        canvasRect.x = 15;
        canvasRect.left = 15;

        ScaleManager.prototype.step.call(scale, 1002, 501);
        ScaleManager.prototype.step.call(scale, 1503, 501);

        expect(scale.getRefreshCount()).toBe(0);
    });

    it('does not refresh repeatedly after vertical scrolling', function ()
    {
        setPageOffset(0, 0);

        var canvasRect = { x: 40, y: 120, left: 40, top: 120, width: 640, height: 360 };
        var scale = createScale({
            canvasRect: canvasRect,
            canvasBounds: { x: 40, y: 120, width: 640, height: 360 }
        });

        ScaleManager.prototype.step.call(scale, 501, 501);

        setPageOffset(0, 100);
        canvasRect.y = 20;
        canvasRect.top = 20;

        ScaleManager.prototype.step.call(scale, 1002, 501);
        ScaleManager.prototype.step.call(scale, 1503, 501);

        expect(scale.getRefreshCount()).toBe(0);
    });

    it('accounts for document client borders', function ()
    {
        setPageOffset(25, 100);
        setDocumentClientOffset(2, 3);

        var scale = createScale({
            canvasRect: { x: 17, y: 23, left: 17, top: 23, width: 640, height: 360 },
            canvasBounds: { x: 40, y: 120, width: 640, height: 360 }
        });

        expect(scale.getParentBounds()).toBe(false);
    });

    it('reports a parent resize', function ()
    {
        setPageOffset(25, 100);

        var scale = createScale({
            parentRect: { width: 801, height: 600 },
            canvasRect: { x: 15, y: 20, left: 15, top: 20, width: 640, height: 360 },
            canvasBounds: { x: 40, y: 120, width: 640, height: 360 }
        });

        expect(scale.getParentBounds()).toBe(true);
        expect(scale.parentSize.width).toBe(801);
        expect(scale.parentSize.height).toBe(600);
    });

    it('reports horizontal canvas movement in page space', function ()
    {
        setPageOffset(25, 100);

        var scale = createScale({
            canvasRect: { x: 16, y: 20, left: 16, top: 20, width: 640, height: 360 },
            canvasBounds: { x: 40, y: 120, width: 640, height: 360 }
        });

        expect(scale.getParentBounds()).toBe(true);
    });

    it('reports vertical canvas movement in page space', function ()
    {
        setPageOffset(25, 100);

        var scale = createScale({
            canvasRect: { x: 15, y: 21, left: 15, top: 21, width: 640, height: 360 },
            canvasBounds: { x: 40, y: 120, width: 640, height: 360 }
        });

        expect(scale.getParentBounds()).toBe(true);
    });

    it('refreshes once when a fixed canvas changes page position', function ()
    {
        setPageOffset(0, 0);

        var scale = createScale({
            canvasRect: { x: 15, y: 20, left: 15, top: 20, width: 640, height: 360 },
            canvasBounds: { x: 15, y: 20, width: 640, height: 360 }
        });

        ScaleManager.prototype.step.call(scale, 501, 501);

        setPageOffset(25, 100);

        ScaleManager.prototype.step.call(scale, 1002, 501);
        ScaleManager.prototype.step.call(scale, 1503, 501);

        expect(scale.getRefreshCount()).toBe(1);
        expect(scale.canvasBounds.x).toBe(40);
        expect(scale.canvasBounds.y).toBe(120);
    });
});
