/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */


/**
 * Implements a model view projection matrices.
 * Pipelines can implement this for doing 2D and 3D rendering.
 */

var ModelViewProjection = {

    /**
     * Dirty flag for checking if model matrix needs to be updated on GPU.
     */
    modelMatrixDirty: false,

    /**
     * Dirty flag for checking if view matrix needs to be updated on GPU.
     */
    viewMatrixDirty: false,

    /**
     * Dirty flag for checking if projection matrix needs to be updated on GPU.
     */
    projectionMatrixDirty: false,

    /**
     * Model matrix
     */
    modelMatrix: null,

    /**
     * View matrix
     */
    viewMatrix: null,

    /**
     * Projection matrix
     */
    projectionMatrix: null,

    /**
     * Initializes MVP matrices with an identity matrix
     */
    mvpInit: function ()
    {
        this.modelMatrixDirty = true;
        this.viewMatrixDirty = true;
        this.projectionMatrixDirty = true;
        
        this.modelMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        
        this.viewMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        
        this.projectionMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        
        return this;
    },

    /**
     * If dirty flags are set then the matrices are uploaded to the GPU.
     */
    mvpUpdate: function ()
    {
        var program = this.program;

        if (this.modelMatrixDirty)
        {
            this.renderer.setMatrix4(program, 'uModelMatrix', false, this.modelMatrix);
            this.modelMatrixDirty = false;
        }
        
        if (this.viewMatrixDirty)
        {
            this.renderer.setMatrix4(program, 'uViewMatrix', false, this.viewMatrix);
            this.viewMatrixDirty = false;
        }

        if (this.projectionMatrixDirty)
        {
            this.renderer.setMatrix4(program, 'uProjectionMatrix', false, this.projectionMatrix);
            this.projectionMatrixDirty = false;
        }

        return this;
    },

    /**
     * Loads an identity matrix to the model matrix
     */
    modelIdentity: function ()
    {
        var modelMatrix = this.modelMatrix;
        
        modelMatrix[0] = 1;
        modelMatrix[1] = 0;
        modelMatrix[2] = 0;
        modelMatrix[3] = 0;
        modelMatrix[4] = 0;
        modelMatrix[5] = 1;
        modelMatrix[6] = 0;
        modelMatrix[7] = 0;
        modelMatrix[8] = 0;
        modelMatrix[9] = 0;
        modelMatrix[10] = 1;
        modelMatrix[11] = 0;
        modelMatrix[12] = 0;
        modelMatrix[13] = 0;
        modelMatrix[14] = 0;
        modelMatrix[15] = 1;

        this.modelMatrixDirty = true;
        
        return this;
    },

    /**
     * Scale model matrix
     */
    modelScale: function (x, y, z)
    {
        var modelMatrix = this.modelMatrix;

        modelMatrix[0] = modelMatrix[0] * x;
        modelMatrix[1] = modelMatrix[1] * x;
        modelMatrix[2] = modelMatrix[2] * x;
        modelMatrix[3] = modelMatrix[3] * x;
        modelMatrix[4] = modelMatrix[4] * y;
        modelMatrix[5] = modelMatrix[5] * y;
        modelMatrix[6] = modelMatrix[6] * y;
        modelMatrix[7] = modelMatrix[7] * y;
        modelMatrix[8] = modelMatrix[8] * z;
        modelMatrix[9] = modelMatrix[9] * z;
        modelMatrix[10] = modelMatrix[10] * z;
        modelMatrix[11] = modelMatrix[11] * z;
    
        this.modelMatrixDirty = true;

        return this;
    },

    /**
     * Translate model matrix
     */
    modelTranslate: function (x, y, z)
    {
        var modelMatrix = this.modelMatrix;

        modelMatrix[12] = modelMatrix[0] * x + modelMatrix[4] * y + modelMatrix[8] * z + modelMatrix[12];
        modelMatrix[13] = modelMatrix[1] * x + modelMatrix[5] * y + modelMatrix[9] * z + modelMatrix[13];
        modelMatrix[14] = modelMatrix[2] * x + modelMatrix[6] * y + modelMatrix[10] * z + modelMatrix[14];
        modelMatrix[15] = modelMatrix[3] * x + modelMatrix[7] * y + modelMatrix[11] * z + modelMatrix[15];

        this.modelMatrixDirty = true;

        return this;
    },


    /**
     * Rotates the model matrix in the X axis.
     */
    modelRotateX: function (radians)
    {
        var modelMatrix = this.modelMatrix;
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        var a10 = modelMatrix[4];
        var a11 = modelMatrix[5];
        var a12 = modelMatrix[6];
        var a13 = modelMatrix[7];
        var a20 = modelMatrix[8];
        var a21 = modelMatrix[9];
        var a22 = modelMatrix[10];
        var a23 = modelMatrix[11];

        modelMatrix[4] = a10 * c + a20 * s;
        modelMatrix[5] = a11 * c + a21 * s;
        modelMatrix[6] = a12 * c + a22 * s;
        modelMatrix[7] = a13 * c + a23 * s;
        modelMatrix[8] = a20 * c - a10 * s;
        modelMatrix[9] = a21 * c - a11 * s;
        modelMatrix[10] = a22 * c - a12 * s;
        modelMatrix[11] = a23 * c - a13 * s;

        this.modelMatrixDirty = true;

        return this;
    },

    /**
     * Rotates the model matrix in the Y axis.
     */
    modelRotateY: function (radians)
    {
        var modelMatrix = this.modelMatrix;
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        var a00 = modelMatrix[0];
        var a01 = modelMatrix[1];
        var a02 = modelMatrix[2];
        var a03 = modelMatrix[3];
        var a20 = modelMatrix[8];
        var a21 = modelMatrix[9];
        var a22 = modelMatrix[10];
        var a23 = modelMatrix[11];

        modelMatrix[0] = a00 * c - a20 * s;
        modelMatrix[1] = a01 * c - a21 * s;
        modelMatrix[2] = a02 * c - a22 * s;
        modelMatrix[3] = a03 * c - a23 * s;
        modelMatrix[8] = a00 * s + a20 * c;
        modelMatrix[9] = a01 * s + a21 * c;
        modelMatrix[10] = a02 * s + a22 * c;
        modelMatrix[11] = a03 * s + a23 * c;

        this.modelMatrixDirty = true;
        
        return this;
    },
    
    /**
     * Rotates the model matrix in the Z axis.
     */
    modelRotateZ: function (radians)
    {
        var modelMatrix = this.modelMatrix;
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        var a00 = modelMatrix[0];
        var a01 = modelMatrix[1];
        var a02 = modelMatrix[2];
        var a03 = modelMatrix[3];
        var a10 = modelMatrix[4];
        var a11 = modelMatrix[5];
        var a12 = modelMatrix[6];
        var a13 = modelMatrix[7];

        modelMatrix[0] = a00 * c + a10 * s;
        modelMatrix[1] = a01 * c + a11 * s;
        modelMatrix[2] = a02 * c + a12 * s;
        modelMatrix[3] = a03 * c + a13 * s;
        modelMatrix[4] = a10 * c - a00 * s;
        modelMatrix[5] = a11 * c - a01 * s;
        modelMatrix[6] = a12 * c - a02 * s;
        modelMatrix[7] = a13 * c - a03 * s;

        this.modelMatrixDirty = true;

        return this;
    },

    /**
     * Loads identity matrix into the view matrix
     */
    viewIdentity: function ()
    {
        var viewMatrix = this.viewMatrix;
        
        viewMatrix[0] = 1;
        viewMatrix[1] = 0;
        viewMatrix[2] = 0;
        viewMatrix[3] = 0;
        viewMatrix[4] = 0;
        viewMatrix[5] = 1;
        viewMatrix[6] = 0;
        viewMatrix[7] = 0;
        viewMatrix[8] = 0;
        viewMatrix[9] = 0;
        viewMatrix[10] = 1;
        viewMatrix[11] = 0;
        viewMatrix[12] = 0;
        viewMatrix[13] = 0;
        viewMatrix[14] = 0;
        viewMatrix[15] = 1;

        this.viewMatrixDirty = true;
        
        return this;
    },
    
    /**
     * Scales view matrix
     */
    viewScale: function (x, y, z)
    {
        var viewMatrix = this.viewMatrix;

        viewMatrix[0] = viewMatrix[0] * x;
        viewMatrix[1] = viewMatrix[1] * x;
        viewMatrix[2] = viewMatrix[2] * x;
        viewMatrix[3] = viewMatrix[3] * x;
        viewMatrix[4] = viewMatrix[4] * y;
        viewMatrix[5] = viewMatrix[5] * y;
        viewMatrix[6] = viewMatrix[6] * y;
        viewMatrix[7] = viewMatrix[7] * y;
        viewMatrix[8] = viewMatrix[8] * z;
        viewMatrix[9] = viewMatrix[9] * z;
        viewMatrix[10] = viewMatrix[10] * z;
        viewMatrix[11] = viewMatrix[11] * z;
    
        this.viewMatrixDirty = true;

        return this;
    },

    /**
     * Translates view matrix
     */
    viewTranslate: function (x, y, z)
    {
        var viewMatrix = this.viewMatrix;

        viewMatrix[12] = viewMatrix[0] * x + viewMatrix[4] * y + viewMatrix[8] * z + viewMatrix[12];
        viewMatrix[13] = viewMatrix[1] * x + viewMatrix[5] * y + viewMatrix[9] * z + viewMatrix[13];
        viewMatrix[14] = viewMatrix[2] * x + viewMatrix[6] * y + viewMatrix[10] * z + viewMatrix[14];
        viewMatrix[15] = viewMatrix[3] * x + viewMatrix[7] * y + viewMatrix[11] * z + viewMatrix[15];

        this.viewMatrixDirty = true;

        return this;
    },
    
    /**
     * Rotates view matrix in the X axis.
     */
    viewRotateX: function (radians)
    {
        var viewMatrix = this.viewMatrix;
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        var a10 = viewMatrix[4];
        var a11 = viewMatrix[5];
        var a12 = viewMatrix[6];
        var a13 = viewMatrix[7];
        var a20 = viewMatrix[8];
        var a21 = viewMatrix[9];
        var a22 = viewMatrix[10];
        var a23 = viewMatrix[11];

        viewMatrix[4] = a10 * c + a20 * s;
        viewMatrix[5] = a11 * c + a21 * s;
        viewMatrix[6] = a12 * c + a22 * s;
        viewMatrix[7] = a13 * c + a23 * s;
        viewMatrix[8] = a20 * c - a10 * s;
        viewMatrix[9] = a21 * c - a11 * s;
        viewMatrix[10] = a22 * c - a12 * s;
        viewMatrix[11] = a23 * c - a13 * s;

        this.viewMatrixDirty = true;

        return this;
    },
    
    /**
     * Rotates view matrix in the Y axis.
     */
    viewRotateY: function (radians)
    {
        var viewMatrix = this.viewMatrix;
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        var a00 = viewMatrix[0];
        var a01 = viewMatrix[1];
        var a02 = viewMatrix[2];
        var a03 = viewMatrix[3];
        var a20 = viewMatrix[8];
        var a21 = viewMatrix[9];
        var a22 = viewMatrix[10];
        var a23 = viewMatrix[11];

        viewMatrix[0] = a00 * c - a20 * s;
        viewMatrix[1] = a01 * c - a21 * s;
        viewMatrix[2] = a02 * c - a22 * s;
        viewMatrix[3] = a03 * c - a23 * s;
        viewMatrix[8] = a00 * s + a20 * c;
        viewMatrix[9] = a01 * s + a21 * c;
        viewMatrix[10] = a02 * s + a22 * c;
        viewMatrix[11] = a03 * s + a23 * c;

        this.viewMatrixDirty = true;
        
        return this;
    },
    
    /**
     * Rotates view matrix in the Z axis.
     */
    viewRotateZ: function (radians)
    {
        var viewMatrix = this.viewMatrix;
        var s = Math.sin(radians);
        var c = Math.cos(radians);
        var a00 = viewMatrix[0];
        var a01 = viewMatrix[1];
        var a02 = viewMatrix[2];
        var a03 = viewMatrix[3];
        var a10 = viewMatrix[4];
        var a11 = viewMatrix[5];
        var a12 = viewMatrix[6];
        var a13 = viewMatrix[7];

        viewMatrix[0] = a00 * c + a10 * s;
        viewMatrix[1] = a01 * c + a11 * s;
        viewMatrix[2] = a02 * c + a12 * s;
        viewMatrix[3] = a03 * c + a13 * s;
        viewMatrix[4] = a10 * c - a00 * s;
        viewMatrix[5] = a11 * c - a01 * s;
        viewMatrix[6] = a12 * c - a02 * s;
        viewMatrix[7] = a13 * c - a03 * s;

        this.viewMatrixDirty = true;

        return this;
    },

    /**
     * Loads a 2D view matrix (3x2 matrix) into a 4x4 view matrix 
     */
    viewLoad2D: function (matrix2D)
    {
        var vm = this.viewMatrix;

        vm[0] = matrix2D[0];
        vm[1] = matrix2D[1];
        vm[2] = 0.0;
        vm[3] = 0.0;
        vm[4] = matrix2D[2];
        vm[5] = matrix2D[3];
        vm[6] = 0.0;
        vm[7] = 0.0;
        vm[8] = matrix2D[4];
        vm[9] = matrix2D[5];
        vm[10] = 1.0;
        vm[11] = 0.0;
        vm[12] = 0.0;
        vm[13] = 0.0;
        vm[14] = 0.0;
        vm[15] = 1.0;

        this.viewMatrixDirty = true;

        return this;
    },


    /**
     * Copies a 4x4 matrix into the view matrix
     */
    viewLoad: function (matrix)
    {
        var vm = this.viewMatrix;

        vm[0] = matrix[0];
        vm[1] = matrix[1];
        vm[2] = matrix[2];
        vm[3] = matrix[3];
        vm[4] = matrix[4];
        vm[5] = matrix[5];
        vm[6] = matrix[6];
        vm[7] = matrix[7];
        vm[8] = matrix[8];
        vm[9] = matrix[9];
        vm[10] = matrix[10];
        vm[11] = matrix[11];
        vm[12] = matrix[12];
        vm[13] = matrix[13];
        vm[14] = matrix[14];
        vm[15] = matrix[15];

        this.viewMatrixDirty = true;

        return this;
    },
    
    /**
     * Loads identity matrix into the projection matrix.
     */
    projIdentity: function ()
    {
        var projectionMatrix = this.projectionMatrix;
        
        projectionMatrix[0] = 1;
        projectionMatrix[1] = 0;
        projectionMatrix[2] = 0;
        projectionMatrix[3] = 0;
        projectionMatrix[4] = 0;
        projectionMatrix[5] = 1;
        projectionMatrix[6] = 0;
        projectionMatrix[7] = 0;
        projectionMatrix[8] = 0;
        projectionMatrix[9] = 0;
        projectionMatrix[10] = 1;
        projectionMatrix[11] = 0;
        projectionMatrix[12] = 0;
        projectionMatrix[13] = 0;
        projectionMatrix[14] = 0;
        projectionMatrix[15] = 1;

        this.projectionMatrixDirty = true;

        return this;
    },

    /**
     * Sets up an orthographics projection matrix
     */
    projOrtho: function (left, right, bottom, top, near, far)
    {
        var projectionMatrix = this.projectionMatrix;
        var leftRight = 1.0 / (left - right);
        var bottomTop = 1.0 / (bottom - top);
        var nearFar = 1.0 / (near - far);

        projectionMatrix[0] = -2.0 * leftRight;
        projectionMatrix[1] = 0.0;
        projectionMatrix[2] = 0.0;
        projectionMatrix[3] = 0.0;
        projectionMatrix[4] = 0.0;
        projectionMatrix[5] = -2.0 * bottomTop;
        projectionMatrix[6] = 0.0;
        projectionMatrix[7] = 0.0;
        projectionMatrix[8] = 0.0;
        projectionMatrix[9] = 0.0;
        projectionMatrix[10] = 2.0 * nearFar;
        projectionMatrix[11] = 0.0;
        projectionMatrix[12] = (left + right) * leftRight;
        projectionMatrix[13] = (top + bottom) * bottomTop;
        projectionMatrix[14] = (far + near) * nearFar;
        projectionMatrix[15] = 1.0;

        this.projectionMatrixDirty = true;
        return this;
    },
    
    /**
     * Sets up a perspective projection matrix
     */
    projPersp: function (fovy, aspectRatio, near, far)
    {
        var projectionMatrix = this.projectionMatrix;
        var fov = 1.0 / Math.tan(fovy / 2.0);
        var nearFar = 1.0 / (near - far);
        
        projectionMatrix[0] = fov / aspectRatio;
        projectionMatrix[1] = 0.0;
        projectionMatrix[2] = 0.0;
        projectionMatrix[3] = 0.0;
        projectionMatrix[4] = 0.0;
        projectionMatrix[5] = fov;
        projectionMatrix[6] = 0.0;
        projectionMatrix[7] = 0.0;
        projectionMatrix[8] = 0.0;
        projectionMatrix[9] = 0.0;
        projectionMatrix[10] = (far + near) * nearFar;
        projectionMatrix[11] = -1.0;
        projectionMatrix[12] = 0.0;
        projectionMatrix[13] = 0.0;
        projectionMatrix[14] = (2.0 * far * near) * nearFar;
        projectionMatrix[15] = 0.0;
        
        this.projectionMatrixDirty = true;
        return this;
    }
};

module.exports = ModelViewProjection;
