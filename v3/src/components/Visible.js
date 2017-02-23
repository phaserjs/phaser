
//  Visible Component

var _visible = true;

//  bitmask flag for GameObject.renderMask
var _FLAG = 1; // 0001

var Visible = {

    visible: {

        get: function ()
        {
            return _visible;
        },

        set: function (value)
        {
            if (value)
            {
                _visible = true;
                this.renderFlags |= _FLAG;
            }
            else
            {
                _visible = false;
                this.renderFlags &= ~_FLAG;
            }
        }

    }

};

module.exports = Visible;
