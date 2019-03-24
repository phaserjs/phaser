/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var IntersectsRect = require('./IntersectsRect');

var CollisionInfo = {

    check: function (data, body1, body2, overlapOnly, bias)
    {
        if (overlapOnly === undefined) { overlapOnly = false; }
        if (bias === undefined) { bias = 0; }

        if (data)
        {
            body1 = data.body1;
            body2 = data.body2;
        }

        var overlapX = 0;
        var overlapY = 0;

        // var maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + bias;
    
        var distanceX1 = body1.right - body2.x;
        var distanceX2 = body2.right - body1.x;
    
        var prevDistanceX1 = (body1.prev.x + body1.width) - body2.prev.x;
        var prevDistanceX2 = (body2.prev.x + body2.width) - body1.prev.x;

        var distanceY1 = body1.bottom - body2.y;
        var distanceY2 = body2.bottom - body1.y;
    
        var prevDistanceY1 = (body1.prev.y + body1.height) - body2.prev.y;
        var prevDistanceY2 = (body2.prev.y + body2.height) - body1.prev.y;
   
        var leftFace = (distanceX1 > distanceX2 && prevDistanceX1 > prevDistanceX2);
        var topFace = (distanceY1 > distanceY2 && prevDistanceY1 > prevDistanceY2);

        var testX = ((leftFace && (!body1.checkCollision.left || !body2.checkCollision.right)) || (!leftFace && (!body1.checkCollision.right || !body2.checkCollision.left)));
        var testY = ((topFace && (!body1.checkCollision.up || !body2.checkCollision.down)) || (!topFace && (!body1.checkCollision.down || !body2.checkCollision.up)));
    
        var face = CONST.FACING_NONE;
        var intersects = false;
        var touching = false;

        if (testX || testY)
        {
            intersects = IntersectsRect(body1, body2, 0);
            touching = (intersects) ? true : IntersectsRect(body1, body2, 1);

            //  Try and give 50% separation to each body (this could be improved to give a speed ratio amount to each body)
            var share = 0;
            var share1 = 0;
            var share2 = 0;
        }


        
        if (topFace)
        {
            face = CONST.FACING_UP;

            //  body1 top is touching body2 bottom
            if (intersects && body1.checkCollision.up && body2.checkCollision.down)
            {
                overlapY = distanceY2;

                share = overlapY * 0.5;

                if (!body1.immovable)
                {
                    share1 = body1.getMoveY(share);
                }

                if (share1 < share)
                {
                    share += (share - share1);
                }

                if (!body2.immovable)
                {
                    share2 = body2.getMoveY(-share);
                }
            }
            else
            {
                intersects = false;
            }
        }
        else
        {
            face = CONST.FACING_DOWN;

            //  body1 bottom is touching body2 top
            if (intersects && body1.checkCollision.down && body2.checkCollision.up)
            {
                overlapY = distanceY1;

                share = overlapY * 0.5;

                if (!body2.immovable)
                {
                    share2 = body2.getMoveY(share);
                }

                if (share2 < share)
                {
                    share += (share - share2);
                }
    
                if (!body1.immovable)
                {
                    share1 = body1.getMoveY(-share);
                }
            }
            else
            {
                intersects = false;
            }
        }

        if (data)
        {
            data.intersects = intersects;
            data.touching = touching;
            data.overlapX = overlapX;
            data.overlapY = overlapY;
            data.face = face;
            data.set = false;
            data.share1 = share1;
            data.share2 = share2;

            return data;
        }
        else
        {
            return {
                body1: body1,
                body2: body2,
                intersects: intersects,
                touching: touching,
                overlapX: overlapX,
                overlapY: overlapY,
                face: face,
                set: false,
                share1: share1,
                share2: share2
            };
        }
    },

    get: function (body1, body2, overlapOnly, bias)
    {
        var blockers = body1.blockers;

        for (var i = 0; i < blockers.length; i++)
        {
            var data = blockers[i];

            if (data.body1 === body1 && data.body2 === body2)
            {
                this.check(data);

                return data;
            }
        }

        return this.check(null, body1, body2, overlapOnly, bias);
    },

    create: function (body1, body2, overlapOnly, bias)
    {
        return this.check(null, body1, body2, overlapOnly, bias);
    },

    update: function (collisionInfo)
    {
        return this.check(collisionInfo);
    }

};

module.exports = CollisionInfo;
