var GetAspectRatio = require('./GetAspectRatio');

//  Fits the target rectangle around the source rectangle.
//  Preserves aspect ration.
//  Scales and centers the target rectangle to the source rectangle

var FitOutside = function (target, source)
{
    var ratio = GetAspectRatio(target);

    if (ratio > GetAspectRatio(source))
    {
        //  Wider than Tall
        target.setSize(source.height * ratio, source.height);
    }
    else
    {
        //  Taller than Wide
        target.setSize(source.width, source.width * ratio);
    }

    return target.setPosition(
        (source.right / 2) - target.width / 2,
        (source.bottom / 2) - target.height / 2
    );
};

module.exports = FitOutside;
