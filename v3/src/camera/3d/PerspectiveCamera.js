var Camera3D = require('./Camera3D');
var Class = require('../../utils/Class');
var Matrix4 = require('../../math/Matrix4');
var Vector2 = require('../../math/Vector2');
var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');

//  Local cache vars
var tmpVec3 = new Vector3();

var PerspectiveCamera = new Class({

    Extends: Camera3D,

    //  FOV is converted to radians automatically
    initialize: function (fieldOfView, viewportWidth, viewportHeight)
    {
        if (fieldOfView === undefined) { fieldOfView = 80; }
        if (viewportWidth === undefined) { viewportWidth = 0; }
        if (viewportHeight === undefined) { viewportHeight = 0; }

        Camera3D.call(this);

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.fieldOfView = fieldOfView * Math.PI / 180;

        this.update();
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

        return this;
    }

});

module.exports = PerspectiveCamera;
