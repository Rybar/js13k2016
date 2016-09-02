(function(g){
    g.Player =  function(opt) {
        var g = GAME;
        body = new g.Entity({
            radius: 10,
            type: 'player',
            collides: true,
            mapcollide: true,
            gravity: 0.05
        });
        body.setCoords(opt.x,opt.y);

        return {

            cooldown: 0,
            body: body,
            angle: 0,
            update: function(step){

                //player movement
                if(GAME.Key.isDown(GAME.Key.LEFT) || GAME.Key.isDown(GAME.Key.a))
                {
                    //console.log(GAME.player.body.dx, + " " + GAME.player.body.cx + " " + GAME.player.body.xx);
                    GAME.player.body.dx -= GAME.const.P_SPEED * step;
                }
                else if(GAME.Key.isDown(GAME.Key.RIGHT) || GAME.Key.isDown(GAME.Key.d))
                {
                    //console.log(GAME.player.body.dx, + " " + GAME.player.body.cx + " " + GAME.player.body.xx);
                    GAME.player.body.dx += GAME.const.P_SPEED * step;
                }

                if(GAME.Key.isDown(GAME.Key.UP) || GAME.Key.isDown(GAME.Key.w))
                {
                    GAME.player.body.dy = -GAME.const.P_JUMP
                }
                else if(GAME.Key.isDown(GAME.Key.DOWN) || GAME.Key.isDown(GAME.Key.s))
                {
                    GAME.player.body.dy += GAME.const.P_SPEED * step;
                }
                //console.log('update step');
            },
            render: function(ctx){
                ctx.fillStyle = "#0f0"
                GAME.Txt.text({
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
                    glitchChance: Math.min(Math.abs(this.body.dx * 10), .5),
                    glitchFactor: 2
                });

            }
        };
    }

}(GAME));