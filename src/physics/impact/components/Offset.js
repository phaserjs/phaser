/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Offset
 * @since 3.0.0
 */
var Offset = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Offset#setOffset
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} width - [description]
     * @param {[type]} height - [description]
     *
     * @return {[type]} [description]
     */
    setOffset: function (x, y, width, height)
    {
        this.body.offset.x = x;
        this.body.offset.y = y;

        if (width)
        {
            this.setBodySize(width, height);
        }

        return this;
    }

};

module.exports = Offset;
