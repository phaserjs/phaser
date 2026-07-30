# Particle System -- Reference

## Source File Map

| File | Purpose |
|---|---|
| `src/gameobjects/particles/ParticleEmitter.js` | Main emitter class -- config parsing, all methods |
| `src/gameobjects/particles/ParticleEmitterFactory.js` | `this.add.particles()` factory |
| `src/gameobjects/particles/Particle.js` | Individual particle: fire, update, death logic |
| `src/gameobjects/particles/GravityWell.js` | Gravity well processor |
| `src/gameobjects/particles/ParticleProcessor.js` | Base class for processors |
| `src/gameobjects/particles/ParticleBounds.js` | Rectangular bounds processor |
| `src/gameobjects/particles/EmitterOp.js` | EmitterOp value formats (start/end, random, stepped) |
| `src/gameobjects/particles/EmitterColorOp.js` | Color interpolation op |
| `src/gameobjects/particles/zones/` | RandomZone, EdgeZone, DeathZone |
| `src/gameobjects/particles/events/` | COMPLETE, DEATH_ZONE, EXPLODE, START, STOP |
| `src/gameobjects/particles/typedefs/ParticleEmitterConfig.js` | Full config typedef |
