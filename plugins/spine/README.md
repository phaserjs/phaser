# Updating Spine

1. Checkout the Esoteric Spine Runtimes repo to the `spine-runtimes` folder: https://github.com/EsotericSoftware/spine-runtimes/ and make sure this is in the `plugins/spine` folder, not the `plugins/spine/src` folder.
2. Run `npm i` inside the `spine-runtimes/spine-ts` folder.
3. Run `npm run plugin.spine.runtimes` to build the new runtimes to the `plugins/spine/src/runtimes` folder.

You can now build a new version of the Spine Plugin:

4. `npm run plugin.spine.dist`.