# Phaser 3.85.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.85.md).

# matter.js version `0.20.0`

# Highlights

* Added support for high refresh rate displays with fixed timestep in `Matter.Runner`
* Added support for sub-stepping for higher quality simulations in `Matter.Runner`
* Changed to a fixed timestep by default in `Matter.Runner`
* Improved frame pacing and average performance up to ~6% (see [#1238](https://github.com/liabru/matter-js/pull/1238))
* Reduced average memory usage up to ~30% (see [#1238](https://github.com/liabru/matter-js/pull/1238))
* Reduced memory garbage collection
* Bug fixes and improvements see [changelog](https://github.com/liabru/matter-js/blob/0.20.0/CHANGELOG.md)

# Changes

See the release [compare page](https://github.com/liabru/matter-js/compare/0.19.0...0.20.0) and the [changelog](https://github.com/liabru/matter-js/blob/0.20.0/CHANGELOG.md) for a detailed list of changes.

# Migration

`Matter.Runner` related changes [#1254](https://github.com/liabru/matter-js/pull/1254):

* `Matter.Runner` now defaults to a fixed deterministic timestep and support for non-fixed timestep is removed
* Optionally set your performance budgets `runner.maxFrameTime` (see docs)
* Note that `Matter.Runner` can now call zero, one, or multiple engine updates and events per display frame (see docs)
* If needed set up your polyfill for `window.requestAnimationFrame`
* See `Matter.Runner` updated docs throughout

Performance related changes [#1238](https://github.com/liabru/matter-js/pull/1238):

* `Matter.Collision` use `collision.supportCount` instead of `collision.supports.length` for active support count
* `Matter.Pair` use `pair.contacts` instead of `pair.activeContacts`
* `Matter.Pair` use `pair.contactCount` instead of `pair.contacts.length` for active contact count
* `Pair.id` format has changed

# Comparison

For more information see [comparison method](https://github.com/liabru/matter-js/pull/794).

```ocaml
Output sample comparison estimates of 44 examples against previous release matter-js@0.19.0:  

Similarity     99.80%    Overlap    -1.92%   Filesize   +3.38%  81.58 KB  

airFriction · · avalanche ● · ballPool ● · bridge ● · car ● · catapult ● · 
chains ● · circleStack · · cloth ● · collisionFiltering ● · compositeManipulation ● · 
compound · · compoundStack ● · concave ● · constraints ● · doublePendulum · · 
events ● · friction · · gravity ● · gyro ● · manipulation ● ◆ 
mixed ● · newtonsCradle · · pyramid ● · ragdoll ● · raycasting ● · 
remove ● ◆ restitution · · rounded ● · sensors · · sleeping ● ◆ 
slingshot ● · softBody ● · sprites ● · stack · · staticFriction ● · 
stats ● · stress ● · stress2 ● · stress3 ● · stress4 ● · 
timescale ● · views ● · wreckingBall ● ·   

where for the sample  · no change detected  ● extrinsics changed  ◆ intrinsics changed
```

# Contributors ♥︎

Many thanks to the [contributors](https://github.com/liabru/matter-js/compare/0.19.0...0.20.0) of this release, [past contributors](https://github.com/liabru/matter-js/graphs/contributors) as well those involved in the [community](https://github.com/liabru/matter-js/issues) for your input and support.