Particle =  function(opt) {
    this.body = new Entity({
        radius: opt.radius || .5,
        type: opt.type,
        collides: false,
        mapcollide: true,
        gravity: opt.gravity || 0.01,
        dx: opt.dx || 0,
        dy: opt.dy || 0
});

    this.life = opt.life;
    this.remaining = opt.life;
    this.color = opt.color;
    this.body.setCoords(opt.x,opt.y);

    Particle.prototype.update = function(step){

        this.remaining -= step;
        if(this.remaining < 0){
            this.body.die();
        }

        //console.log('update step');
    };

    Particle.prototype.render = function(ctx){
        var b = this.body;
        ctx.fillStyle = this.color || "#fff";
        var rad = this.body.radius * (this.remaining / this.life);
        ctx.fillRect(
            b.xx- rad, b.yy - rad, rad, rad
        )
    };
return this;
    };