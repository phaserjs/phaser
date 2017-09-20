var Camera3D = require('./Camera3D');
var Class = require('../../utils/Class');
var Vector3 = require('../../math/Vector3');

//  Local cache vars
var tmpVec3 = new Vector3();

var PerspectiveCamera = new Class({

    Extends: Camera3D,

    //  FOV is converted to radians automatically
    initialize: function (scene, fieldOfView, viewportWidth, viewportHeight)
    {
        if (fieldOfView === undefined) { fieldOfView = 80; }
        if (viewportWidth === undefined) { viewportWidth = 0; }
        if (viewportHeight === undefined) { viewportHeight = 0; }

        Camera3D.call(this, scene);

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.fieldOfView = fieldOfView * Math.PI / 180;

        this.update();
    },

    setFOV: function (value)
    {
        this.fieldOfView = value * Math.PI / 180;

        return this;
    },

    update: function ()
    {
        var aspect = this.viewportWidth / this.viewportHeight;

        //  Create a perspective matrix for our camera
        this.projection.perspective(
            this.fieldOfView,
            aspect,
            Math.abs(this.near),
            Math.abs(this.far)
        );

        //  Build the view matrix 
        tmpVec3.copy(this.position).add(this.direction);

        this.view.lookAt(this.position, tmpVec3, this.up);

        //  Projection * view matrix
        this.combined.copy(this.projection).mul(this.view);

        //  Invert combined matrix, used for unproject
        this.invProjectionView.copy(this.combined).invert();

        this.billboardMatrixDirty = true;

        this.updateChildren();

        return this;
    }

});

module.exports = PerspectiveCamera;
