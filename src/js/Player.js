Player =  function(opt) {
        this.body = new Entity({
            radius: 10,
            type: 'player',
            collides: true,
            mapcollide: true,
            gravity: 0.05
        });
        this.body.setCoords(opt.x,opt.y);

    Player.prototype.update = function(step){

        particlePool.get({

            x: this.body.xx - this.body.radius/2 + (Math.random() * 6) - 3,
            y: this.body.yy - 5,
            mapcollide: false,
            gravity: -.006,
            //dy: -this.body.dy,
            //dx: //-this.body.dx * 0.5,
            radius: 1,
            color: "#0ff",
            life: 1
            });

        //player movement
        if(Key.isDown(Key.LEFT) || Key.isDown(Key.a))
        {
            //console.log(player.body.dx, + " " + player.body.cx + " " + player.body.xx);
            player.body.dx -= Const.P_SPEED * step;

        }
        else if(Key.isDown(Key.RIGHT) || Key.isDown(Key.d))
        {
            //console.log(player.body.dx, + " " + player.body.cx + " " + player.body.xx);
            player.body.dx += Const.P_SPEED * step;
        }

        if(Key.isDown(Key.UP) || Key.isDown(Key.w))
        {
            player.body.dy = -Const.P_JUMP;

            //playSound(sounds.jump);
        }
        else if(Key.isDown(Key.DOWN) || Key.isDown(Key.s))
        {
            player.body.dy += Const.P_SPEED * step;
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
                xch: 2, xamt: 1,
                ych: 2, yamt: 1,
            }
        });
    };

};