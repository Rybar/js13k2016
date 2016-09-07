function Particle() {
    this.inUse = false; // Is true if the object is currently in use
    /*
     * Sets an object not in use to default values
     */
    this.init = function () {
        this.body = new Entity({
            dead: true,
            gravity: 0,
        });
        this.body.setCoords(-1000, -1000);

    };


    Particle.prototype.spawn = function (opt) {
        /*code to set values if any*/
        //console.log('particle spawned');
        this.inUse = true;

        this.life = opt.life || 1;
        this.remaining = opt.life || 1;
        this.body.radius = opt.radius || 1;
        this.body.collides = opt.collides || false;
        this.body.mapcollide = opt.mapcollide || false;


        this.color = opt.color || '#fff';
        this.asplode = opt.asplode;
        this.body.dead = false;
        this.dead = false;

        this.body.setCoords(opt.x, opt.y);
        this.body.dx = opt.dx || 0;
        this.body.dy = opt.dy || 0;
        this.body.gravity = opt.gravity || 0;
        this.body.type = opt.type || 'particle';


    }
    /*
     * Use the object. Return true if the object is ready to be
     * cleared (such as a bullet going of the screen or hitting
     * an enemy), otherwise return false.
     */
    Particle.prototype.use = function (step) {
        if (this.dead) {
            return true;
        } else {
            //watch.remaining = this.remaining + ' particle: ' + this.body.id ;
            this.remaining -= step;
            if (this.remaining <= 0) {
                this.dead = true;
                return true;
            }

            this.render(ctxfg);
            this.body.update();


            return false;

        }
    };
    /*
     * Resets the object values to default
     */
    Particle.prototype.clear = function () {
        this.inUse = false;
        this.body.xx = -1000;
        this.body.xx = -1000;
        this.body.dead = true;
        this.body.collides = false;
        this.body.mapcollide = false;
    };


    Particle.prototype.render = function (ctx) {
        var b = this.body;

        ctx.fillStyle = this.color || '#fff'//"#" + "456789ABCDEF".charAt(Math.floor(Math.random() * 12)) + "00"; //random shade of red
        //ctxcomp.fillRect(0,0,64,64);
        var rad = this.body.radius * (this.remaining / this.life);
        ctx.fillRect(
            b.xx - rad, b.yy - rad, rad, rad
        );

        //watch.particle = {x: b.xx-rad, y: b.yy-rad, radius: rad, remaining: this.remaining, life: this.life}
    };

}


//---------stashing this here, particle related

function Asplode(type, B) {

            switch(type) {

                default:
                var p = 2;
                    while(p--){
                        particlePool.get({

                            x: B.xx || 100,
                            y: B.yy || 100,
                            mapcollide: false,

                            dy: rnd(-.25, .25),
                            dx: rnd(-.25, .25),
                            radius: 3,
                            color: "#ff0",
                            life: .25
                        });
                    }
                break;
            }

}