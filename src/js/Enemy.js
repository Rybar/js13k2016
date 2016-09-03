
    Enemy = function(opt) {

        body = new Entity({
            radius: opt.radius,
            type: 'enemy',
            collides: false,
            mapcollide: true,
            gravity: 0.06,


        });
        body.setCoords(opt.x, opt.y);
        return {
            color: '#f00',
            body: body,
            movingLeft: true,
            stride: 0,
            stridetick: 0,
            antennae: Math.random() > 0.5,
            fill: "#" + "456789ABCDEF".charAt(Math.floor(Math.random() * 12)) + "00", //random shade of red
            stroke: "#" + "456789ABCDEF".charAt(Math.floor(Math.random() * 12)) + "00", //random shade of red

            update: function(step){

                this.stridetick+= .3;
                this.stride = Math.sin(this.stridetick) * 2;
                this.stride2 = Math.sin(this.stridetick - .8) * 1.3;

                //patrol logic ----------------
                if(this.movingLeft){
                    this.body.dx -= Const.E_SPEED * step;
                }
                else this.body.dx += Const.E_SPEED * step;

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
                if(this.body.yy > Const.GAMEHEIGHT){
                    this.body.setCoords(100, -5);
                }

                //console.log('enemy update');
                //body.update();
            },

            render: function(ctx){
                ctx.fillStyle = this.fill;
                ctx.strokeStyle = this.stroke;
                ctx.save();
                ctx.translate(0.5, -3.5);

                ctx.fillStyle = opt.fillStyle;
                ctx.fillRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius-this.stride,
                    (this.body.radius*2),
                    (this.body.radius*2));
                ctx.strokeRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius-this.stride,
                    this.body.radius*2,
                    this.body.radius*2);

                ctx.restore();//post stroke, put back the .5 translation so future rendering isnt on subpixels

                ctx.fillStyle = "#FFF";  //eyes
                ctx.fillRect(
                    this.body.xx-2,
                    this.body.yy-4-this.stride2,
                    1, 2);
                ctx.fillRect(
                    this.body.xx+2,
                    this.body.yy-4-this.stride2,
                    1, 2);
                ctx.fillStyle = "#Fa0"
                if(this.antennae) {
                    ctx.fillRect(
                        this.body.xx - 3,
                        this.body.yy - 11 - this.stride2,
                        1,
                        5);
                    ctx.fillRect(
                        this.body.xx + 3,
                        this.body.yy - 11 - this.stride2,
                        1,
                        5);
                }


            }

        };

    };