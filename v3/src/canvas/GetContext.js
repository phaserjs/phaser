var GetContext = function (canvas, options)
{
    return (
        canvas.getContext('2d', options) || 
        null
    );
};

module.exports = GetContext;
