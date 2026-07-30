var ParallelFilters = require('../../src/filters/ParallelFilters');
var FilterList = require('../../src/gameobjects/components/FilterList');
var Blend = require('../../src/filters/Blend');

function makeMockCamera ()
{
    return {
        scene: {
            sys: {
                textures: {
                    getFrame: function () { return null; }
                }
            }
        }
    };
}

describe('ParallelFilters', function ()
{
    var camera;

    beforeEach(function ()
    {
        camera = makeMockCamera();
    });

    describe('constructor', function ()
    {
        it('should create an instance with default active state', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.active).toBe(true);
        });

        it('should store the camera reference', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.camera).toBe(camera);
        });

        it('should set the renderNode to FilterParallelFilters', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.renderNode).toBe('FilterParallelFilters');
        });

        it('should create a top FilterList', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.top).toBeDefined();
            expect(pf.top instanceof FilterList).toBe(true);
        });

        it('should create a bottom FilterList', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.bottom).toBeDefined();
            expect(pf.bottom instanceof FilterList).toBe(true);
        });

        it('should create a blend Blend controller', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.blend).toBeDefined();
            expect(pf.blend instanceof Blend).toBe(true);
        });

        it('should create top and bottom as separate FilterList instances', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.top).not.toBe(pf.bottom);
        });

        it('should pass the camera to the top FilterList', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.top.camera).toBe(camera);
        });

        it('should pass the camera to the bottom FilterList', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.bottom.camera).toBe(camera);
        });

        it('should pass the camera to the blend controller', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.blend.camera).toBe(camera);
        });

        it('should start with empty top filter list', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.top.list.length).toBe(0);
        });

        it('should start with empty bottom filter list', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.bottom.list.length).toBe(0);
        });

        it('should set paddingOverride as a Rectangle on the controller', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.paddingOverride).toBeDefined();
            expect(pf.paddingOverride).not.toBeNull();
        });

        it('should set ignoreDestroy to false by default', function ()
        {
            var pf = new ParallelFilters(camera);
            expect(pf.ignoreDestroy).toBe(false);
        });

        it('should allow multiple independent instances with different cameras', function ()
        {
            var camera2 = makeMockCamera();
            var pf1 = new ParallelFilters(camera);
            var pf2 = new ParallelFilters(camera2);
            expect(pf1.camera).toBe(camera);
            expect(pf2.camera).toBe(camera2);
            expect(pf1.top).not.toBe(pf2.top);
            expect(pf1.bottom).not.toBe(pf2.bottom);
            expect(pf1.blend).not.toBe(pf2.blend);
        });
    });

    describe('addParallelFilters', function ()
    {
        it('should be injected onto FilterList prototype', function ()
        {
            expect(typeof FilterList.prototype.addParallelFilters).toBe('function');
        });

        it('should return a ParallelFilters instance', function ()
        {
            var filterList = new FilterList(camera);
            var result = filterList.addParallelFilters();
            expect(result instanceof ParallelFilters).toBe(true);
        });

        it('should add the ParallelFilters to the filter list', function ()
        {
            var filterList = new FilterList(camera);
            expect(filterList.list.length).toBe(0);
            filterList.addParallelFilters();
            expect(filterList.list.length).toBe(1);
        });

        it('should add the returned instance to the filter list', function ()
        {
            var filterList = new FilterList(camera);
            var result = filterList.addParallelFilters();
            expect(filterList.list[0]).toBe(result);
        });

        it('should set the camera on the resulting ParallelFilters to match the FilterList camera', function ()
        {
            var filterList = new FilterList(camera);
            var result = filterList.addParallelFilters();
            expect(result.camera).toBe(camera);
        });

        it('should support adding multiple ParallelFilters to the same list', function ()
        {
            var filterList = new FilterList(camera);
            var pf1 = filterList.addParallelFilters();
            var pf2 = filterList.addParallelFilters();
            expect(filterList.list.length).toBe(2);
            expect(pf1).not.toBe(pf2);
        });

        it('should create a ParallelFilters with its own independent top and bottom lists', function ()
        {
            var filterList = new FilterList(camera);
            var pf = filterList.addParallelFilters();
            expect(pf.top instanceof FilterList).toBe(true);
            expect(pf.bottom instanceof FilterList).toBe(true);
            expect(pf.top).not.toBe(filterList);
            expect(pf.bottom).not.toBe(filterList);
        });
    });
});
