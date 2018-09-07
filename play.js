var mfile = "mp3/01 - Gold Tamba (320 Kbps) - DownloadMing.SE.mp3";
var audio = new Audio();
var interval = {};

function startSeek(){
    interval = setInterval(function(){ 
       var seek = (audio.currentTime/60).toFixed(2);
       console.log( seek );
       document.getElementById('pslider').value = seek ;
    }, 1);
   }

   function showTime(){
    interval = setInterval(function(){ 
       var seek = (audio.currentTime/60).toFixed(2);
       document.getElementById('seektime').value = seek;
    }, 1);
   }

audio.addEventListener('loadeddata', function() 
{
    loaded = true;
    var duration = audio.duration;
    duration = (duration / 60).toFixed(2);
    document.getElementById('pduration').innerHTML = duration;
    document.getElementById('pslider').max = duration;
    startSeek();
    showTime();
    audio.play();
}, false);
 
audio.addEventListener('error' , function() 
{
    alert('error loading audio');
}, false);

document.getElementById('pslider').addEventListener('onmousedown' , function(e) 
{
    clearInterval( interval );
});

document.getElementById('pslider').addEventListener('onmouseup' , function(e) 
{
    startSeek();
});
document.getElementById('pslider').addEventListener('change' , function(e) 
{
    clearInterval( interval );
    audio.currentTime = e.target.value*60;
    // startSeek();
});
function play(){
    startSeek()
    audio.play();
}

function pause(){
    clearInterval( interval );
    audio.pause();
}



audio.src = mfile;