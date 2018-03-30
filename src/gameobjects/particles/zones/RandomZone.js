/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Vector2 = require('../../../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class RandomZone
 * @memberOf Phaser.GameObjects.Particles.Zones
 * @constructor
 * @since 3.0.0
 *
 * @param {object} source - [description]
 */
var RandomZone = new Class({

    initialize:

    function RandomZone (source)
    {
        /**
         * [description]
         *
         * @name Phaser.GameObjects.Particles.Zones.RandomZone#source
         * @type {object}
         * @since 3.0.0
         */
        this.source = source;

        /**
         * Internal calculation vector.
         *
         * @name Phaser.GameObjects.Particles.Zones.RandomZone#_tempVec
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tempVec = new Vector2();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Particles.Zones.RandomZone#getPoint
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Particles.Particle} particle - [description]
     */
    getPoint: function (particle)
    {
        var vec = this._tempVec;

        this.source.getRandomPoint(vec);

        particle.x = vec.x;
        particle.y = vec.y;
    }

});

module.exports = RandomZone;
