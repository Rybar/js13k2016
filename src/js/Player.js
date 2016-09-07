Player =  function(opt) {
    this.body = new Entity({
            radius: 10,
            type: 'player',
            collides: true,
            mapcollide: true,
            gravity: .05
        });
        this.body.setCoords(opt.x,opt.y);
        /** facing left */
        this.fl = true;
        this.cooldown = 0;

    Player.prototype.update = function(step){

        this.cooldown -= step;

        //particlePool.get({
        //
        //    x: this.body.xx - this.body.radius/2 + (Math.random() * 6) - 3,
        //    y: this.body.yy - 5,
        //    mapcollide: false,
        //    gravity: -.006,
        //    //dy: -this.body.dy,
        //    //dx: //-this.body.dx * 0.5,
        //    radius: 1,
        //    color: "#0ff",
        //    life: 1
        //    });

        //player movement
        if(Key.isDown(Key.LEFT) || Key.isDown(Key.a))
        {
            this.fl = true;

            player.body.dx -= Const.P_SPEED * step;

        }
        else if(Key.isDown(Key.RIGHT) || Key.isDown(Key.d))
        {
            this.fl = false;

            player.body.dx += Const.P_SPEED * step;
        }

        if(Key.isDown(Key.UP) || Key.isDown(Key.w))
        {
            if(this.body.onGround()){

                player.body.dy = -Const.P_JUMP;

            }

            //playSound(sounds.jump);
        }
        else if(Key.isDown(Key.DOWN) || Key.isDown(Key.s)) {

            player.body.dy += Const.P_SPEED * step;

        }

        if(Key.isDown(Key.SPACE)) {
            if(this.cooldown <= 0){
                bulletPool.get({

                    x: this.body.xx + (this.fl ? -10 : 10),
                    y: this.body.yy,
                    mapcollide: true,
                    collides: true,
                    gravity: 0,
                    frictX: 0, frictY: 0,
                    dy: 0, //( Key.isDown(Key.UP) || Key.isDown(Key.W) )  ? -.5 : 0,
                    dx: ( Key.isDown(Key.UP) || Key.isDown(Key.W) ) ? 0 : this.fl ? -.5 :.5,
                    radius: 5,
                    color: "red",
                    life: 1,
                });

                this.cooldown = .2
             }

        }
    }
};

    Player.prototype.render = function(ctx){
        ctx.fillStyle = "#0f0";
        Txt.text({
            ctx: ctx,
            x: this.body.xx-this.body.radius,
            y: this.body.yy-this.body.radius,
            text: "we\nsd",
            hspacing: 0,
            vspacing: 0,
            halign: 'top',
            valign: 'left',
            scale: 1,
            snap: 1,
            render: 1,
            glitch: {
                xch:.5, xamt:.5,
                ych:.5, yamt:.5,
            }
        });
    };