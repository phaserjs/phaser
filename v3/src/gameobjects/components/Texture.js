//  Texture Component

//  bitmask flag for GameObject.renderMask
var _FLAG = 8; // 1000

var Texture = {

    texture: null,
    frame: null,

    setTexture: function (key, frame)
    {
        this.texture = this.scene.sys.textures.get(key);

        return this.setFrame(frame);
    },

    setFrame: function (frame)
    {
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
