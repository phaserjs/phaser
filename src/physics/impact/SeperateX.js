
var SeperateX = function (world, left, right, weak)
{
    var nudge = left.pos.x + left.size.x - right.pos.x;
    
    // We have a weak entity, so just move this one
    if (weak)
    {
        var strong = (left === weak) ? right : left;

        weak.vel.x = -weak.vel.x * weak.bounciness + strong.vel.x;
        
        var resWeak = world.collisionMap.trace(weak.pos.x, weak.pos.y, weak === left ? -nudge : nudge, 0, weak.size.x, weak.size.y);

        weak.pos.x = resWeak.pos.x;
    }
    else
    {
        var v2 = (left.vel.x - right.vel.x) / 2;

        left.vel.x = -v2;
        right.vel.x = v2;
    
        var resLeft = world.collisionMap.trace(left.pos.x, left.pos.y, -nudge / 2, 0, left.size.x, left.size.y);

        left.pos.x = Math.floor(resLeft.pos.x);
        
        var resRight = world.collisionMap.trace(right.pos.x, right.pos.y, nudge / 2, 0, right.size.x, right.size.y);

        right.pos.x = Math.ceil(resRight.pos.x);
    }
};

module.exports = SeperateX;
