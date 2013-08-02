        static renderPhysicsBody(body: Phaser.Physics.Body, lineWidth: number = 1, fillStyle: string = 'rgba(0,255,0,0.2)', sleepStyle: string = 'rgba(100,100,100,0.2)') {

            for (var s = 0; s < body.shapesLength; s++)
            {
                DebugUtils.context.beginPath();

                if (body.shapes[s].type == Phaser.Physics.AdvancedPhysics.SHAPE_TYPE_POLY)
                {
                    var verts = body.shapes[s].tverts;

                    //		            DebugUtils.context.moveTo(body.position.x * 50 + verts[0].x, body.position.y * 50 + verts[0].y);
                    DebugUtils.context.moveTo(verts[0].x * 50, verts[0].y * 50);

                    for (var i = 1; i < verts.length; i++)
                    {
                        //			            DebugUtils.context.lineTo(body.position.x * 50 + verts[i].x, body.position.y * 50 + verts[i].y);
                        DebugUtils.context.lineTo(verts[i].x * 50, verts[i].y * 50);
                    }

                    //		            DebugUtils.context.lineTo(body.position.x * 50 + verts[0].x, body.position.y * 50 + verts[0].y);
                    DebugUtils.context.lineTo(verts[0].x * 50, verts[0].y * 50);
                }
                else if (body.shapes[s].type == Phaser.Physics.AdvancedPhysics.SHAPE_TYPE_CIRCLE)
                    {
                    var circle = <Phaser.Physics.Shapes.Circle> body.shapes[s];
                    DebugUtils.context.arc(circle.tc.x * 50, circle.tc.y * 50, circle.radius * 50, 0, Math.PI * 2, false);
                }

                DebugUtils.context.closePath();

                if (body.isAwake)
                {
                    DebugUtils.context.fillStyle = fillStyle;
                }
                else
                {
                    DebugUtils.context.fillStyle = sleepStyle;
                }

                DebugUtils.context.fill();

            }

	}

        /**
         * Render debug infos. (including name, bounds info, position and some other properties)
         * @param x {number} X position of the debug info to be rendered.
         * @param y {number} Y position of the debug info to be rendered.
         * @param [color] {number} color of the debug info to be rendered. (format is css color string)
         */
        /*
        static renderPhysicsBodyInfo(body: Phaser.Physics.Body, x: number, y: number, color?: string = 'rgb(255,255,255)') {

            DebugUtils.context.fillStyle = color;
            DebugUtils.context.fillText('Body ID: ' + body.name, x, y);
            DebugUtils.context.fillText('Position x: ' + body.position.x.toFixed(1) + ' y: ' + body.position.y.toFixed(1) + ' rotation: ' + body.angle.toFixed(1), x, y + 14);
            DebugUtils.context.fillText('World x: ' + (body.position.x * 50).toFixed(1) + ' y: ' + (body.position.y * 50).toFixed(1), x, y + 28);
            DebugUtils.context.fillText('Velocity x: ' + body.velocity.x.toFixed(1) + ' y: ' + body.velocity.y.toFixed(1), x, y + 42);

            if (body.shapes[0].verts.length > 0)
            {
                DebugUtils.context.fillText('Vert 1 x: ' + (body.shapes[0].verts[0].x * 50) + ' y: ' + (body.shapes[0].verts[0].y * 50), x, y + 56);
                DebugUtils.context.fillText('Vert 2 x: ' + (body.shapes[0].verts[1].x * 50) + ' y: ' + (body.shapes[0].verts[1].y * 50), x, y + 70);
                DebugUtils.context.fillText('Vert 3 x: ' + (body.shapes[0].tverts[2].x * 50) + ' y: ' + (body.shapes[0].tverts[2].y * 50), x, y + 84);
                DebugUtils.context.fillText('Vert 4 x: ' + (body.shapes[0].tverts[3].x * 50) + ' y: ' + (body.shapes[0].tverts[3].y * 50), x, y + 98);

                //
                //                DebugUtils.context.fillText('Vert 1 x: ' + body.shapes[0].verts[0].x.toFixed(1) + ' y: ' + body.shapes[0].verts[0].y.toFixed(1), x, y + 56);
                //                DebugUtils.context.fillText('Vert 2 x: ' + body.shapes[0].verts[1].x.toFixed(1) + ' y: ' + body.shapes[0].verts[1].y.toFixed(1), x, y + 70);
                //                DebugUtils.context.fillText('Vert 3 x: ' + body.shapes[0].verts[2].x.toFixed(1) + ' y: ' + body.shapes[0].verts[2].y.toFixed(1), x, y + 84);
                //                DebugUtils.context.fillText('Vert 4 x: ' + body.shapes[0].verts[3].x.toFixed(1) + ' y: ' + body.shapes[0].verts[3].y.toFixed(1), x, y + 98);
                //

            }

        }
        */
