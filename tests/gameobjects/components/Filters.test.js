var Filters = require('../../../src/gameobjects/components/Filters');

describe('Filters', function ()
{
    // Helper to create a fresh filterCamera mock
    function makeCameraMock ()
    {
        return {
            width: 100,
            height: 100,
            originX: 0.5,
            originY: 0.5,
            filters: {
                internal: { getActive: function () { return []; } },
                external: { getActive: function () { return []; } }
            },
            setSize: vi.fn().mockReturnThis(),
            setScroll: vi.fn().mockReturnThis(),
            setRotation: vi.fn().mockReturnThis(),
            setOrigin: vi.fn().mockReturnThis(),
            setZoom: vi.fn().mockReturnThis(),
            centerOn: vi.fn().mockReturnThis()
        };
    }

    // Helper to create a mock object with Filters methods mixed in.
    // The Filters mixin is applied first (so its null defaults land),
    // then concrete mock values overwrite them, then user overrides.
    function createMockObject (overrides)
    {
        var obj = {};

        // Apply the Filters mixin.
        // Properties whose value is { get: fn } are accessor descriptors.
        for (var key in Filters)
        {
            if (Object.prototype.hasOwnProperty.call(Filters, key))
            {
                var val = Filters[key];
                if (val && typeof val === 'object' && typeof val.get === 'function')
                {
                    Object.defineProperty(obj, key, {
                        get: val.get,
                        configurable: true,
                        enumerable: true
                    });
                }
                else
                {
                    obj[key] = val;
                }
            }
        }

        // Overlay concrete mock defaults (overwrite nulls from the mixin).
        var defaults = {
            filterCamera: makeCameraMock(),
            maxFilterSize: { x: 4096, y: 4096 },
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            originX: 0.5,
            originY: 0.5,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            flipX: false,
            flipY: false,
            type: 'Image',
            scrollFactorX: 1,
            scrollFactorY: 1
        };

        for (var dk in defaults)
        {
            if (Object.prototype.hasOwnProperty.call(defaults, dk))
            {
                obj[dk] = defaults[dk];
            }
        }

        // Apply caller overrides last.
        if (overrides)
        {
            for (var prop in overrides)
            {
                if (Object.prototype.hasOwnProperty.call(overrides, prop))
                {
                    obj[prop] = overrides[prop];
                }
            }
        }

        return obj;
    }

    it('should be a non-null object', function ()
    {
        expect(Filters).toBeDefined();
        expect(typeof Filters).toBe('object');
        expect(Filters).not.toBeNull();
    });

    it('should have default property values defined on the mixin', function ()
    {
        expect(Filters.filterCamera).toBeNull();
        expect(Filters.renderFilters).toBe(true);
        expect(Filters.maxFilterSize).toBeNull();
        expect(Filters.filtersAutoFocus).toBe(true);
        expect(Filters.filtersFocusContext).toBe(false);
        expect(Filters.filtersForceComposite).toBe(false);
        expect(Filters._filtersMatrix).toBeNull();
        expect(Filters._filtersViewMatrix).toBeNull();
    });

    // -------------------------------------------------------------------------
    // filters getter
    // -------------------------------------------------------------------------

    describe('filters getter', function ()
    {
        it('should return filterCamera.filters when filterCamera exists', function ()
        {
            var obj = createMockObject();
            expect(obj.filters).toBe(obj.filterCamera.filters);
        });

        it('should return null when filterCamera is null', function ()
        {
            var obj = createMockObject({ filterCamera: null });
            expect(obj.filters).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // willRenderFilters
    // -------------------------------------------------------------------------

    describe('willRenderFilters', function ()
    {
        it('should return false when renderFilters is false', function ()
        {
            var obj = createMockObject({ renderFilters: false });
            expect(obj.willRenderFilters()).toBe(false);
        });

        it('should return falsy when filterCamera is null (filters is null)', function ()
        {
            var obj = createMockObject({ filterCamera: null });
            expect(obj.willRenderFilters()).toBeFalsy();
        });

        it('should return false when there are no active filters and filtersForceComposite is false', function ()
        {
            var obj = createMockObject();
            // filterCamera.filters.internal and external both return empty arrays
            expect(obj.willRenderFilters()).toBe(false);
        });

        it('should return true when there are active internal filters', function ()
        {
            var obj = createMockObject();
            obj.filterCamera.filters.internal.getActive = function () { return [ {} ]; };
            expect(obj.willRenderFilters()).toBe(true);
        });

        it('should return true when there are active external filters', function ()
        {
            var obj = createMockObject();
            obj.filterCamera.filters.external.getActive = function () { return [ {} ]; };
            expect(obj.willRenderFilters()).toBe(true);
        });

        it('should return true when filtersForceComposite is true even with no filters', function ()
        {
            var obj = createMockObject({ filtersForceComposite: true });
            expect(obj.willRenderFilters()).toBe(true);
        });

        it('should return false when renderFilters is false even if filtersForceComposite is true', function ()
        {
            var obj = createMockObject({ renderFilters: false, filtersForceComposite: true });
            expect(obj.willRenderFilters()).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // enableFilters
    // -------------------------------------------------------------------------

    describe('enableFilters', function ()
    {
        it('should return early without changes when filterCamera already exists', function ()
        {
            var obj = createMockObject();
            var original = obj.filterCamera;
            var result = obj.enableFilters();
            expect(result).toBe(obj);
            expect(obj.filterCamera).toBe(original);
        });

        it('should return early when renderer has no gl context', function ()
        {
            var obj = createMockObject({
                filterCamera: null,
                scene: {
                    renderer: { gl: null }
                }
            });
            var result = obj.enableFilters();
            expect(result).toBe(obj);
            expect(obj.filterCamera).toBeNull();
        });
    });

    // -------------------------------------------------------------------------
    // setFilterSize
    // -------------------------------------------------------------------------

    describe('setFilterSize', function ()
    {
        it('should set the filter camera size', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize(200, 150);
            expect(obj.filterCamera.setSize).toHaveBeenCalledWith(200, 150);
        });

        it('should clamp width and height to a minimum of 1', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize(0, -5);
            expect(obj.filterCamera.setSize).toHaveBeenCalledWith(1, 1);
        });

        it('should clamp width and height to maxFilterSize', function ()
        {
            var obj = createMockObject({ maxFilterSize: { x: 256, y: 128 } });
            obj.setFilterSize(9999, 9999);
            expect(obj.filterCamera.setSize).toHaveBeenCalledWith(256, 128);
        });

        it('should ceil fractional values', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize(100.1, 200.9);
            expect(obj.filterCamera.setSize).toHaveBeenCalledWith(101, 201);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            expect(obj.setFilterSize(100, 100)).toBe(obj);
        });

        it('should return this without calling setSize when filterCamera is null', function ()
        {
            var obj = createMockObject({ filterCamera: null });
            var result = obj.setFilterSize(100, 100);
            expect(result).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // setFiltersAutoFocus
    // -------------------------------------------------------------------------

    describe('setFiltersAutoFocus', function ()
    {
        it('should set filtersAutoFocus to true', function ()
        {
            var obj = createMockObject({ filtersAutoFocus: false });
            obj.setFiltersAutoFocus(true);
            expect(obj.filtersAutoFocus).toBe(true);
        });

        it('should set filtersAutoFocus to false', function ()
        {
            var obj = createMockObject();
            obj.setFiltersAutoFocus(false);
            expect(obj.filtersAutoFocus).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            expect(obj.setFiltersAutoFocus(true)).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // setFiltersFocusContext
    // -------------------------------------------------------------------------

    describe('setFiltersFocusContext', function ()
    {
        it('should set filtersFocusContext to true', function ()
        {
            var obj = createMockObject();
            obj.setFiltersFocusContext(true);
            expect(obj.filtersFocusContext).toBe(true);
        });

        it('should set filtersFocusContext to false', function ()
        {
            var obj = createMockObject({ filtersFocusContext: true });
            obj.setFiltersFocusContext(false);
            expect(obj.filtersFocusContext).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            expect(obj.setFiltersFocusContext(false)).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // setFiltersForceComposite
    // -------------------------------------------------------------------------

    describe('setFiltersForceComposite', function ()
    {
        it('should set filtersForceComposite to true', function ()
        {
            var obj = createMockObject();
            obj.setFiltersForceComposite(true);
            expect(obj.filtersForceComposite).toBe(true);
        });

        it('should set filtersForceComposite to false', function ()
        {
            var obj = createMockObject({ filtersForceComposite: true });
            obj.setFiltersForceComposite(false);
            expect(obj.filtersForceComposite).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            expect(obj.setFiltersForceComposite(true)).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // setRenderFilters
    // -------------------------------------------------------------------------

    describe('setRenderFilters', function ()
    {
        it('should set renderFilters to true', function ()
        {
            var obj = createMockObject({ renderFilters: false });
            obj.setRenderFilters(true);
            expect(obj.renderFilters).toBe(true);
        });

        it('should set renderFilters to false', function ()
        {
            var obj = createMockObject();
            obj.setRenderFilters(false);
            expect(obj.renderFilters).toBe(false);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            expect(obj.setRenderFilters(true)).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // focusFilters
    // -------------------------------------------------------------------------

    describe('focusFilters', function ()
    {
        it('should call setFilterSize with the object dimensions', function ()
        {
            var obj = createMockObject({ width: 200, height: 100 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.setFilterSize).toHaveBeenCalledWith(200, 100);
        });

        it('should call filterCamera.centerOn with the center position', function ()
        {
            var obj = createMockObject({
                x: 100,
                y: 50,
                width: 200,
                height: 100,
                originX: 0.5,
                originY: 0.5,
                rotation: 0,
                scaleX: 1,
                scaleY: 1
            });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            // centerX = 100 + 200 * (0.5 - 0.5) = 100
            // centerY = 50 + 100 * (0.5 - 0.5) = 50
            expect(obj.filterCamera.centerOn).toHaveBeenCalledWith(100, 50);
        });

        it('should set filtersFocusContext to true for a Layer type', function ()
        {
            var obj = createMockObject({ type: 'Layer' });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.filtersFocusContext).toBe(true);
        });

        it('should set filtersFocusContext to true when width is 0', function ()
        {
            var obj = createMockObject({ width: 0 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.filtersFocusContext).toBe(true);
        });

        it('should set filtersFocusContext to true when height is 0', function ()
        {
            var obj = createMockObject({ height: 0 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.filtersFocusContext).toBe(true);
        });

        it('should set filtersFocusContext to true when coordinates are NaN', function ()
        {
            var obj = createMockObject({ x: NaN });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.filtersFocusContext).toBe(true);
        });

        it('should adjust origin and scale for flipX', function ()
        {
            var obj = createMockObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                originX: 0.5,
                originY: 0.5,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                flipX: true,
                flipY: false
            });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            // flipX: scaleX *= -1, originX = 1 - 0.5 = 0.5
            expect(obj.filterCamera.setZoom).toHaveBeenCalledWith(-1, 1);
        });

        it('should adjust origin and scale for flipY', function ()
        {
            var obj = createMockObject({
                x: 0,
                y: 0,
                width: 100,
                height: 100,
                originX: 0.5,
                originY: 0.5,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                flipX: false,
                flipY: true
            });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.filterCamera.setZoom).toHaveBeenCalledWith(1, -1);
        });

        it('should set camera rotation to negative object rotation', function ()
        {
            var obj = createMockObject({ rotation: Math.PI / 4 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.filterCamera.setRotation).toHaveBeenCalledWith(-Math.PI / 4);
        });

        it('should set camera zoom to inverse scale', function ()
        {
            var obj = createMockObject({ scaleX: 2, scaleY: 4 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFilters();
            expect(obj.filterCamera.setZoom).toHaveBeenCalledWith(0.5, 0.25);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize = vi.fn().mockReturnThis();
            expect(obj.focusFilters()).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // focusFiltersOnCamera
    // -------------------------------------------------------------------------

    describe('focusFiltersOnCamera', function ()
    {
        it('should set the filter camera size from the given camera', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize = vi.fn().mockReturnThis();
            var cam = { width: 800, height: 600, scrollX: 10, scrollY: 20, rotation: 0.5, zoomX: 1.5, zoomY: 2 };
            obj.focusFiltersOnCamera(cam);
            expect(obj.setFilterSize).toHaveBeenCalledWith(800, 600);
        });

        it('should apply scroll, rotation and zoom from the given camera', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize = vi.fn().mockReturnThis();
            var cam = { width: 800, height: 600, scrollX: 10, scrollY: 20, rotation: 0.5, zoomX: 1.5, zoomY: 2 };
            obj.focusFiltersOnCamera(cam);
            expect(obj.filterCamera.setScroll).toHaveBeenCalledWith(10, 20);
            expect(obj.filterCamera.setRotation).toHaveBeenCalledWith(0.5);
            expect(obj.filterCamera.setZoom).toHaveBeenCalledWith(1.5, 2);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize = vi.fn().mockReturnThis();
            var cam = { width: 100, height: 100, scrollX: 0, scrollY: 0, rotation: 0, zoomX: 1, zoomY: 1 };
            expect(obj.focusFiltersOnCamera(cam)).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // focusFiltersOverride
    // -------------------------------------------------------------------------

    describe('focusFiltersOverride', function ()
    {
        it('should disable filtersAutoFocus', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFiltersOverride(50, 50, 100, 100);
            expect(obj.filtersAutoFocus).toBe(false);
        });

        it('should set scroll based on object position and focus point', function ()
        {
            var obj = createMockObject({ x: 200, y: 300 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFiltersOverride(50, 75, 100, 150);
            // scroll = objectX - x, objectY - y = 200 - 50, 300 - 75
            expect(obj.filterCamera.setScroll).toHaveBeenCalledWith(150, 225);
        });

        it('should set origin based on focus point relative to size', function ()
        {
            var obj = createMockObject({ x: 0, y: 0 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.focusFiltersOverride(50, 75, 100, 150);
            // originX = 50/100 = 0.5, originY = 75/150 = 0.5
            expect(obj.filterCamera.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
        });

        it('should default x to width/2 when not specified', function ()
        {
            var obj = createMockObject({ x: 0, y: 0 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.filterCamera.width = 200;
            obj.filterCamera.height = 100;
            obj.focusFiltersOverride(undefined, undefined, 200, 100);
            // x defaults to 200/2 = 100, y defaults to 100/2 = 50
            expect(obj.filterCamera.setScroll).toHaveBeenCalledWith(-100, -50);
        });

        it('should default width to filterCamera.width when not specified', function ()
        {
            var obj = createMockObject({ x: 0, y: 0 });
            obj.setFilterSize = vi.fn().mockReturnThis();
            obj.filterCamera.width = 300;
            obj.filterCamera.height = 200;
            obj.focusFiltersOverride(undefined, undefined, undefined, undefined);
            expect(obj.setFilterSize).toHaveBeenCalledWith(300, 200);
        });

        it('should return this for chaining', function ()
        {
            var obj = createMockObject();
            obj.setFilterSize = vi.fn().mockReturnThis();
            expect(obj.focusFiltersOverride(50, 50, 100, 100)).toBe(obj);
        });
    });

    // -------------------------------------------------------------------------
    // method chaining
    // -------------------------------------------------------------------------

    describe('method chaining', function ()
    {
        it('should support chaining multiple setters', function ()
        {
            var obj = createMockObject();
            var result = obj
                .setRenderFilters(true)
                .setFiltersAutoFocus(false)
                .setFiltersFocusContext(true)
                .setFiltersForceComposite(true);

            expect(result).toBe(obj);
            expect(obj.renderFilters).toBe(true);
            expect(obj.filtersAutoFocus).toBe(false);
            expect(obj.filtersFocusContext).toBe(true);
            expect(obj.filtersForceComposite).toBe(true);
        });
    });
});
