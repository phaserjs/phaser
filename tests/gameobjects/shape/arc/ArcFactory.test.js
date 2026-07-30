// @vitest-environment jsdom

var helper = require('../../../helper');
var GameObjectFactory = require('../../../../src/gameobjects/GameObjectFactory');

// Register arc and circle on the source GameObjectFactory prototype
require('../../../../src/gameobjects/shape/arc/ArcFactory');

describe('ArcFactory', function ()
{
    var scene;

    beforeEach(async function ()
    {
        scene = await helper.createGame();
    });

    afterEach(function ()
    {
        helper.destroyGame();
    });

    describe('registration', function ()
    {
        it('should register arc on GameObjectFactory prototype', function ()
        {
            expect(typeof GameObjectFactory.prototype.arc).toBe('function');
        });

        it('should register circle on GameObjectFactory prototype', function ()
        {
            expect(typeof GameObjectFactory.prototype.circle).toBe('function');
        });
    });

    describe('#arc factory method', function ()
    {
        it('should return an Arc game object', function ()
        {
            var arc = scene.add.arc(100, 200, 64, 0, 360, false, 0xff0000, 1);

            expect(arc).toBeDefined();
            expect(arc.type).toBe('Arc');
        });

        it('should pass x and y to the Arc constructor', function ()
        {
            var arc = scene.add.arc(50, 75, 32);

            expect(arc.x).toBe(50);
            expect(arc.y).toBe(75);
        });

        it('should pass radius to the Arc constructor', function ()
        {
            var arc = scene.add.arc(0, 0, 200);

            expect(arc.radius).toBe(200);
        });

        it('should pass startAngle and endAngle to the Arc constructor', function ()
        {
            var arc = scene.add.arc(0, 0, 128, 45, 180, false);

            expect(arc.startAngle).toBe(45);
            expect(arc.endAngle).toBe(180);
        });

        it('should pass anticlockwise flag to the Arc constructor', function ()
        {
            var arc = scene.add.arc(0, 0, 128, 0, 360, true);

            expect(arc.anticlockwise).toBe(true);
        });

        it('should pass fillColor and fillAlpha to the Arc constructor', function ()
        {
            var arc = scene.add.arc(0, 0, 128, 0, 360, false, 0x0000ff, 0.75);

            expect(arc.fillColor).toBe(0x0000ff);
            expect(arc.fillAlpha).toBe(0.75);
        });

        it('should add the arc to the display list', function ()
        {
            var arc = scene.add.arc(0, 0, 64);

            expect(scene.children.exists(arc)).toBe(true);
        });
    });

    describe('#circle factory method', function ()
    {
        it('should return an Arc game object', function ()
        {
            var circle = scene.add.circle(100, 200, 64, 0xff0000, 1);

            expect(circle).toBeDefined();
            expect(circle.type).toBe('Arc');
        });

        it('should always use startAngle of 0', function ()
        {
            var circle = scene.add.circle(0, 0, 128, 0xff0000, 1);

            expect(circle.startAngle).toBe(0);
        });

        it('should always use endAngle of 360', function ()
        {
            var circle = scene.add.circle(0, 0, 128, 0xff0000, 1);

            expect(circle.endAngle).toBe(360);
        });

        it('should always use anticlockwise of false', function ()
        {
            var circle = scene.add.circle(0, 0, 128, 0xff0000, 1);

            expect(circle.anticlockwise).toBe(false);
        });

        it('should pass x and y to the Arc constructor', function ()
        {
            var circle = scene.add.circle(300, 400, 64);

            expect(circle.x).toBe(300);
            expect(circle.y).toBe(400);
        });

        it('should pass radius to the Arc constructor', function ()
        {
            var circle = scene.add.circle(0, 0, 96);

            expect(circle.radius).toBe(96);
        });

        it('should pass fillColor and fillAlpha to the Arc constructor', function ()
        {
            var circle = scene.add.circle(0, 0, 64, 0x00ff00, 0.9);

            expect(circle.fillColor).toBe(0x00ff00);
            expect(circle.fillAlpha).toBe(0.9);
        });

        it('should add the circle to the display list', function ()
        {
            var circle = scene.add.circle(0, 0, 64);

            expect(scene.children.exists(circle)).toBe(true);
        });
    });
});
