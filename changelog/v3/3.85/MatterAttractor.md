# Phaser 3.85.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.85.md).

# New `attractors` property added to Body class

The `attractors` property has been introduced to the `Body` class. This property is an array of callback functions that are executed for every pair of bodies during each engine update. These callbacks allow for the simulation of gravitational attraction or any other force-based interaction between bodies.

The `Engine.attractors` method has been added to the Matter Engine. This method is responsible for applying the forces defined by the `attractors` property of each body. It iterates over all bodies, identifies pairs, and applies the specified forces, facilitating complex interactions within the physics simulation.

# Changes compared to the Matter Attractors plugin

The `attractors` functionality is now natively integrated into the Matter.js library, eliminating the need to enable it through the Matter physics `MatterConfig` option by adding `attractors: true` to the plugins property. Instead, attractors can be directly specified by passing an array of functions to the `attractors` property option when creating a new Matter game object. This change simplifies the process of adding custom force-based interactions between bodies and enhances the flexibility of the physics engine.

# Steps to add attractors to a Matter game object

- *Create or Identify the Game Object*: First, create a Matter game object to add an attractor. This could be a sprite or an image.

- *Define the Attractor Function*: An attractor is essentially a function that defines how the object attracts or repels other objects in the physics world. This function takes two arguments: `bodyA` and `bodyB`. `bodyA` is typically the body that contains the attractor, and `bodyB` is another body in the world that is being affected by the attractor.

- The function should return an object with `x` and `y` properties. These properties determine the force of attraction or repulsion along the X and Y axes, respectively.

- *Add the Attractor to the Game Object*: When creating or modifying the game object, add the attractor function to the `attractors` property of the object. The `attractors` property is an `array` containing a function. Example:
```js
    this.matter.add.image(x, y, 'key', null, {
        attractors: [
            (bodyA, bodyB) => ({
                x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                y: (bodyA.position.y - bodyB.position.y) * 0.000001
            })
        ]
    });
```

- *Adjust the Attractor Function as Needed*: The strength and direction of the force applied by the attractor are controlled by the values returned in the `x` and `y` properties of the object returned by the attractor function.

# To remove the attractors from a game object

- Set the `attractors` property on the game object body to `[]` or `null`. Example:

```js
gameObject.body.attractors = [];
```