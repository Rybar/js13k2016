function Particle() {
    this.inUse = false; // Is true if the object is currently in use
    /*
     * Sets an object not in use to default values
     */
    this.init = function(/*values*/) {
        //console.log('particle initialized');
        this.body = new Entity({
            dead: false,
            gravity: 0,
            type: 'particle'
        });
        this.body.setCoords(-1000,-1000);

    };


    Particle.prototype.spawn = function(opt) {
        /*code to set values if any*/
        //console.log('particle spawned');
        this.inUse = true;

        this.life = opt.life || 1;
        this.remaining = opt.life || 1;
        this.body.radius = opt.radius || 1;
        this.body.collides = opt.collides || false;
        this.body.mapcollide = opt.mapcollide || true;


        this.color = opt.color || '#fff';
        this.body.dead = false;
        this.dead = false;

        this.body.setCoords(opt.x, opt.y);
        this.body.dx = opt.dx || 0;
        this.body.dy = opt.dy || 0;
        this.body.gravity = opt.gravity || 0;

    }
    /*
     * Use the object. Return true if the object is ready to be
     * cleared (such as a bullet going of the screen or hitting
     * an enemy), otherwise return false.
     */
    Particle.prototype.use = function(step) {
        if (this.dead) {
            return true;
        } else {
            //watch.remaining = this.remaining + ' particle: ' + this.body.id ;
            this.remaining -= step;
            if(this.remaining <= 0) {
                this.dead = true;
            }
            this.render(ctxfg);
            this.body.update(particlePool);

            return false;

        }
    };
    /*
     * Resets the object values to default
     */
    Particle.prototype.clear = function() {
        /*code to reset values*/
        this.inUse = false;
        //this.body.setCoords(-1000,-1000);
        //this.body.dx = this.body.dy = 0;
        //this.body.gravity = 0;
        //this.body.dead = true;
        //this.life = 0;
        //this.remaining = 0;
    };
}


    Particle.prototype.render = function(ctx){
            var b = this.body;

            ctx.fillStyle = this.color || '#fff'//"#" + "456789ABCDEF".charAt(Math.floor(Math.random() * 12)) + "00"; //random shade of red
            //ctxcomp.fillRect(0,0,64,64);
            var rad = this.body.radius * (this.remaining / this.life);
            ctx.fillRect(
                b.xx - rad, b.yy - rad, rad, rad
            );
            //watch.particle = {x: b.xx-rad, y: b.yy-rad, radius: rad, remaining: this.remaining, life: this.life}
    };