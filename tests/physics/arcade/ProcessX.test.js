var ProcessX = require('../../../src/physics/arcade/ProcessX');

// Helper: create a mock body with sensible defaults
function createBody (opts)
{
    opts = opts || {};

    return {
        velocity: { x: opts.velocityX !== undefined ? opts.velocityX : 0 },
        _dx: opts._dx !== undefined ? opts._dx : 0,
        x: opts.x !== undefined ? opts.x : 0,
        right: opts.right !== undefined ? opts.right : 10,
        bounce: { x: opts.bounceX !== undefined ? opts.bounceX : 0 },
        mass: opts.mass !== undefined ? opts.mass : 1,
        pushable: opts.pushable !== undefined ? opts.pushable : true,
        blocked: {
            left: opts.blockedLeft || false,
            right: opts.blockedRight || false
        },
        moves: opts.moves || false,
        directControl: opts.directControl || false,
        y: opts.y !== undefined ? opts.y : 0,
        prev: { y: opts.prevY !== undefined ? opts.prevY : 0 },
        autoFrame: { y: opts.autoFrameY !== undefined ? opts.autoFrameY : 0 },
        friction: { y: opts.frictionY !== undefined ? opts.frictionY : 1 },
        _dy: 0,
        processX: vi.fn()
    };
}

// body1 is to the left of body2:
//   |body1.right - body2.x| small, |body2.right - body1.x| large
function makeBody1OnLeft (b1opts, b2opts)
{
    b1opts = b1opts || {};
    b2opts = b2opts || {};

    b1opts.x = b1opts.x !== undefined ? b1opts.x : 0;
    b1opts.right = b1opts.right !== undefined ? b1opts.right : 10;
    b2opts.x = b2opts.x !== undefined ? b2opts.x : 8;
    b2opts.right = b2opts.right !== undefined ? b2opts.right : 20;

    return {
        b1: createBody(b1opts),
        b2: createBody(b2opts)
    };
}

// body2 is to the left of body1:
//   |body1.right - body2.x| large, |body2.right - body1.x| small
function makeBody2OnLeft (b1opts, b2opts)
{
    b1opts = b1opts || {};
    b2opts = b2opts || {};

    b1opts.x = b1opts.x !== undefined ? b1opts.x : 10;
    b1opts.right = b1opts.right !== undefined ? b1opts.right : 20;
    b2opts.x = b2opts.x !== undefined ? b2opts.x : 0;
    b2opts.right = b2opts.right !== undefined ? b2opts.right : 12;

    return {
        b1: createBody(b1opts),
        b2: createBody(b2opts)
    };
}

describe('Phaser.Physics.Arcade.ProcessX.Set', function ()
{
    it('should return 0 when neither body is blocked in its direction of travel', function ()
    {
        var bodies = makeBody1OnLeft({ _dx: 1 }, {});
        var result = ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(result).toBe(0);
    });

    it('should return 1 when body1 is moving right, body1 is on left, and body2 is blocked right', function ()
    {
        var bodies = makeBody1OnLeft({ _dx: 1 }, { blockedRight: true });
        var result = ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(result).toBe(1);
    });

    it('should call body1.processX with negative overlap when body1 blocked moving right', function ()
    {
        var bodies = makeBody1OnLeft({ _dx: 1 }, { blockedRight: true });
        ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(bodies.b1.processX).toHaveBeenCalledOnce();
        var args = bodies.b1.processX.mock.calls[0];
        expect(args[0]).toBe(-5);
    });

    it('should return 1 when body1 is moving left, body2 is on left, and body2 is blocked left', function ()
    {
        var bodies = makeBody2OnLeft({ _dx: -1 }, { blockedLeft: true });
        var result = ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(result).toBe(1);
    });

    it('should call body1.processX with positive overlap when body1 blocked moving left', function ()
    {
        var bodies = makeBody2OnLeft({ _dx: -1 }, { blockedLeft: true });
        ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(bodies.b1.processX).toHaveBeenCalledOnce();
        var args = bodies.b1.processX.mock.calls[0];
        expect(args[0]).toBe(5);
    });

    it('should return 2 when body2 is moving right, body2 is on left, and body1 is blocked right', function ()
    {
        var bodies = makeBody2OnLeft({ blockedRight: true }, { _dx: 1 });
        var result = ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(result).toBe(2);
    });

    it('should call body2.processX with negative overlap when body2 blocked moving right', function ()
    {
        var bodies = makeBody2OnLeft({ blockedRight: true }, { _dx: 1 });
        ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(bodies.b2.processX).toHaveBeenCalledOnce();
        var args = bodies.b2.processX.mock.calls[0];
        expect(args[0]).toBe(-5);
    });

    it('should return 2 when body2 is moving left, body1 is on left, and body1 is blocked left', function ()
    {
        var bodies = makeBody1OnLeft({ blockedLeft: true }, { _dx: -1 });
        var result = ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(result).toBe(2);
    });

    it('should call body2.processX with positive overlap when body2 blocked moving left', function ()
    {
        var bodies = makeBody1OnLeft({ blockedLeft: true }, { _dx: -1 });
        ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(bodies.b2.processX).toHaveBeenCalledOnce();
        var args = bodies.b2.processX.mock.calls[0];
        expect(args[0]).toBe(5);
    });

    it('should use the absolute value of a negative overlap', function ()
    {
        // body1 moving right, body2 blocked right -> processX(-overlap, ...)
        // passing ov=-5 should give overlap=5, so processX arg[0]=-5
        var bodies = makeBody1OnLeft({ _dx: 1 }, { blockedRight: true });
        ProcessX.Set(bodies.b1, bodies.b2, -5);

        var args = bodies.b1.processX.mock.calls[0];
        expect(args[0]).toBe(-5);
    });

    it('should compute body1FullImpact as v2 - v1 * bounce.x (zero bounce)', function ()
    {
        // body1FullImpact = v2 - v1 * bounce.x
        // With bounce=0: body1FullImpact = v2 = 3
        var bodies = makeBody1OnLeft(
            { _dx: 1, velocityX: 5, bounceX: 0 },
            { velocityX: 3, blockedRight: true }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 8);

        var args = bodies.b1.processX.mock.calls[0];
        expect(args[1]).toBeCloseTo(3);
    });

    it('should compute body1FullImpact as v2 - v1 * bounce.x (nonzero bounce)', function ()
    {
        // body1FullImpact = v2 - v1 * bounce.x = 3 - 5 * 0.5 = 0.5
        var bodies = makeBody1OnLeft(
            { _dx: 1, velocityX: 5, bounceX: 0.5 },
            { velocityX: 3, blockedRight: true }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 8);

        var args = bodies.b1.processX.mock.calls[0];
        expect(args[1]).toBeCloseTo(0.5);
    });

    it('should compute body2FullImpact as v1 - v2 * bounce.x (zero bounce)', function ()
    {
        // body2FullImpact = v1 - v2 * bounce.x = 4 - 0 = 4
        var bodies = makeBody1OnLeft(
            { blockedLeft: true, velocityX: 4 },
            { _dx: -1, velocityX: 0, bounceX: 0 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 6);

        var args = bodies.b2.processX.mock.calls[0];
        expect(args[1]).toBeCloseTo(4);
    });

    it('should compute body2FullImpact as v1 - v2 * bounce.x (nonzero bounce)', function ()
    {
        // body2FullImpact = v1 - v2 * bounce.x = 4 - 2 * 0.5 = 3
        var bodies = makeBody1OnLeft(
            { blockedLeft: true, velocityX: 4 },
            { _dx: -1, velocityX: 2, bounceX: 0.5 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 6);

        var args = bodies.b2.processX.mock.calls[0];
        expect(args[1]).toBeCloseTo(3);
    });

    it('should not fire BlockCheck when conditions do not match any blocked branch', function ()
    {
        var bodies = makeBody1OnLeft({ _dx: 0 }, {});
        ProcessX.Set(bodies.b1, bodies.b2, 5);

        expect(bodies.b1.processX).not.toHaveBeenCalled();
        expect(bodies.b2.processX).not.toHaveBeenCalled();
    });
});

describe('Phaser.Physics.Arcade.ProcessX.Check', function ()
{
    it('should return false when no movement scenario matches', function ()
    {
        // Both stationary, no direction
        var bodies = makeBody1OnLeft({ _dx: 0 }, { _dx: 0 });
        ProcessX.Set(bodies.b1, bodies.b2, 5);

        var result = ProcessX.Check();

        expect(result).toBe(false);
    });

    it('should return true and call processX when body1 moving left, body2 on left (side 0)', function ()
    {
        // body1 moving left (_dx < 0), body2 on left -> Run(0)
        var bodies = makeBody2OnLeft({ _dx: -1, velocityX: -5 }, { _dx: 0, velocityX: 0 });
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        var result = ProcessX.Check();

        expect(result).toBe(true);
        expect(bodies.b1.processX).toHaveBeenCalled();
    });

    it('should return true and call processX when body2 moving left, body1 on left (side 1)', function ()
    {
        // body2 moving left (_dx < 0), body1 on left -> Run(1)
        var bodies = makeBody1OnLeft({ _dx: 0, velocityX: 0 }, { _dx: -1, velocityX: -5 });
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        var result = ProcessX.Check();

        expect(result).toBe(true);
        expect(bodies.b2.processX).toHaveBeenCalled();
    });

    it('should return true and call processX when body1 moving right, body1 on left (side 2)', function ()
    {
        // body1 moving right (_dx > 0), body1 on left -> Run(2)
        var bodies = makeBody1OnLeft({ _dx: 1, velocityX: 5 }, { _dx: 0, velocityX: 0 });
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        var result = ProcessX.Check();

        expect(result).toBe(true);
        expect(bodies.b1.processX).toHaveBeenCalled();
    });

    it('should return true and call processX when body2 moving right, body2 on left (side 3)', function ()
    {
        // body2 moving right (_dx > 0), body2 on left -> Run(3)
        var bodies = makeBody2OnLeft({ _dx: 0, velocityX: 0 }, { _dx: 1, velocityX: 5 });
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        var result = ProcessX.Check();

        expect(result).toBe(true);
        expect(bodies.b2.processX).toHaveBeenCalled();
    });

    it('should compute mass-adjusted impacts using equal masses and equal velocities', function ()
    {
        // equal mass, equal speed => nv1 = nv2 = |v|, avg = |v|, nv1 -= avg => 0
        // body1MassImpact = avg + 0 * bounce = avg = |v|
        // With bounce=0 and v1=-5, v2=5, mass=1:
        //   nv1 = sqrt(25*1/1) * 1 = 5 (v2>0)
        //   nv2 = sqrt(25*1/1) * -1 = -5 (v1<0)
        //   avg = (5 + -5) * 0.5 = 0
        //   nv1 = 5 - 0 = 5, nv2 = -5 - 0 = -5
        //   body1MassImpact = 0 + 5 * 0 = 0
        //   body2MassImpact = 0 + (-5) * 0 = 0
        var bodies = makeBody1OnLeft(
            { _dx: 1, velocityX: 5, bounceX: 0, mass: 1 },
            { _dx: 0, velocityX: -5, bounceX: 0, mass: 1 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.Check();

        // Both pushable, side 2 (body1 moving right, body1 on left) -> processX(-halfOverlap, body1MassImpact)
        var b1args = bodies.b1.processX.mock.calls[0];
        expect(b1args[1]).toBeCloseTo(0);
    });
});

describe('Phaser.Physics.Arcade.ProcessX.Run', function ()
{
    describe('both bodies pushable', function ()
    {
        it('should call processX on both bodies with half overlap (side 0)', function ()
        {
            // side 0: body1 moving left, body2 on left
            var bodies = makeBody2OnLeft(
                { _dx: -1, velocityX: -5, pushable: true },
                { _dx: 0, velocityX: 0, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            var result = ProcessX.Run(0);

            expect(result).toBe(true);
            expect(bodies.b1.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX).toHaveBeenCalledOnce();
            // overlap was 10 * 0.5 = 5
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(-5);
        });

        it('should call processX on both bodies with half overlap (side 1)', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 0, velocityX: 0, pushable: true },
                { _dx: -1, velocityX: -5, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            var result = ProcessX.Run(1);

            expect(result).toBe(true);
            // side 1: body1.processX(-halfOverlap, ...) body2.processX(halfOverlap, ...)
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(-5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(5);
        });

        it('should call processX on both bodies with half overlap (side 2)', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 1, velocityX: 5, pushable: true },
                { _dx: 0, velocityX: 0, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(2);

            // side 2 (else branch): body1.processX(-halfOverlap, ...) body2.processX(halfOverlap, ...)
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(-5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(5);
        });

        it('should call processX on both bodies with half overlap (side 3)', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: 0, velocityX: 0, pushable: true },
                { _dx: 1, velocityX: 5, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(3);

            // side 3 (side===0||3 branch): body1.processX(halfOverlap, ...) body2.processX(-halfOverlap, ...)
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(-5);
        });
    });

    describe('body1 pushable, body2 not pushable', function ()
    {
        it('should call processX only on body1 with positive overlap (side 0)', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: -1, velocityX: -5, pushable: true },
                { _dx: 0, velocityX: 0, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(0);

            expect(bodies.b1.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX).not.toHaveBeenCalled();
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(10);
            expect(bodies.b1.processX.mock.calls[0][2]).toBe(true);
        });

        it('should call processX only on body1 with negative overlap (side 1)', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 0, velocityX: 0, pushable: true },
                { _dx: -1, velocityX: -5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(1);

            expect(bodies.b1.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX).not.toHaveBeenCalled();
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(-10);
        });

        it('should call processX only on body1 with negative overlap (side 2)', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 1, velocityX: 5, pushable: true },
                { _dx: 0, velocityX: 0, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(2);

            expect(bodies.b1.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX).not.toHaveBeenCalled();
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(-10);
        });

        it('should call processX only on body1 with positive overlap (side 3)', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: 0, velocityX: 0, pushable: true },
                { _dx: 1, velocityX: 5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(3);

            expect(bodies.b1.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX).not.toHaveBeenCalled();
            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(10);
        });
    });

    describe('body1 not pushable, body2 pushable', function ()
    {
        it('should call processX only on body2 with negative overlap (side 0)', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: -1, velocityX: -5, pushable: false },
                { _dx: 0, velocityX: 0, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(0);

            expect(bodies.b1.processX).not.toHaveBeenCalled();
            expect(bodies.b2.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(-10);
        });

        it('should call processX only on body2 with positive overlap (side 1)', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 0, velocityX: 0, pushable: false },
                { _dx: -1, velocityX: -5, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(1);

            expect(bodies.b1.processX).not.toHaveBeenCalled();
            expect(bodies.b2.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(10);
        });

        it('should call processX only on body2 with positive overlap (side 2)', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 1, velocityX: 5, pushable: false },
                { _dx: 0, velocityX: 0, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(2);

            expect(bodies.b1.processX).not.toHaveBeenCalled();
            expect(bodies.b2.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(10);
        });

        it('should call processX only on body2 with negative overlap (side 3)', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: 0, velocityX: 0, pushable: false },
                { _dx: 1, velocityX: 5, pushable: true }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(3);

            expect(bodies.b1.processX).not.toHaveBeenCalled();
            expect(bodies.b2.processX).toHaveBeenCalledOnce();
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(-10);
        });
    });

    describe('neither body pushable', function ()
    {
        it('side 0: body2 stationary - body1 gets full overlap, body2 gets zero', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: -1, velocityX: -5, pushable: false },
                { _dx: 0, velocityX: 0, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(0);

            var b1args = bodies.b1.processX.mock.calls[0];
            var b2args = bodies.b2.processX.mock.calls[0];
            expect(b1args[0]).toBeCloseTo(10);  // full overlap
            expect(b1args[1]).toBe(0);
            expect(b1args[2]).toBe(true);
            expect(b2args[0]).toBeCloseTo(0);
            expect(b2args[1]).toBeNull();
        });

        it('side 0: body2 moving right - both get half overlap', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: -1, velocityX: -5, pushable: false },
                { _dx: 1, velocityX: 3, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(0);

            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(-5);
        });

        it('side 0: body2 moving same direction - body1 gets body2 velocity', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: -1, velocityX: -5, pushable: false },
                { _dx: -1, velocityX: -3, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(0);

            var b1args = bodies.b1.processX.mock.calls[0];
            expect(b1args[0]).toBeCloseTo(5);
            expect(b1args[1]).toBeCloseTo(-3);  // body2.velocity.x
        });

        it('side 1: body1 stationary - body1 gets zero, body2 gets full overlap', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 0, velocityX: 0, pushable: false },
                { _dx: -1, velocityX: -5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(1);

            var b1args = bodies.b1.processX.mock.calls[0];
            var b2args = bodies.b2.processX.mock.calls[0];
            expect(b1args[0]).toBeCloseTo(0);
            expect(b1args[1]).toBeNull();
            expect(b2args[0]).toBeCloseTo(10);
            expect(b2args[1]).toBe(0);
        });

        it('side 1: body1 moving right - both get half overlap', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 1, velocityX: 3, pushable: false },
                { _dx: -1, velocityX: -5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(1);

            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(-5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(5);
        });

        it('side 1: body1 moving same direction - body2 gets body1 velocity', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: -1, velocityX: -3, pushable: false },
                { _dx: -1, velocityX: -5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(1);

            var b2args = bodies.b2.processX.mock.calls[0];
            expect(b2args[1]).toBeCloseTo(-3);  // body1.velocity.x
        });

        it('side 2: body2 stationary - body1 gets negative full overlap, body2 gets zero', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 1, velocityX: 5, pushable: false },
                { _dx: 0, velocityX: 0, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(2);

            var b1args = bodies.b1.processX.mock.calls[0];
            var b2args = bodies.b2.processX.mock.calls[0];
            expect(b1args[0]).toBeCloseTo(-10);
            expect(b1args[1]).toBe(0);
            expect(b2args[0]).toBeCloseTo(0);
            expect(b2args[1]).toBeNull();
        });

        it('side 2: body2 moving left - both get half overlap', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 1, velocityX: 5, pushable: false },
                { _dx: -1, velocityX: -3, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(2);

            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(-5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(5);
        });

        it('side 2: body2 moving same direction - body1 gets body2 velocity', function ()
        {
            var bodies = makeBody1OnLeft(
                { _dx: 1, velocityX: 5, pushable: false },
                { _dx: 1, velocityX: 3, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(2);

            var b1args = bodies.b1.processX.mock.calls[0];
            expect(b1args[1]).toBeCloseTo(3);  // body2.velocity.x
        });

        it('side 3: body1 stationary - body1 gets zero, body2 gets negative full overlap', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: 0, velocityX: 0, pushable: false },
                { _dx: 1, velocityX: 5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(3);

            var b1args = bodies.b1.processX.mock.calls[0];
            var b2args = bodies.b2.processX.mock.calls[0];
            expect(b1args[0]).toBeCloseTo(0);
            expect(b1args[1]).toBeNull();
            expect(b2args[0]).toBeCloseTo(-10);
            expect(b2args[1]).toBe(0);
        });

        it('side 3: body1 moving left - both get half overlap', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: -1, velocityX: -3, pushable: false },
                { _dx: 1, velocityX: 5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(3);

            expect(bodies.b1.processX.mock.calls[0][0]).toBeCloseTo(5);
            expect(bodies.b2.processX.mock.calls[0][0]).toBeCloseTo(-5);
        });

        it('side 3: body1 moving same direction - body1 gets body2 velocity', function ()
        {
            var bodies = makeBody2OnLeft(
                { _dx: 1, velocityX: 3, pushable: false },
                { _dx: 1, velocityX: 5, pushable: false }
            );
            ProcessX.Set(bodies.b1, bodies.b2, 10);
            bodies.b1.processX.mockClear();
            bodies.b2.processX.mockClear();

            ProcessX.Run(3);

            var b1args = bodies.b1.processX.mock.calls[0];
            expect(b1args[1]).toBeCloseTo(5);  // body2.velocity.x
        });
    });

    it('should always return true', function ()
    {
        var bodies = makeBody1OnLeft(
            { _dx: 1, velocityX: 5, pushable: true },
            { _dx: 0, velocityX: 0, pushable: true }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        expect(ProcessX.Run(0)).toBe(true);
        expect(ProcessX.Run(1)).toBe(true);
        expect(ProcessX.Run(2)).toBe(true);
        expect(ProcessX.Run(3)).toBe(true);
    });
});

describe('Phaser.Physics.Arcade.ProcessX.RunImmovableBody1', function ()
{
    it('should zero body2 velocity when blockedState is 1', function ()
    {
        var bodies = makeBody1OnLeft({}, { velocityX: 50 });
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b2.velocity.x = 50;
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody1(1);

        expect(bodies.b2.velocity.x).toBe(0);
        expect(bodies.b2.processX).not.toHaveBeenCalled();
    });

    it('should call body2.processX with positive overlap when body1 is on left and blockedState != 1', function ()
    {
        // body1 on left, normal case
        var bodies = makeBody1OnLeft({}, {});
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody1(0);

        expect(bodies.b2.processX).toHaveBeenCalledOnce();
        var args = bodies.b2.processX.mock.calls[0];
        expect(args[0]).toBeCloseTo(10);
        expect(args[2]).toBe(true);
    });

    it('should call body2.processX with negative overlap when body2 is on left and blockedState != 1', function ()
    {
        // body2 on left
        var bodies = makeBody2OnLeft({}, {});
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody1(0);

        expect(bodies.b2.processX).toHaveBeenCalledOnce();
        var args = bodies.b2.processX.mock.calls[0];
        expect(args[0]).toBeCloseTo(-10);
    });

    it('should not adjust body2.y when body1.moves is false', function ()
    {
        var bodies = makeBody1OnLeft({ moves: false }, {});
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b2.y = 100;
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody1(0);

        expect(bodies.b2.y).toBe(100);
    });

    it('should adjust body2.y using body1.prev.y when body1.moves is true and not directControl', function ()
    {
        var bodies = makeBody1OnLeft(
            { moves: true, directControl: false, y: 50, prevY: 40, frictionY: 1 },
            { y: 200, prevY: 200 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody1(0);

        // body1Distance = body1.y - body1.prev.y = 50 - 40 = 10
        // body2.y += 10 * 1 = 10 → 210
        expect(bodies.b2.y).toBeCloseTo(210);
        expect(bodies.b2._dy).toBeCloseTo(10); // 210 - 200
    });

    it('should adjust body2.y using body1.autoFrame.y when body1.moves and directControl are true', function ()
    {
        var bodies = makeBody1OnLeft(
            { moves: true, directControl: true, y: 50, autoFrameY: 45, frictionY: 2 },
            { y: 200, prevY: 200 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody1(0);

        // body1Distance = body1.y - body1.autoFrame.y = 50 - 45 = 5
        // body2.y += 5 * 2 = 10 → 210
        expect(bodies.b2.y).toBeCloseTo(210);
        expect(bodies.b2._dy).toBeCloseTo(10);
    });

    it('should scale body2.y adjustment by body1.friction.y', function ()
    {
        var bodies = makeBody1OnLeft(
            { moves: true, directControl: false, y: 60, prevY: 50, frictionY: 0.5 },
            { y: 100, prevY: 100 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody1(0);

        // body1Distance = 10, friction = 0.5 → body2.y += 5 → 105
        expect(bodies.b2.y).toBeCloseTo(105);
        expect(bodies.b2._dy).toBeCloseTo(5);
    });
});

describe('Phaser.Physics.Arcade.ProcessX.RunImmovableBody2', function ()
{
    it('should zero body1 velocity when blockedState is 2', function ()
    {
        var bodies = makeBody1OnLeft({ velocityX: 50 }, {});
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b1.velocity.x = 50;
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody2(2);

        expect(bodies.b1.velocity.x).toBe(0);
        expect(bodies.b1.processX).not.toHaveBeenCalled();
    });

    it('should call body1.processX with positive overlap when body2 is on left and blockedState != 2', function ()
    {
        // body2 on left -> body1.processX(overlap, body1FullImpact, true)
        var bodies = makeBody2OnLeft({}, {});
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody2(0);

        expect(bodies.b1.processX).toHaveBeenCalledOnce();
        var args = bodies.b1.processX.mock.calls[0];
        expect(args[0]).toBeCloseTo(10);
        expect(args[2]).toBe(true);
    });

    it('should call body1.processX with negative overlap when body1 is on left and blockedState != 2', function ()
    {
        // body1 on left -> body1.processX(-overlap, body1FullImpact, false, true)
        var bodies = makeBody1OnLeft({}, {});
        ProcessX.Set(bodies.b1, bodies.b2, 10);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody2(0);

        expect(bodies.b1.processX).toHaveBeenCalledOnce();
        var args = bodies.b1.processX.mock.calls[0];
        expect(args[0]).toBeCloseTo(-10);
    });

    it('should not adjust body1.y when body2.moves is false', function ()
    {
        var bodies = makeBody1OnLeft({}, { moves: false });
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.y = 100;
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody2(0);

        expect(bodies.b1.y).toBe(100);
    });

    it('should adjust body1.y using body2.prev.y when body2.moves is true and not directControl', function ()
    {
        var bodies = makeBody1OnLeft(
            { y: 200, prevY: 200 },
            { moves: true, directControl: false, y: 50, prevY: 40, frictionY: 1 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody2(0);

        // body2Distance = 50 - 40 = 10, body1.y += 10 * 1 = 10 → 210
        expect(bodies.b1.y).toBeCloseTo(210);
        expect(bodies.b1._dy).toBeCloseTo(10);
    });

    it('should adjust body1.y using body2.autoFrame.y when body2.moves and directControl are true', function ()
    {
        var bodies = makeBody1OnLeft(
            { y: 200, prevY: 200 },
            { moves: true, directControl: true, y: 50, autoFrameY: 45, frictionY: 2 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody2(0);

        // body2Distance = 50 - 45 = 5, body1.y += 5 * 2 = 10 → 210
        expect(bodies.b1.y).toBeCloseTo(210);
        expect(bodies.b1._dy).toBeCloseTo(10);
    });

    it('should scale body1.y adjustment by body2.friction.y', function ()
    {
        var bodies = makeBody1OnLeft(
            { y: 100, prevY: 100 },
            { moves: true, directControl: false, y: 60, prevY: 50, frictionY: 0.5 }
        );
        ProcessX.Set(bodies.b1, bodies.b2, 5);
        bodies.b1.processX.mockClear();
        bodies.b2.processX.mockClear();

        ProcessX.RunImmovableBody2(0);

        // body2Distance = 10, friction = 0.5 → body1.y += 5 → 105
        expect(bodies.b1.y).toBeCloseTo(105);
        expect(bodies.b1._dy).toBeCloseTo(5);
    });
});
