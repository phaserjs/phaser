# Updating Spine

1. Clone the Esoteric Spine Runtimes repo to the `spine-runtimes` folder: https://github.com/EsotericSoftware/spine-runtimes/ and make sure this is in the `plugins/spine4.2` folder, not the `plugins/spine4.2/src` folder.
2. `cd spine-runtimes` and then run `git checkout 4.2`
~~3. Run `npm i` inside the `spine-runtimes/spine-ts` folder.~~
~~3-1. `spine-runtimes/spine-ts/tsconfig.base.json` 先設置 "target": "es2018" (當前 `ESNext` 後續 webpack build 將發生錯誤)~~
4. From the root directory, run `npm run plugin.spine4.2.runtimes` to build the new runtimes to the `plugins/spine4.2/src/runtimes` folder.

You can now build a new version of the Spine Plugin:

5. `npm run plugin.spine4.2.dist`.
