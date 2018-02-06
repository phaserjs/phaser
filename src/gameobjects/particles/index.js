/**
 * @namespace Phaser.GameObjects.Particles
 */

module.exports = {

    GravityWell: require('./GravityWell'),
    Particle: require('./Particle'),
    ParticleEmitter: require('./ParticleEmitter'),
    ParticleEmitterManager: require('./ParticleEmitterManager'),

    Zones: {
        DeathZone: require('./zones/DeathZone'),
        EdgeZone: require('./zones/EdgeZone'),
        RandomZone: require('./zones/RandomZone')
    }

};
