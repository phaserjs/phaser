var Equals = function (line, toCompare)
{
    return (
        line.x1 === toCompare.x1 &&
        line.y1 === toCompare.y1 &&
        line.x2 === toCompare.x2 &&
        line.y2 === toCompare.y2
    );
};

module.exports = Equals;
