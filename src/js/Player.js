Player =  function(opt) {
    this.body = new Entity({
            radius: 8,
            type: 'player',
            collides: true,
            mapcollide: true,
            gravity: .04
        });
        this.body.setCoords(opt.x,opt.y);
        /** facing left */
        this.fl = true;
        this.cooldown = 0;
        this.justJumped = false;
        this.justFired = false;
        this.currentGun = null;

    Player.prototype.update = function(step){

        if(!this.currentGun) this.currentGun = this.makeGun();
        player.currentGun.bullet.x = player.body.xx;
        player.currentGun.bullet.y = player.body.yy;
        player.currentGun.bullet.dx = this.fl ? -player.currentGun.velocity : player.currentGun.velocity;


            this.cooldown -= step;

        //particlePool.get({
        //
        //    x: player.body.xx - player.body.radius/2 + (Math.random() * 6) - 3,
        //    y: player.body.yy - 5,
        //    mapcollide: false,
        //    gravity: -.006,
        //    //dy: -this.body.dy,
        //    //dx: //-this.body.dx * 0.5,
        //    radius: 1,
        //    color: "#0ff",
        //    life: 1
        //    //type: 'text',
        //    //text: 'o'
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

        if(Key.isDown(Key.UP) || Key.isDown(Key.w) || Key.isDown(Key.x))
        {
            if(this.body.onGround()){

                player.body.dy = -Const.P_JUMP;
                player.justJumped = true;

            }
            if(player.justJumped){
                player.justJumped = false;
                playSound(sounds.jump, rnd(0.7, 1.1), norm(player.body.xx, 0, Const.GAMEWIDTH), false);
            }


        }

        //temp, player respawn if fall-thru
        if(player.body.yy > 200){
            player.die();
        }
        if(player.body.yy < 5){
            player.body.setCoords(this.body.xx, 5);
        }

        if( Key.isDown(Key.SPACE) || Key.isDown(Key.z) ) {

            if(this.cooldown <= 0) {
                this.justFired = true;
                bulletPool.get(this.currentGun.bullet);

                this.cooldown = this.currentGun.cooldown;
                if (this.justFired){
                    this.justFired = false;
                    playSound(sounds.shoot, rnd(.95, 1.1), norm(player.body.xx, 0, Const.GAMEWIDTH));
                }
             }

        }
    }
};

    Player.prototype.render = function(ctx){
        ctx.save();
        ctx.fillStyle = "#ea0"
        if(player.fl){

            ctx.scale(-1,1); //mirror it
            //ctx.translate(-270, 0) //move to where are player is
        }

        Txt.text({
            ctx: ctx,
            x: player.fl ? (player.body.xx+player.body.radius) * -1 : player.body.xx-player.body.radius,
            y: player.body.yy-player.body.radius-3,
            //x: 0,
            //y: 0,
            text: "tyu\nghj\nbnm",
            hspacing: Math.abs( player.body.dx * 15 ),
            vspacing: Math.abs( player.body.dy * 15 ),
            halign: 'top',
            valign: 'left',
            scale: 1,
            snap: 1,
            render: 1,
            glitch: {
                xch:Math.abs( player.body.dx ), xamt: 5,
                ych:Math.abs( player.body.dy ), yamt: 5,
            }
        });
        ctx.restore();
    };

    Player.prototype.die = function(step) {
        Asplode('player', this.body);
        player.body.setCoords(100, 100)  //gameover eventually
        fsm.lose();


    }

    Player.prototype.makeGun = function() {

        var vel = Math.random() * 1.1 + .5;

        var cooldown = Math.random() * .2 + .02;

        bullet = {

            x: 0,
            y: 0,
            mapcollide: true,
            collides: false,
            gravity: 0,
            frictX: 0, frictY: 0,
            dy: 0, //( Key.isDown(Key.UP) || Key.isDown(Key.W) )  ? -.5 : 0,
            dx: 0,
            radius: Math.floor(rnd(1, 15)),
            color: "#f80",
            life: rnd(.5, 3),

        }

        return { bullet: bullet, cooldown: cooldown, velocity: vel};

    }