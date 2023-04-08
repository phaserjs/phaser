# Phaser 3 Change Log

## Version 3.24.1 - Rem - 14th July 2020

* Reverted the PR that added the parent transform to a Static Tilemap Layer as it broke tilemap rendering when the camera was zoomed (thanks @kainage)
* Fixed an error with the use of the Vector2Like type in the `Math.RotateTo` function that caused a TypeScript error on compilation
