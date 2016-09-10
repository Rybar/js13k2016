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
        this.type = opt.type;
        this.text = opt.text;

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
            Asplode('default', this.body);
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
        switch(this.type) {
            default:
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = this.color || '#fff'
                ctx.strokeStyle = this.stroke;
                var rad = this.body.radius * (this.remaining / this.life);
                ctx.fillRect(
                    b.xx, b.yy - rad, rad * 2, rad * 2
                );
                ctx.restore();
                break;

            case 'text':
                ctx.save();
                ctx.fillStyle = this.color;
                Txt.text({
                    ctx: ctxui,
                    x: b.xx,
                    y: b.yy,
                    text: "o",
                    hspacing: 2,
                    vspacing: 5,
                    halign: 'center',
                    valign: 'top',
                    scale: 1,
                    snap: 1,
                    render: 1,
                });
                ;


        }

    };

}


//---------stashing this here, particle related

function Asplode(type, B) {

            switch(type) {

                default:
                    var p = 20;
                    while(p--){
                        particlePool.get({

                            x: B.xx || 100,
                            y: B.yy || 100,
                            mapcollide: false,

                            dy: rnd(-.25, .25),
                            dx: rnd(-.25, .25),
                            radius: 3,
                            color: "#e80",
                            life: .25
                        });
                    }
                    break;

                case 'enemy':
                var p = 20;
                    while(p--){
                        particlePool.get({

                            x: B.xx || 100,
                            y: B.yy || 100,
                            mapcollide: false,

                            dy: Math.cos(Math.random()) * 2,
                            dx: Math.sin(Math.random()) * 2,
                            radius: 2,
                            color: "#e80",
                            life: .25
                        });
                    }
                break;
            }

}