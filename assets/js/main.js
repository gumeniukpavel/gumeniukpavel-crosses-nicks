
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



        socket.emit('move', {'game_id': $(this).parent().parent().attr('id'), 'box_id': $(this).attr('id'), 'tumbler': $tumbler,
            'socket_id': socket.id});
    });

    $('.box').on('mouseover',function(){
        if( !$(this).hasClass('checked') ){
            $(this).addClass($tumbler);
        }
    })

    $('.box').on('mouseout',function(){
        if( !$(this).hasClass('checked') ){
            $(this).removeClass("plus");
            $(this).removeClass("zero");
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

    $(`#${msg.data.box_id}`).addClass('checked');
    $(`#${msg.data.box_id}`).addClass(msg.data.tumbler);


    if( msg.data.tumbler == 'plus'){
        $tumbler = 'zero';
    }else{
        $tumbler = 'plus';
    }

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


