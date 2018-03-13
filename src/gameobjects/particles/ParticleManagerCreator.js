/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetFastValue = require('../../utils/object/GetFastValue');
var ParticleEmitterManager = require('./ParticleEmitterManager');

/**
 * Creates a new Particle Emitter Manager Game Object and returns it.
 *
 * Note: This method will only be available if the Particles Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#particles
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.Particles.ParticleEmitterManager} The Game Object that was created.
 */
GameObjectCreator.register('particles', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var emitters = GetFastValue(config, 'emitters', null);

    //  frame is optional and can contain the emitters array or object if skipped
    var manager = new ParticleEmitterManager(this.scene, key, frame, emitters);

    var add = GetFastValue(config, 'add', false);

    if (add)
    {
        this.displayList.add(manager);
    }

    this.updateList.add(manager);

    return manager;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
//  
//  There are several properties available to use:
//  
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns
