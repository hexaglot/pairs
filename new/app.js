(function () {
    const width = 4;
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    let clicks_allowed = true;

    //the DOM elements we need
    //game screen
    const grid = $('#game-grid');
    const $stars = $('.stars');
    const $score = $('.score');
    const $timer = $('.timer');
    //win screen
    const $final_score = $('#final-score');
    const $final_time = $('#final-time');
    //both
    const $body = $('body');
    //there are two restart buttons
    const $restart_buttons = $('.restart');

    let state = {
        // first : {card : undefined, value : undefined},
        first: undefined,
        tiles: images.concat(images),
        move_tally: 0,
        pairs_found: 0,
        timer: { time: 0, running: false },
        stars: 0
    };

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
    }

    function render_stars(stars) {
        const star_hollow = '\u2606';
        const star_filled = '\u2605';
        $stars.text(star_filled.repeat(state.stars) + star_hollow.repeat(3 - state.stars));
    }

    function update_stars() {
        //to get three stars you need a score of 16 - perfect
        //to get two stars you need to complete it in 24 moves,
        //anything else is one star
        if (state.move_tally <= 16) {
            state.stars = 3;
        } else if (state.move_tally <= 24) {
            state.stars = 2;
        } else {
            state.stars = 1;
        }
    }

    function card_click(e) {
        const current = e.data;
        //don't do anything if card already flipped
        if (current.card.hasClass('flipped')) {
            return;
        }

        //cards are animating so dont allow more clicks!
        //allowing them can be confusing to player
        if (!clicks_allowed) {
            return;
        }

        current.card.addClass('flipped');
        state.move_tally += 1;
        $score.text(state.move_tally);
        update_stars();
        render_stars(state.stars);

        if (state.first === undefined) {
            //first choice
            state.first = current;
        } else if (state.first != undefined) {
            //second choice
            if (state.tiles[current.value] === state.tiles[state.first.value]) {
                //match found
                state.pairs_found += 1;
                current.card.toggleClass('correct');
                state.first.card.toggleClass('correct');
                //check if we have won
                if (state.pairs_found === 8) {
                    $final_score.text(state.move_tally);
                    //stop the timer
                    state.timer.running = false;
                    $final_time.text(state.timer.time);
                    //TODO: change to a container div
                    $body.toggleClass('gameover');
                }
            } else {
                //no match found
                clicks_allowed = false;
                setTimeout(function (f) {
                    current.card.removeClass('flipped');
                    f.removeClass('flipped');
                    clicks_allowed = true;
                }, 1000, state.first.card);
            }
            state.first = undefined;
        }
    };

    var init_game = function () {

        state = {
            // first : {card : undefined, value : undefined},
            first: undefined,
            tiles: images.concat(images),
            move_tally: 0,
            pairs_found: 0,
            timer: { time: 0, running: true },
            stars: 0
        };

        //shuffle(state.tiles);

        //clear the game grid and refill
        grid.find('*').remove();
        for (let cell = 0; cell < (width * width); cell += 1) {
            const card_container = $('\
                <div class="card-container" >\
                    <div class="card">\
                    <div class="front"></div>\
                        <div class="back card-' + state.tiles[cell] + '"></div>\
                        </div>\
                    </div>');
            card_container.on('click', { card: card_container, value: cell }, card_click);
            grid.append(card_container);
        }

        $score.text(state.move_tally);
        $timer.text(state.timer.time);

        update_stars();
        render_stars(state.stars);

    };


    $(document).ready(function () {
        //on load 
        init_game();

        //install the resart button handler
        $restart_buttons.on('click', function () {
            init_game();
            $body.removeClass('gameover');
        });

        //install the timer function
        window.setInterval(function () {
            //only update if the timer is set to running
            if (state.timer.running) {
                state.timer.time += 1;
            }
            $timer.text(state.timer.time);
        }, 1000);

    });
}());


