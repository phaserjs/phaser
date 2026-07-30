var StaggerBuilder = require('../../../src/tweens/builders/StaggerBuilder');

describe('Phaser.Tweens.Builders.StaggerBuilder', function ()
{
    describe('return value', function ()
    {
        it('should return a function', function ()
        {
            var fn = StaggerBuilder(100);
            expect(typeof fn).toBe('function');
        });

        it('should return a function when called with no options', function ()
        {
            var fn = StaggerBuilder(50);
            expect(typeof fn).toBe('function');
        });

        it('should return a function when called with an empty options object', function ()
        {
            var fn = StaggerBuilder(100, {});
            expect(typeof fn).toBe('function');
        });

        it('should return a function when value is a range array', function ()
        {
            var fn = StaggerBuilder([0, 200]);
            expect(typeof fn).toBe('function');
        });
    });

    describe('non-grid mode, from=0 (default numeric from)', function ()
    {
        it('should return start (0) for index 0', function ()
        {
            var fn = StaggerBuilder(100);
            // fromValue=true, from=0, fromIndex=|0-0|=0, output=0*100=0
            expect(fn(null, null, null, 0, 5)).toBe(0);
        });

        it('should return value1 * index for each target', function ()
        {
            var fn = StaggerBuilder(100);
            // fromIndex = |0 - index| = index
            expect(fn(null, null, null, 1, 5)).toBe(100);
            expect(fn(null, null, null, 2, 5)).toBe(200);
            expect(fn(null, null, null, 3, 5)).toBe(300);
        });

        it('should add start offset to each result', function ()
        {
            var fn = StaggerBuilder(100, { start: 50 });
            expect(fn(null, null, null, 0, 5)).toBe(50);
            expect(fn(null, null, null, 1, 5)).toBe(150);
            expect(fn(null, null, null, 2, 5)).toBe(250);
        });

        it('should work with floating point stagger value', function ()
        {
            var fn = StaggerBuilder(0.5);
            expect(fn(null, null, null, 0, 5)).toBeCloseTo(0);
            expect(fn(null, null, null, 2, 5)).toBeCloseTo(1.0);
            expect(fn(null, null, null, 4, 5)).toBeCloseTo(2.0);
        });

        it('should work with a single target (total=1)', function ()
        {
            var fn = StaggerBuilder(100);
            // total-- = 0, fromIndex=0, output=0
            expect(fn(null, null, null, 0, 1)).toBe(0);
        });

        it('should work with numeric from=2', function ()
        {
            var fn = StaggerBuilder(100, { from: 2 });
            // fromIndex = |2 - index|
            expect(fn(null, null, null, 0, 5)).toBe(200);
            expect(fn(null, null, null, 2, 5)).toBe(0);
            expect(fn(null, null, null, 4, 5)).toBe(200);
        });

        it('should work with negative start offset', function ()
        {
            var fn = StaggerBuilder(100, { start: -50 });
            expect(fn(null, null, null, 0, 5)).toBe(-50);
            expect(fn(null, null, null, 1, 5)).toBe(50);
        });
    });

    describe('non-grid mode, from="first"', function ()
    {
        it('should return 0 + start for index 0', function ()
        {
            var fn = StaggerBuilder(100, { from: 'first' });
            expect(fn(null, null, null, 0, 5)).toBe(0);
        });

        it('should increase stagger linearly from first target', function ()
        {
            var fn = StaggerBuilder(100, { from: 'first' });
            expect(fn(null, null, null, 0, 5)).toBe(0);
            expect(fn(null, null, null, 1, 5)).toBe(100);
            expect(fn(null, null, null, 2, 5)).toBe(200);
            expect(fn(null, null, null, 3, 5)).toBe(300);
            expect(fn(null, null, null, 4, 5)).toBe(400);
        });

        it('should apply start offset', function ()
        {
            var fn = StaggerBuilder(50, { from: 'first', start: 200 });
            expect(fn(null, null, null, 0, 4)).toBe(200);
            expect(fn(null, null, null, 1, 4)).toBe(250);
            expect(fn(null, null, null, 2, 4)).toBe(300);
        });
    });

    describe('non-grid mode, from="last"', function ()
    {
        it('should return 0 + start for last index', function ()
        {
            var fn = StaggerBuilder(100, { from: 'last' });
            // total=5, total--=4, fromIndex = 4 - 4 = 0
            expect(fn(null, null, null, 4, 5)).toBe(0);
        });

        it('should increase stagger from last to first', function ()
        {
            var fn = StaggerBuilder(100, { from: 'last' });
            // total=5, total--=4
            expect(fn(null, null, null, 4, 5)).toBe(0);
            expect(fn(null, null, null, 3, 5)).toBe(100);
            expect(fn(null, null, null, 2, 5)).toBe(200);
            expect(fn(null, null, null, 1, 5)).toBe(300);
            expect(fn(null, null, null, 0, 5)).toBe(400);
        });
    });

    describe('non-grid mode, from="center"', function ()
    {
        it('should return 0 for the center target in an odd-count set', function ()
        {
            var fn = StaggerBuilder(100, { from: 'center' });
            // total=5, total--=4, center index=2: fromIndex=|4/2 - 2|=0
            expect(fn(null, null, null, 2, 5)).toBe(0);
        });

        it('should increase stagger moving outward from center', function ()
        {
            var fn = StaggerBuilder(100, { from: 'center' });
            // total=5, total--=4
            // index 0: |2-0|=2 => 200
            // index 1: |2-1|=1 => 100
            // index 2: |2-2|=0 => 0
            // index 3: |2-3|=1 => 100
            // index 4: |2-4|=2 => 200
            expect(fn(null, null, null, 0, 5)).toBe(200);
            expect(fn(null, null, null, 1, 5)).toBe(100);
            expect(fn(null, null, null, 2, 5)).toBe(0);
            expect(fn(null, null, null, 3, 5)).toBe(100);
            expect(fn(null, null, null, 4, 5)).toBe(200);
        });

        it('should be symmetric around center', function ()
        {
            var fn = StaggerBuilder(100, { from: 'center' });
            var total = 7;
            var r0 = fn(null, null, null, 0, total);
            var r6 = fn(null, null, null, 6, total);
            expect(r0).toBeCloseTo(r6);

            var r1 = fn(null, null, null, 1, total);
            var r5 = fn(null, null, null, 5, total);
            expect(r1).toBeCloseTo(r5);
        });
    });

    describe('non-grid mode, range value', function ()
    {
        it('should start at value1 + original start for first index with from="first"', function ()
        {
            var fn = StaggerBuilder([100, 500], { from: 'first' });
            // isRange=true, start += value1 => start=0+100=100
            // index=0: fromIndex=0, spacing=0, output=0, return 0+100=100
            expect(fn(null, null, null, 0, 5)).toBe(100);
        });

        it('should interpolate between value1 and value2 across targets with from="first"', function ()
        {
            var fn = StaggerBuilder([0, 400], { from: 'first' });
            // start=0+0=0
            // total=5, total--=4
            // index=0: fromIndex=0, spacing=((400-0)/4)*0=0, return 0
            // index=2: fromIndex=2, spacing=((400-0)/4)*2=200, return 200
            // index=4: fromIndex=4, spacing=((400-0)/4)*4=400, return 400
            expect(fn(null, null, null, 0, 5)).toBe(0);
            expect(fn(null, null, null, 2, 5)).toBe(200);
            expect(fn(null, null, null, 4, 5)).toBe(400);
        });

        it('should double spacing from center with from="center" for range values', function ()
        {
            var fn = StaggerBuilder([0, 400], { from: 'center' });
            // total=5, total--=4, center=2
            // index=2: fromIndex=0, spacing=0
            // index=4: fromIndex=|2-4|=2, spacing=((400-0)/4)*(2*2)=400
            expect(fn(null, null, null, 2, 5)).toBe(0);
            expect(fn(null, null, null, 4, 5)).toBe(400);
        });

        it('should apply start offset on top of value1 for range', function ()
        {
            var fn = StaggerBuilder([50, 250], { from: 'first', start: 10 });
            // isRange=true, start=10+50=60
            // index=0: output=0, return 0+60=60
            expect(fn(null, null, null, 0, 5)).toBe(60);
        });
    });

    describe('non-grid mode, ease function', function ()
    {
        it('should apply a linear ease and produce same result as no ease at index 0', function ()
        {
            var fnNoEase = StaggerBuilder(100, { from: 'first' });
            var fnLinear = StaggerBuilder(100, { from: 'first', ease: 'Linear' });
            // Linear ease at t=0 => 0, both return 0+0=0
            expect(fnLinear(null, null, null, 0, 5)).toBeCloseTo(fnNoEase(null, null, null, 0, 5));
        });

        it('should apply a linear ease at t=1 giving same result as no ease at last index', function ()
        {
            var fnNoEase = StaggerBuilder(100, { from: 'first' });
            var fnLinear = StaggerBuilder(100, { from: 'first', ease: 'Linear' });
            // total=5, total--=4, index=4: fromIndex=4, t=4/4=1
            // Linear(1)=1, output=(4*100)*1=400
            // No ease: output=4*100=400
            expect(fnLinear(null, null, null, 4, 5)).toBeCloseTo(fnNoEase(null, null, null, 4, 5));
        });

        it('should apply ease to range output', function ()
        {
            var fnLinear = StaggerBuilder([0, 400], { from: 'first', ease: 'Linear' });
            // total=5, total--=4, index=4: fromIndex=4, t=4/4=1
            // spacing=((400-0)/4)*4=400, output=400*Linear(1)=400
            expect(fnLinear(null, null, null, 4, 5)).toBeCloseTo(400);
        });
    });

    describe('grid mode', function ()
    {
        it('should return a function in grid mode', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 2] });
            expect(typeof fn).toBe('function');
        });

        it('should return start for index 0 (origin cell) with default from', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 2] });
            // from=0 (fromValue), fromX=0%3=0, fromY=floor(0/3)=0
            // index=0: toX=0, toY=0, dist=0, output=0*100=0, return 0+0=0
            expect(fn(null, null, null, 0)).toBe(0);
        });

        it('should return positive value for non-origin cell in grid mode', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 2] });
            // index=2: toX=2, toY=0, dist=sqrt((0-2)^2+(0-0)^2)=2, output=2*100=200
            expect(fn(null, null, null, 2)).toBe(200);
        });

        it('should add start offset in grid mode', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 2], start: 50 });
            // index=0: gridSpace=0, output=0, return 0+50=50
            expect(fn(null, null, null, 0)).toBe(50);
        });

        it('should handle from="last" in grid mode', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 2], from: 'last' });
            // fromLast=true: fromX=3-1=2, fromY=2-1=1
            // index=5 (last cell): toX=2, toY=1, dist=0, output=0*100=0
            expect(fn(null, null, null, 5)).toBe(0);
        });

        it('should handle from="center" in grid mode', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 3], from: 'center' });
            // fromCenter: fromX=(3-1)/2=1, fromY=(3-1)/2=1
            // index=4 (center cell): toX=1, toY=1, dist=0, output=0
            expect(fn(null, null, null, 4)).toBe(0);
        });

        it('should compute correct distance for corner cells in grid mode with center', function ()
        {
            var fn = StaggerBuilder(1, { grid: [3, 3], from: 'center' });
            // fromCenter: fromX=1, fromY=1
            // index=0: toX=0, toY=0, dist=sqrt(1+1)=sqrt(2)
            // index=8: toX=2, toY=2, dist=sqrt(1+1)=sqrt(2)
            var r0 = fn(null, null, null, 0);
            var r8 = fn(null, null, null, 8);
            expect(r0).toBeCloseTo(r8);
        });

        it('should return start for out-of-bounds index in grid mode', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 2], start: 0 });
            // index=99: toX=99%3=0, toY=floor(99/3)=33, toY >= gridHeight(2), gridSpace=0
            expect(fn(null, null, null, 99)).toBe(0);
        });

        it('should handle range values in grid mode', function ()
        {
            var fn = StaggerBuilder([0, 100], { grid: [3, 1], from: 'first' });
            // from=0 (fromValue), grid=[3,1]: fromX=0, fromY=0
            // index=0: toX=0, toY=0, dist=0
            // index=2: toX=2, toY=0, dist=2 (gridMax=2)
            // isRange: diff=100-0=100, output=(2/2)*100=100
            // start += value1 => start=0+0=0
            expect(fn(null, null, null, 0)).toBe(0);
            expect(fn(null, null, null, 2)).toBeCloseTo(100);
        });

        it('should handle from=numeric in grid mode', function ()
        {
            var fn = StaggerBuilder(100, { grid: [3, 2], from: 4 });
            // fromValue=true, fromX=4%3=1, fromY=floor(4/3)=1
            // index=4 (toX=1, toY=1): dist=sqrt((1-1)^2+(1-1)^2)=0, output=0
            expect(fn(null, null, null, 4)).toBe(0);
        });
    });

    describe('edge cases', function ()
    {
        it('should handle a stagger value of 0', function ()
        {
            var fn = StaggerBuilder(0);
            expect(fn(null, null, null, 3, 5)).toBe(0);
        });

        it('should handle negative stagger value', function ()
        {
            var fn = StaggerBuilder(-100, { from: 'first' });
            expect(fn(null, null, null, 0, 5)).toBe(0);
            expect(fn(null, null, null, 1, 5)).toBe(-100);
            expect(fn(null, null, null, 2, 5)).toBe(-200);
        });

        it('should handle options being omitted entirely', function ()
        {
            var fn = StaggerBuilder(100);
            expect(typeof fn).toBe('function');
            expect(fn(null, null, null, 0, 3)).toBe(0);
        });

        it('should handle string-parsed float values', function ()
        {
            var fn = StaggerBuilder('50.5', { from: 'first' });
            expect(fn(null, null, null, 2, 5)).toBeCloseTo(101.0);
        });

        it('should handle range with equal values', function ()
        {
            var fn = StaggerBuilder([100, 100], { from: 'first' });
            // start=0+100=100, diff=0, spacing=0 always
            expect(fn(null, null, null, 0, 5)).toBe(100);
            expect(fn(null, null, null, 4, 5)).toBe(100);
        });

        it('should handle a 1x1 grid', function ()
        {
            var fn = StaggerBuilder(100, { grid: [1, 1] });
            // Only one cell: index=0, toX=0, toY=0, dist=0, output=0
            expect(fn(null, null, null, 0)).toBe(0);
        });
    });
});
