/*global enemySpawnTimer */
states.game = {


    onenter: function(event, from, to){

        switch(event) {

            case 'play':

                player = new Player({
                    x: Const.GAMEWIDTH/2,
                    y: 100
                });

                glitchbox = new Glitchbox({
                    x: 70,
                    y: 100
                })

                //song=playSound(sounds.song, true)
                break;

        }

    },

    onexit: function(event, from, to){
        //ctxcomp.save();
        //ctxcomp.globalCompositeOperation = 'color';
        ctxcomp.fillStyle = '#f00';
        ctxcomp.fillRect(0,0, ctx.width, ctx.height);
        ctxcomp.globalCompositeOperation = 'source-over';
        //ctxcomp.restore();
        // titlesong.sound.stop();
    },

    render: function(){

        clear(GAME);

        //background-------------------
        ctxbg.fillStyle = "#223";
        Txt.text({
            ctx: ctxbg,
            x: 10,
            y: 0,
            text: "o o o\n o o \no o o\n o o ",
            hspacing: 0,
            vspacing: 0,
            halign: 'top',
            valign: 'left',
            scale: 10,
            snap: 1,
            render: 1,
            glitch: Const.GLITCH
        });
        //UI text-----------------------
        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 10,
            text: score.toString(),
            hspacing: 2, vspacing: 1, halign: 'center', valign: 'center',
            scale: 2, snap: 1, render: 1,
            glitch: Const.GLITCH
        });

        map.render(ctxfg);

        player.render(ctxfg);
        glitchbox.render(ctxfg);





    },

    update: function(step){

        Const.GLITCH.ych += .00001;
        Const.GLITCH.xch += .00001;
        Const.GLITCH.yamt = 5;

        enemySpawnTimer -= step;
        //console.log(enemySpawnTimer)

        if(enemySpawnTimer <= 0) {

            enemyPool.get({
                x: Const.GAMEWIDTH/2, y: 0
            })

            enemySpawnTimer = enemySpawnRate;

        }

        //reset from any state
        if(Key.isDown(Key.r)) {
            if(fsm.current)fsm.reset();
        }

        player.update(step);
        glitchbox.update(step);

        player.body.update(step);
        glitchbox.body.update(step);

        particlePool.use();
        enemyPool.use();
        bulletPool.use();

//----------enemy-bullet check----------------------------
        var enemies = enemyPool.getPool().slice();
        var bullets = bulletPool.getPool().slice();

        for (var i = 0; i < enemies.length; i++)
        {
            for (var j = 0; j < bullets.length; j++)
            {
                    //if(Math.abs(enemies[i].body.cx-bullets[j].body.cx) <= 1 && Math.abs(enemies[i].body.cy-bullets[j].body) <= 1 ) {

                if(enemies[i].inUse) {

                    if(bullets[j].inUse) {

                        //particlePool.get({
                        //
                        //    x: bullets[j].body.xx + (Math.random() * 2)-1,
                        //    y: bullets[j].body.yy + (Math.random() * 2)-1,
                        //    mapcollide: false,
                        //    gravity: -.003,
                        //    //dy: -this.body.dy,
                        //    //dx: //-this.body.dx * 0.5,
                        //    radius: 1,
                        //    color: "#f80",
                        //    life:.5
                        //});

                        if (Entity.prototype.overlaps(
                                enemies[i].body, bullets[j].body)) {
                            //score +=10;
                            enemies[i].dead = true;
                            bullets[j].dead = true;
                        }

                    }

                }

            }
        }
//----------enemy-bullet check----------------------------

//------------enemy-player check---------------
        for (var j = 0; j < enemies.length; j++)
        {
            //if(Math.abs(enemies[i].body.cx-bullets[j].body.cx) <= 1 && Math.abs(enemies[i].body.cy-bullets[j].body) <= 1 ) {

            if(enemies[j].inUse) {

                    if (Entity.prototype.overlaps(
                            player.body, enemies[j].body)) {
                        player.die();

                    }
            }

        }
        if(Entity.prototype.overlaps(player.body, glitchbox.body)){
            glitchbox.die();
            player.currentGun = player.makeGun();
        }









    }

}
