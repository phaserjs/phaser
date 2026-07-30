# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Mesh, Vertex and Face New Features

* `Mesh.setTint` is a new method that will set the tint color across all vertices of a Mesh (thanks @rexrainbow)
* `Mesh.tint` is a new setter that will  set the tint color across all vertices of a Mesh (thanks @rexrainbow)
* `Mesh.clearTint` is a new method that will clear the tint from all vertices of a Mesh (thanks @rexrainbow)

## Mesh, Vertex and Face Updates

* The `GenerateVerts` function has a new optional parameter `flipUV` which, if set, will flip the UV texture coordinates (thanks cedarcantab)
* The `GenerateVerts` function no longer errors if the verts and uvs arrays are not the same size and `containsZ` is true (thanks cedarcantab)
* `Face.update` is a new method that updates each of the Face vertices. This is now called internally by `Face.isInView`.
* `Vertex.resize` is a new method that will set the position and then translate the Vertex based on an identity matrix.
* The `Vertex.update` method now returns `this` to allow it to be chained.
* `Mesh.addVertices` will now throw a console warning if invalid vertices data is given to the method (thanks @omniowl)
* `Mesh.addVerticesFromObj` will now throw a console warning if invalid vertices data is given to the method (thanks @omniowl)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
