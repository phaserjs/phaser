# Phaser 4 Changelog

## Version 4.2.1 - Giedi - 9th July 2026

## Fixes

- `Stencil` option `stencilInvert` works correctly (an alpha bug prevented it from having the intended effect)
- Framebuffers now correctly clear stencil on use
  - The global stencil settings defaulted to deactivating the stencil write mask, so it couldn't actually run the `clear` process correctly. Write mask is now enabled by default, but is never triggered because default stencil operations keep existing values.
- Remove inline access of Phaser namespace from `CombineColorMatrix`, `ImageLight`, and `Texture`. These would break in the ESM build. Thanks @scobo!
- Fix ScaleManager not resizing to parent container. Fix #7213 (thanks @VijayVPatil13)
- Docs: correct AnimationManager get() return type (thanks @samme)
- Tweens with a startDelay set weren't having their state updated from START_DELAY to ACTIVE. This left them stuck in their initial state, even once the startDelay had elapsed. Fix #7093 (thanks @Bambosh)
