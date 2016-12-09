// The keys of a Map can be arbitrary values.

/*
var map = new Map([
    [ 1, 'one' ],
    [ 2, 'two' ],
    [ 3, 'three' ]
]);
*/

var Map = function (elements)
{
    this.entries = {};

    if (Array.isArray(elements))
    {
        for (var i = 0; i < elements.length; i++)
        {
            this.add(elements[i][0], elements[i][1]);
        }
    }
};

Map.prototype.constructor = Map;

Map.prototype = {

    set: function (key, value)
    {
        if (!this.entries.hasOwnProperty(key))
        {
            this.entries[key] = value;
        }
        return this;
    },

    delete: function (value)
    {
        var index = this.entries.indexOf(value);

        if (index > -1)
        {
            this.entries.splice(index, 1);
        }
    },

    keys: function ()
    {

    },

    values: function ()
    {

    },

    dump: function ()
    {
        console.group('Map');

        for (var i = 0; i < this.entries.length; i++)
        {
            var entry = this.entries[i];
            console.log(entry);
        }

        console.groupEnd();
    },

    get: function (property, value)
    {
        for (var i = 0; i < this.entries.length; i++)
        {
            var entry = this.entries[i];

            if (entry[property] === value)
            {
                return entry;
            }
        }
    },

    //  For when you know this Map will be modified during the iteration
    each: function (callback)
    {
        var temp = this.entries.slice();

        for (var i = 0; i < temp.length; i++)
        {
            if (callback(temp[i]) === false)
            {
                break;
            }
        }
    },

    //  For when you absolutely know this Map won't be modified during the iteration
    iterate: function (callback)
    {
        for (var i = 0; i < this.entries.length; i++)
        {
            if (callback(this.entries[i]) === false)
            {
                break;
            }
        }
    },

    clear: function ()
    {
        this.entries.length = 0;
    },

    contains: function (value)
    {
        return (this.entries.indexOf(value) > -1);
    },

    union: function (set)
    {
        var newMap = new Map();

        set.values.forEach(function (value)
        {
            newMap.add(value);
        });

        this.entries.forEach(function (value)
        {
            newMap.add(value);
        });

        return newMap;
    },

    intersect: function (set)
    {
        var newMap = new Map();

        this.entries.forEach(function (value)
        {
            if (set.contains(value))
            {
                newMap.add(value);
            }
        });

        return newMap;
    },

    difference: function (set)
    {
        var newMap = new Map();

        this.entries.forEach(function (value)
        {
            if (!set.contains(value))
            {
                newMap.add(value);
            }
        });

        return newMap;
    }

};

Object.defineProperties(Map.prototype, {

    size: {

        enumerable: true,

        get: function ()
        {
            return this.entries.length;
        },

        set: function (value)
        {
            return this.entries.length = value;
        }

    }

});

module.exports = Map;
