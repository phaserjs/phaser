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

        //  Work out the vertical overlap first
    
        var distance1 = body1.bottom - body2.y;
        var distance2 = body2.bottom - body1.y;
    
        var prevDistance1 = (body1.prev.y + body1.height) - body2.prev.y;
        var prevDistance2 = (body2.prev.y + body2.height) - body1.prev.y;
   
        var topFace = (distance1 > distance2 && prevDistance1 > prevDistance2);
    
        var intersects = IntersectsRect(body1, body2, 0);
        var touching = (intersects) ? true : IntersectsRect(body1, body2, 1);

        var face = CONST.FACING_NONE;

        //  Try and give 50% separation to each body (this could be improved to give a speed ratio amount to each body)
        var share = 0;
        var share1 = 0;
        var share2 = 0;
        
        if (topFace)
        {
            face = CONST.FACING_UP;

            //  body1 top is touching body2 bottom
            if (intersects && body1.checkCollision.up && body2.checkCollision.down)
            {
                overlapY = distance2;

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
                overlapY = distance1;

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
