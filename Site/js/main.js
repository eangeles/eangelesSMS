var flashReady = function(){
    flash.connect('rtmp://localhost/SMSServer');
    var cam = flash.getCameras();
    var mic = flash.getMicrophones();

    $("#record").click(function(filename, cameraIndex , microphoneIndex){
        record_play = "rec";
        flash.connect('rtmp://localhost/SMSServer');
    });
    $("#stopRecord").click(function(){
        flash.stopRecording();
    });

    for(var i = 0; i<mic.length; i++){
//        var mic_html = $("<option>").text(mic[i]).val(i);
//        $("#select").append(mic_html);
//        var mic_html = $("<img src='img/videoplayer/mic.png'>").html(mic[i]).val(0);
//        $("#mic").append(mic_html);
    }
//    for(var j = 0; j<cam.length; j++){
////        var cam_html = $("<option>").text(cam[j]).val(j);
////        $("#select2").append(cam_html);
//        var cam_html = $("<img src='img/videoplayer/camera.png'>").html(cam[j]).val(j);
//        $("#camera").append(cam_html);
//
//    }

    $("#play").click(function(e){
        flash.connect('rtmp://localhost/SMSServer');

        playing = true;
        record_play = "play";
//        e.preventDefault();


    });
    $("#controls").on('click','#pause',function(){
        flash.playPause();
        console.log(playing)
        if(playing){
            playing = false;
            $("#play2").attr("src","img/videoplayer/play.png")
        }else{
            playing = true;
            $("#play2").attr("src","img/videoplayer/pause.png")
            ;
        }
    });
};

var connected = function(success,error){
    if(success){

        if(record_play === "rec"){
            var selectedMic = $("#select").val();
            console.log(selectedMic);
            flash.startRecording('movie',0,selectedMic);
        }else if(record_play === "play"){
            flash.startPlaying('hobbit_vp6');

            $("#play").replaceWith("<button id='pause'><img id='play2' height='30px' src='img/videoplayer/pause.png'></div>");

            var volume = flash.getVolume();
            var vol_left = volume/1 * 160;

            $("#vol_tab").css("left", vol_left);
            console.log('success');
        }
    }else{
        console.log(error);
    }
}

var durationTime = 0;
var seekerTime = 0



var getDuration = function(duration){
    durationTime = duration;
    $('#duration').text(duration);

}

var seekTime = function(time){
    $('#timer').text(Math.floor(time));


    if(durationTime){
        $("#seeker_tab").css("left", time/durationTime * 365);
    }
}

$("#seeker").click(function(e){
    if(durationTime){
        var mouseX = e.pageX - $(this).offset().left;

        $("#seeker_tab").css("left", mouseX);
        flash.setTime(mouseX/365 * durationTime);
    }
});

$("#vol_seeker").click(function(e){
    var mouseX = e.pageX - $(this).offset().left;
    $("#vol_tab").css("left", mouseX);
    flash.setVolume(mouseX/155 * 1);
});


