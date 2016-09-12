
states.menu = {

    onenter: function(event, from, to){
        if(event == 'ready') titlesong=playSound(sounds.titlesong, 1, 0, true);

    },

    onexit: function(event, from, to){
        if(event == 'play') titlesong.sound.stop();
    },

    render: function(){

        clear(GAME);

        ctxui.fillStyle = "#e80";
        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 20,
            text: "SUPER\n\nBOX",
            hspacing: 2,
            vspacing: 5,
            halign: 'center',
            valign: 'top',
            scale: 5,
            snap: 1,
            render: 1,
        });
        ctxui.fillStyle = '#cc0';

        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 20+25+5,
            text: "GLITCH",
            hspacing: 2,
            vspacing: 2,
            halign: 'center',
            valign: 'top',
            scale: 5,
            snap: 1,
            render: 1,
            glitch: { xch:.1, xamt: 10, ych:0, yamt:0}
        });


        ctxui.save();
        ctxui.fillStyle = "#fff";
        Txt.text({
            ctx: ctxui,
            x: Const.GAMEWIDTH/2,
            y: 150,
            text: "A+D/ARROWS: MOVE\nSPACE/Z: SHOOT   X:JUMP\nPRESS Z TO PLAY",
            hspacing: 2,
            vspacing: 2,
            halign: 'center',
            valign: 'top',
            scale: 1,
            snap: 1,
            render: 1,
        });
        ctxui.restore();
    },

    update: function(){

        if(Key.isDown(Key.z)) {

            if(fsm.current == 'menu') fsm.play();
        }
        if(!isFirefox){
            var p = 2;
            while(p--){

                particlePool.get({

                    x: Math.random() * Const.GAMEWIDTH,
                    y: 220,
                    mapcollide: false,
                    collides: false,
                    gravity: -.03,
                    radius: rnd(2,20),
                    color: "rgba(20,0,40, 1)",
                    life: 5

                });

            }
        }


        particlePool.use();



    }

};