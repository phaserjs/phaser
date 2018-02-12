/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Camera = require('./Camera');
var Class = require('../../utils/Class');
var Vector3 = require('../../math/Vector3');

//  Local cache vars
var tmpVec3 = new Vector3();

/**
 * @classdesc
 * [description]
 *
 * @class OrthographicCamera
 * @extends Phaser.Cameras.Sprite3D.Camera
 * @memberOf Phaser.Cameras.Sprite3D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {integer} viewportWidth - [description]
 * @param {integer} viewportHeight - [description]
 */
var OrthographicCamera = new Class({

    Extends: Camera,

    initialize:

    function OrthographicCamera (scene, viewportWidth, viewportHeight)
    {
        if (viewportWidth === undefined) { viewportWidth = 0; }
        if (viewportHeight === undefined) { viewportHeight = 0; }

        Camera.call(this, scene);

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#viewportWidth
         * @type {integer}
         * @since 3.0.0
         */
        this.viewportWidth = viewportWidth;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#viewportHeight
         * @type {integer}
         * @since 3.0.0
         */
        this.viewportHeight = viewportHeight;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#_zoom
         * @type {float}
         * @private
         * @since 3.0.0
         */
        this._zoom = 1.0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D.OrthographicCamera#near
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.near = 0;

        this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.OrthographicCamera#setToOrtho
     * @since 3.0.0
     *
     * @param {[type]} yDown - [description]
     * @param {[type]} viewportWidth - [description]
     * @param {[type]} viewportHeight - [description]
     *
     * @return {[type]} [description]
     */
    setToOrtho: function (yDown, viewportWidth, viewportHeight)
    {
        if (viewportWidth === undefined) { viewportWidth = this.viewportWidth; }
        if (viewportHeight === undefined) { viewportHeight = this.viewportHeight; }

        var zoom = this.zoom;

        this.up.set(0, (yDown) ? -1 : 1, 0);
        this.direction.set(0, 0, (yDown) ? 1 : -1);
        this.position.set(zoom * viewportWidth / 2, zoom * viewportHeight / 2, 0);

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.OrthographicCamera#update
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    update: function ()
    {
        var w = this.viewportWidth;
        var h = this.viewportHeight;
        var near = Math.abs(this.near);
        var far = Math.abs(this.far);
        var zoom = this.zoom;

        if (w === 0 || h === 0)
        {
            //  What to do here... hmm?
            return this;
        }

        this.projection.ortho(
            zoom * -w / 2, zoom * w / 2,
            zoom * -h / 2, zoom * h / 2,
            near,
            far
        );

        //  Build the view matrix 
        tmpVec3.copy(this.position).add(this.direction);

        this.view.lookAt(this.position, tmpVec3, this.up);

        //  Projection * view matrix
        this.combined.copy(this.projection).multiply(this.view);

        //  Invert combined matrix, used for unproject
        this.invProjectionView.copy(this.combined).invert();

        this.billboardMatrixDirty = true;

        this.updateChildren();

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.OrthographicCamera#zoom
     * @type {number}
     * @since 3.0.0
     */
    zoom: {

        get: function ()
        {
            return this._zoom;
        },

        set: function (value)
        {
            this._zoom = value;
            this.update();
        }
    }

});

module.exports = OrthographicCamera;
