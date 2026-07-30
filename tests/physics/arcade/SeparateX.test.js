var SeparateX = require('../../../src/physics/arcade/SeparateX');
var ProcessX = require('../../../src/physics/arcade/ProcessX');

function createBody (overrides)
{
    var body = {
        immovable: false,
        customSeparateX: false,
        embedded: false,
        velocity: { x: 0 },
        pushable: true,
        _dx: 0,
        bounce: { x: 0 },
        mass: 1,
        right: 100,
        x: 0,
        width: 100,
        blocked: { left: false, right: false, none: true },
        processX: vi.fn()
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            body[key] = overrides[key];
        }
    }

    return body;
}

describe('Phaser.Physics.Arcade.SeparateX', function ()
{
    var spySet;
    var spyCheck;
    var spyRunBody1;
    var spyRunBody2;

    beforeEach(function ()
    {
        spySet = vi.spyOn(ProcessX, 'Set').mockReturnValue(0);
        spyCheck = vi.spyOn(ProcessX, 'Check').mockReturnValue(true);
        spyRunBody1 = vi.spyOn(ProcessX, 'RunImmovableBody1').mockImplementation(function () {});
        spyRunBody2 = vi.spyOn(ProcessX, 'RunImmovableBody2').mockImplementation(function () {});
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    // -------------------------------------------------------------------------
    // Early-exit / overlap-only branch
    // -------------------------------------------------------------------------

    it('should return false when overlap is zero and bodies are not embedded', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        var result = SeparateX(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should return true when overlap is zero but both bodies are embedded', function ()
    {
        var body1 = createBody({ embedded: true });
        var body2 = createBody({ embedded: true });

        var result = SeparateX(body1, body2, false, 0, 0);

        expect(result).toBe(true);
    });

    it('should return false when overlap is zero and only one body is embedded', function ()
    {
        var body1 = createBody({ embedded: true });
        var body2 = createBody({ embedded: false });

        var result = SeparateX(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should return true when overlapOnly is true and overlap is non-zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        var result = SeparateX(body1, body2, true, 0, 10);

        expect(result).toBe(true);
    });

    it('should return false when overlapOnly is true and overlap is zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        var result = SeparateX(body1, body2, true, 0, 0);

        expect(result).toBe(false);
    });

    it('should not call ProcessX.Set when overlapOnly is true', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateX(body1, body2, true, 0, 10);

        expect(spySet).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Both bodies immovable
    // -------------------------------------------------------------------------

    it('should return true when both bodies are immovable and overlap is non-zero', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody({ immovable: true });

        var result = SeparateX(body1, body2, false, 0, 5);

        expect(result).toBe(true);
    });

    it('should return false when both bodies are immovable and overlap is zero', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody({ immovable: true });

        var result = SeparateX(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should not call ProcessX.Set when both bodies are immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody({ immovable: true });

        SeparateX(body1, body2, false, 0, 5);

        expect(spySet).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Custom separate logic
    // -------------------------------------------------------------------------

    it('should return true when body1 has customSeparateX and overlap is non-zero', function ()
    {
        var body1 = createBody({ customSeparateX: true });
        var body2 = createBody();

        var result = SeparateX(body1, body2, false, 0, 8);

        expect(result).toBe(true);
    });

    it('should return false when body1 has customSeparateX and overlap is zero', function ()
    {
        var body1 = createBody({ customSeparateX: true });
        var body2 = createBody();

        var result = SeparateX(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should return true when body2 has customSeparateX and overlap is non-zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ customSeparateX: true });

        var result = SeparateX(body1, body2, false, 0, 8);

        expect(result).toBe(true);
    });

    it('should return false when body2 has customSeparateX and overlap is zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ customSeparateX: true });

        var result = SeparateX(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should not call ProcessX.Set when body1 has customSeparateX', function ()
    {
        var body1 = createBody({ customSeparateX: true });
        var body2 = createBody();

        SeparateX(body1, body2, false, 0, 8);

        expect(spySet).not.toHaveBeenCalled();
    });

    it('should not call ProcessX.Set when body2 has customSeparateX', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ customSeparateX: true });

        SeparateX(body1, body2, false, 0, 8);

        expect(spySet).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Normal separation — neither body immovable
    // -------------------------------------------------------------------------

    it('should call ProcessX.Set with both bodies and the overlap value', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateX(body1, body2, false, 0, 12);

        expect(spySet).toHaveBeenCalledWith(body1, body2, 12);
    });

    it('should call ProcessX.Check when blockedState is 0', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        spySet.mockReturnValue(0);

        SeparateX(body1, body2, false, 0, 12);

        expect(spyCheck).toHaveBeenCalled();
    });

    it('should return the result of ProcessX.Check when blockedState is 0', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        spySet.mockReturnValue(0);
        spyCheck.mockReturnValue(false);

        var result = SeparateX(body1, body2, false, 0, 12);

        expect(result).toBe(false);
    });

    it('should return true and not call ProcessX.Check when blockedState is greater than 0', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        spySet.mockReturnValue(1);

        var result = SeparateX(body1, body2, false, 0, 12);

        expect(result).toBe(true);
        expect(spyCheck).not.toHaveBeenCalled();
    });

    it('should return true and not call ProcessX.Check when blockedState is 2', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        spySet.mockReturnValue(2);

        var result = SeparateX(body1, body2, false, 0, 12);

        expect(result).toBe(true);
        expect(spyCheck).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Body1 immovable, body2 movable
    // -------------------------------------------------------------------------

    it('should call ProcessX.RunImmovableBody1 when only body1 is immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        SeparateX(body1, body2, false, 0, 10);

        expect(spyRunBody1).toHaveBeenCalled();
    });

    it('should pass blockedState to ProcessX.RunImmovableBody1', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        spySet.mockReturnValue(1);

        SeparateX(body1, body2, false, 0, 10);

        expect(spyRunBody1).toHaveBeenCalledWith(1);
    });

    it('should return true when only body1 is immovable and there is overlap', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        var result = SeparateX(body1, body2, false, 0, 10);

        expect(result).toBe(true);
    });

    it('should not call ProcessX.Check when body1 is immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        SeparateX(body1, body2, false, 0, 10);

        expect(spyCheck).not.toHaveBeenCalled();
    });

    it('should not call ProcessX.RunImmovableBody2 when only body1 is immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        SeparateX(body1, body2, false, 0, 10);

        expect(spyRunBody2).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Body2 immovable, body1 movable
    // -------------------------------------------------------------------------

    it('should call ProcessX.RunImmovableBody2 when only body2 is immovable', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        SeparateX(body1, body2, false, 0, 10);

        expect(spyRunBody2).toHaveBeenCalled();
    });

    it('should pass blockedState to ProcessX.RunImmovableBody2', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        spySet.mockReturnValue(2);

        SeparateX(body1, body2, false, 0, 10);

        expect(spyRunBody2).toHaveBeenCalledWith(2);
    });

    it('should return true when only body2 is immovable and there is overlap', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        var result = SeparateX(body1, body2, false, 0, 10);

        expect(result).toBe(true);
    });

    it('should not call ProcessX.Check when body2 is immovable', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        SeparateX(body1, body2, false, 0, 10);

        expect(spyCheck).not.toHaveBeenCalled();
    });

    it('should not call ProcessX.RunImmovableBody1 when only body2 is immovable', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        SeparateX(body1, body2, false, 0, 10);

        expect(spyRunBody1).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Overlap value forwarding
    // -------------------------------------------------------------------------

    it('should forward a negative overlap value to ProcessX.Set', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateX(body1, body2, false, 0, -15);

        expect(spySet).toHaveBeenCalledWith(body1, body2, -15);
    });

    it('should forward a floating point overlap value to ProcessX.Set', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateX(body1, body2, false, 0, 3.75);

        expect(spySet).toHaveBeenCalledWith(body1, body2, 3.75);
    });
});
