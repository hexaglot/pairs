function shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}

$(document).ready(function () {
    //on load 
    const width = 4;
    const cells = width * width;
    const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let tiles = images.concat(images);
    console.log(tiles);
    const grid = $('#game-grid');
    let first;
    let first_cell;

    var init_game = function () {

        shuffle(tiles);
        console.log(tiles);
        let move_tally = 0;
        let pairs_found = 0;

        grid.find('*').remove();
        $('#score').text(move_tally);

        let cell = 0;
        for (let row = 0; row < width; row += 1) {
            const tr = $('<tr></tr>');

            for (let col = 0; col < width; col += 1) {
                const src = "img/" + tiles[cell] + ".svg";
                const img = $('<img class="" src="' + src + '" alt="g">');
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
                    console.log(move_tally);
                    //first choice
                    if (first === undefined) {
                        flipper_container.addClass('flip');
                        first = flipper_container;
                        first_cell = this_cell;
                        move_tally += 1;
                    } else {
                        if (flipper_container !== first) {
                            flipper_container.addClass('flip');
                            move_tally += 1;
                            if (tiles[this_cell] === tiles[first_cell]) {
                                console.log('pair found!');
                                console.log(tiles[this_cell] + "=" + tiles[first_cell]);
                                pairs_found += 1;
                                first = undefined;
                                first_cell = undefined;
                                if (pairs_found === width * 2) {
                                    console.log('game over!');
                                    grid.hide();
                                    $('.win-screen').show();
                                }
                            } else {
                                window.setTimeout(function () {
                                    first.removeClass('flip');
                                    first = undefined;
                                    first_cell = undefined;
                                    flipper_container.removeClass('flip');
                                }, 1000);
                            }

                        }

                    }
                    $('#score').text(move_tally);
                })
                tr.append(td);
                cell += 1;
            }
            grid.append(tr);
        }
    }

    init_game();

    $('#restart-btn').on('click', function () {
        init_game();
        $('.win-screen').hide();
        grid.show();

    });


})