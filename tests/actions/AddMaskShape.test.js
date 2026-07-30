vi.mock('../../src/gameobjects/GameObject', function ()
{
    function GameObject () {}
    return GameObject;
});

var AddMaskShape = require('../../src/actions/AddMaskShape');

describe('Phaser.Actions.AddMaskShape', function ()
{
    var mockShape;
    var mockScene;
    var mockTarget;
    var mockMask;
    var mockExternalFilters;
    var mockInternalFilters;

    beforeEach(function ()
    {
        vi.clearAllMocks();

        mockShape = {
            x: 0,
            y: 0,
            setScale: vi.fn(),
            filters: {
                external: {
                    addBlur: vi.fn()
                }
            },
            enableFilters: vi.fn(function () { return mockShape; })
        };

        mockScene = {
            add: {
                circle: vi.fn(function () { return mockShape; }),
                rectangle: vi.fn(function () { return mockShape; }),
                ellipse: vi.fn(function () { return mockShape; })
            },
            children: {
                remove: vi.fn()
            },
            scale: {
                width: 800,
                height: 600
            }
        };

        mockMask = { type: 'mask' };

        mockExternalFilters = {
            addMask: vi.fn(function () { return mockMask; })
        };

        mockInternalFilters = {
            addMask: vi.fn(function () { return mockMask; })
        };

        mockTarget = {
            scene: mockScene,
            filters: {
                external: mockExternalFilters,
                internal: mockInternalFilters
            }
        };
    });

    // --- Return value ---

    it('should return the mask filter created by addMask', function ()
    {
        var result = AddMaskShape(mockTarget, {});

        expect(result).toStrictEqual([ mockMask ]);
    });

    it('should return a mask when no config is provided', function ()
    {
        var result = AddMaskShape(mockTarget);

        expect(result).toStrictEqual([ mockMask ]);
    });

    // --- Shape selection ---

    it('should create a circle shape by default when no shape is specified', function ()
    {
        AddMaskShape(mockTarget, {});

        expect(mockScene.add.circle).toHaveBeenCalledWith(0, 0, 1, 0xffffff);
        expect(mockScene.add.rectangle).not.toHaveBeenCalled();
        expect(mockScene.add.ellipse).not.toHaveBeenCalled();
    });

    it('should create a circle shape when shape is "circle"', function ()
    {
        AddMaskShape(mockTarget, { shape: 'circle' });

        expect(mockScene.add.circle).toHaveBeenCalledWith(0, 0, 1, 0xffffff);
        expect(mockScene.add.rectangle).not.toHaveBeenCalled();
        expect(mockScene.add.ellipse).not.toHaveBeenCalled();
    });

    it('should create an ellipse shape when shape is "ellipse"', function ()
    {
        AddMaskShape(mockTarget, { shape: 'ellipse' });

        expect(mockScene.add.ellipse).toHaveBeenCalled();
        expect(mockScene.add.circle).not.toHaveBeenCalled();
        expect(mockScene.add.rectangle).not.toHaveBeenCalled();
    });

    it('should create a rectangle shape when shape is "square"', function ()
    {
        AddMaskShape(mockTarget, { shape: 'square' });

        expect(mockScene.add.rectangle).toHaveBeenCalled();
        expect(mockScene.add.circle).not.toHaveBeenCalled();
        expect(mockScene.add.ellipse).not.toHaveBeenCalled();
    });

    it('should create a rectangle shape when shape is "rectangle"', function ()
    {
        AddMaskShape(mockTarget, { shape: 'rectangle' });

        expect(mockScene.add.rectangle).toHaveBeenCalled();
        expect(mockScene.add.circle).not.toHaveBeenCalled();
        expect(mockScene.add.ellipse).not.toHaveBeenCalled();
    });

    it('should fall back to circle for an unrecognised shape value', function ()
    {
        AddMaskShape(mockTarget, { shape: 'triangle' });

        expect(mockScene.add.circle).toHaveBeenCalled();
    });

    // --- aspectRatio ---

    it('should use aspectRatio of 1 for ellipse when aspectRatio is not specified', function ()
    {
        AddMaskShape(mockTarget, { shape: 'ellipse' });

        expect(mockScene.add.ellipse).toHaveBeenCalledWith(0, 0, 1, 1, 0xffffff);
    });

    it('should pass custom aspectRatio to ellipse', function ()
    {
        AddMaskShape(mockTarget, { shape: 'ellipse', aspectRatio: 2 });

        expect(mockScene.add.ellipse).toHaveBeenCalledWith(0, 0, 2, 1, 0xffffff);
    });

    it('should pass custom aspectRatio to rectangle', function ()
    {
        AddMaskShape(mockTarget, { shape: 'rectangle', aspectRatio: 1.5 });

        expect(mockScene.add.rectangle).toHaveBeenCalledWith(0, 0, 1.5, 1, 0xffffff);
    });

    it('should use equal dimensions for square regardless of aspectRatio', function ()
    {
        AddMaskShape(mockTarget, { shape: 'square', aspectRatio: 3 });

        expect(mockScene.add.rectangle).toHaveBeenCalledWith(0, 0, 1, 1, 0xffffff);
    });

    // --- Scene management ---

    it('should remove the shape from the scene after creation', function ()
    {
        AddMaskShape(mockTarget, {});

        expect(mockScene.children.remove).toHaveBeenCalledWith(mockShape);
    });

    // --- Region (verified via FitToRegion effects on mockShape) ---
    // FitToRegion with scaleMode=0 (default), itemWidth=1, itemHeight=1, originX=0.5, originY=0.5:
    //   shape.x = region.x + region.width * 0.5
    //   shape.y = region.y + region.height * 0.5
    //   shape.setScale(region.width, region.height)

    it('should use scene scale dimensions as the region when no region is provided', function ()
    {
        AddMaskShape(mockTarget, {});

        // scene is 800x600, region = {x:0, y:0, w:800, h:600}
        expect(mockShape.setScale).toHaveBeenCalledWith(800, 600);
    });

    it('should use a region starting at 0,0 when derived from scene scale', function ()
    {
        AddMaskShape(mockTarget, {});

        // shape.x = 0 + 800 * 0.5 = 400, shape.y = 0 + 600 * 0.5 = 300
        expect(mockShape.x).toBe(400);
        expect(mockShape.y).toBe(300);
    });

    it('should use the provided region directly when config.region is set', function ()
    {
        var customRegion = { x: 10, y: 20, width: 300, height: 200 };

        AddMaskShape(mockTarget, { region: customRegion });

        // shape.setScale(300, 200); shape.x = 10 + 300*0.5 = 160
        expect(mockShape.setScale).toHaveBeenCalledWith(300, 200);
        expect(mockShape.x).toBe(160);
    });

    it('should use target width and height when useInternal is true and target has _sizeComponent', function ()
    {
        mockTarget._sizeComponent = true;
        mockTarget.width = 400;
        mockTarget.height = 300;

        AddMaskShape(mockTarget, { useInternal: true });

        // region = {x:0, y:0, w:400, h:300}
        expect(mockShape.setScale).toHaveBeenCalledWith(400, 300);
    });

    it('should fall back to scene scale when useInternal is true but target lacks _sizeComponent', function ()
    {
        AddMaskShape(mockTarget, { useInternal: true });

        expect(mockShape.setScale).toHaveBeenCalledWith(800, 600);
    });

    // --- Padding ---

    it('should shrink the region by padding on all sides', function ()
    {
        AddMaskShape(mockTarget, { padding: 10 });

        // region = {x:10, y:10, w:780, h:580}
        expect(mockShape.setScale).toHaveBeenCalledWith(780, 580);
    });

    it('should not alter the region when padding is zero', function ()
    {
        AddMaskShape(mockTarget, { padding: 0 });

        expect(mockShape.setScale).toHaveBeenCalledWith(800, 600);
    });

    it('should not alter the region when padding is not specified', function ()
    {
        AddMaskShape(mockTarget, {});

        expect(mockShape.setScale).toHaveBeenCalledWith(800, 600);
    });

    it('should apply padding to a custom region', function ()
    {
        var customRegion = { x: 0, y: 0, width: 200, height: 100 };

        AddMaskShape(mockTarget, { region: customRegion, padding: 5 });

        // region = {x:5, y:5, w:190, h:90}
        expect(mockShape.setScale).toHaveBeenCalledWith(190, 90);
    });

    // --- FitToRegion call ---

    it('should call FitToRegion with the shape as the first argument', function ()
    {
        AddMaskShape(mockTarget, {});

        // FitToRegion ran on mockShape — verified by setScale being called on it
        expect(mockShape.setScale).toHaveBeenCalled();
    });

    it('should pass scaleMode to FitToRegion', function ()
    {
        // scaleMode=-1 causes FitToRegion to use Math.min(scaleX, scaleY)
        // For 800x600 region with 1x1 item: Math.min(800, 600) = 600 (single-arg setScale)
        AddMaskShape(mockTarget, { scaleMode: -1 });

        expect(mockShape.setScale).toHaveBeenCalledWith(600);
    });

    // --- Blur ---

    it('should add a blur filter when blurRadius is greater than zero', function ()
    {
        AddMaskShape(mockTarget, { blurRadius: 5 });

        expect(mockShape.enableFilters).toHaveBeenCalled();
        expect(mockShape.filters.external.addBlur).toHaveBeenCalled();
    });

    it('should pass blur parameters to addBlur', function ()
    {
        AddMaskShape(mockTarget, { blurRadius: 4, blurQuality: 2, blurSteps: 3 });

        expect(mockShape.filters.external.addBlur).toHaveBeenCalledWith(2, 4, 4, 1, undefined, 3);
    });

    it('should not add a blur filter when blurRadius is zero', function ()
    {
        AddMaskShape(mockTarget, { blurRadius: 0 });

        expect(mockShape.enableFilters).not.toHaveBeenCalled();
        expect(mockShape.filters.external.addBlur).not.toHaveBeenCalled();
    });

    it('should not add a blur filter when blurRadius is not specified', function ()
    {
        AddMaskShape(mockTarget, {});

        expect(mockShape.enableFilters).not.toHaveBeenCalled();
        expect(mockShape.filters.external.addBlur).not.toHaveBeenCalled();
    });

    it('should not add a blur filter when blurRadius is negative', function ()
    {
        AddMaskShape(mockTarget, { blurRadius: -1 });

        expect(mockShape.enableFilters).not.toHaveBeenCalled();
    });

    // --- Filter list selection ---

    it('should use external filter list by default', function ()
    {
        AddMaskShape(mockTarget, {});

        expect(mockExternalFilters.addMask).toHaveBeenCalled();
        expect(mockInternalFilters.addMask).not.toHaveBeenCalled();
    });

    it('should use internal filter list when useInternal is true', function ()
    {
        AddMaskShape(mockTarget, { useInternal: true });

        expect(mockInternalFilters.addMask).toHaveBeenCalled();
        expect(mockExternalFilters.addMask).not.toHaveBeenCalled();
    });

    it('should use external filter list when useInternal is false', function ()
    {
        AddMaskShape(mockTarget, { useInternal: false });

        expect(mockExternalFilters.addMask).toHaveBeenCalled();
        expect(mockInternalFilters.addMask).not.toHaveBeenCalled();
    });

    // --- addMask arguments ---

    it('should pass the shape to addMask', function ()
    {
        AddMaskShape(mockTarget, {});

        expect(mockExternalFilters.addMask).toHaveBeenCalledWith(mockShape, undefined);
    });

    it('should pass invert true to addMask when configured', function ()
    {
        AddMaskShape(mockTarget, { invert: true });

        expect(mockExternalFilters.addMask).toHaveBeenCalledWith(mockShape, true);
    });

    it('should pass invert false to addMask when configured', function ()
    {
        AddMaskShape(mockTarget, { invert: false });

        expect(mockExternalFilters.addMask).toHaveBeenCalledWith(mockShape, false);
    });

    // --- GameObject instanceof check ---

    it('should not call enableFilters on target when target is a plain object', function ()
    {
        mockTarget.enableFilters = vi.fn();

        AddMaskShape(mockTarget, {});

        expect(mockTarget.enableFilters).not.toHaveBeenCalled();
    });
});
