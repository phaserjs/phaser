var GetValueOp = function (key, value)
{
    var valueCallback;
    var t = typeof(value);

    if (t === 'number')
    {
        // props: {
        //     x: 400,
        //     y: 300
        // }

        valueCallback = function ()
        {
            return value;
        };
    }
    else if (t === 'string')
    {
        // props: {
        //     x: '+=400',
        //     y: '-=300',
        //     z: '*=2',
        //     w: '/=2'
        // }

        var op = value[0];
        var num = parseFloat(value.substr(2));

        switch (op)
        {
            case '+':
                valueCallback = function (i)
                {
                    return i + num;
                };
                break;

            case '-':
                valueCallback = function (i)
                {
                    return i - num;
                };
                break;

            case '*':
                valueCallback = function (i)
                {
                    return i * num;
                };
                break;

            case '/':
                valueCallback = function (i)
                {
                    return i / num;
                };
                break;

            default:
                valueCallback = function ()
                {
                    return parseFloat(value);
                };
        }
    }
    else if (t === 'function')
    {
        // props: {
        //     x: function (startValue, target, index, totalTargets) { return startValue + (index * 50); },
        // }

        valueCallback = function (startValue, target, index, total)
        {
            return value(startValue, target, index, total);
        };
    }
    else if (value.hasOwnProperty('value'))
    {
        //  Value may still be a string, function or a number
        // props: {
        //     x: { value: 400, ... },
        //     y: { value: 300, ... }
        // }

        valueCallback = GetValueOp(key, value.value);
    }

    return valueCallback;
};

module.exports = GetValueOp;
