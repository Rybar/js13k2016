(function(g){

    g.Enemy = function(opt) {
        var g = GAME;
        body = new g.Entity({
            radius: opt.radius,
            type: 'enemy',
            collides: true,
            gravity: 0.1
        });
        body.setCoords(opt.x, opt.y);
        return {
            color: '#f00',
            body: body,

            update: function(){
                console.log('enemy update');
                body.update();
            },

            render: function(ctx){
                ctx.fillStyle = "#800";
                ctx.strokeStyle = "#f00";
                ctx.save();
                ctx.translate(0.5, 0.5);

                //ctx.fillStyle = "#" + "456789ABCDEF".charAt(Math.floor(Math.random() * 12)) + "00" //random shade of red
                ctx.fillRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius,
                    this.body.radius*2,
                    this.body.radius*2);
                ctx.strokeRect(
                    this.body.xx-this.body.radius,
                    this.body.yy-this.body.radius,
                    this.body.radius*2,
                    this.body.radius*2);

                ctx.restore();

            }

        };

    }
}(GAME));