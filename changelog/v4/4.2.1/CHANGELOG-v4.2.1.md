# Phaser 4 Changelog

## Version 4.2.1 - Giedi - 23rd June 2026

## Fixes

- `Stencil` option `stencilInvert` works correctly (an alpha bug prevented it from having the intended effect)
- Framebuffers now correctly clear stencil on use
  - The global stencil settings defaulted to deactivating the stencil write mask, so it couldn't actually run the `clear` process correctly. Write mask is now enabled by default, but is never triggered because default stencil operations keep existing values.
