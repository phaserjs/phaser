var ParticleBounds = require('../../../src/gameobjects/particles/ParticleBounds');

describe('ParticleBounds', function ()
{
    describe('Constructor', function ()
    {
        it('should create a ParticleBounds with given position and size', function ()
        {
            var pb = new ParticleBounds(10, 20, 200, 100);

            expect(pb.bounds.x).toBe(10);
            expect(pb.bounds.y).toBe(20);
            expect(pb.bounds.width).toBe(200);
            expect(pb.bounds.height).toBe(100);
        });

        it('should default all collide flags to true', function ()
        {
            var pb = new ParticleBounds(0, 0, 100, 100);

            expect(pb.collideLeft).toBe(true);
            expect(pb.collideRight).toBe(true);
            expect(pb.collideTop).toBe(true);
            expect(pb.collideBottom).toBe(true);
        });

        it('should accept custom collide flags', function ()
        {
            var pb = new ParticleBounds(0, 0, 100, 100, false, false, false, false);

            expect(pb.collideLeft).toBe(false);
            expect(pb.collideRight).toBe(false);
            expect(pb.collideTop).toBe(false);
            expect(pb.collideBottom).toBe(false);
        });

        it('should accept mixed collide flags', function ()
        {
            var pb = new ParticleBounds(0, 0, 100, 100, true, false, true, false);

            expect(pb.collideLeft).toBe(true);
            expect(pb.collideRight).toBe(false);
            expect(pb.collideTop).toBe(true);
            expect(pb.collideBottom).toBe(false);
        });

        it('should inherit x and y from ParticleProcessor', function ()
        {
            var pb = new ParticleBounds(50, 75, 200, 100);

            expect(pb.x).toBe(50);
            expect(pb.y).toBe(75);
        });

        it('should be active by default', function ()
        {
            var pb = new ParticleBounds(0, 0, 100, 100);

            expect(pb.active).toBe(true);
        });

        it('should compute correct bounds right and bottom edges', function ()
        {
            var pb = new ParticleBounds(10, 20, 200, 100);

            expect(pb.bounds.right).toBe(210);
            expect(pb.bounds.bottom).toBe(120);
        });
    });

    describe('update', function ()
    {
        var pb;

        function makeParticle (wx, wy, vx, vy, bounce)
        {
            return {
                x: wx,
                y: wy,
                velocityX: vx,
                velocityY: vy,
                bounce: bounce !== undefined ? bounce : 1,
                worldPosition: { x: wx, y: wy }
            };
        }

        beforeEach(function ()
        {
            // Bounds from (0,0) to (100,100)
            pb = new ParticleBounds(0, 0, 100, 100);
        });

        it('should not modify a particle inside the bounds', function ()
        {
            var particle = makeParticle(50, 50, 10, 10);

            pb.update(particle);

            expect(particle.x).toBe(50);
            expect(particle.y).toBe(50);
            expect(particle.velocityX).toBe(10);
            expect(particle.velocityY).toBe(10);
        });

        it('should rebound particle off the left edge when collideLeft is true', function ()
        {
            var particle = makeParticle(-10, 50, -5, 0, 0.5);

            pb.update(particle);

            expect(particle.x).toBe(0);
            expect(particle.velocityX).toBeCloseTo(2.5);
        });

        it('should not rebound particle off the left edge when collideLeft is false', function ()
        {
            pb.collideLeft = false;
            var particle = makeParticle(-10, 50, -5, 0, 0.5);

            pb.update(particle);

            expect(particle.x).toBe(-10);
            expect(particle.velocityX).toBe(-5);
        });

        it('should rebound particle off the right edge when collideRight is true', function ()
        {
            var particle = makeParticle(110, 50, 5, 0, 0.5);

            pb.update(particle);

            expect(particle.x).toBe(100);
            expect(particle.velocityX).toBeCloseTo(-2.5);
        });

        it('should not rebound particle off the right edge when collideRight is false', function ()
        {
            pb.collideRight = false;
            var particle = makeParticle(110, 50, 5, 0, 0.5);

            pb.update(particle);

            expect(particle.x).toBe(110);
            expect(particle.velocityX).toBe(5);
        });

        it('should rebound particle off the top edge when collideTop is true', function ()
        {
            var particle = makeParticle(50, -10, 0, -5, 0.5);

            pb.update(particle);

            expect(particle.y).toBe(0);
            expect(particle.velocityY).toBeCloseTo(2.5);
        });

        it('should not rebound particle off the top edge when collideTop is false', function ()
        {
            pb.collideTop = false;
            var particle = makeParticle(50, -10, 0, -5, 0.5);

            pb.update(particle);

            expect(particle.y).toBe(-10);
            expect(particle.velocityY).toBe(-5);
        });

        it('should rebound particle off the bottom edge when collideBottom is true', function ()
        {
            var particle = makeParticle(50, 110, 0, 5, 0.5);

            pb.update(particle);

            expect(particle.y).toBe(100);
            expect(particle.velocityY).toBeCloseTo(-2.5);
        });

        it('should not rebound particle off the bottom edge when collideBottom is false', function ()
        {
            pb.collideBottom = false;
            var particle = makeParticle(50, 110, 0, 5, 0.5);

            pb.update(particle);

            expect(particle.y).toBe(110);
            expect(particle.velocityY).toBe(5);
        });

        it('should negate velocity when bounce is 1', function ()
        {
            var particle = makeParticle(-5, 50, -10, 0, 1);

            pb.update(particle);

            expect(particle.velocityX).toBe(10);
        });

        it('should zero velocity when bounce is 0', function ()
        {
            var particle = makeParticle(-5, 50, -10, 0, 0);

            pb.update(particle);

            expect(particle.velocityX).toBe(0);
        });

        it('should clamp x position exactly to left boundary', function ()
        {
            var particle = makeParticle(-25, 50, -10, 0, 1);

            pb.update(particle);

            expect(particle.x).toBe(0);
        });

        it('should clamp x position exactly to right boundary', function ()
        {
            var particle = makeParticle(115, 50, 10, 0, 1);

            pb.update(particle);

            expect(particle.x).toBe(100);
        });

        it('should clamp y position exactly to top boundary', function ()
        {
            var particle = makeParticle(50, -15, 0, -10, 1);

            pb.update(particle);

            expect(particle.y).toBe(0);
        });

        it('should clamp y position exactly to bottom boundary', function ()
        {
            var particle = makeParticle(50, 120, 0, 10, 1);

            pb.update(particle);

            expect(particle.y).toBe(100);
        });

        it('should handle a particle exactly on the left boundary without rebounding', function ()
        {
            var particle = makeParticle(0, 50, -5, 0, 1);

            pb.update(particle);

            // pos.x is not < bounds.x so no collision
            expect(particle.x).toBe(0);
            expect(particle.velocityX).toBe(-5);
        });

        it('should handle a particle exactly on the right boundary without rebounding', function ()
        {
            var particle = makeParticle(100, 50, 5, 0, 1);

            pb.update(particle);

            // pos.x is not > bounds.right so no collision
            expect(particle.x).toBe(100);
            expect(particle.velocityX).toBe(5);
        });

        it('should handle a particle exactly on the top boundary without rebounding', function ()
        {
            var particle = makeParticle(50, 0, 0, -5, 1);

            pb.update(particle);

            expect(particle.y).toBe(0);
            expect(particle.velocityY).toBe(-5);
        });

        it('should handle a particle exactly on the bottom boundary without rebounding', function ()
        {
            var particle = makeParticle(50, 100, 0, 5, 1);

            pb.update(particle);

            expect(particle.y).toBe(100);
            expect(particle.velocityY).toBe(5);
        });

        it('should handle simultaneous left and top corner collision', function ()
        {
            var particle = makeParticle(-10, -10, -5, -5, 1);

            pb.update(particle);

            expect(particle.x).toBe(0);
            expect(particle.y).toBe(0);
            expect(particle.velocityX).toBe(5);
            expect(particle.velocityY).toBe(5);
        });

        it('should handle simultaneous right and bottom corner collision', function ()
        {
            var particle = makeParticle(110, 110, 5, 5, 1);

            pb.update(particle);

            expect(particle.x).toBe(100);
            expect(particle.y).toBe(100);
            expect(particle.velocityX).toBe(-5);
            expect(particle.velocityY).toBe(-5);
        });

        it('should work with a non-zero origin bounds', function ()
        {
            var pb2 = new ParticleBounds(50, 50, 100, 100);
            var particle = makeParticle(40, 75, -5, 0, 1);

            pb2.update(particle);

            expect(particle.x).toBe(50);
            expect(particle.velocityX).toBe(5);
        });

        it('should scale velocity by bounce factor on right edge collision', function ()
        {
            var particle = makeParticle(115, 50, 20, 0, 0.75);

            pb.update(particle);

            expect(particle.x).toBe(100);
            expect(particle.velocityX).toBeCloseTo(-15);
        });

        it('should scale velocity by bounce factor on bottom edge collision', function ()
        {
            var particle = makeParticle(50, 108, 0, 20, 0.75);

            pb.update(particle);

            expect(particle.y).toBe(100);
            expect(particle.velocityY).toBeCloseTo(-15);
        });

        it('should not modify y when particle only crosses the left edge', function ()
        {
            var particle = makeParticle(-5, 50, -5, 3, 1);

            pb.update(particle);

            expect(particle.y).toBe(50);
            expect(particle.velocityY).toBe(3);
        });

        it('should not modify x when particle only crosses the top edge', function ()
        {
            var particle = makeParticle(50, -5, 3, -5, 1);

            pb.update(particle);

            expect(particle.x).toBe(50);
            expect(particle.velocityX).toBe(3);
        });
    });
});
