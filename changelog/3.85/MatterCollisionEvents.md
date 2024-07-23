# Phaser 3.85.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.85.md).

# `MatterCollisionEvents` integration

Integrated `MatterCollisionEvents` plugin functionality directly into the `Matter.World` class to handle collision events (`collisionStart`, `collisionActive`, and `collisionEnd`) more effectively.

Three new events are available on `Matter.Body`:

1. `onCollide`
2. `onCollideEnd`
3. `onCollideActive`

These events correspond to the Matter events `collisionStart`, `collisionActive` and `collisionEnd`, respectively.

You can listen to these events via `Matter.Events` or they will also be emitted from the Matter World.

Also added to `Matter.Body` are three convenience functions:

- `Matter.Body.setOnCollide(callback)`
- `Matter.Body.setOnCollideEnd(callback)`
- `Matter.Body.setOnCollideActive(callback)`

To register an event callback, provide a function of type `(pair: Matter.Pair) => void`.
