var Set = function ()
{
    this.values = [];
};

Set.prototype.constructor = Set;

Set.prototype = {

    add: function (value)
    {
        if (this.values.indexOf(value) === -1)
        {
            this.values.push(value);
        }
    },

    delete: function (value)
    {
        var index = this.values.indexOf(value);

        if (index > -1)
        {
            this.values.splice(index, 1);
        }
    },

    dump: function ()
    {
        console.group('Set');

        for (var i = 0; i < this.values.length; i++)
        {
            var entry = this.values[i];
            console.log(entry);
        }

        console.groupEnd();
    },

    get: function (property, value)
    {
        for (var i = 0; i < this.values.length; i++)
        {
            var entry = this.values[i];

            if (entry[property] === value)
            {
                return entry;
            }
        }
    },

    //  For when you know this Set will be modified during the iteration
    each: function (callback)
    {
        var temp = this.values.slice();

        for (var i = 0; i < temp.length; i++)
        {
            if (callback(temp[i]) === false)
            {
                break;
            }
        }
    },

    //  For when you absolutely know this Set won't be modified during the iteration
    iterate: function (callback)
    {
        for (var i = 0; i < this.values.length; i++)
        {
            if (callback(this.values[i]) === false)
            {
                break;
            }
        }
    },

    clear: function ()
    {
        this.values.length = 0;
    },

    contains: function (value)
    {
        return (this.values.indexOf(value) > -1);
    },

    union: function (set)
    {
        var newSet = new Set();

        set.values.forEach(function (value)
        {
            newSet.add(value);
        });

        this.values.forEach(function (value)
        {
            newSet.add(value);
        });

        return newSet;
    },

    intersect: function (set)
    {
        var newSet = new Set();

        this.values.forEach(function (value)
        {
            if (set.contains(value))
            {
                newSet.add(value);
            }
        });

        return newSet;
    },

    difference: function (set)
    {
        var newSet = new Set();

        this.values.forEach(function (value)
        {
            if (!set.contains(value))
            {
                newSet.add(value);
            }
        });

        return newSet;
    }

};

Object.defineProperties(Set.prototype, {

    size: {

        enumerable: true,

        get: function ()
        {
            return this.values.length;
        },

        set: function (value)
        {
            return this.values.length = value;
        }

    }

});

module.exports = Set;
