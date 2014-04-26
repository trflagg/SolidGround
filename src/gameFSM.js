define(['constants'
        , 'rig']
        , function(constants
                   , Rig) {
    
    var gameFSM = function(game) {
        this.game = game;
    };

    gameFSM.prototype.onplacing_rig = function(event, from, to) {
        var placing_rig = new Rig(this.game, constants.exile_x, constants.exile_y);
        this.game.add.existing(placing_rig);
        this.game.placing_rig = placing_rig;
    };

    gameFSM.prototype.onleaveplacing_rig = function(event, from, to) {
        this.game.rigs.add(this.game.placing_rig);
        this.game.dirt[this.game.placing_rig.i][0].rig();
        this.game.placing_rig = null;
    };

    // attach FSM
    StateMachine.create({
        target: gameFSM.prototype

        , events: [
            { name: 'startup',      from: 'none',           to: 'placing_rig'}
          , { name: 'placeRig',     from: 'placing_rig',    to: 'digging'}        
        ]
    });

    return gameFSM;
});