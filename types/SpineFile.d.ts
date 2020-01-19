declare namespace Phaser.Loader.FileTypes {
    interface SpineFileConfig {
        key: string
        textureURL?: string
        textureExtension?: string
        textureXhrSettings?: Phaser.Types.Loader.XHRSettingsObject
        normalMap?: string
        atlasURL?: string
        atlasExtension?: string
        atlasXhrSettings?: Phaser.Types.Loader.XHRSettingsObject
    }

    class SpineFile extends Phaser.Loader.MultiFile {
        constructor(loader: Phaser.Loader.LoaderPlugin, key: string | Phaser.Loader.FileTypes.SpineFileConfig, jsonURL: string | string[], atlasURL: string, preMultipliedAlpha: boolean, jsonXhrSettings: Phaser.Types.Loader.XHRSettingsObject, atlasXhrSettings: Phaser.Types.Loader.XHRSettingsObject)

        addToCache()
	}
}
