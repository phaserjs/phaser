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
        }

        return this;
    }

};

module.exports = Texture;
