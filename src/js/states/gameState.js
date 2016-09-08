/*global enemySpawnTimer */
states.game = {

    onenter: function(event, from, to){

        switch(event) {

            case 'play':

                player = new Player({
                    x: 100,
                    y: 100
                });

                //song=playSound(sounds.song, true)
                break;

        }

    },

    onexit: function(event, from, to){
        // titlesong.sound.stop();
    },

    render: function(){

        clear(GAME);

        //background-------------------
        ctxbg.fillStyle = "#223";
        Txt.text({
            ctx: ctxbg,
            x: 0,
            y: 0,
            text: "xzxzxz\nzxzxzx\nxzxzxz\nzxzxzx",
            hspacing: 0,
            vspacing: 0,
            halign: 'top',
            valign: 'left',
            scale: 10,
            snap: 1,
            render: 1,
            glitch: {xch: 0, xamt: 0, ych:0, yamt:0}
        });
        //UI text-----------------------
        Txt.text({
            ctx: ctxui,
            x: 10,
            y: 10,
            text: "WASD OR ARROWS TO MOVE",
            hspacing: 2, vspacing: 1, halign: 'top', valign: 'left',
            scale: 1, snap: 1, render: 1,
            glitchChance: .4, glitchFactor: 3
        });

        map.render(ctxfg);

        player.render(ctxfg);





    },

    update: function(step){

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
        player.body.update(step);

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

                        if (Entity.prototype.overlaps(
                                enemies[i].body, bullets[j].body)) {
                            enemies[i].dead = true;
                            bullets[j].dead = true;
                        }

                    }

                }

            }
        }
//----------enemy-bullet check----------------------------










    }

}
