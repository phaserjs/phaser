var Trace = function (x, y, vx, vy)
{
    return {
        collision: { x: false, y: false, slope: false },
        pos: { x: x + vx, y: y + vy },
        tile: { x: 0, y: 0 }
    };
};

module.exports = Trace;
