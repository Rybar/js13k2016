/**
 * Created by ryan on 9/10/16.
 */
states.boot = {

    onenter: function() {
        if(!sounds.jump)initAudio(); //off for now, placeholder song works
    },

    render: function(){

        clear(GAME);
        ALL = [];

        var i = Const.WIDTH;

        while(i--){
            ctxui.fillStyle = "#020";
            Txt.text({
                ctx: ctxui,
                x: i * (Const.GRID+2),
                y: 70,
                text: rndTxt('wesdxz', 2) + "\n" + rndTxt('wesdxz', 2) + "\n" + rndTxt('wesdxz', 2),
                hspacing: 1,
                vspacing: 1,
                halign: 'top',
                valign: 'left',
                scale: 1,
                snap: 1,
                render: 1,
            });
        }
        var loadmsg = ['INITIALIZING...',
            'RENDERING SOUNDS...',
            'CONFIGURATING PIXELS....',
            'RETICULATING SPLINES...',
            'MESSAGE 42',
            'STIRRING THE PARTICLE POOL...',
            'STIRRING THE PARTICLE POOL...',
            'BREEDING BADDIES...',
            'READY. PRESS X TO CONTINUE'];

        finalctx.clearRect(0,0, Const.GAMEWIDTH, Const.GAMEHEIGHT);
        ctxui.fillStyle = sounds.loaded==7 ? "#0d0" : "#080";
        Txt.text({
            ctx: ctxui,
            x: 18,
            y: 79,
            text: loadmsg[sounds.loaded],
            hspacing: 1,
            vspacing: 1,
            halign: 'top',
            valign: 'center',
            scale: 1,
            snap: 1,
            render: 1,
            glitchChance: .0,
            glitchFactor: 0
        });

    },

    update: function(){

        if(Key.isDown(Key.r)) {
            if(fsm.current)fsm.reset();
        }

        if( sounds.loaded == sounds.total &&  Key.isDown(Key.x)) {
            if(fsm.current == 'boot') {
                //playSound(sounds.es4, 1, 0, false);
                fsm.ready();
            }
        }

    }

};
