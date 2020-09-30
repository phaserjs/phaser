/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Euler = require('../math/Euler');
var Matrix4 = require('../math/Matrix4');
var Quaternion = require('../math/Quaternion');
var Vector3 = require('../math/Vector3');

var id = 0;
var tempMatrix = new Matrix4();

var GameObject3D = new Class({

    initialize:

    function GameObject3D ()
    {
        this.id = id++;
        this.name = '';
        this.type = '';

        this.position = new Vector3();
        this.scale = new Vector3(1, 1, 1);

        this.euler = new Euler();
        this.quaternion = new Quaternion();

        this.matrix = new Matrix4();
        this.worldMatrix = new Matrix4();

        this.children = [];
        this.parent = null;

        this.castShadow = false;
        this.receiveShadow = false;
        this.shadowType = 0;

        this.frustumCulled = true;
        this.visible = true;

        this.renderOrder = 0;

        this.matrixAutoupdate = true;
        this.matrixNeedsUpdate = true;
        this.worldMatrixNeedsUpdate = true;

        var euler = this.euler;
        var quat = this.quaternion;

        euler.onChangeCallback = function ()
        {
            quat.setFromEuler(euler, false);
        };

        quat.onChangeCallback = function ()
        {
            euler.setFromQuaternion(quat);
        };
    },

    //  Swap for already created functions
    add: function (child)
    {
        if (child !== this)
        {
            if (child.parent !== null)
            {
                child.parent.remove(child);
            }

            child.parent = this;

            this.children.push(child);

            child.worldMatrixNeedsUpdate = true;
        }

        return this;
    },

    //  Swap for already created functions
    remove: function (child)
    {
        var index = this.children.indexOf(child);

        if (index > -1)
        {
            child.parent = null;

            this.children.splice(index, 1);

            child.worldMatrixNeedsUpdate = true;
        }

        return this;
    },

    updateMatrix: function (force)
    {
        if (this.matrixAutoupdate || this.matrixNeedsUpdate)
        {
            this.matrix.transform(this.position, this.scale, this.quaternion);

            this.matrixNeedsUpdate = false;
            this.worldMatrixNeedsUpdate = true;
        }

        if (this.worldMatrixNeedsUpdate || force)
        {
            this.worldMatrix.copy(this.matrix);

            if (this.parent)
            {
                var parentMatrix = this.parent.worldMatrix;

                this.worldMatrix.premultiply(parentMatrix);
            }

            this.worldMatrixNeedsUpdate = false;
            force = true;
        }

        var children = this.children;

        for (var i = 0; i < children.length; i++)
        {
            children[i].updateMatrix(force);
        }
    },

    getWorldDirection: function (target)
    {
        if (target === undefined) { target = new Vector3(); }

        var world = this.worldMatrix.val;

        return target.set(world[8], world[9], world[10]).normalize();
    },

    lookAt: function (target, up)
    {
        tempMatrix.lookAtRH(target, this.position, up);

        this.quaternion.setFromRotationMatrix(tempMatrix);
    },

    destroy: function ()
    {

    }

});

module.exports = GameObject3D;
