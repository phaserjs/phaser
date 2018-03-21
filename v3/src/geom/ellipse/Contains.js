var Contains = function (ellipse, x, y)
{
    if (ellipse.width <= 0 || ellipse.height <= 0)
    {
        return false;
    }
 
    //  Normalize the coords to an ellipse with center 0,0 and a radius of 0.5
    var normx = ((x - ellipse.x) / ellipse.width) - 0.5;
    var normy = ((y - ellipse.y) / ellipse.height) - 0.5;
 
    normx *= normx;
    normy *= normy;
 
    return (normx + normy < 0.25);
};

module.exports = Contains;
