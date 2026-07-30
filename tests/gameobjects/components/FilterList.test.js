var FilterList = require('../../../src/gameobjects/components/FilterList');

// Mock all filter constructors to avoid WebGL/renderer dependencies
vi.mock('../../../src/filters/Barrel', function ()
{
    return function MockBarrel (camera, amount)
    {
        this.camera = camera;
        this.amount = amount;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Blend', function ()
{
    return function MockBlend (camera, texture, blendMode, amount, color)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Blocky', function ()
{
    return function MockBlocky (camera, config)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Blur', function ()
{
    return function MockBlur (camera, quality, x, y, strength, color, steps)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Bokeh', function ()
{
    return function MockBokeh (camera, radius, amount, contrast, tiltShift, blurX, blurY, strength)
    {
        this.camera = camera;
        this.tiltShift = tiltShift;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/ColorMatrix', function ()
{
    return function MockColorMatrix (camera)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/CombineColorMatrix', function ()
{
    return function MockCombineColorMatrix (camera, texture)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Displacement', function ()
{
    return function MockDisplacement (camera, texture, x, y)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Glow', function ()
{
    return function MockGlow (camera, color, outerStrength, innerStrength, scale, knockout, quality, distance)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/GradientMap', function ()
{
    return function MockGradientMap (camera, config)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/ImageLight', function ()
{
    return function MockImageLight (camera, config)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Key', function ()
{
    return function MockKey (camera, config)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Mask', function ()
{
    return function MockMask (camera, mask, invert, viewCamera, viewTransform, scaleFactor)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/NormalTools', function ()
{
    return function MockNormalTools (camera, config)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/PanoramaBlur', function ()
{
    return function MockPanoramaBlur (camera, config)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Pixelate', function ()
{
    return function MockPixelate (camera, amount)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Quantize', function ()
{
    return function MockQuantize (camera, config)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Sampler', function ()
{
    return function MockSampler (camera, callback, region)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Shadow', function ()
{
    return function MockShadow (camera, x, y, decay, power, color, samples, intensity)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Threshold', function ()
{
    return function MockThreshold (camera, edge1, edge2, invert)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Vignette', function ()
{
    return function MockVignette (camera, x, y, radius, strength, color, blendMode)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

vi.mock('../../../src/filters/Wipe', function ()
{
    return function MockWipe (camera, wipeWidth, direction, axis, reveal, wipeTexture)
    {
        this.camera = camera;
        this.active = true;
        this.ignoreDestroy = false;
        this.destroy = vi.fn();
    };
});

function makeMockFilter (active, ignoreDestroy)
{
    return {
        active: active !== undefined ? active : true,
        ignoreDestroy: ignoreDestroy !== undefined ? ignoreDestroy : false,
        destroy: vi.fn()
    };
}

describe('FilterList', function ()
{
    var mockCamera;
    var filterList;

    beforeEach(function ()
    {
        mockCamera = { id: 'mock-camera' };
        filterList = new FilterList(mockCamera);
    });

    describe('constructor', function ()
    {
        it('should set the camera reference', function ()
        {
            expect(filterList.camera).toBe(mockCamera);
        });

        it('should initialize with an empty list', function ()
        {
            expect(filterList.list).toEqual([]);
            expect(filterList.list.length).toBe(0);
        });
    });

    describe('add', function ()
    {
        it('should append a filter to the end of the list by default', function ()
        {
            var filter = makeMockFilter();
            filterList.add(filter);
            expect(filterList.list.length).toBe(1);
            expect(filterList.list[0]).toBe(filter);
        });

        it('should return the added filter', function ()
        {
            var filter = makeMockFilter();
            var result = filterList.add(filter);
            expect(result).toBe(filter);
        });

        it('should insert a filter at the given index', function ()
        {
            var first = makeMockFilter();
            var second = makeMockFilter();
            var inserted = makeMockFilter();
            filterList.add(first);
            filterList.add(second);
            filterList.add(inserted, 1);
            expect(filterList.list[0]).toBe(first);
            expect(filterList.list[1]).toBe(inserted);
            expect(filterList.list[2]).toBe(second);
        });

        it('should insert at index 0 to prepend', function ()
        {
            var first = makeMockFilter();
            var prepended = makeMockFilter();
            filterList.add(first);
            filterList.add(prepended, 0);
            expect(filterList.list[0]).toBe(prepended);
            expect(filterList.list[1]).toBe(first);
        });

        it('should support negative index insertion', function ()
        {
            var a = makeMockFilter();
            var b = makeMockFilter();
            var c = makeMockFilter();
            filterList.add(a);
            filterList.add(b);
            filterList.add(c, -1);
            // splice(-1, 0, c) inserts before the last element
            expect(filterList.list[1]).toBe(c);
        });
    });

    describe('remove', function ()
    {
        it('should remove a filter from the list', function ()
        {
            var filter = makeMockFilter();
            filterList.add(filter);
            filterList.remove(filter);
            expect(filterList.list.length).toBe(0);
        });

        it('should call destroy on the removed filter', function ()
        {
            var filter = makeMockFilter();
            filterList.add(filter);
            filterList.remove(filter);
            expect(filter.destroy).toHaveBeenCalledOnce();
        });

        it('should return the FilterList instance for chaining', function ()
        {
            var filter = makeMockFilter();
            filterList.add(filter);
            var result = filterList.remove(filter);
            expect(result).toBe(filterList);
        });

        it('should not throw when removing a filter not in the list', function ()
        {
            var filter = makeMockFilter();
            expect(function () { filterList.remove(filter); }).not.toThrow();
        });

        it('should not destroy a filter with ignoreDestroy set', function ()
        {
            var filter = makeMockFilter(true, true);
            filterList.add(filter);
            filterList.remove(filter);
            expect(filter.destroy).not.toHaveBeenCalled();
            expect(filterList.list.length).toBe(0);
        });

        it('should destroy a filter with ignoreDestroy set when forceDestroy is true', function ()
        {
            var filter = makeMockFilter(true, true);
            filterList.add(filter);
            filterList.remove(filter, true);
            expect(filter.destroy).toHaveBeenCalledOnce();
        });

        it('should only remove the specified filter, leaving others intact', function ()
        {
            var a = makeMockFilter();
            var b = makeMockFilter();
            var c = makeMockFilter();
            filterList.add(a);
            filterList.add(b);
            filterList.add(c);
            filterList.remove(b);
            expect(filterList.list.length).toBe(2);
            expect(filterList.list[0]).toBe(a);
            expect(filterList.list[1]).toBe(c);
        });
    });

    describe('clear', function ()
    {
        it('should remove all filters from the list', function ()
        {
            filterList.add(makeMockFilter());
            filterList.add(makeMockFilter());
            filterList.clear();
            expect(filterList.list.length).toBe(0);
        });

        it('should call destroy on each filter', function ()
        {
            var a = makeMockFilter();
            var b = makeMockFilter();
            filterList.add(a);
            filterList.add(b);
            filterList.clear();
            expect(a.destroy).toHaveBeenCalledOnce();
            expect(b.destroy).toHaveBeenCalledOnce();
        });

        it('should not call destroy on filters with ignoreDestroy set', function ()
        {
            var safe = makeMockFilter(true, true);
            var normal = makeMockFilter();
            filterList.add(safe);
            filterList.add(normal);
            filterList.clear();
            expect(safe.destroy).not.toHaveBeenCalled();
            expect(normal.destroy).toHaveBeenCalledOnce();
        });

        it('should return the FilterList instance for chaining', function ()
        {
            var result = filterList.clear();
            expect(result).toBe(filterList);
        });

        it('should work when the list is already empty', function ()
        {
            expect(function () { filterList.clear(); }).not.toThrow();
            expect(filterList.list.length).toBe(0);
        });
    });

    describe('getActive', function ()
    {
        it('should return only active filters', function ()
        {
            var active1 = makeMockFilter(true);
            var inactive = makeMockFilter(false);
            var active2 = makeMockFilter(true);
            filterList.add(active1);
            filterList.add(inactive);
            filterList.add(active2);
            var result = filterList.getActive();
            expect(result.length).toBe(2);
            expect(result[0]).toBe(active1);
            expect(result[1]).toBe(active2);
        });

        it('should return an empty array when no filters are active', function ()
        {
            filterList.add(makeMockFilter(false));
            filterList.add(makeMockFilter(false));
            var result = filterList.getActive();
            expect(result.length).toBe(0);
        });

        it('should return an empty array when the list is empty', function ()
        {
            var result = filterList.getActive();
            expect(result).toEqual([]);
        });

        it('should not modify the original list', function ()
        {
            filterList.add(makeMockFilter(true));
            filterList.add(makeMockFilter(false));
            filterList.getActive();
            expect(filterList.list.length).toBe(2);
        });
    });

    describe('destroy', function ()
    {
        it('should clear all filters', function ()
        {
            var filter = makeMockFilter();
            filterList.add(filter);
            filterList.destroy();
            expect(filterList.list.length).toBe(0);
        });

        it('should set camera to null', function ()
        {
            filterList.destroy();
            expect(filterList.camera).toBeNull();
        });

        it('should call destroy on filters when destroyed', function ()
        {
            var filter = makeMockFilter();
            filterList.add(filter);
            filterList.destroy();
            expect(filter.destroy).toHaveBeenCalledOnce();
        });
    });

    describe('addBarrel', function ()
    {
        it('should add a filter to the list and return it', function ()
        {
            var result = filterList.addBarrel(1);
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('addBlur', function ()
    {
        it('should add a filter to the list and return it', function ()
        {
            var result = filterList.addBlur(0, 2, 2, 1, 0xffffff, 4);
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('addGlow', function ()
    {
        it('should add a filter to the list and return it', function ()
        {
            var result = filterList.addGlow(0xffffff, 4, 0, 1, false, 10, 10);
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('addColorMatrix', function ()
    {
        it('should add a filter to the list and return it', function ()
        {
            var result = filterList.addColorMatrix();
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('addBokeh', function ()
    {
        it('should add a filter to the list and return it', function ()
        {
            var result = filterList.addBokeh(0.5, 1, 0.2);
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('addTiltShift', function ()
    {
        it('should add a Bokeh-based filter to the list and return it', function ()
        {
            var result = filterList.addTiltShift(0.5, 1, 0.2, 1, 1, 1);
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('addShadow', function ()
    {
        it('should add a filter to the list and return it', function ()
        {
            var result = filterList.addShadow(0, 0, 0.1, 1, 0x000000, 6, 1);
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('addPixelate', function ()
    {
        it('should add a filter to the list and return it', function ()
        {
            var result = filterList.addPixelate(4);
            expect(filterList.list.length).toBe(1);
            expect(result).toBe(filterList.list[0]);
        });
    });

    describe('multiple filters', function ()
    {
        it('should support stacking multiple filters in order', function ()
        {
            filterList.addBarrel(1);
            filterList.addColorMatrix();
            filterList.addShadow(0, 0, 0.1, 1, 0x000000, 6, 1);
            expect(filterList.list.length).toBe(3);
        });

        it('should clear all stacked filters', function ()
        {
            filterList.addBarrel(1);
            filterList.addColorMatrix();
            filterList.addShadow(0, 0, 0.1, 1, 0x000000, 6, 1);
            filterList.clear();
            expect(filterList.list.length).toBe(0);
        });
    });
});
