var Area = function (circle)
{
    return (circle.radius > 0) ? Math.PI * circle.radius * circle.radius : 0;
};

module.exports = Area;
