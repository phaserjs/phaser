var Class = require('../utils/Class');

var Vector3 = require('../math/Vector3');
var Vector4 = require('../math/Vector4');
var Matrix4 = require('../math/Matrix4');

var Camera = require('./Camera3D');

var tmpVec3 = new Vector3();

var PerspectiveCamera = new Class({

    Extends: Camera,

    //fov in RADIANS!
    initialize: function(fieldOfView, viewportWidth, viewportHeight) {
        Camera.call(this);
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        this.fieldOfView = fieldOfView;
        this.update();
    },

    update: function() {
        var aspect = this.viewportWidth / this.viewportHeight;

        //create a perspective matrix for our camera
        this.projection.perspective(this.fieldOfView, aspect,
            Math.abs(this.near), Math.abs(this.far));

        //build the view matrix 
        tmpVec3.copy(this.position).add(this.direction);
        this.view.lookAt(this.position, tmpVec3, this.up);

        //projection * view matrix
        this.combined.copy(this.projection).mul(this.view);

        //invert combined matrix, used for unproject
        this.invProjectionView.copy(this.combined).invert();
    }
});

module.exports = PerspectiveCamera;



/*
TODO: Billboarding should be moved to a separate module.

    updateBillboardMatrix: function() {
        if (!dirvec) {
            dirvec = new Vector3();
            rightvec = new Vector3();
            billboardMatrix = new Matrix4();
        }


        var dir = dirvec.set(this.direction).negate();

        // Better view-aligned billboards might use this:
        // var dir = tmp.set(camera.position).sub(p).normalize();
        
        var right = rightvec.set(this.up).cross(dir).normalize();
        var up = tmpVec3.set(dir).cross(right).normalize();

        var out = billboardMatrix.val;
        out[0] = right.x;
        out[1] = right.y;
        out[2] = right.z;
        out[3] = 0;
        out[4] = up.x;
        out[5] = up.y;
        out[6] = up.z;
        out[7] = 0;
        out[8] = dir.x;
        out[9] = dir.y;
        out[10] = dir.z;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        this.billboardMatrixDirty = false;
    },

    
     * This is a utility function for canvas 3D rendering, 
     * which determines the "point size" of a camera-facing
     * sprite billboard given its 3D world position 
     * (origin at center of sprite) and its world width
     * and height in x/y. 
     *
     * We place into the output Vector2 the scaled width
     * and height. If no `out` is specified, a new Vector2
     * will be created for convenience (this should be avoided 
     * in tight loops).
     * 
     * @param  {Vector3} vec the position of the 3D sprite
     * @param  {Vector2} size the x and y dimensions of the sprite
     * @param  {Vector2} out the result, scaled x and y dimensions in 3D space
     * @return {Vector2} returns the out parameter, or a new Vector2 if none was given    
     
    getPointSize: function(vec, size, out) {
        //TODO: optimize this with a simple distance calculation:
        //https://developer.valvesoftware.com/wiki/Field_of_View

        if (!out)
            out = new Vector2();

        if (this.billboardMatrixDirty)
            this.updateBillboardMatrix();

        var tmp = tmpVec3;

        var dx = size.x/2;
        var dy = size.y/2;

        tmp.set(-dx, -dy, 0).transformMat4(billboardMatrix).add(vec);
        this.project(tmp, tmp);

        var tlx = tmp.x;
        var tly = tmp.y;

        tmp.set(dx, dy, 0).transformMat4(billboardMatrix).add(vec);
        this.project(tmp, tmp);

        var brx = tmp.x;
        var bry = tmp.y;

        var w = Math.abs(brx - tlx);
        var h = Math.abs(bry - tly);
        return out.set(w, h);
    },

*/