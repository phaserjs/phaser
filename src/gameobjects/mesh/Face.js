/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A Face Game Object.
 *
 * This class consists of 3 Vertex instances, for the 3 corners of the face.
 *
 * @class Face
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.Vertex} vertex1 - The first vertex in this Face.
 * @param {Phaser.GameObjects.Vertex} vertex2 - The second vertex in this Face.
 * @param {Phaser.GameObjects.Vertex} vertex3 - The third vertex in this Face.
 */
var Face = new Class({

    initialize:

    function Face (vertex1, vertex2, vertex3)
    {
        /**
         * The first vertex in this Face.
         *
         * @name Phaser.GameObjects.Face#vertex1
         * @type {Phaser.GameObjects.Vertex}
         * @since 3.50.0
         */
        this.vertex1 = vertex1;

        /**
         * The second vertex in this Face.
         *
         * @name Phaser.GameObjects.Face#vertex2
         * @type {Phaser.GameObjects.Vertex}
         * @since 3.50.0
         */
        this.vertex2 = vertex2;

        /**
         * The third vertex in this Face.
         *
         * @name Phaser.GameObjects.Face#vertex3
         * @type {Phaser.GameObjects.Vertex}
         * @since 3.50.0
         */
        this.vertex3 = vertex3;
    }

});

module.exports = Face;
