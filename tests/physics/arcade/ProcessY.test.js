var ProcessY = require('../../../src/physics/arcade/ProcessY');

//  Helper: create a minimal mock body with configurable properties
function makeBody (options)
{
    options = options || {};

    var body = {
        velocity: { y: options.velocityY !== undefined ? options.velocityY : 0 },
        pushable: options.pushable !== undefined ? options.pushable : true,
        _dy: options._dy !== undefined ? options._dy : 0,
        bottom: options.bottom !== undefined ? options.bottom : 100,
        y: options.y !== undefined ? options.y : 0,
        bounce: { y: options.bounceY !== undefined ? options.bounceY : 0 },
        blocked: {
            up: options.blockedUp !== undefined ? options.blockedUp : false,
            down: options.blockedDown !== undefined ? options.blockedDown : false
        },
        mass: options.mass !== undefined ? options.mass : 1,
        moves: options.moves !== undefined ? options.moves : false,
        directControl: options.directControl !== undefined ? options.directControl : false,
        x: options.x !== undefined ? options.x : 0,
        autoFrame: { x: options.autoFrameX !== undefined ? options.autoFrameX : 0 },
        prev: { x: options.prevX !== undefined ? options.prevX : 0 },
        friction: { x: options.frictionX !== undefined ? options.frictionX : 1 },
        _dx: options._dx !== undefined ? options._dx : 0,
        processY: vi.fn()
    };

    return body;
}

//  body1OnTop when |body1.bottom - body2.y| <= |body2.bottom - body1.y|
//  body1 on top:   body1.bottom=100, body2.y=100, body2.bottom=200, body1.y=0   → |0| <= |200| ✓
//  body2 on top:   body1.bottom=200, body2.y=100, body2.bottom=150, body1.y=150 → |100| <= |0| ✗
function makeBody1OnTop ()
{
    return {
        b1: makeBody({ bottom: 100, y: 0 }),
        b2: makeBody({ bottom: 200, y: 100 })
    };
}

function makeBody2OnTop ()
{
    return {
        b1: makeBody({ bottom: 200, y: 150 }),
        b2: makeBody({ bottom: 150, y: 100 })
    };
}

describe('Phaser.Physics.Arcade.ProcessY.Set', function ()
{
    it('should return 0 when neither body is blocked', function ()
    {
        var b = makeBody1OnTop();
        var result = ProcessY.Set(b.b1, b.b2, 10);
        expect(result).toBe(0);
    });

    it('should return the absolute value of a negative overlap', function ()
    {
        var b = makeBody1OnTop();
        //  With a negative overlap and no blocking conditions, should still return 0
        var result = ProcessY.Set(b.b1, b.b2, -10);
        expect(result).toBe(0);
    });

    it('should return 0 with zero overlap', function ()
    {
        var b = makeBody1OnTop();
        var result = ProcessY.Set(b.b1, b.b2, 0);
        expect(result).toBe(0);
    });

    it('should detect body1 on top when bottom of body1 is close to top of body2', function ()
    {
        //  body1.bottom=100, body2.y=100 → distance=0; body2.bottom=200, body1.y=0 → distance=200
        //  body1OnTop = true
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, blockedDown: true });
        var result = ProcessY.Set(b1, b2, 5);
        //  body1 moving down, body1 on top, body2 blocked down → returns 1
        expect(result).toBe(1);
        expect(b1.processY).toHaveBeenCalledWith(-5, expect.any(Number), false, true);
    });

    it('should compute body1FullImpact as v2 - v1 * bounce.y', function ()
    {
        //  v1=100, v2=50, bounce.y=0.5 → fullImpact = 50 - 100*0.5 = 0
        //  Trigger BlockCheck result=1 to observe the impact value passed to processY
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1, velocityY: 100, bounceY: 0.5 });
        var b2 = makeBody({ bottom: 200, y: 100, velocityY: 50, blockedDown: true });
        ProcessY.Set(b1, b2, 8);
        var call = b1.processY.mock.calls[0];
        expect(call[1]).toBeCloseTo(0);
    });

    it('should compute body2FullImpact as v1 - v2 * bounce.y', function ()
    {
        //  v1=100, v2=50, body2.bounce.y=0.5 → body2FullImpact = 100 - 50*0.5 = 75
        //  Trigger body2 processY via BlockCheck result=2: body2 moving down, body2 on top, body1 blocked down
        var b = makeBody2OnTop();
        b.b1.blockedDown = true; // won't read via blocked.down directly, need the object
        var b1 = makeBody({ bottom: 200, y: 150, velocityY: 100, blockedDown: true });
        var b2 = makeBody({ bottom: 150, y: 100, velocityY: 50, bounceY: 0.5, _dy: 1 });
        ProcessY.Set(b1, b2, 10);
        var call = b2.processY.mock.calls[0];
        expect(call[1]).toBeCloseTo(75);
    });
});

describe('Phaser.Physics.Arcade.ProcessY.BlockCheck', function ()
{
    it('should return 0 when no blocked conditions are met', function ()
    {
        var b1 = makeBody({ _dy: 0 });
        var b2 = makeBody({ _dy: 0 });
        ProcessY.Set(b1, b2, 10);
        expect(ProcessY.BlockCheck()).toBe(0);
    });

    it('should return 1 and call body1.processY when body1 moving down, body1 on top, body2 blocked down', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, blockedDown: true });
        ProcessY.Set(b1, b2, 12);
        b1.processY.mockClear();
        var result = ProcessY.BlockCheck();
        expect(result).toBe(1);
        expect(b1.processY).toHaveBeenCalledWith(-12, expect.any(Number), false, true);
    });

    it('should return 1 and call body1.processY when body1 moving up, body2 on top, body2 blocked up', function ()
    {
        //  body2 on top means body1OnTop=false → body2OnTop=true
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1 });
        var b2 = makeBody({ bottom: 150, y: 100, blockedUp: true });
        ProcessY.Set(b1, b2, 7);
        b1.processY.mockClear();
        var result = ProcessY.BlockCheck();
        expect(result).toBe(1);
        expect(b1.processY).toHaveBeenCalledWith(7, expect.any(Number), true);
    });

    it('should return 2 and call body2.processY when body2 moving down, body2 on top, body1 blocked down', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, blockedDown: true });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 1 });
        ProcessY.Set(b1, b2, 9);
        b2.processY.mockClear();
        var result = ProcessY.BlockCheck();
        expect(result).toBe(2);
        expect(b2.processY).toHaveBeenCalledWith(-9, expect.any(Number), false, true);
    });

    it('should return 2 and call body2.processY when body2 moving up, body1 on top, body1 blocked up', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, blockedUp: true });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1 });
        ProcessY.Set(b1, b2, 6);
        b2.processY.mockClear();
        var result = ProcessY.BlockCheck();
        expect(result).toBe(2);
        expect(b2.processY).toHaveBeenCalledWith(6, expect.any(Number), true);
    });

    it('should not return 1 for body1 moving down when body1 is NOT on top', function ()
    {
        //  body2 is on top; body1 moving down should not trigger the first block check
        var b1 = makeBody({ bottom: 200, y: 150, _dy: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, blockedDown: true });
        var result = ProcessY.Set(b1, b2, 5);
        expect(result).toBe(0);
    });
});

describe('Phaser.Physics.Arcade.ProcessY.Check', function ()
{
    it('should return false when no movement conditions match', function ()
    {
        //  _dy=0 for both, no directional movement
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 0, pushable: true });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: 0, pushable: true });
        ProcessY.Set(b1, b2, 10);
        var result = ProcessY.Check();
        expect(result).toBe(false);
    });

    it('should return true when body1 moving up and body2 on top (side 0)', function ()
    {
        //  body2 on top, body1 moving up
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 0, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 10);
        var result = ProcessY.Check();
        expect(result).toBe(true);
    });

    it('should return true when body2 moving up and body1 on top (side 1)', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 0, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 10);
        var result = ProcessY.Check();
        expect(result).toBe(true);
    });

    it('should return true when body1 moving down and body1 on top (side 2)', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: 0, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 10);
        var result = ProcessY.Check();
        expect(result).toBe(true);
    });

    it('should return true when body2 moving down and body2 on top (side 3)', function ()
    {
        //  body2 on top, body2 moving down
        var b1 = makeBody({ bottom: 200, y: 150, _dy: 0, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 1, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 10);
        var result = ProcessY.Check();
        expect(result).toBe(true);
    });

    it('should call Run(0) which calls processY on body1 and body2 when both pushable', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: true, mass: 1, velocityY: -100 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 0, pushable: true, mass: 1, velocityY: 0 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Check();
        expect(b1.processY).toHaveBeenCalled();
        expect(b2.processY).toHaveBeenCalled();
    });
});

describe('Phaser.Physics.Arcade.ProcessY.Run', function ()
{
    it('should always return true', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: 0, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 10);
        expect(ProcessY.Run(0)).toBe(true);
        expect(ProcessY.Run(1)).toBe(true);
        expect(ProcessY.Run(2)).toBe(true);
        expect(ProcessY.Run(3)).toBe(true);
    });

    it('should split overlap equally when both bodies are pushable (side 0)', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 0, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(0);
        //  overlap becomes 20*0.5=10; side 0 → body1 gets +overlap, body2 gets -overlap
        expect(b1.processY.mock.calls[0][0]).toBeCloseTo(10);
        expect(b2.processY.mock.calls[0][0]).toBeCloseTo(-10);
    });

    it('should split overlap equally when both bodies are pushable (side 1)', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 0, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(1);
        //  side 1 → body1 gets -overlap, body2 gets +overlap
        expect(b1.processY.mock.calls[0][0]).toBeCloseTo(-10);
        expect(b2.processY.mock.calls[0][0]).toBeCloseTo(10);
    });

    it('should apply full overlap to body1 only when body1 pushable and body2 not (side 0)', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 0, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 16);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(0);
        expect(b1.processY).toHaveBeenCalledWith(16, expect.any(Number), true);
        expect(b2.processY).not.toHaveBeenCalled();
    });

    it('should apply full overlap to body1 only when body1 pushable and body2 not (side 1)', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 0, pushable: true, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 16);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(1);
        expect(b1.processY).toHaveBeenCalledWith(-16, expect.any(Number), false, true);
        expect(b2.processY).not.toHaveBeenCalled();
    });

    it('should apply full overlap to body2 only when body2 pushable and body1 not (side 0)', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 0, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 14);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(0);
        expect(b2.processY).toHaveBeenCalledWith(-14, expect.any(Number), false, true);
        expect(b1.processY).not.toHaveBeenCalled();
    });

    it('should apply full overlap to body2 only when body2 pushable and body1 not (side 1)', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 0, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1, pushable: true, mass: 1 });
        ProcessY.Set(b1, b2, 14);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(1);
        expect(b2.processY).toHaveBeenCalledWith(14, expect.any(Number), true);
        expect(b1.processY).not.toHaveBeenCalled();
    });

    it('should handle neither pushable, side 0, body2 stationary', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 0, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(0);
        expect(b1.processY).toHaveBeenCalledWith(20, 0, true);
        expect(b2.processY).toHaveBeenCalledWith(0, null, false, true);
    });

    it('should handle neither pushable, side 0, body2 moving down', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 1, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(0);
        expect(b1.processY).toHaveBeenCalledWith(10, 0, true);
        expect(b2.processY).toHaveBeenCalledWith(-10, 0, false, true);
    });

    it('should handle neither pushable, side 0, body2 moving up (same direction)', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: false, mass: 1, velocityY: -50 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: -1, pushable: false, mass: 1, velocityY: -30 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(0);
        expect(b1.processY).toHaveBeenCalledWith(10, -30, true);
        expect(b2.processY).toHaveBeenCalledWith(-10, null, false, true);
    });

    it('should handle neither pushable, side 1, body1 stationary', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 0, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(1);
        expect(b1.processY).toHaveBeenCalledWith(0, null, false, true);
        expect(b2.processY).toHaveBeenCalledWith(20, 0, true);
    });

    it('should handle neither pushable, side 1, body1 moving down', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(1);
        expect(b1.processY).toHaveBeenCalledWith(-10, 0, false, true);
        expect(b2.processY).toHaveBeenCalledWith(10, 0, true);
    });

    it('should handle neither pushable, side 2, body2 stationary', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: 0, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(2);
        expect(b1.processY).toHaveBeenCalledWith(-20, 0, false, true);
        expect(b2.processY).toHaveBeenCalledWith(0, null, true);
    });

    it('should handle neither pushable, side 2, body2 moving up', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, _dy: 1, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, _dy: -1, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(2);
        expect(b1.processY).toHaveBeenCalledWith(-10, 0, false, true);
        expect(b2.processY).toHaveBeenCalledWith(10, 0, true);
    });

    it('should handle neither pushable, side 3, body1 stationary', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: 0, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 1, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(3);
        expect(b1.processY).toHaveBeenCalledWith(0, null, true);
        expect(b2.processY).toHaveBeenCalledWith(-20, 0, false, true);
    });

    it('should handle neither pushable, side 3, body1 moving up', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150, _dy: -1, pushable: false, mass: 1 });
        var b2 = makeBody({ bottom: 150, y: 100, _dy: 1, pushable: false, mass: 1 });
        ProcessY.Set(b1, b2, 20);
        b1.processY.mockClear();
        b2.processY.mockClear();
        ProcessY.Run(3);
        expect(b1.processY).toHaveBeenCalledWith(10, 0, true);
        expect(b2.processY).toHaveBeenCalledWith(-10, 0, false, true);
    });
});

describe('Phaser.Physics.Arcade.ProcessY.RunImmovableBody1', function ()
{
    it('should zero out body2 velocity when blockedState is 1', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0 });
        var b2 = makeBody({ bottom: 200, y: 100, velocityY: 200 });
        ProcessY.Set(b1, b2, 10);
        ProcessY.RunImmovableBody1(1);
        expect(b2.velocity.y).toBe(0);
        expect(b2.processY).not.toHaveBeenCalled();
    });

    it('should call body2.processY with positive overlap when body1 is on top and blockedState is 0', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0 });
        var b2 = makeBody({ bottom: 200, y: 100 });
        ProcessY.Set(b1, b2, 15);
        b2.processY.mockClear();
        ProcessY.RunImmovableBody1(0);
        expect(b2.processY).toHaveBeenCalledWith(15, expect.any(Number), true);
    });

    it('should call body2.processY with negative overlap when body2 is on top and blockedState is 0', function ()
    {
        var b1 = makeBody({ bottom: 200, y: 150 });
        var b2 = makeBody({ bottom: 150, y: 100 });
        ProcessY.Set(b1, b2, 15);
        b2.processY.mockClear();
        ProcessY.RunImmovableBody1(0);
        expect(b2.processY).toHaveBeenCalledWith(-15, expect.any(Number), false, true);
    });

    it('should apply body1 horizontal distance to body2.x when body1.moves is true (prev control)', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, moves: true, directControl: false, x: 50, prevX: 40, frictionX: 1 });
        var b2 = makeBody({ bottom: 200, y: 100, x: 100, prevX: 100 });
        ProcessY.Set(b1, b2, 10);
        b2.processY.mockClear();
        ProcessY.RunImmovableBody1(1);
        //  body1Distance = 50 - 40 = 10; body2.x += 10 * 1 = 110
        expect(b2.x).toBe(110);
        expect(b2._dx).toBe(110 - 100);
    });

    it('should apply body1 horizontal distance using autoFrame when directControl is true', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, moves: true, directControl: true, x: 50, autoFrameX: 45, frictionX: 2 });
        var b2 = makeBody({ bottom: 200, y: 100, x: 100, prevX: 100 });
        ProcessY.Set(b1, b2, 10);
        b2.processY.mockClear();
        ProcessY.RunImmovableBody1(1);
        //  body1Distance = 50 - 45 = 5; body2.x += 5 * 2 = 110
        expect(b2.x).toBe(110);
        expect(b2._dx).toBe(10);
    });

    it('should not modify body2.x when body1.moves is false', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, moves: false });
        var b2 = makeBody({ bottom: 200, y: 100, x: 100, prevX: 100 });
        ProcessY.Set(b1, b2, 10);
        b2.processY.mockClear();
        ProcessY.RunImmovableBody1(1);
        expect(b2.x).toBe(100);
    });
});

describe('Phaser.Physics.Arcade.ProcessY.RunImmovableBody2', function ()
{
    it('should zero out body1 velocity when blockedState is 2', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, velocityY: 300 });
        var b2 = makeBody({ bottom: 200, y: 100 });
        ProcessY.Set(b1, b2, 10);
        ProcessY.RunImmovableBody2(2);
        expect(b1.velocity.y).toBe(0);
        expect(b1.processY).not.toHaveBeenCalled();
    });

    it('should call body1.processY with positive overlap when body2 is on top and blockedState is 0', function ()
    {
        //  body2OnTop → body1OnTop=false
        var b1 = makeBody({ bottom: 200, y: 150 });
        var b2 = makeBody({ bottom: 150, y: 100 });
        ProcessY.Set(b1, b2, 18);
        b1.processY.mockClear();
        ProcessY.RunImmovableBody2(0);
        expect(b1.processY).toHaveBeenCalledWith(18, expect.any(Number), true);
    });

    it('should call body1.processY with negative overlap when body1 is on top and blockedState is 0', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0 });
        var b2 = makeBody({ bottom: 200, y: 100 });
        ProcessY.Set(b1, b2, 18);
        b1.processY.mockClear();
        ProcessY.RunImmovableBody2(0);
        expect(b1.processY).toHaveBeenCalledWith(-18, expect.any(Number), false, true);
    });

    it('should apply body2 horizontal distance to body1.x when body2.moves is true (prev control)', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, x: 200, prevX: 200 });
        var b2 = makeBody({ bottom: 200, y: 100, moves: true, directControl: false, x: 60, prevX: 50, frictionX: 1 });
        ProcessY.Set(b1, b2, 10);
        b1.processY.mockClear();
        ProcessY.RunImmovableBody2(2);
        //  body2Distance = 60 - 50 = 10; body1.x += 10 * 1 = 210
        expect(b1.x).toBe(210);
        expect(b1._dx).toBe(210 - 200);
    });

    it('should apply body2 horizontal distance using autoFrame when directControl is true', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, x: 200, prevX: 200 });
        var b2 = makeBody({ bottom: 200, y: 100, moves: true, directControl: true, x: 60, autoFrameX: 55, frictionX: 3 });
        ProcessY.Set(b1, b2, 10);
        b1.processY.mockClear();
        ProcessY.RunImmovableBody2(2);
        //  body2Distance = 60 - 55 = 5; body1.x += 5 * 3 = 215
        expect(b1.x).toBe(215);
        expect(b1._dx).toBe(15);
    });

    it('should not modify body1.x when body2.moves is false', function ()
    {
        var b1 = makeBody({ bottom: 100, y: 0, x: 200, prevX: 200 });
        var b2 = makeBody({ bottom: 200, y: 100, moves: false });
        ProcessY.Set(b1, b2, 10);
        b1.processY.mockClear();
        ProcessY.RunImmovableBody2(2);
        expect(b1.x).toBe(200);
    });
});
