
var socket = io();
var allowedSocketId = undefined;

socket.on('connect', function () {

    $tumbler = 'plus';
    $count = 0;

    $('.findGame').on('click', function() {
        $(this).css('display', 'none');
        $('#loader').css('display', 'block');
        socket.emit('joinToQueue', {'socket_id': socket.id});
    });

    $('.box').on('click', function(){
        if( allowedSocketId != socket.id ){
        $('.error').css('display', 'block');
            $('.error').text('Чекай свою чергу!');
            console.log('Wait ur queue!');
            return 0;
        }

        if( $(this).hasClass('checked') ){
        $('.error').css('display', 'block');
            $('.error').text('Вибери вільну клітинку!');
            console.log('Choose another box!');
            return 0;
        }
        $('.error').text('');
        $('.error').css('display', 'none');

        $old_tumbler = $tumbler;

        if( $tumbler == 'plus'){
            $tumbler = 'zero';
        }else{
            $tumbler = 'plus';
        }

        socket.emit('move', {'game_id': $(this).parent().parent().attr('id'), 'box_id': $(this).attr('id'), 'tumbler': $tumbler,'old_tumbler': $old_tumbler,
            'socket_id': socket.id});
    });

    $('.box').on('mouseover',function(){
        if( !$(this).hasClass('checked') ){
            $(this).addClass($tumbler);
        }
    })

    $('.box').on('mouseout',function(){
        if( !$(this).hasClass('checked') ){
            $(this).removeClass($tumbler);
        }
    })
});

socket.on('gameStarted', function(msg){
    $('#loader').css('display', 'none');
    allowedSocketId = msg.opponentOne;
    $('.game').css('display', 'flex');
    $('.game').attr('id', msg.id);
})

socket.on('moveAnswer', function (msg) {
    console.log(socket.id);
    console.log(msg.data, msg.allowedSocketId);
    allowedSocketId = msg.allowedSocketId;
    $tumbler = msg.data.tumbler;
    $(`#${msg.data.box_id}`).addClass('checked');
    $(`#${msg.data.box_id}`).addClass(msg.data.old_tumbler);

    $count += 1;

    if( $count >= 5 ){
        $status = checkGame();

        if( $count == 9 || $status){
            $('.box').removeClass('plus');
            $('.box').removeClass('zero');
            $('.box').removeClass('checked');
            $count = 0;
            $tumbler = 'plus';

            if( $status == 'plus' ){
                $winTeam = 1;
                alert('+ WIN!');
            }else if( $status == 'zero' ){
                $winTeam = 2;
                alert('o WIN!');
            }else{
                $winTeam = 0;
                alert('DRAW');
            }

            socket.emit('gameEnd', {'game_id': msg.data.game_id, 'winTeam': $winTeam});
            window.location.reload();
        }
    }
})

function checkGame(){
    $winConditions =[
        [1,2,3], [1,4,7], [1,5,9], [2,5,8], [3,6,9], [4,5,6], [7,8,9], [3,5,7]
    ];

    $winTeam = false;

    $winConditions.forEach((condition) => {
        $winBoxes = [];

        condition.forEach((value) => {
            $winBoxes.push($(`#${value}`));
        })

        $winPlus = $winBoxes.filter(element => element.hasClass('plus'));

        if( $winPlus.length == 3 ){
            console.log('plus');
            $winTeam = 'plus';
        }

        $winZero = $winBoxes.filter(element => element.hasClass('zero'));

        if( $winZero.length == 3 ){
            console.log('zero');
            $winTeam = 'zero';
        }
    })

    return $winTeam;
}
