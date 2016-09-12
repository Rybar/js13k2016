/*global enemySpawnTimer */
states.game = {


    onenter: function(event, from, to){

        switch(from) {

            case 'menu':

                player = new Player({
                    x: Const.GAMEWIDTH/2,
                    y: 100
                });

                glitchbox = new Glitchbox({
                    x: 70,
                    y: 100
                });
                song = playSound(sounds.song, 1, 0, false);
                break;

            case 'gameover':

                score = 0;

                player.body.setCoords(Const.GAMEWIDTH/2, 100);
                song = playSound(sounds.song, 1, 0, false);

                enemyPool.init();
                particlePool.init();
                bulletPool.init();
                Const.GLITCH = { xch: 0, xamt: 10, ych: 0, yamt: 10}

                break;
        }
    },

    onexit: function(event, from, to){

        song.sound.stop();
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
        ctxbg.fillStyle = "#111";
        ctxbg.globalCompositeOperation = 'screen';
        Txt.text({
            ctx: ctxbg,
            x: 10,
            y: 0,
            text: "ooooooooooo\nooooooooooo\nooooooooooo\nooooooooooo\nooooooooooo" +
                    "\nooooooooooo\nooooooooooo\nooooooooooo",
            hspacing: 0,
            vspacing: 0,
            halign: 'top',
            valign: 'left',
            scale: 5,
            snap: 1,
            render: 1,
            glitch: Const.GLITCH
        });
        ctxbg.globalCompositeOperation = 'source-over';
        //UI text-----------------------
        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 10,
            text: score.toString(),
            color: '#c90',
            hspacing: 2, vspacing: 1, halign: 'center', valign: 'center',
            scale: 2, snap: 1, render: 1,
            glitch: Const.GLITCH
        });

        map.render(ctxfg);

        player.render(ctxfg);
        glitchbox.render(ctxfg);





    },

    update: function(step) {

        particlePool.get({
            x: 110 + Math.random() * 50,
            y: 205,
            mapcollide: true,
            gravity: -.004,
            //dy: -this.body.dy,
            //dx: //-this.body.dx * 0.5,
            radius: 4,
            color: "#a20",
            life: .8,
        });

        //Const.GLITCH.ych += .00001;
        //Const.GLITCH.xch += .00001;
        //Const.GLITCH.yamt = 5;

        enemySpawnTimer -= step;
        //console.log(enemySpawnTimer)

        if(enemySpawnTimer <= 0) {

            enemyPool.get({
                x: Const.GAMEWIDTH/2, y: 0
            })

            enemySpawnTimer = enemySpawnRate;

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

                    if(enemies[i].inUse) {

                    if(bullets[j].inUse) {

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

//------------enemy-player check--------------------------
        for (var j = 0; j < enemies.length; j++)  {

            if(enemies[j].inUse) {

                    if (Entity.prototype.overlaps( player.body, enemies[j].body )) {

                        player.die();

                    }
            }

        }
//--------------------------------------------------------
        if(Entity.prototype.overlaps(player.body, glitchbox.body)){
            glitchbox.die();
            player.currentGun = player.makeGun();
        }

    }

}
