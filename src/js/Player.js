(function(g){
    g.Player =  function(opt) {
        var g = GAME;
        body = new g.Entity({
            radius: 5,
            type: 'player',
            collides: true,
            gravity: 0.05
        });
        body.setCoords(opt.x,opt.y);

        return {

            cooldown: 0,
            body: body,
            angle: 0,
            update: function(){


                this.angle += .05;
                console.log(this.body.dx);
                body.update();
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
                    glitchChance: Math.abs(this.body.dx * 10),
                    glitchFactor: 3
                });

            }
        };
    }

}(GAME));