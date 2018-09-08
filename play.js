var mfile = "mp3/Haal - E - Dil (Male)(MyMp3Song).mp3";
var audio = new Audio();


audio.addEventListener('loadeddata', function() 
{
    loaded = true;
    var duration = audio.duration;
    duration = (duration / 60).toFixed(2);
    document.getElementById('pduration').innerHTML = duration;
    document.getElementById('pslider').max = duration;
    audio.volume = document.getElementById('volume').value;
    audio.play();
}, false);


audio.addEventListener('timeupdate' , function() 
{
    var seek = (audio.currentTime/60).toFixed(2);
    document.getElementById('seektime').innerHTML = seek;
    document.getElementById('pslider').value = seek ;
}, false);

audio.addEventListener('error' , function() 
{
    alert('error loading audio');
}, false);

document.getElementById('pslider').oninput =  function(e) 
{
    audio.currentTime = e.target.value*60;
};

document.getElementById('volume').oninput = function(e) 
{
    console.log( 'v change', this.value );
    audio.volume = this.value;
};



function play(){
    audio.play();
}

function pause(){
    audio.pause();
}

function showVolume(){
    if( 'none' == document.getElementById('volume').style.display){
        document.getElementById('volume').style.display = 'block'; 
    }else{
        document.getElementById('volume').style.display = 'none'; 
    }
    
}

function playpause(btn){
    console.log('val', btn.value)
    console.log( 'inn', btn.innerHTML )
    if( audio.paused ){
        audio.play();
        btn.innerHTML = 'Pause';
    }else{
        audio.pause();
        btn.innerHTML = 'Play';
    }
}

audio.src = mfile;

function playFile(nfile){
    audio.src = nfile;
}

function loadFile(fl){
    
    console.log ( 'mfile',fl.value );
    playFile(fl.value);
}