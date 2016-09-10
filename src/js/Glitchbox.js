/**
 * Created by Ryan on 9/8/2016.
 */
Glitchbox =  function(opt) {
    this.body = new Entity({
        radius: 10,
        collides: false,
        mapcollide: true,
        gravity: .05
    });
    this.body.setCoords(70, 100);
    /** facing left */
    this.fl = true;
    this.cooldown = 0;
    this.justJumped = false;
    this.justFired = false;
    this.type = 'glitchbox'
    this.bump = 0;
    this.locations = [
        {cx: 8, cy: 15},
        {cx: 24, cy: 15},
        {cx: 8, cy: 4},
        {cx: 24, cy: 4},

    ];
};

    Glitchbox.prototype.update = function (step) {


        if(this.bump > 0)this.bump -= .01;
        Const.GLITCH.xch = this.bump;

        particlePool.get({

            x: this.body.xx - this.body.radius / 2 + (Math.random() * 6) - 3,
            y: this.body.yy - 5,
            mapcollide: false,
            gravity: -.006,
            radius: 1,
            color: "#0ff",
            life: 1
        });
    };

    Glitchbox.prototype.render = function (ctx) {
        ctx.fillStyle = "#fff";
        Txt.text({
            ctx: ctx,
            x: this.body.xx - this.body.radius,
            y: this.body.yy - this.body.radius - 3,
            text: "dos\noOo\neow",
            hspacing: -1,
            vspacing: -1,
            halign: 'top',
            valign: 'left',
            scale: 1,
            snap: 1,
            render: 1,
            glitch: Const.GLITCH
        });
    };

    Glitchbox.prototype.die = function (step) {
        this.bump = .5;
        score++
        Const.GLITCH.ych += .005;
        Asplode('glitchbox', this.body);
        console.log(this.locations);
        var loc = this.locations[Math.floor(rnd(0, this.locations.length - 1))];
        glitchbox.body.setCoords(loc.cx * Const.GRID, loc.cy * Const.GRID);
    };