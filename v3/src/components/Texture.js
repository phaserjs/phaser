//  Texture Component

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

var Texture = {

    texture: null,
    frame: null,

    setTexture: function (key, frame)
    {
        this.texture = this.state.sys.textures.get(key);

        this.frame = this.texture.get(frame);

        if (!this.frame.cutWidth || !this.frame.cutHeight)
        {
            this.renderFlags &= ~_FLAG;
        }
        else
        {
            this.renderFlags |= _FLAG;

            // if (this.hasOwnProperty('originX'))
            // {
            //     //  Default origin to the center
            //     var w = Math.floor(this.frame.realWidth / 2);
            //     var h = Math.floor(this.frame.realHeight / 2);

            //     this.setOrigin(w, h);
            // }
        }

        return this;
    }

};

module.exports = Texture;
