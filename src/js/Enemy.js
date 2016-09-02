(function(g){

    g.Enemy = function(opt) {
        var g = GAME;
        body = new g.Entity({
            radius: opt.radius,
            type: 'enemy',
            collides: false,
            mapcollide: true,
            gravity: 0.06
        });
        body.setCoords(opt.x, opt.y);
        return {
            color: '#f00',
            body: body,
            movingLeft: true,

            update: function(step){

                //patrol logic ----------------
                if(this.movingLeft){
                    this.body.dx -= g.const.E_SPEED * step;
                }
                else this.body.dx += g.const.E_SPEED * step;

                if(this.body.onWallLeft()){
                    this.movingLeft = false;
                }
                if(this.body.onWallRight()){
                    this.movingLeft = true;
                }
                if(this.body.collided){
                    this.movingLeft = !this.movingLeft;
                    this.body.collided = false;
                }

                //world wrap + anger stuff? crate-box style
                if(this.body.yy > g.const.GAMEHEIGHT){
                    this.body.setCoords(100, -5);
                }

                //console.log('enemy update');
                //body.update();
            },

            render: function(ctx){
                ctx.fillStyle = "#800";
                ctx.strokeStyle = "#f00";
                ctx.save();
                ctx.translate(0.5, 0.5);

                //ctx.fillStyle = "#" + "456789ABCDEF".charAt(Math.floor(Math.random() * 12)) + "00" //random shade of red
                ctx.fillRect(
                    this.body.xx-this.body.radius +1,
                    this.body.yy-this.body.radius +1,
                    (this.body.radius*2)-1,
                    (this.body.radius*2)-3);
                ctx.strokeRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius,
                    this.body.radius*2,
                    this.body.radius*2);

                ctx.restore();//post stroke, put back the .5 translation so future rendering isnt on subpixels

                ctx.fillStyle = "#FFF";  //eyes
                ctx.fillRect(
                    this.body.xx-2,
                    this.body.yy-4,
                    1, 1);
                ctx.fillRect(
                    this.body.xx+3,
                    this.body.yy-4,
                    1, 1);

            }

        };

    }
}(GAME));