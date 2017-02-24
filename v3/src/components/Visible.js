
//  Visible Component

//  bitmask flag for GameObject.renderMask
var _FLAG = 1; // 0001

var Visible = {

    _visible: true,

    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            if (value)
            {
                this._visible = true;
                this.renderFlags |= _FLAG;
            }
            else
            {
                this._visible = false;
                this.renderFlags &= ~_FLAG;
            }
        }

    }

};

module.exports = Visible;
