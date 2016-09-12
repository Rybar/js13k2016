/**
 * Created by Ryan on 9/8/2016.
 */
Glitchbox =  function(opt) {
    this.body = new Entity({
        radius: 8,
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
        {cx: 10, cy: 2},
        {cx: 6, cy: 2},
        {cx: 2, cy: 7},
        {cx: 5, cy: 7},
        {cx: 8, cy: 7},
        {cx: 18, cy: 7},
        {cx: 24, cy: 7},
        {cx: 9, cy: 12},
        {cx: 14, cy: 12},
        {cx: 18, cy: 12},
        {cx: 2, cy: 16},
        {cx: 10, cy: 17},
        {cx: 18, cy: 17},
        {cx: 24, cy: 16},

    ];
};

    Glitchbox.prototype.update = function (step) {


        if(this.bump > 0)this.bump -= .01;
        Const.GLITCH.xch = this.bump;

        particlePool.get({

            x: this.body.xx - this.body.radius + 1 + (Math.random() * 15),
            y: this.body.yy - 5,
            mapcollide: false,
            gravity: -.006,
            radius: 1,
            type: 'glitch',
            life: 1
        });
    };

    Glitchbox.prototype.render = function (ctx) {
        ctx.fillStyle = '#' + rndTxt('456789ABCDEF', 3);
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
        playSound(sounds.glitchget, rnd(.98, 1.02), norm(this.body.xx, 0, Const.GAMEWIDTH), false);
        Asplode('glitchbox', this.body);
        //console.log(this.locations);
        var loc = this.locations[Math.floor(rnd(0, this.locations.length - 1))];
        glitchbox.body.setCoords(loc.cx * Const.GRID, loc.cy * Const.GRID);
    };