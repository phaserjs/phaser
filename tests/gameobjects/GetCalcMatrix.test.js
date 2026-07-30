var GetCalcMatrix = require('../../src/gameobjects/GetCalcMatrix');
var TransformMatrix = require('../../src/gameobjects/components/TransformMatrix');

function makeSrc (overrides)
{
    var defaults = {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        scrollFactorX: 1,
        scrollFactorY: 1
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            defaults[key] = overrides[key];
        }
    }

    return defaults;
}

function makeCamera (overrides)
{
    var cam = {
        scrollX: 0,
        scrollY: 0,
        matrix: new TransformMatrix(),
        matrixCombined: new TransformMatrix(),
        matrixExternal: new TransformMatrix()
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            cam[key] = overrides[key];
        }
    }

    return cam;
}

describe('Phaser.GameObjects.GetCalcMatrix', function ()
{
    it('should be importable', function ()
    {
        expect(GetCalcMatrix).toBeDefined();
    });

    it('should return an object with camera, sprite, calc, and cameraExternal properties', function ()
    {
        var src = makeSrc();
        var camera = makeCamera();

        var result = GetCalcMatrix(src, camera);

        expect(result).toBeDefined();
        expect(result.camera).toBeDefined();
        expect(result.sprite).toBeDefined();
        expect(result.calc).toBeDefined();
        expect(result.cameraExternal).toBeDefined();
    });

    it('should return TransformMatrix instances for all result properties', function ()
    {
        var src = makeSrc();
        var camera = makeCamera();

        var result = GetCalcMatrix(src, camera);

        expect(result.camera).toBeInstanceOf(TransformMatrix);
        expect(result.sprite).toBeInstanceOf(TransformMatrix);
        expect(result.calc).toBeInstanceOf(TransformMatrix);
        expect(result.cameraExternal).toBeInstanceOf(TransformMatrix);
    });

    it('should apply sprite position to the sprite matrix', function ()
    {
        var src = makeSrc({ x: 100, y: 200 });
        var camera = makeCamera();

        var result = GetCalcMatrix(src, camera);

        expect(result.sprite.tx).toBeCloseTo(100);
        expect(result.sprite.ty).toBeCloseTo(200);
    });

    it('should apply sprite scale to the sprite matrix', function ()
    {
        var src = makeSrc({ x: 0, y: 0, scaleX: 2, scaleY: 3 });
        var camera = makeCamera();

        var result = GetCalcMatrix(src, camera);

        expect(result.sprite.a).toBeCloseTo(2);
        expect(result.sprite.d).toBeCloseTo(3);
    });

    it('should apply sprite rotation to the sprite matrix', function ()
    {
        var angle = Math.PI / 4;
        var src = makeSrc({ rotation: angle, scaleX: 1, scaleY: 1 });
        var camera = makeCamera();

        var result = GetCalcMatrix(src, camera);

        expect(result.sprite.a).toBeCloseTo(Math.cos(angle));
        expect(result.sprite.b).toBeCloseTo(Math.sin(angle));
        expect(result.sprite.c).toBeCloseTo(-Math.sin(angle));
        expect(result.sprite.d).toBeCloseTo(Math.cos(angle));
    });

    it('should copy camera matrixCombined into the cam matrix when ignoreCameraPosition is false', function ()
    {
        var combined = new TransformMatrix(2, 0, 0, 2, 50, 60);
        var camera = makeCamera({ matrixCombined: combined, scrollX: 0, scrollY: 0 });
        var src = makeSrc({ scrollFactorX: 1, scrollFactorY: 1 });

        var result = GetCalcMatrix(src, camera);

        expect(result.camera.a).toBeCloseTo(2);
        expect(result.camera.d).toBeCloseTo(2);
    });

    it('should use camera.matrix instead of matrixCombined when ignoreCameraPosition is true', function ()
    {
        var mat = new TransformMatrix(3, 0, 0, 3, 0, 0);
        var combined = new TransformMatrix(1, 0, 0, 1, 0, 0);
        var camera = makeCamera({ matrix: mat, matrixCombined: combined, scrollX: 0, scrollY: 0 });
        var src = makeSrc({ scrollFactorX: 1, scrollFactorY: 1 });

        var result = GetCalcMatrix(src, camera, null, true);

        expect(result.camera.a).toBeCloseTo(3);
        expect(result.camera.d).toBeCloseTo(3);
    });

    it('should set cameraExternal to identity when ignoreCameraPosition is true', function ()
    {
        var extMatrix = new TransformMatrix(5, 0, 0, 5, 100, 200);
        var camera = makeCamera({ matrixExternal: extMatrix, scrollX: 0, scrollY: 0 });
        var src = makeSrc();

        var result = GetCalcMatrix(src, camera, null, true);

        expect(result.cameraExternal.a).toBeCloseTo(1);
        expect(result.cameraExternal.b).toBeCloseTo(0);
        expect(result.cameraExternal.c).toBeCloseTo(0);
        expect(result.cameraExternal.d).toBeCloseTo(1);
        expect(result.cameraExternal.tx).toBeCloseTo(0);
        expect(result.cameraExternal.ty).toBeCloseTo(0);
    });

    it('should copy camera matrixExternal into cameraExternal when ignoreCameraPosition is false', function ()
    {
        var extMatrix = new TransformMatrix(4, 0, 0, 4, 10, 20);
        var camera = makeCamera({ matrixExternal: extMatrix, scrollX: 0, scrollY: 0 });
        var src = makeSrc();

        var result = GetCalcMatrix(src, camera, null, false);

        expect(result.cameraExternal.a).toBeCloseTo(4);
        expect(result.cameraExternal.d).toBeCloseTo(4);
        expect(result.cameraExternal.tx).toBeCloseTo(10);
        expect(result.cameraExternal.ty).toBeCloseTo(20);
    });

    it('should multiply parentMatrix into calc matrix when provided', function ()
    {
        var src = makeSrc({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 });
        var camera = makeCamera({ scrollX: 0, scrollY: 0 });
        var parentMatrix = new TransformMatrix(2, 0, 0, 2, 0, 0);

        var resultWithParent = GetCalcMatrix(src, camera, parentMatrix);
        var calcWithParent = resultWithParent.calc.a;

        var resultWithout = GetCalcMatrix(src, camera, null);
        var calcWithout = resultWithout.calc.a;

        expect(calcWithParent).not.toBe(calcWithout);
        expect(calcWithParent).toBeCloseTo(2);
    });

    it('should produce identity-like calc matrix for a default src and camera with no parent', function ()
    {
        var src = makeSrc();
        var camera = makeCamera({ scrollX: 0, scrollY: 0 });

        var result = GetCalcMatrix(src, camera, null);

        expect(result.calc.a).toBeCloseTo(1);
        expect(result.calc.b).toBeCloseTo(0);
        expect(result.calc.c).toBeCloseTo(0);
        expect(result.calc.d).toBeCloseTo(1);
        expect(result.calc.tx).toBeCloseTo(0);
        expect(result.calc.ty).toBeCloseTo(0);
    });

    it('should factor scroll offset into camera matrix translation when scrollFactor is 1', function ()
    {
        var combined = new TransformMatrix(1, 0, 0, 1, 0, 0);
        var camera = makeCamera({ matrixCombined: combined, scrollX: 50, scrollY: 80 });
        var src = makeSrc({ scrollFactorX: 1, scrollFactorY: 1 });

        var result = GetCalcMatrix(src, camera);

        // scrollFactor of 1 means (1 - 1) = 0, no scroll offset applied
        expect(result.camera.tx).toBeCloseTo(0);
        expect(result.camera.ty).toBeCloseTo(0);
    });

    it('should apply scroll offset when scrollFactor is 0', function ()
    {
        var combined = new TransformMatrix(1, 0, 0, 1, 0, 0);
        var camera = makeCamera({ matrixCombined: combined, scrollX: 50, scrollY: 80 });
        var src = makeSrc({ scrollFactorX: 0, scrollFactorY: 0 });

        var result = GetCalcMatrix(src, camera);

        // scrollFactor of 0 means (1 - 0) = 1, full scroll offset applied
        expect(result.camera.tx).toBeCloseTo(50);
        expect(result.camera.ty).toBeCloseTo(80);
    });

    it('should return the same result object reference on each call', function ()
    {
        var src = makeSrc();
        var camera = makeCamera();

        var result1 = GetCalcMatrix(src, camera);
        var result2 = GetCalcMatrix(src, camera);

        expect(result1).toBe(result2);
    });

    it('should handle zero scale values without throwing', function ()
    {
        var src = makeSrc({ scaleX: 0, scaleY: 0 });
        var camera = makeCamera();

        expect(function ()
        {
            GetCalcMatrix(src, camera);
        }).not.toThrow();

        var result = GetCalcMatrix(src, camera);
        expect(result.sprite.a).toBeCloseTo(0);
        expect(result.sprite.d).toBeCloseTo(0);
    });

    it('should handle negative scale values', function ()
    {
        var src = makeSrc({ scaleX: -1, scaleY: -2 });
        var camera = makeCamera();

        var result = GetCalcMatrix(src, camera);

        expect(result.sprite.a).toBeCloseTo(-1);
        expect(result.sprite.d).toBeCloseTo(-2);
    });

    it('should handle negative position values', function ()
    {
        var src = makeSrc({ x: -100, y: -200 });
        var camera = makeCamera();

        var result = GetCalcMatrix(src, camera);

        expect(result.sprite.tx).toBeCloseTo(-100);
        expect(result.sprite.ty).toBeCloseTo(-200);
    });

    it('should handle partial scroll factor correctly', function ()
    {
        var combined = new TransformMatrix(1, 0, 0, 1, 0, 0);
        var camera = makeCamera({ matrixCombined: combined, scrollX: 100, scrollY: 100 });
        var src = makeSrc({ scrollFactorX: 0.5, scrollFactorY: 0.5 });

        var result = GetCalcMatrix(src, camera);

        // (1 - 0.5) * 100 = 50
        expect(result.camera.tx).toBeCloseTo(50);
        expect(result.camera.ty).toBeCloseTo(50);
    });
});
