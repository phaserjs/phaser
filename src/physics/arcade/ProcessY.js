/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var body1Pushable;
var body2Pushable;
var body1MassImpact;
var body2MassImpact;
var body1FullImpact;
var body2FullImpact;

var SetProcessY = function (b1Pushable, b2Pushable, b1MassImpact, b2MassImpact, b1FullImpact, b2FullImpact)
{
    body1Pushable = b1Pushable;
    body2Pushable = b2Pushable;
    body1MassImpact = b1MassImpact;
    body2MassImpact = b2MassImpact;
    body1FullImpact = b1FullImpact;
    body2FullImpact = b2FullImpact;
};

var RunProcessY = function (body1, body2, overlap1, overlap2, bodyStationary, body2Direction, movingBody, debug)
{
    if (body1Pushable && body2Pushable)
    {
        //  Both pushable
        if (debug)
        {
            console.log(debug + '-0 :: body1', body1.y, 'body2', body2.y, 'overlap', overlap1, overlap2);
        }

        //  Both pushable, or both moving at the same time, so equal rebound
        overlap1 *= 0.5;
        overlap2 *= 0.5;

        body1.y += overlap1;
        body2.y += overlap2;

        body1.velocity.y = body1MassImpact;
        body2.velocity.y = body2MassImpact;
    }
    else if (body1Pushable && !body2Pushable)
    {
        if (debug)
        {
            console.log(debug + '-1 :: body1', body1.y, 'body2', body2.y, 'overlap', overlap1, overlap2);
        }

        //  Body1 pushable, Body2 not
        body1.y += overlap1;
        body1.velocity.y = body1FullImpact;
    }
    else if (!body1Pushable && body2Pushable)
    {
        if (debug)
        {
            console.log(debug + '-2 :: body1', body1.y, 'body2', body2.y, 'overlap', overlap1, overlap2);
        }

        //  Body2 pushable, Body1 not
        body2.y += overlap2;
        body2.velocity.y = body2FullImpact;
    }
    else if (bodyStationary || body2Direction)
    {
        if (debug)
        {
            console.log(debug + '-3 :: body1', body1.y, 'body2', body2.y, 'overlap', overlap1, overlap2);
        }

        //  Neither pushable, so base it on movement
        if (bodyStationary)
        {
            if (debug)
            {
                console.log(debug + '-3a :: body1', body1.y, 'body2', body2.y, 'overlap', overlap1, overlap2);
            }

            if (movingBody === body1)
            {
                movingBody.y += overlap1;
            }
            else
            {
                movingBody.y += overlap2;
            }
        }
        else
        {
            //  Both pushable, or both moving at the same time, so equal rebound
            overlap1 *= 0.5;
            overlap2 *= 0.5;

            body1.y += overlap1;
            body2.y += overlap2;
        }

        body1.velocity.y = 0;
        body2.velocity.y = 0;
    }
    else
    {
        if (debug)
        {
            console.log(debug + '-4 :: body1', body1.y, 'body2', body2.y, 'overlap', overlap1, overlap2);
        }

        //  Body1 and Body2 both moving up, so slow Body1 to match Body2 speed
        body1.velocity.y = body2.velocity.y;
    }

    return true;
};

module.exports = {
    SetProcessY: SetProcessY,
    RunProcessY: RunProcessY
};
