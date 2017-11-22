var Collision = {

    setCollisionCategory: function (value)
    {
        this.body.collisionFilter.category = value;

        return this;
    },

    setCollisionGroup: function (value)
    {
        this.body.collisionFilter.group = value;

        return this;
    },

    setCollidesWith: function (categories)
    {
        var flags = 0;

        if (!Array.isArray(categories))
        {
            flags = categories;
        }
        else
        {
            for (var i = 0; i < categories.length; i++)
            {
                flags |= categories[i];
            }
        }

        this.body.collisionFilter.mask = flags;

        return this;
    },

};

module.exports = Collision;
