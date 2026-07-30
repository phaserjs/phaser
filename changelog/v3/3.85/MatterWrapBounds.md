# Phaser 3.85.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.85.md).

# New Body.wrap method

The old `MatterWrap` plugin has been deprecated in favour of native integration into the new `Matter.Body.wrap` method.

This method ensures that a body's position is always maintained within specified bounds. If the body crosses a boundary, it will appear on the opposite side of the bounds, preserving its velocity. This enhancement eliminates the need for enabling the `wrap` method through the Matter physics `MatterConfig` option by adding `wrap: true` to the plugins property.

To utilize the new `wrap` functionality, you can now directly pass a `wrapBounds` object specifying the `x` and `y` boundaries when creating a new Matter object. This approach simplifies the process of applying boundary wrapping to Matter bodies.

# Steps to add wrap bounds to a Matter game object

- *Define Wrap Bounds*: First, define the boundaries within which you want the game object to wrap. Create a `wrapBounds` object that specifies `min` and `max` coordinates for `x` and `y`.
```js
    const wrapBounds = {
        min: {
            x: 0,
            y: 0
        },
        max: {
            x: 800,
            y: 600
        }
    };
```
- *Create a Matter Game Object*: Create a Matter game object that you want to apply the wrapping behavior to. Use the Matter physics system to add a game object, like an image, polygon, circle, rectangle, etc., to the world. For example:
```js
    const gameObject = this.matter.add.image(x, y, 'key', null, {
        wrapBounds: wrapBoundary 
    });
```
- This will enable the game object to wrap around a specified boundary.

# To remove the wrap bounds on a game object

- Set the `wrapBounds` property on the game object body to `null`. Example:
```js
    gameObject.body.wrapBounds = null;
```