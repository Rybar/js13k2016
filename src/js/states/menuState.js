
states.menu = {

    onenter: function(event, from, to){
        if(event == 'ready'){
            //titlesong=playSound(sounds.titlesong, true);
        }
    },

    onexit: function(event, from, to){
        //if(event == 'play') titlesong.sound.stop();
    },

    render: function(){

        clear(GAME);

        ctxbfillStyle = "#444";


        ctx.fillStyle = "#fff";
        Txt.text({
            ctx: ctxui,
            x: 20,
            y: 20,
            text: "SUPER\nGLITCH\n",
            hspacing: 2,
            vspacing: 1,
            halign: 'top',
            valign: 'center',
            scale: 1,
            snap: 1,
            render: 1,
            glitchChance: .01,
            glitchFactor: 2
        });
    },

    update: function(){
        if(Key.isDown(Key.r)) {
            if(fsm.current)fsm.reset();
        }

        if(Key.isDown(Key.s)) {
            ctx.fillStyle = "#00ff00";
            if(fsm.current == 'menu') fsm.play();
        }

        particlePool.get({
            x: Math.random() * 200,
            y: 200,
            mapcollide: false,
            collides: false,
            gravity: -.05,
            //dy: -this.body.dy,
            //dx: //-this.body.dx * 0.5,
            radius: 10,
            color: "#0f0",
            life: 1
        });
        particlePool.use();



    }

};