var SeparateY = require('../../../src/physics/arcade/SeparateY');
var ProcessY = require('../../../src/physics/arcade/ProcessY');

function createBody (overrides)
{
    var body = {
        immovable: false,
        customSeparateY: false,
        embedded: false
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

describe('Phaser.Physics.Arcade.SeparateY', function ()
{
    beforeEach(function ()
    {
        vi.spyOn(ProcessY, 'Set').mockReturnValue(0);
        vi.spyOn(ProcessY, 'Check').mockReturnValue(true);
        vi.spyOn(ProcessY, 'RunImmovableBody1').mockImplementation(function () {});
        vi.spyOn(ProcessY, 'RunImmovableBody2').mockImplementation(function () {});
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

        var result = SeparateY(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should return true when overlap is zero but both bodies are embedded', function ()
    {
        var body1 = createBody({ embedded: true });
        var body2 = createBody({ embedded: true });

        var result = SeparateY(body1, body2, false, 0, 0);

        expect(result).toBe(true);
    });

    it('should return false when overlap is zero and only one body is embedded', function ()
    {
        var body1 = createBody({ embedded: true });
        var body2 = createBody({ embedded: false });

        var result = SeparateY(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should return true when overlapOnly is true and overlap is non-zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        var result = SeparateY(body1, body2, true, 0, 10);

        expect(result).toBe(true);
    });

    it('should return false when overlapOnly is true and overlap is zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        var result = SeparateY(body1, body2, true, 0, 0);

        expect(result).toBe(false);
    });

    it('should not call ProcessY.Set when overlapOnly is true', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateY(body1, body2, true, 0, 10);

        expect(ProcessY.Set).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Both bodies immovable
    // -------------------------------------------------------------------------

    it('should return true when both bodies are immovable and overlap is non-zero', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody({ immovable: true });

        var result = SeparateY(body1, body2, false, 0, 5);

        expect(result).toBe(true);
    });

    it('should return false when both bodies are immovable and overlap is zero', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody({ immovable: true });

        var result = SeparateY(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should not call ProcessY.Set when both bodies are immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody({ immovable: true });

        SeparateY(body1, body2, false, 0, 5);

        expect(ProcessY.Set).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Custom separate logic
    // -------------------------------------------------------------------------

    it('should return true when body1 has customSeparateY and overlap is non-zero', function ()
    {
        var body1 = createBody({ customSeparateY: true });
        var body2 = createBody();

        var result = SeparateY(body1, body2, false, 0, 8);

        expect(result).toBe(true);
    });

    it('should return false when body1 has customSeparateY and overlap is zero', function ()
    {
        var body1 = createBody({ customSeparateY: true });
        var body2 = createBody();

        var result = SeparateY(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should return true when body2 has customSeparateY and overlap is non-zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ customSeparateY: true });

        var result = SeparateY(body1, body2, false, 0, 8);

        expect(result).toBe(true);
    });

    it('should return false when body2 has customSeparateY and overlap is zero', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ customSeparateY: true });

        var result = SeparateY(body1, body2, false, 0, 0);

        expect(result).toBe(false);
    });

    it('should not call ProcessY.Set when body1 has customSeparateY', function ()
    {
        var body1 = createBody({ customSeparateY: true });
        var body2 = createBody();

        SeparateY(body1, body2, false, 0, 8);

        expect(ProcessY.Set).not.toHaveBeenCalled();
    });

    it('should not call ProcessY.Set when body2 has customSeparateY', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ customSeparateY: true });

        SeparateY(body1, body2, false, 0, 8);

        expect(ProcessY.Set).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Normal separation — neither body immovable
    // -------------------------------------------------------------------------

    it('should call ProcessY.Set with both bodies and the overlap value', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateY(body1, body2, false, 0, 12);

        expect(ProcessY.Set).toHaveBeenCalledWith(body1, body2, 12);
    });

    it('should call ProcessY.Check when blockedState is 0', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        ProcessY.Set.mockReturnValue(0);

        SeparateY(body1, body2, false, 0, 12);

        expect(ProcessY.Check).toHaveBeenCalled();
    });

    it('should return the result of ProcessY.Check when blockedState is 0', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        ProcessY.Set.mockReturnValue(0);
        ProcessY.Check.mockReturnValue(false);

        var result = SeparateY(body1, body2, false, 0, 12);

        expect(result).toBe(false);
    });

    it('should return true without calling ProcessY.Check when blockedState is greater than 0', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        ProcessY.Set.mockReturnValue(1);

        var result = SeparateY(body1, body2, false, 0, 12);

        expect(result).toBe(true);
        expect(ProcessY.Check).not.toHaveBeenCalled();
    });

    it('should return true when blockedState is 2 and neither body is immovable', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        ProcessY.Set.mockReturnValue(2);

        var result = SeparateY(body1, body2, false, 0, 12);

        expect(result).toBe(true);
        expect(ProcessY.Check).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Body1 immovable, body2 movable
    // -------------------------------------------------------------------------

    it('should call ProcessY.RunImmovableBody1 when only body1 is immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.RunImmovableBody1).toHaveBeenCalled();
    });

    it('should pass blockedState to ProcessY.RunImmovableBody1', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        ProcessY.Set.mockReturnValue(1);

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.RunImmovableBody1).toHaveBeenCalledWith(1);
    });

    it('should return true when only body1 is immovable and there is overlap', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        var result = SeparateY(body1, body2, false, 0, 10);

        expect(result).toBe(true);
    });

    it('should not call ProcessY.Check when body1 is immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.Check).not.toHaveBeenCalled();
    });

    it('should not call ProcessY.RunImmovableBody2 when only body1 is immovable', function ()
    {
        var body1 = createBody({ immovable: true });
        var body2 = createBody();

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.RunImmovableBody2).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Body2 immovable, body1 movable
    // -------------------------------------------------------------------------

    it('should call ProcessY.RunImmovableBody2 when only body2 is immovable', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.RunImmovableBody2).toHaveBeenCalled();
    });

    it('should pass blockedState to ProcessY.RunImmovableBody2', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        ProcessY.Set.mockReturnValue(2);

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.RunImmovableBody2).toHaveBeenCalledWith(2);
    });

    it('should return true when only body2 is immovable and there is overlap', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        var result = SeparateY(body1, body2, false, 0, 10);

        expect(result).toBe(true);
    });

    it('should not call ProcessY.Check when body2 is immovable', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.Check).not.toHaveBeenCalled();
    });

    it('should not call ProcessY.RunImmovableBody1 when only body2 is immovable', function ()
    {
        var body1 = createBody();
        var body2 = createBody({ immovable: true });

        SeparateY(body1, body2, false, 0, 10);

        expect(ProcessY.RunImmovableBody1).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Overlap magnitude
    // -------------------------------------------------------------------------

    it('should pass negative overlap value directly to ProcessY.Set', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateY(body1, body2, false, 0, -15);

        expect(ProcessY.Set).toHaveBeenCalledWith(body1, body2, -15);
    });

    it('should call ProcessY.Set with a floating point overlap value', function ()
    {
        var body1 = createBody();
        var body2 = createBody();

        SeparateY(body1, body2, false, 0, 3.75);

        expect(ProcessY.Set).toHaveBeenCalledWith(body1, body2, 3.75);
    });
});
