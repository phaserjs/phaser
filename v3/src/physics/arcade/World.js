//  Phaser.Physics.Arcade.World

var Class = require('../../utils/Class');
var Rectangle = require('../../geom/rectangle/Rectangle');
var Vector2 = require('../../math/Vector2');
var CONST = require('./const');

var World = new Class({

    initialize:

    function World (width, height)
    {
        this.gravity = new Vector2();

        this.bounds = new Rectangle(0, 0, width, height);

        this.checkCollision = { up: true, down: true, left: true, right: true };

        this.maxObjects = 10;

        this.maxLevels = 4;

        this.OVERLAP_BIAS = 4;

        this.forceX = false;

        this.sortDirection = CONST.LEFT_RIGHT;

        this.skipQuadTree = true;

        this.isPaused = false;

        // this.quadTree = new Phaser.QuadTree(this.game.world.bounds.x, this.game.world.bounds.y, this.game.world.bounds.width, this.game.world.bounds.height, this.maxObjects, this.maxLevels);

        this._total = 0;

        // this.setBoundsToWorld();
    },

    setBounds: function (x, y, width, height)
    {
        this.bounds.setTo(x, y, width, height);

        return this;
    },

    updateMotion: function (body)
    {
        if (body.allowRotation)
        {
            var velocityDelta = this.computeVelocity(0, body, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity;

            body.angularVelocity += velocityDelta;
            body.rotation += (body.angularVelocity * this.game.time.physicsElapsed);
        }

        body.velocity.x = this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x);
        body.velocity.y = this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y);
    },

    computeVelocity: function (axis, body, velocity, acceleration, drag, max)
    {
        if (max === undefined) { max = 10000; }

        if (axis === 1 && body.allowGravity)
        {
            velocity += (this.gravity.x + body.gravity.x) * this.game.time.physicsElapsed;
        }
        else if (axis === 2 && body.allowGravity)
        {
            velocity += (this.gravity.y + body.gravity.y) * this.game.time.physicsElapsed;
        }

        if (acceleration)
        {
            velocity += acceleration * this.game.time.physicsElapsed;
        }
        else if (drag && body.allowDrag)
        {
            drag *= this.game.time.physicsElapsed;

            if (velocity - drag > 0)
            {
                velocity -= drag;
            }
            else if (velocity + drag < 0)
            {
                velocity += drag;
            }
            else
            {
                velocity = 0;
            }
        }

        if (velocity > max)
        {
            velocity = max;
        }
        else if (velocity < -max)
        {
            velocity = -max;
        }

        return velocity;
    },

    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        overlapCallback = overlapCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || overlapCallback;

        this._total = 0;

        this.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);

        return (this._total > 0);
    },

    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        collideCallback = collideCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || collideCallback;

        this._total = 0;

        this.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);

        return (this._total > 0);
    },

    sortLeftRight: function (a, b)
    {
        if (!a.body || !b.body)
        {
            return 0;
        }

        return a.body.x - b.body.x;
    },

    sortRightLeft: function (a, b)
    {
        if (!a.body || !b.body)
        {
            return 0;
        }

        return b.body.x - a.body.x;
    },

    sortTopBottom: function (a, b)
    {
        if (!a.body || !b.body)
        {
            return 0;
        }

        return a.body.y - b.body.y;
    },

    sortBottomTop: function (a, b)
    {
        if (!a.body || !b.body)
        {
            return 0;
        }

        return b.body.y - a.body.y;
    },

    /*
    sort: function (group, sortDirection)
    {
        if (group.physicsSortDirection !== null)
        {
            sortDirection = group.physicsSortDirection;
        }
        else
        {
            if (sortDirection === undefined) { sortDirection = this.sortDirection; }
        }

        if (sortDirection === Phaser.Physics.Arcade.LEFT_RIGHT)
        {
            //  Game world is say 2000x600 and you start at 0
            group.hash.sort(this.sortLeftRight);
        }
        else if (sortDirection === Phaser.Physics.Arcade.RIGHT_LEFT)
        {
            //  Game world is say 2000x600 and you start at 2000
            group.hash.sort(this.sortRightLeft);
        }
        else if (sortDirection === Phaser.Physics.Arcade.TOP_BOTTOM)
        {
            //  Game world is say 800x2000 and you start at 0
            group.hash.sort(this.sortTopBottom);
        }
        else if (sortDirection === Phaser.Physics.Arcade.BOTTOM_TOP)
        {
            //  Game world is say 800x2000 and you start at 2000
            group.hash.sort(this.sortBottomTop);
        }
    },
    */

    collideObjects: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly)
    {
        if (!Array.isArray(object1) && Array.isArray(object2))
        {
            for (var i = 0; i < object2.length; i++)
            {
                if (!object2[i]) { continue; }

                this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else if (Array.isArray(object1) && !Array.isArray(object2))
        {
            for (var i = 0; i < object1.length; i++)
            {
                if (!object1[i]) { continue; }

                this.collideHandler(object1[i], object2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }
        else if (Array.isArray(object1) && Array.isArray(object2))
        {
            for (var i = 0; i < object1.length; i++)
            {
                if (!object1[i]) { continue; }

                for (var j = 0; j < object2.length; j++)
                {
                    if (!object2[j]) { continue; }

                    this.collideHandler(object1[i], object2[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }
        else
        {
            this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
        }
    },

});

module.exports = World;
