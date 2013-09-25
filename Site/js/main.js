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

        playing = true;
        record_play = "play";

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

            $("#play").replaceWith("<button id='pause'><img id='play2' height='25px' src='img/videoplayer/pause.png'></div>");

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
    $('#timer').text(time);


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

//Firebase Chat


var myDataRef = new Firebase('https://erwinfullsail.firebaseio.com/');
var user_info;
var auth = new FirebaseSimpleLogin(myDataRef, function(error, user) {
    if (error) {
        // an error occurred while attempting login
        console.log(error);
    }else if(user) {
        // user authenticated with Firebase
        user_info = user;
        console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
        $("#name").html("<p>"+user.displayName+ "</p>");
        $("#messageInput").show();
        $("#logout").show();
        $("#login").hide();


    }else{
        //user is logged out
        user_info = null;
        $("#name").html("<p>Guest</p>");
        $("#messageInput").hide();
        $("#logout").hide();
        console.log();
    }

});
$('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
        var name = user_info.displayName;
        var text = $('#messageInput').val();
        console.log(name);
        myDataRef.push({name: name, text: text,profileId:user_info.id});
        $('#messageInput').val('');
    }
});
myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text,message.profileId);
});
function displayChatMessage(name, text, profileId) {
    var message = $('<div id="messages"/>').html("<em>" +name + ':</em> '  +  text);
    if(profileId){
        message.prepend('<img id="profile_pic" src="http://graph.facebook.com/'+profileId+'/picture" />');
    }
    message.appendTo($('#messagesDiv'));

    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};

$("#login").click(function(e){
    auth.login('facebook');
    e.preventDefault(e);
    return false;

});
$("#logout").click(function(e){
    auth.logout();
    e.preventDefault(e);
    return false;
});




