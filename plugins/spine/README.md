# Updating Spine

1. Checkout the Esoteric Spine Runtimes repo to the `spine-runtimes` folder: https://github.com/EsotericSoftware/spine-runtimes/
2. Run `npm i` inside the `spine-runtimes` folder.
3. Add the `source-map` module: `npm i --save-dev source-map`.
4. Run `npm run plugins.spine.runtimes` to build the new runtimes to the `plugins/spine/src/runtimes` folder.

You can now build a new version of the Spine Plugin:

5. `npm run plugin.spine.dist`.

