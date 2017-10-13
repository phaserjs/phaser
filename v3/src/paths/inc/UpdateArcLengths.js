// cacheLengths must be recalculated.
var UpdateArcLengths = function ()
{
    this.cacheLengths = [];

    this.getCurveLengths();
};

module.exports = UpdateArcLengths;
