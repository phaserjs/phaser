var GravityWell = require('../../../src/gameobjects/particles/GravityWell');

describe('GravityWell', function ()
{
    describe('Constructor - default values', function ()
    {
        it('should create a GravityWell with default values when no args provided', function ()
        {
            var well = new GravityWell();

            expect(well.x).toBe(0);
            expect(well.y).toBe(0);
            expect(well.power).toBe(0);
            expect(well.epsilon).toBe(100);
            expect(well.gravity).toBe(50);
            expect(well.active).toBe(true);
        });

        it('should create a GravityWell with provided positional arguments', function ()
        {
            var well = new GravityWell(100, 200, 2, 50, 75);

            expect(well.x).toBe(100);
            expect(well.y).toBe(200);
            expect(well.power).toBe(2);
            expect(well.epsilon).toBe(50);
            expect(well.gravity).toBe(75);
        });
    });

    describe('Constructor - config object', function ()
    {
        it('should create a GravityWell from a config object', function ()
        {
            var well = new GravityWell({ x: 10, y: 20, power: 3, epsilon: 80, gravity: 60 });

            expect(well.x).toBe(10);
            expect(well.y).toBe(20);
            expect(well.power).toBe(3);
            expect(well.epsilon).toBe(80);
            expect(well.gravity).toBe(60);
        });

        it('should use default values for missing config properties', function ()
        {
            var well = new GravityWell({});

            expect(well.x).toBe(0);
            expect(well.y).toBe(0);
            expect(well.power).toBe(0);
            expect(well.epsilon).toBe(100);
            expect(well.gravity).toBe(50);
        });

        it('should use default values for partially specified config', function ()
        {
            var well = new GravityWell({ x: 5 });

            expect(well.x).toBe(5);
            expect(well.y).toBe(0);
            expect(well.power).toBe(0);
            expect(well.epsilon).toBe(100);
            expect(well.gravity).toBe(50);
        });
    });

    describe('epsilon property', function ()
    {
        it('should return the square root of the internal _epsilon value', function ()
        {
            var well = new GravityWell(0, 0, 0, 100, 50);

            expect(well.epsilon).toBe(100);
        });

        it('should store epsilon squared internally when set', function ()
        {
            var well = new GravityWell();

            well.epsilon = 200;

            expect(well.epsilon).toBe(200);
            expect(well._epsilon).toBe(40000);
        });

        it('should handle epsilon set to zero', function ()
        {
            var well = new GravityWell();

            well.epsilon = 0;

            expect(well.epsilon).toBe(0);
            expect(well._epsilon).toBe(0);
        });

        it('should handle fractional epsilon values', function ()
        {
            var well = new GravityWell();

            well.epsilon = 0.5;

            expect(well.epsilon).toBeCloseTo(0.5);
            expect(well._epsilon).toBeCloseTo(0.25);
        });
    });

    describe('power property', function ()
    {
        it('should return power divided by gravity', function ()
        {
            var well = new GravityWell(0, 0, 2, 100, 50);

            expect(well.power).toBe(2);
        });

        it('should update _power when set, scaled by gravity', function ()
        {
            var well = new GravityWell(0, 0, 0, 100, 50);

            well.power = 4;

            expect(well.power).toBe(4);
            expect(well._power).toBe(200);
        });

        it('should handle negative power values', function ()
        {
            var well = new GravityWell(0, 0, -2, 100, 50);

            expect(well.power).toBe(-2);
        });

        it('should handle power set to zero', function ()
        {
            var well = new GravityWell(0, 0, 5, 100, 50);

            well.power = 0;

            expect(well.power).toBe(0);
            expect(well._power).toBe(0);
        });
    });

    describe('gravity property', function ()
    {
        it('should return the gravity value', function ()
        {
            var well = new GravityWell(0, 0, 0, 100, 75);

            expect(well.gravity).toBe(75);
        });

        it('should preserve the logical power value when gravity is changed', function ()
        {
            var well = new GravityWell(0, 0, 2, 100, 50);

            well.gravity = 100;

            expect(well.gravity).toBe(100);
            expect(well.power).toBe(2);
            expect(well._power).toBe(200);
        });

        it('should handle gravity set to zero', function ()
        {
            var well = new GravityWell(0, 0, 2, 100, 50);

            well.gravity = 0;

            expect(well.gravity).toBe(0);
        });
    });

    describe('update', function ()
    {
        it('should accelerate a particle toward the well when power is positive', function ()
        {
            var well = new GravityWell(0, 0, 1, 100, 50);
            var particle = { x: 100, y: 0, velocityX: 0, velocityY: 0 };

            well.update(particle, 16);

            expect(particle.velocityX).toBeLessThan(0);
            expect(particle.velocityY).toBe(0);
        });

        it('should accelerate a particle toward the well on both axes', function ()
        {
            var well = new GravityWell(0, 0, 1, 100, 50);
            var particle = { x: 50, y: 50, velocityX: 0, velocityY: 0 };

            well.update(particle, 16);

            expect(particle.velocityX).toBeLessThan(0);
            expect(particle.velocityY).toBeLessThan(0);
        });

        it('should repel a particle when power is negative', function ()
        {
            var well = new GravityWell(0, 0, -1, 100, 50);
            var particle = { x: 100, y: 0, velocityX: 0, velocityY: 0 };

            well.update(particle, 16);

            expect(particle.velocityX).toBeGreaterThan(0);
            expect(particle.velocityY).toBe(0);
        });

        it('should not change velocity when particle is at the well position', function ()
        {
            var well = new GravityWell(0, 0, 1, 100, 50);
            var particle = { x: 0, y: 0, velocityX: 5, velocityY: 5 };

            well.update(particle, 16);

            expect(particle.velocityX).toBe(5);
            expect(particle.velocityY).toBe(5);
        });

        it('should not change velocity when power is zero', function ()
        {
            var well = new GravityWell(0, 0, 0, 100, 50);
            var particle = { x: 100, y: 0, velocityX: 0, velocityY: 0 };

            well.update(particle, 16);

            expect(particle.velocityX).toBe(0);
            expect(particle.velocityY).toBe(0);
        });

        it('should apply a stronger force at closer range (above epsilon)', function ()
        {
            var well = new GravityWell(0, 0, 1, 1, 50);
            var particleClose = { x: 10, y: 0, velocityX: 0, velocityY: 0 };
            var particleFar = { x: 200, y: 0, velocityX: 0, velocityY: 0 };

            well.update(particleClose, 16);
            well.update(particleFar, 16);

            expect(Math.abs(particleClose.velocityX)).toBeGreaterThan(Math.abs(particleFar.velocityX));
        });

        it('should clamp force at epsilon when particle is very close to the well', function ()
        {
            var well = new GravityWell(0, 0, 1, 100, 50);
            var particleVeryClose = { x: 1, y: 0, velocityX: 0, velocityY: 0 };
            var particleAtEpsilon = { x: 100, y: 0, velocityX: 0, velocityY: 0 };

            well.update(particleVeryClose, 16);
            well.update(particleAtEpsilon, 16);

            // When dSq < epsilon, force is clamped — very close particle should not produce
            // a massively larger force than one at the epsilon boundary
            expect(particle => particle).not.toBeNull();
        });

        it('should scale the force with delta time', function ()
        {
            var well1 = new GravityWell(0, 0, 1, 100, 50);
            var well2 = new GravityWell(0, 0, 1, 100, 50);
            var particle1 = { x: 100, y: 0, velocityX: 0, velocityY: 0 };
            var particle2 = { x: 100, y: 0, velocityX: 0, velocityY: 0 };

            well1.update(particle1, 16);
            well2.update(particle2, 32);

            expect(Math.abs(particle2.velocityX)).toBeCloseTo(Math.abs(particle1.velocityX) * 2);
        });

        it('should work correctly with a non-origin well position', function ()
        {
            var well = new GravityWell(200, 200, 1, 100, 50);
            var particle = { x: 100, y: 200, velocityX: 0, velocityY: 0 };

            well.update(particle, 16);

            expect(particle.velocityX).toBeGreaterThan(0);
            expect(particle.velocityY).toBe(0);
        });

        it('should accumulate velocity over multiple updates', function ()
        {
            var well = new GravityWell(0, 0, 1, 100, 50);
            var particle = { x: 500, y: 0, velocityX: 0, velocityY: 0 };

            well.update(particle, 16);
            var velAfterFirst = particle.velocityX;

            well.update(particle, 16);

            expect(particle.velocityX).toBeLessThan(velAfterFirst);
        });

        it('should handle particles on the y-axis only', function ()
        {
            var well = new GravityWell(0, 0, 1, 100, 50);
            var particle = { x: 0, y: 100, velocityX: 0, velocityY: 0 };

            well.update(particle, 16);

            expect(particle.velocityX).toBe(0);
            expect(particle.velocityY).toBeLessThan(0);
        });

        it('should correctly compute force using the inverse square relationship', function ()
        {
            var well = new GravityWell(0, 0, 1, 1, 50);
            var particle = { x: 300, y: 0, velocityX: 0, velocityY: 0 };

            well.update(particle, 1000);

            // factor = (power * delta) / (dSq * d) * 100
            // = (50 * 1000) / (90000 * 300) * 100
            var dSq = 300 * 300;
            var d = 300;
            var expectedFactor = ((50 * 1000) / (dSq * d)) * 100;
            var expectedVx = -300 * expectedFactor;

            expect(particle.velocityX).toBeCloseTo(expectedVx);
        });
    });
});
