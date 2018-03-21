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

    this.size = 0;

    if (Array.isArray(elements))
    {
        for (var i = 0; i < elements.length; i++)
        {
            this.set(elements[i][0], elements[i][1]);
        }
    }
};

Map.prototype.constructor = Map;

Map.prototype = {

    set: function (key, value)
    {
        if (!this.has(key))
        {
            this.entries[key] = value;
            this.size++;
        }

        return this;
    },

    get: function (key)
    {
        if (this.has(key))
        {
            return this.entries[key];
        }
    },

    has: function (key)
    {
        return (this.entries.hasOwnProperty(key));
    },

    delete: function (key)
    {
        if (this.has(key))
        {
            delete this.entries[key];
            this.size--;
        }

        return this;
    },

    clear: function ()
    {
        Object.keys(this.entries).forEach(function (prop)
        {
            delete this.entries[prop];
        });

        this.size = 0;

        return this;
    },

    keys: function ()
    {
        return Object.keys(this.entries);
    },

    values: function ()
    {
        var output = [];
        var entries = this.entries;

        for (var key in entries)
        {
            output.push(entries[key]);
        }

        return output;
    },

    dump: function ()
    {
        var entries = this.entries;

        console.group('Map');

        for (var key in entries)
        {
            console.log(key, entries[key]);
        }

        console.groupEnd();
    },


    each: function (callback)
    {
        var entries = this.entries;

        for (var key in entries)
        {
            if (callback(key, entries[key]) === false)
            {
                break;
            }
        }

        return this;
    },

    contains: function (value)
    {
        var entries = this.entries;

        for (var key in entries)
        {
            if (entries[key] === value)
            {
                return true;
            }
        }

        return false;
    },

    //  Merges all new keys from the given Map into this one
    //  If it encounters a key that already exists it will be skipped
    //  unless override = true
    merge: function (map, override)
    {
        if (override === undefined) { override = false; }

        var local = this.entries;
        var source = map.entries;

        for (var key in source)
        {
            if (local.hasOwnProperty(key) && override)
            {
                local[key] = source[key];
            }
            else
            {
                this.set(key, source[key]);
            }
        }

        return this;
    }
};

module.exports = Map;
