$(document).ready(function () {
    //on load 
    const width = 4;
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const grid = $('#game-grid');
    let clicks_allowed = true;
    window.timer_id = false;


    var init_game = function () {

        let state = {
            // first : {card : undefined, value : undefined},
            first: undefined,
            tiles: images.concat(images),
            move_tally: 0,
            pairs_found: 0,
            time: 0,
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

        if (window.timer_id) {
            clearInterval(timer_id);
        }

        window.timer_id = window.setInterval(function () {
            state.time += 1;
            $('.timer').text(state.time);
        }, 1000);

        //shuffle(state.tiles);


        grid.find('*').remove();
        $('.score').text(state.move_tally);
        $('.timer').text(state.time);

        function render_stars(stars) {
            const star_hollow = '\u2606';
            const star_filled = '\u2605';
            $('.stars').text(star_filled.repeat(state.stars) + star_hollow.repeat(3 - state.stars));
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

        update_stars();
        render_stars(state.stars);

        function card_click(e) {
            const current = e.data;
            //don't do anything if card already flipped
            if (current.card.hasClass('flipped')) {
                return;
            }

            //cards are animating to dont allow more clicks!
            //allowing them can be confusing
            if (!clicks_allowed) {
                return;
            }

            current.card.addClass('flipped');
            state.move_tally += 1;
            $('.score').text(state.move_tally);
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
                        $('#final-score').text(state.move_tally);
                        //stop the timer
                        clearInterval(timer_id);
                        $('#final-time').text(state.time);
                        $('body').toggleClass('gameover');
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
    };

    init_game();

    $('.restart').on('click', function () {
        init_game();
        $('body').removeClass('gameover');
    });
});