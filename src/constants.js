define(function() {
    var constants = {
        // 33% of screen width, divided by 64 (drop remainder)
        game_size_x: 20
        , game_size_y: 20
        , tile_size: 32
        , exile_x: -100
        , exile_y: -100

        , dirt_size_x: 20
        , dirt_size_y: 10
        , dirt_start: 10

        , top_pipe: 1
        , right_pipe: 2
        , bottom_pipe: 4
        , left_pipe: 8

        , lightblue_50_score: 50
        , lightblue_25_score: 25
        , magenta_50_score: 50
        , magenta_25_score: 25
    };

    return constants;
})