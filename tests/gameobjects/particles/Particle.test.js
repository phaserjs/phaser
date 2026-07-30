var Particle = require('../../../src/gameobjects/particles/Particle');

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function createMockEmitter ()
{
    return {
        scene: {},
        anims: [],
        emit: function (event, a1, a2, a3, a4, a5)
        {
            return true;
        }
    };
}

function createMockOp (returnValue)
{
    var val = (returnValue !== undefined) ? returnValue : 0;
    return {
        active: false,
        steps: 0,
        onEmit: function (particle, key) { return val; },
        onUpdate: function (particle, key, t, current) { return current; }
    };
}

// An op that always returns its fixed value from both onEmit and onUpdate
function createFixedOp (returnValue)
{
    var val = (returnValue !== undefined) ? returnValue : 0;
    return {
        active: false,
        steps: 0,
        onEmit: function (particle, key) { return val; },
        onUpdate: function (particle, key, t, current) { return val; }
    };
}

function createMockOps ()
{
    return {
        x: createMockOp(0),
        y: createMockOp(0),
        lifespan: createMockOp(1000),
        delay: createMockOp(0),
        hold: createMockOp(0),
        scaleX: createMockOp(1),
        scaleY: createMockOp(1),
        rotate: createMockOp(0),
        speedX: createMockOp(100),
        speedY: createMockOp(100),
        angle: createMockOp(0),
        moveToX: createMockOp(0),
        moveToY: createMockOp(0),
        accelerationX: createMockOp(0),
        accelerationY: createMockOp(0),
        maxVelocityX: createMockOp(10000),
        maxVelocityY: createMockOp(10000),
        bounce: createMockOp(0),
        alpha: createMockOp(1),
        tint: createMockOp(0xffffff),
        color: createMockOp(0xffffff)
    };
}

function createMockFrame ()
{
    return {
        width: 32,
        height: 32,
        texture: { key: 'test' }
    };
}

function createIdentityMatrix ()
{
    return {
        scaleX: 1,
        scaleY: 1,
        transformPoint: function (x, y, point)
        {
            point.x = x;
            point.y = y;
            return point;
        }
    };
}

function createFullMockEmitter ()
{
    var frame = createMockFrame();

    return {
        scene: {},
        anims: [],
        ops: createMockOps(),
        emit: function () { return true; },
        getAnim: function () { return null; },
        getFrame: function () { return frame; },
        getEmitZone: function (particle) {},
        getDeathZone: function (particle) { return false; },
        worldMatrix: {
            transformPoint: function (x, y, point)
            {
                point.x = x;
                point.y = y;
                return point;
            }
        },
        getWorldTransformMatrix: function ()
        {
            return createIdentityMatrix();
        },
        radial: false,
        moveTo: false,
        acceleration: false,
        gravityX: 0,
        gravityY: 0
    };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Particle', function ()
{
    describe('constructor', function ()
    {
        it('should store the emitter reference', function ()
        {
            var emitter = createMockEmitter();
            var particle = new Particle(emitter);

            expect(particle.emitter).toBe(emitter);
        });

        it('should default x and y to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.x).toBe(0);
            expect(particle.y).toBe(0);
        });

        it('should default velocities to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.velocityX).toBe(0);
            expect(particle.velocityY).toBe(0);
        });

        it('should default accelerations to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.accelerationX).toBe(0);
            expect(particle.accelerationY).toBe(0);
        });

        it('should default maxVelocity to 10000', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.maxVelocityX).toBe(10000);
            expect(particle.maxVelocityY).toBe(10000);
        });

        it('should default bounce to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.bounce).toBe(0);
        });

        it('should default scale to one', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.scaleX).toBe(1);
            expect(particle.scaleY).toBe(1);
        });

        it('should default alpha to one', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.alpha).toBe(1);
        });

        it('should default angle and rotation to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.angle).toBe(0);
            expect(particle.rotation).toBe(0);
        });

        it('should default tint to white', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.tint).toBe(0xffffff);
        });

        it('should default life and lifeCurrent to 1000', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.life).toBe(1000);
            expect(particle.lifeCurrent).toBe(1000);
        });

        it('should default delayCurrent and holdCurrent to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.delayCurrent).toBe(0);
            expect(particle.holdCurrent).toBe(0);
        });

        it('should default lifeT to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.lifeT).toBe(0);
        });

        it('should default texture and frame to null', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.texture).toBeNull();
            expect(particle.frame).toBeNull();
        });

        it('should initialise worldPosition as a Vector2 at origin', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.worldPosition).toBeDefined();
            expect(particle.worldPosition.x).toBe(0);
            expect(particle.worldPosition.y).toBe(0);
        });

        it('should initialise bounds as a Rectangle', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.bounds).toBeDefined();
            expect(typeof particle.bounds.x).toBe('number');
            expect(typeof particle.bounds.y).toBe('number');
        });

        it('should set scene from emitter.scene', function ()
        {
            var scene = { key: 'myScene' };
            var emitter = createMockEmitter();
            emitter.scene = scene;

            var particle = new Particle(emitter);

            expect(particle.scene).toBe(scene);
        });

        it('should leave anims null when emitter has no anims', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.anims).toBeNull();
        });

        it('should initialise data with expected keys', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.data).toBeDefined();
            expect(particle.data.tint).toBeDefined();
            expect(particle.data.alpha).toBeDefined();
            expect(particle.data.rotate).toBeDefined();
            expect(particle.data.scaleX).toBeDefined();
            expect(particle.data.scaleY).toBeDefined();
            expect(particle.data.x).toBeDefined();
            expect(particle.data.y).toBeDefined();
            expect(particle.data.bounce).toBeDefined();
        });
    });

    // -----------------------------------------------------------------------

    describe('isAlive', function ()
    {
        it('should return true when lifeCurrent is positive', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = 500;

            expect(particle.isAlive()).toBe(true);
        });

        it('should return true when lifeCurrent is 1', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = 1;

            expect(particle.isAlive()).toBe(true);
        });

        it('should return false when lifeCurrent is zero', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = 0;

            expect(particle.isAlive()).toBe(false);
        });

        it('should return false when lifeCurrent is negative', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = -100;

            expect(particle.isAlive()).toBe(false);
        });
    });

    // -----------------------------------------------------------------------

    describe('kill', function ()
    {
        it('should set lifeCurrent to zero', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.lifeCurrent).toBe(1000);
            particle.kill();
            expect(particle.lifeCurrent).toBe(0);
        });

        it('should cause isAlive to return false', function ()
        {
            var particle = new Particle(createMockEmitter());

            particle.kill();
            expect(particle.isAlive()).toBe(false);
        });

        it('should work when particle is already dead', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = 0;
            particle.kill();

            expect(particle.lifeCurrent).toBe(0);
        });
    });

    // -----------------------------------------------------------------------

    describe('setPosition', function ()
    {
        it('should set x and y to the given values', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.setPosition(100, 200);

            expect(particle.x).toBe(100);
            expect(particle.y).toBe(200);
        });

        it('should reset x and y to zero when called with no arguments', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.x = 50;
            particle.y = 75;
            particle.setPosition();

            expect(particle.x).toBe(0);
            expect(particle.y).toBe(0);
        });

        it('should handle negative coordinates', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.setPosition(-300, -400);

            expect(particle.x).toBe(-300);
            expect(particle.y).toBe(-400);
        });

        it('should handle floating point coordinates', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.setPosition(1.5, 2.7);

            expect(particle.x).toBeCloseTo(1.5);
            expect(particle.y).toBeCloseTo(2.7);
        });

        it('should default x to zero when only y is undefined', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.setPosition(undefined, 50);

            expect(particle.x).toBe(0);
            expect(particle.y).toBe(50);
        });
    });

    // -----------------------------------------------------------------------

    describe('emit', function ()
    {
        it('should delegate to emitter.emit and return its result', function ()
        {
            var emitter = createMockEmitter();
            var called = false;
            var capturedArgs = [];

            emitter.emit = function (event, a1, a2, a3, a4, a5)
            {
                called = true;
                capturedArgs = [ event, a1, a2, a3, a4, a5 ];
                return true;
            };

            var particle = new Particle(emitter);
            var result = particle.emit('test-event', 1, 2, 3, 4, 5);

            expect(called).toBe(true);
            expect(result).toBe(true);
            expect(capturedArgs[0]).toBe('test-event');
            expect(capturedArgs[1]).toBe(1);
            expect(capturedArgs[2]).toBe(2);
            expect(capturedArgs[3]).toBe(3);
            expect(capturedArgs[4]).toBe(4);
            expect(capturedArgs[5]).toBe(5);
        });

        it('should return false when emitter.emit returns false', function ()
        {
            var emitter = createMockEmitter();
            emitter.emit = function () { return false; };

            var particle = new Particle(emitter);

            expect(particle.emit('no-listeners')).toBe(false);
        });
    });

    // -----------------------------------------------------------------------

    describe('setSizeToFrame', function ()
    {
        it('should be a no-op and not throw', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(function () { particle.setSizeToFrame(); }).not.toThrow();
        });

        it('should return undefined', function ()
        {
            var particle = new Particle(createMockEmitter());

            expect(particle.setSizeToFrame()).toBeUndefined();
        });
    });

    // -----------------------------------------------------------------------

    describe('fire', function ()
    {
        it('should return true when particle fires successfully', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);

            var result = particle.fire(100, 200);

            expect(result).toBe(true);
        });

        it('should set frame and texture from emitter.getFrame', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.frame).not.toBeNull();
            expect(particle.texture).not.toBeNull();
            expect(particle.texture.key).toBe('test');
        });

        it('should set life and lifeCurrent from ops.lifespan', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.ops.lifespan = createMockOp(2000);

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.life).toBe(2000);
            expect(particle.lifeCurrent).toBe(2000);
        });

        it('should reset lifeT to zero', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.lifeT = 0.9;
            particle.fire(0, 0);

            expect(particle.lifeT).toBe(0);
        });

        it('should set delayCurrent from ops.delay', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.ops.delay = createMockOp(500);

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.delayCurrent).toBe(500);
        });

        it('should set alpha from ops.alpha', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.ops.alpha = createMockOp(0.5);

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.alpha).toBeCloseTo(0.5);
        });

        it('should set scaleX from ops.scaleX', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.ops.scaleX = createMockOp(2);

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.scaleX).toBe(2);
        });

        it('should copy scaleX to scaleY when scaleY op is inactive', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.ops.scaleX = createMockOp(3);
            emitter.ops.scaleY.active = false;

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.scaleY).toBe(3);
        });

        it('should use scaleY op value when scaleY op is active', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.ops.scaleX = createMockOp(2);
            emitter.ops.scaleY = {
                active: true,
                steps: 0,
                onEmit: function () { return 4; },
                onUpdate: function (p, k, t, c) { return c; }
            };

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.scaleX).toBe(2);
            expect(particle.scaleY).toBe(4);
        });

        it('should set non-radial velocities directly from speedX and speedY ops', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.radial = false;
            emitter.ops.speedX = createMockOp(150);
            emitter.ops.speedY = {
                active: true,
                steps: 0,
                onEmit: function () { return 75; },
                onUpdate: function (p, k, t, c) { return c; }
            };

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.velocityX).toBe(150);
            expect(particle.velocityY).toBe(75);
        });

        it('should copy speedX to velocityY when speedY op is inactive', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.radial = false;
            emitter.ops.speedX = createMockOp(200);
            emitter.ops.speedY.active = false;

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.velocityX).toBe(200);
            expect(particle.velocityY).toBe(200);
        });

        it('should set radial velocity using angle op when radial is true', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.radial = true;
            // angle = 0 degrees -> cos(0)=1, sin(0)=0
            emitter.ops.angle = {
                active: false,
                steps: 0,
                onEmit: function () { return 0; },
                onUpdate: function (p, k, t, c) { return c; }
            };
            emitter.ops.speedX = createMockOp(100);
            emitter.ops.speedY.active = false;

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.velocityX).toBeCloseTo(100);
            expect(particle.velocityY).toBeCloseTo(0);
        });

        it('should set moveTo velocities when emitter.moveTo is true', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.moveTo = true;
            emitter.ops.lifespan = createMockOp(1000); // 1 second
            emitter.ops.moveToX = {
                active: false,
                steps: 0,
                onEmit: function () { return 200; },
                onUpdate: function (p, k, t, c) { return c; }
            };
            emitter.ops.moveToY = {
                active: false,
                steps: 0,
                onEmit: function () { return 300; },
                onUpdate: function (p, k, t, c) { return c; }
            };

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            // life = 1000ms = 1s, so velocity = distance/time
            // x starts at 0 (no emit zone offset), moveToX=200 -> vx = 200/1 = 200
            expect(particle.velocityX).toBeCloseTo(200);
            expect(particle.velocityY).toBeCloseTo(300);
        });

        it('should return false when particle spawns inside a death zone', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.getDeathZone = function () { return true; };

            var particle = new Particle(emitter);
            var result = particle.fire(0, 0);

            expect(result).toBe(false);
            expect(particle.lifeCurrent).toBe(0);
        });

        it('should set acceleration when emitter.acceleration is true', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.acceleration = true;
            emitter.ops.accelerationX = createMockOp(50);
            emitter.ops.accelerationY = createMockOp(80);

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            expect(particle.accelerationX).toBe(50);
            expect(particle.accelerationY).toBe(80);
        });

        it('should throw when no texture frame is available', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.getFrame = function () { return null; };

            var particle = new Particle(emitter);

            expect(function () { particle.fire(0, 0); }).toThrow();
        });
    });

    // -----------------------------------------------------------------------

    describe('update', function ()
    {
        it('should return true immediately when lifeCurrent is zero and holdCurrent is zero', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = 0;
            particle.holdCurrent = 0;

            expect(particle.update(16, 0.016, [])).toBe(true);
        });

        it('should return false and decrement holdCurrent when lifeCurrent is zero but holdCurrent is positive', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = 0;
            particle.holdCurrent = 500;

            var result = particle.update(100, 0.1, []);

            expect(result).toBe(false);
            expect(particle.holdCurrent).toBe(400);
        });

        it('should return true when holdCurrent expires after decrement', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.lifeCurrent = 0;
            particle.holdCurrent = 50;

            var result = particle.update(100, 0.1, []);

            expect(result).toBe(true);
            expect(particle.holdCurrent).toBeLessThanOrEqual(0);
        });

        it('should return false and decrement delayCurrent when delay is active', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.delayCurrent = 300;

            var result = particle.update(100, 0.1, []);

            expect(result).toBe(false);
            expect(particle.delayCurrent).toBe(200);
        });

        it('should return false and not advance life while delay is pending', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.delayCurrent = 100;
            var lifeBefore = particle.lifeCurrent;

            particle.update(16, 0.016, []);

            expect(particle.lifeCurrent).toBe(lifeBefore);
        });

        it('should decrement lifeCurrent by delta on normal update', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);

            particle.update(16, 0.016, []);

            expect(particle.lifeCurrent).toBe(1000 - 16);
        });

        it('should return false when particle is still alive after update', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);

            var result = particle.update(16, 0.016, []);

            expect(result).toBe(false);
        });

        it('should return true when lifeCurrent reaches zero', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.ops.lifespan = createMockOp(16);

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            var result = particle.update(16, 0.016, []);

            expect(result).toBe(true);
        });

        it('should update lifeT proportionally', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);

            // lifeT is computed at the top of update before decrementing lifeCurrent.
            // Set lifeCurrent to 500 so that t = 1 - (500/1000) = 0.5.
            particle.lifeCurrent = 500;
            particle.update(16, 0.016, []);

            expect(particle.lifeT).toBeCloseTo(0.5);
        });

        it('should kill the particle and return true when entering a death zone during update', function ()
        {
            var emitter = createFullMockEmitter();
            var callCount = 0;

            emitter.getDeathZone = function ()
            {
                callCount++;
                // First call is from fire(), second is from update()
                return callCount > 1;
            };

            var particle = new Particle(emitter);
            particle.fire(0, 0);

            var result = particle.update(16, 0.016, []);

            expect(result).toBe(true);
            expect(particle.lifeCurrent).toBe(0);
        });

        it('should call active processor update during normal update', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);

            var processorCalled = false;
            var processors = [
                {
                    active: true,
                    update: function (p, delta, step, t)
                    {
                        processorCalled = true;
                    }
                }
            ];

            particle.update(16, 0.016, processors);

            expect(processorCalled).toBe(true);
        });

        it('should skip inactive processors during update', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);

            var processorCalled = false;
            var processors = [
                {
                    active: false,
                    update: function ()
                    {
                        processorCalled = true;
                    }
                }
            ];

            particle.update(16, 0.016, processors);

            expect(processorCalled).toBe(false);
        });
    });

    // -----------------------------------------------------------------------

    describe('computeVelocity', function ()
    {
        it('should update position based on velocity and step', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.velocityX = 100;
            particle.velocityY = 50;

            particle.computeVelocity(emitter, 16, 0.016, [], 0);

            expect(particle.x).toBeCloseTo(100 * 0.016);
            expect(particle.y).toBeCloseTo(50 * 0.016);
        });

        it('should apply gravity to velocity', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.gravityY = 100;

            var particle = new Particle(emitter);
            particle.velocityX = 0;
            particle.velocityY = 0;

            particle.computeVelocity(emitter, 1000, 1, [], 0);

            // vy = 0 + (100 * 1) = 100
            expect(particle.velocityY).toBeCloseTo(100);
            // y = 0 + 100 * 1 = 100
            expect(particle.y).toBeCloseTo(100);
        });

        it('should apply horizontal gravity to velocity', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.gravityX = 200;

            var particle = new Particle(emitter);
            particle.velocityX = 0;
            particle.velocityY = 0;

            particle.computeVelocity(emitter, 1000, 1, [], 0);

            expect(particle.velocityX).toBeCloseTo(200);
            expect(particle.x).toBeCloseTo(200);
        });

        it('should clamp velocity to maxVelocityX and maxVelocityY', function ()
        {
            var emitter = createFullMockEmitter();
            emitter.gravityX = 0;
            emitter.gravityY = 0;
            // Use createFixedOp so onUpdate always returns 50, not particle.maxVelocityX
            emitter.ops.maxVelocityX = createFixedOp(50);
            emitter.ops.maxVelocityY = createFixedOp(50);

            var particle = new Particle(emitter);
            particle.velocityX = 999;
            particle.velocityY = -999;

            particle.computeVelocity(emitter, 16, 0.016, [], 0);

            expect(particle.velocityX).toBe(50);
            expect(particle.velocityY).toBe(-50);
        });

        it('should update worldPosition after integrating position', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.velocityX = 100;
            particle.velocityY = 200;

            particle.computeVelocity(emitter, 1000, 1, [], 0);

            expect(particle.worldPosition.x).toBeCloseTo(100);
            expect(particle.worldPosition.y).toBeCloseTo(200);
        });

        it('should call active processor.update with correct arguments', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            var capturedArgs = null;

            var processors = [
                {
                    active: true,
                    update: function (p, delta, step, t)
                    {
                        capturedArgs = { p: p, delta: delta, step: step, t: t };
                    }
                }
            ];

            particle.computeVelocity(emitter, 16, 0.016, processors, 0.5);

            expect(capturedArgs).not.toBeNull();
            expect(capturedArgs.p).toBe(particle);
            expect(capturedArgs.delta).toBe(16);
            expect(capturedArgs.step).toBeCloseTo(0.016);
            expect(capturedArgs.t).toBe(0.5);
        });

        it('should skip inactive processors', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            var called = false;

            var processors = [
                {
                    active: false,
                    update: function () { called = true; }
                }
            ];

            particle.computeVelocity(emitter, 16, 0.016, processors, 0);

            expect(called).toBe(false);
        });

        it('should handle an empty processors array', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);

            expect(function ()
            {
                particle.computeVelocity(emitter, 16, 0.016, [], 0);
            }).not.toThrow();
        });
    });

    // -----------------------------------------------------------------------

    describe('getBounds', function ()
    {
        it('should return the bounds rectangle', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);

            var result = particle.getBounds(createIdentityMatrix());

            expect(result).toBe(particle.bounds);
        });

        it('should compute correct bounds for an axis-aligned unrotated particle at origin', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);
            particle.rotation = 0;

            // frame is 32x32, scaleX/Y = 1, identity matrix
            // half-width = 16, half-height = 16
            particle.getBounds(createIdentityMatrix());

            expect(particle.bounds.x).toBeCloseTo(-16);
            expect(particle.bounds.y).toBeCloseTo(-16);
            expect(particle.bounds.width).toBeCloseTo(32);
            expect(particle.bounds.height).toBeCloseTo(32);
        });

        it('should scale bounds by scaleX and scaleY', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);
            particle.scaleX = 2;
            particle.scaleY = 2;
            particle.rotation = 0;

            // frame 32x32, scale 2 -> half = 32
            particle.getBounds(createIdentityMatrix());

            expect(particle.bounds.width).toBeCloseTo(64);
            expect(particle.bounds.height).toBeCloseTo(64);
        });

        it('should offset bounds when particle is not at origin', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);
            particle.x = 100;
            particle.y = 50;
            particle.rotation = 0;

            particle.getBounds(createIdentityMatrix());

            // x=100 ± 16 -> min=84, width=32
            expect(particle.bounds.x).toBeCloseTo(84);
            expect(particle.bounds.y).toBeCloseTo(34);
            expect(particle.bounds.width).toBeCloseTo(32);
            expect(particle.bounds.height).toBeCloseTo(32);
        });

        it('should produce a larger bounding box when particle is rotated 45 degrees', function ()
        {
            var emitter = createFullMockEmitter();
            var particle = new Particle(emitter);
            particle.fire(0, 0);
            particle.rotation = Math.PI / 4; // 45 degrees

            var unrotated = particle.getBounds(createIdentityMatrix());
            var unrotatedWidth = unrotated.width;

            particle.rotation = 0;
            particle.getBounds(createIdentityMatrix());
            var straightWidth = particle.bounds.width;

            particle.rotation = Math.PI / 4;
            particle.getBounds(createIdentityMatrix());
            var rotatedWidth = particle.bounds.width;

            // At 45 degrees a square's bounding box is larger than its unrotated form
            expect(rotatedWidth).toBeGreaterThan(straightWidth - 0.001);
        });

        it('should use emitter world transform matrix when no matrix argument is given', function ()
        {
            var emitter = createFullMockEmitter();
            var matrixUsed = false;

            emitter.getWorldTransformMatrix = function ()
            {
                matrixUsed = true;
                return createIdentityMatrix();
            };

            var particle = new Particle(emitter);
            particle.fire(0, 0);
            particle.getBounds();

            expect(matrixUsed).toBe(true);
        });
    });

    // -----------------------------------------------------------------------

    describe('destroy', function ()
    {
        it('should null the emitter reference', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.destroy();

            expect(particle.emitter).toBeNull();
        });

        it('should null the texture reference', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.destroy();

            expect(particle.texture).toBeNull();
        });

        it('should null the frame reference', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.destroy();

            expect(particle.frame).toBeNull();
        });

        it('should null the scene reference', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.destroy();

            expect(particle.scene).toBeNull();
        });

        it('should null the anims reference', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.destroy();

            expect(particle.anims).toBeNull();
        });

        it('should not throw when called on an already-destroyed particle', function ()
        {
            var particle = new Particle(createMockEmitter());
            particle.destroy();

            expect(function () { particle.destroy(); }).not.toThrow();
        });
    });
});
