function shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}

//cards can be in two states - flpped not flipped
//they can also be in two other states in-play or complete
//user interacts in two ways - picking either first card, or second card

$(document).ready(function () {
    //on load 
    const width = 4;
    const cells = width * width;
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let tiles = images.concat(images);

    const grid = $('#game-grid');

    let first;
    let first_cell;

    var init_game = function () {

        //shuffle(tiles);

        let move_tally = 0;
        let pairs_found = 0;
        let time = 0;

        grid.find('*').remove();
        $('#score').text(move_tally);
        $('#timer').text(time);

        let cell = 0;
        for (let row = 0; row < width; row += 1) {
            const tr = $('<tr></tr>');

            for (let col = 0; col < width; col += 1) {
                const src = "img/" + tiles[cell] + ".svg";
                const td = $('<td></td>');

                const flipper_container = $('<div class="flip-container">\
                    <div class="flipper">\
                    <div class="front"><img src="img/star.svg" alt=""></div>\
                        <div class="back"><img src="' + src + '" alt=""></div>\
                        </div>\
                    </div>');

                td.append(flipper_container);

                td.on('click', { cell: cell }, function (e) {

                    const this_cell = e.data.cell;
                    //first choice
                    if (!flipper_container.hasClass('flip')) {
                        if (first === undefined) {
                            flipper_container.addClass('flip');
                            move_tally += 1;
                            $('#score').text(move_tally);
                            first = flipper_container;
                            first_cell = this_cell;
                            //second choice
                        } else if (first != undefined) {
                            move_tally += 1;
                            $('#score').text(move_tally);

                            if (tiles[this_cell] === tiles[first_cell]) {
                                //user clicked on same time twice
                                flipper_container.addClass('flip');
                                first = undefined;
                                first_cell = undefined;
                                pairs_found += 1;
                                if (pairs_found === 8) {
                                    console.log("You win!");
                                    $('#final-score').text(move_tally);
                                    clearInterval(timer_id);
                                    $('#final-time').text(time);
                                    $('.game-screen').hide();
                                    $('.win-screen').show();
                                }
                            } else {
                                //user clicked on different tiles
                                flipper_container.addClass('flip');
                                //first choice matches second
                                if (first_cell === this_cell) {
                                    console.log('found pair!')
                                    //first choice doesnt match second
                                } else {
                                    setTimeout(function (f) {
                                        flipper_container.removeClass('flip');
                                        f.removeClass('flip');

                                    }, 1000, first);
                                    first = undefined;
                                    first_cell = undefined;
                                }
                            }

                        }
                    }
                });

                tr.append(td);
                cell += 1;

            }
            grid.append(tr);
        }

        const timer_id = window.setInterval(function() {
            time += 1;
            $('#timer').text(time);
        }, 1000);
    };


    init_game();

    $('#restart-btn').on('click', function () {
        init_game();
        $('.win-screen').hide();
        $('.game-screen').show();

    });
});