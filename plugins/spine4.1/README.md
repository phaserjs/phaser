# Updating Spine

1. Clone the Esoteric Spine Runtimes repo to the `spine-runtimes` folder: https://github.com/EsotericSoftware/spine-runtimes/ and make sure this is in the `plugins/spine4.1` folder, not the `plugins/spine4.1/src` folder.
2. Checkout `git checkout 4.1`
3. Run `npm i` inside the `spine-runtimes/spine-ts` folder.
4. Run `npm run plugin.spine4.runtimes` to build the new runtimes to the `plugins/spine4.1/src/runtimes` folder.

You can now build a new version of the Spine Plugin:

5. `npm run plugin.spine4.dist`.