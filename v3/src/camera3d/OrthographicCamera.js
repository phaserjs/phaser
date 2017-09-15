var Class = require('../utils/Class');

var Vector3 = require('./vecmath/Vector3');
var Vector4 = require('./vecmath/Vector4');
var Matrix4 = require('./vecmath/Matrix4');

var Camera = require('./Camera3D');

var tmpVec3 = new Vector3();

var OrthographicCamera = new Class({

    Extends: Camera,

    zoom: {

        set: function(v) {
            if (typeof v !== 'number')
                throw new Error("zoom must be a number");
            this._zoom = v;
        },

        get: function() {
            return this._zoom;
        }
    },

    initialize: function(viewportWidth, viewportHeight) {
        Camera.call(this);
        this.viewportWidth = viewportWidth||0;
        this.viewportHeight = viewportHeight||0;

        this._zoom = 1.0;
        this.near = 0;
        this.update();
    },

    setToOrtho: function(yDown, viewportWidth, viewportHeight) {
        var zoom = this.zoom;
        viewportWidth = typeof viewportWidth === "number" ? viewportWidth : this.viewportWidth;
        viewportHeight = typeof viewportHeight === "number" ? viewportHeight : this.viewportHeight;

        this.up.set(0, yDown ? -1 : 1, 0);
        this.direction.set(0, 0, yDown ? 1 : -1);
        this.position.set(zoom * viewportWidth / 2, zoom * viewportHeight / 2, 0);

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.update();
    },

    update: function() {
        //TODO: support x/y offset
        var w = this.viewportWidth,
            h = this.viewportHeight,
            near = Math.abs(this.near),
            far = Math.abs(this.far),
            zoom = this.zoom;

        if (w===0||h===0) {
            //What to do here... hmm ? 
            return;
        }

        this.projection.ortho(
            zoom * -w / 2, zoom * w / 2,
            zoom * -h / 2, zoom * h / 2,
            near, far);

        //build the view matrix 
        tmpVec3.copy(this.position).add(this.direction);
        this.view.lookAt(this.position, tmpVec3, this.up);

        //projection * view matrix
        this.combined.copy(this.projection).mul(this.view);

        //invert combined matrix, used for unproject
        this.invProjectionView.copy(this.combined).invert();
    }
});

module.exports = OrthographicCamera;