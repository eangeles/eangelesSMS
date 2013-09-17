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
        var mic_html = $("<option>").text(mic[i]).val(i);
        $("#select").append(mic_html);
    }
    for(var j = 0; j<cam.length; j++){
        var cam_html = $("<option>").text(cam[j]).val(j);
        $("#select2").append(cam_html);
    }

    $("#play").click(function(e){
        flash.connect('rtmp://localhost/SMSServer');
        console.log('test');
        playing = true;
        record_play = "play";
//        e.preventDefault();


    });
    $("#pause").click(function(){
         flash.playPause();
        if(playing){
            playing = false;
            $("#pause").text("Play");
        }else{
            playing = true;
            $("#pause").text("Pause");
        }
       // console.log(flash.playPause());
    });
};

var connected = function(success,error){
    if(success){
        console.log('success');
        if(record_play === "rec"){
            var selectedMic = $("#select").val();
            console.log(selectedMic);
            flash.startRecording('movie',0,selectedMic);
        }else if(record_play === "play"){
            flash.startPlaying('hobbit_vp6');
        }
    }else{
        console.log(error);
    }
}

var getDuration = function(duration){

}



