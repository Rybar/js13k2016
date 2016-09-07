//todo: finish no-namespace refactor
//todo: add 'first' and 'last' to gruntfile

#js13k 2016

Super Glitch Box

    Super crate box clone with a twist
    
    game plays like cratebox, but crates are glitch. each collected glitch escalates the amount of glitch in-game, and randomizes the weapon
    
    amount of glitch will escalate with: ?
        each time you collect a glitch.

    score: how many glitch boxes collected
        
    Glitch visual effects and escalation:
        graphical errors (in order of escalation)
           background glitches -text renderer and 3d arrayp
           map glitches -from 3d array and text renderer
           text rendering glitches -text renderer
           sprite glitches -text renderer
           full screen bars/channel tearing
           

        
           
TODO MVP:
  
  super crate box game mechanic
    falling patrolling enemies DONE
    crates -not.
    1 gun type

TODO CODE:

    refactor object pool for multiple object types in one pool
    refactor enemy and particle objects for generic object pool

    https://gist.github.com/louisstow/5609992
    https://github.com/photonstorm/phaser/blob/master/src/physics/arcade/World.js


    pubsub event logic ? maybe not needed, super simple game

    crates - glitch
    
    add a 3rd dimension to the map array containing options object for glitch effect controls
