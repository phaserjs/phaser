/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');
var FuzzyEqual = require('../../math/fuzzy/Equal');
var IntersectsRect = require('./IntersectsRect');

var CollisionInfo = {

    check: function (data, body1, body2, overlapOnly, bias)
    {
        if (overlapOnly === undefined) { overlapOnly = false; }
        if (bias === undefined) { bias = 0; }

        if (data)
        {
            //  We're refreshing an existing data dump, not creating a new one
            body1 = data.body1;
            body2 = data.body2;
        }

        var intersects = IntersectsRect(body1, body2, 0);
        var touching = (intersects) ? true : IntersectsRect(body1, body2, 1);

        if (data && !intersects)
        {
            //  We can bail out early if we're re-checking an existing CI AND it's no longer intersecting, just maybe touching
            data.intersects = intersects;
            data.touching = touching;

            if (!touching)
            {
                //  Reset the face if not even touching
                data.face = CONST.FACING_NONE;
            }

            return data;
        }

        var checkCollision1 = body1.checkCollision;
        var checkCollision2 = body2.checkCollision;

        var intersectsX = intersects;
        var intersectsY = intersects;

        var overlapX = 0;
        var overlapY = 0;

        var v1 = body1.velocity;
        var v2 = body2.velocity;

        // var maxOverlapX = body1.deltaAbsX() + body2.deltaAbsX() + bias;
        // var maxOverlapY = body1.deltaAbsY() + body2.deltaAbsY() + bias;

        var maxOverlapX = bias;
        var maxOverlapY = bias;
    
        var distanceX1 = body1.right - body2.x;
        var distanceX2 = body2.right - body1.x;
    
        var distanceY1 = body1.bottom - body2.y;
        var distanceY2 = body2.bottom - body1.y;
    
        var leftFace = (distanceX1 > distanceX2);
        var topFace = (distanceY1 > distanceY2);

        var touchingX = false;

        if (body1.x === body2.right)
        {
            leftFace = true;
            touchingX = true;
            intersectsY = false;
        }
        else if (body1.right === body2.x)
        {
            leftFace = false;
            touchingX = true;
            intersectsY = false;
        }

        if (body1.y === body2.bottom)
        {
            topFace = true;
            intersectsX = false;
        }
        else if (body1.bottom === body2.y)
        {
            topFace = false;
            intersectsX = false;
        }

        var faceX = CONST.FACING_NONE;
        var faceY = CONST.FACING_NONE;

        var share = 0;
        var shareX1 = 0;
        var shareX2 = 0;
        var shareY1 = 0;
        var shareY2 = 0;

        var timeXCollision = 0;
        var timeYCollision = 0;

        if (leftFace)
        {
            faceX = CONST.FACING_LEFT;

            //  body1 left is touching body2 right
            if (intersectsX)
            {
                overlapX = distanceX2;

                timeXCollision = overlapX / body2.deltaX();

                share = overlapX * 0.5;

                if (!body1.immovable)
                {
                    shareX1 = body1.getShareX(share);
                }

                if (shareX1 < share)
                {
                    share += (share - shareX1);
                }

                if (!body2.immovable)
                {
                    shareX2 = body2.getShareX(-share);
                }
            }
            else
            {
                touching = false;
                intersects = false;
                intersectsX = false;
            }
        }
        else if (!leftFace)
        {
            faceX = CONST.FACING_RIGHT;

            //  body1 right is touching body2 left
            if (intersectsX)
            {
                overlapX = distanceX1;

                timeXCollision = overlapX / -body2.deltaX();

                share = overlapX * 0.5;

                if (!body2.immovable)
                {
                    shareX2 = body2.getShareX(share);
                }

                if (shareX2 < share)
                {
                    share += (share - shareX2);
                }
    
                if (!body1.immovable)
                {
                    shareX1 = body1.getShareX(-share);
                }
            }
            else
            {
                touching = false;
                intersects = false;
                intersectsX = false;
            }
        }

        if (topFace)
        {
            faceY = CONST.FACING_UP;

            //  body1 top is touching body2 bottom
            if (intersectsY)
            {
                overlapY = distanceY2;

                timeYCollision = overlapY / body2.deltaY();

                share = overlapY * 0.5;

                if (!body1.immovable)
                {
                    shareY1 = body1.getShareY(share);
                }

                if (shareY1 < share)
                {
                    share += (share - shareY1);
                }

                if (!body2.immovable)
                {
                    shareY2 = body2.getShareY(-share);
                }
            }
            else
            {
                touching = false;
                intersects = false;
                intersectsY = false;
            }
        }
        else
        {
            faceY = CONST.FACING_DOWN;

            //  body1 bottom is touching body2 top
            if (intersectsY)
            {
                overlapY = distanceY1;

                timeYCollision = overlapY / -body2.deltaY();

                share = overlapY * 0.5;

                if (!body2.immovable)
                {
                    shareY2 = body2.getShareY(share);
                }

                if (shareY2 < share)
                {
                    share += (share - shareY2);
                }
    
                if (!body1.immovable)
                {
                    shareY1 = body1.getShareY(-share);
                }
            }
            else
            {
                touching = false;
                intersects = false;
                intersectsY = false;
            }
        }

        var forceX = (touchingX || (timeXCollision < timeYCollision));
        var face = (forceX) ? faceX : faceY;

        //  Body embedded?
        var embeddedX = (forceX && overlapX > maxOverlapX);
        var embeddedY = (!forceX && overlapY > maxOverlapY);

        var embedded = (embeddedX || embeddedY);

        var abort = (checkCollision1.none || checkCollision2.none);

        //  Collision Checks

        if (!abort)
        {
            if (forceX && FuzzyEqual(overlapX, 0))
            {
                //  Difference is too small to warrant considering separation
                overlapX = 0;
                shareX1 = 0;
                shareX2 = 0;
                intersects = false;
                intersectsX = false;
                face = faceX;
            }
            
            if (!forceX && FuzzyEqual(overlapY, 0))
            {
                //  Difference is too small to warrant considering separation
                overlapY = 0;
                shareY1 = 0;
                shareY2 = 0;
                intersects = false;
                intersectsY = false;
                face = faceY;
            }

            if (!checkCollision1.left && ((face === CONST.FACING_LEFT || embeddedX) && v2.x >= 0))
            {
                abort = true;
            }
            else if (!checkCollision1.right && ((face === CONST.FACING_RIGHT || embeddedX) && v2.x <= 0))
            {
                abort = true;
            }
            else if (!checkCollision1.up && ((face === CONST.FACING_UP || embeddedY) && v2.y >= 0))
            {
                abort = true;
            }
            else if (!checkCollision1.down && ((face === CONST.FACING_DOWN || embeddedY) && v2.y <= 0))
            {
                abort = true;
            }
    
            if (!checkCollision2.left && ((face === CONST.FACING_RIGHT || embeddedX) && v1.x >= 0))
            {
                abort = true;
            }
            else if (!checkCollision2.right && ((face === CONST.FACING_LEFT || embeddedX) && v1.x <= 0))
            {
                abort = true;
            }
            else if (!checkCollision2.up && ((face === CONST.FACING_DOWN || embeddedY) && v1.y >= 0))
            {
                abort = true;
            }
            else if (!checkCollision2.down && ((face === CONST.FACING_UP || embeddedY) && v1.y <= 0))
            {
                abort = true;
            }
        }

        if (abort)
        {
            intersects = false;
            touching = false;
            face = CONST.FACING_NONE;
        }

        var dump = function ()
        {
            var faces = { 10: 'None', 11: 'Up', 12: 'Down', 13: 'Left', 14: 'Right' };

            if (abort)
            {
                console.log('%c Aborted                                      ', 'background-color: red');
            }

            console.log('body1:', body1.gameObject.name, 'vs body2:', body2.gameObject.name, 'on face', faces[face], faces[faceX], faces[faceY]);
            console.log('intersects?', intersects, 'xy', intersectsX, intersectsY, 'touching?', touching);
            console.log('body1 x:', body1.x, 'right:', body1.right);
            console.log('body1 y:', body1.y, 'bottom:', body1.bottom);
            console.log('body2 x:', body2.x, 'right:', body2.right);
            console.log('body2 y:', body2.y, 'bottom:', body2.bottom);
            console.log('embedded?', embedded, 'xy', embeddedX, embeddedY);
            console.log('time x', timeXCollision, 'time y', timeYCollision);

            // console.log('prev body1 x:', body1.prev.x, 'prev y:', body1.prev.y);
            // console.log('prev body2 x:', body2.prev.x, 'prev y:', body2.prev.y);
            console.log('velocity1 x:', body1.velocity.x, 'y:', body1.velocity.y);
            console.log('velocity2 x:', body2.velocity.x, 'y:', body2.velocity.y);

            var col1 = body1.checkCollision;
            var col2 = body2.checkCollision;

            console.log('collision1 up:', col1.up, 'down:', col1.down, 'left:', col1.left, 'right:', col1.right);
            console.log('collision2 up:', col2.up, 'down:', col2.down, 'left:', col2.left, 'right:', col2.right);

            if (forceX)
            {
                console.log('FORCE X body1 overlaps body2 on the ' + ((faceX === CONST.FACING_LEFT) ? 'left' : 'right') + ' face');
            }
            else
            {
                console.log('FORCE Y body1 overlaps body2 on the ' + ((faceY === CONST.FACING_UP) ? 'top' : 'bottom') + ' face');
            }

            console.log('overlapX:', overlapX, 'overlapY:', overlapY);
            console.log('maxOverlapX:', maxOverlapX, 'maxOverlapY:', maxOverlapY);
            console.log('distanceX:', distanceX1, distanceX2);
            // console.log('prevDistanceX', prevDistanceX1, prevDistanceX2, 'left?', (distanceX1 > distanceX2 && prevDistanceX1 > prevDistanceX2));
            console.log('distanceY:', distanceY1, distanceY2);
            // console.log('prevDistanceY', prevDistanceY1, prevDistanceY2, 'top?', (distanceY1 > distanceY2 && prevDistanceY1 > prevDistanceY2));

            // console.log('shareX1:', shareX1, 'shareX2:', shareX2);
            // console.log('shareY1:', shareY1, 'shareY2:', shareY2);

            // var blocked1 = body1.blocked;
            // var blocked2 = body2.blocked;

            // console.log('body1 blocked up:', blocked1.up, 'down:', blocked1.down, 'left:', blocked1.left, 'right:', blocked1.right);
            // console.log('body2 blocked up:', blocked2.up, 'down:', blocked2.down, 'left:', blocked2.left, 'right:', blocked2.right);

            // console.log('x compare (CI): ', body1.right, 'body2', body2.x, '=', (body1.right - body2.x));
            // console.log('y compare (CI): ', body1.bottom, 'body2', body2.y, '=', (body1.bottom - body2.y));
        };

        if (data)
        {
            data.abort = abort;
            data.intersects = intersects;
            data.touching = touching;
            data.embedded = embedded;
            data.overlapOnly = overlapOnly;
            data.overlapX = overlapX;
            data.overlapY = overlapY;
            data.forceX = forceX;
            data.face = face;
            data.faceX = faceX;
            data.faceY = faceY;
            data.set = false;
            data.shareX1 = shareX1;
            data.shareX2 = shareX2;
            data.shareY1 = shareY1;
            data.shareY2 = shareY2;
            data.dump = dump;

            return data;
        }
        else
        {
            return {
                abort: abort,
                body1: body1,
                body2: body2,
                embedded: embedded,
                intersects: intersects,
                touching: touching,
                overlapOnly: overlapOnly,
                overlapX: overlapX,
                overlapY: overlapY,
                forceX: forceX,
                face: face,
                faceX: faceX,
                faceY: faceY,
                set: false,
                shareX1: shareX1,
                shareX2: shareX2,
                shareY1: shareY1,
                shareY2: shareY2,
                dump: dump
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
