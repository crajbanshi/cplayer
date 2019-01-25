(function () {
class CAPlay{
    constructor(cplayer){
        this.cplayerElemtnt = cplayer;
        this.src = this.cplayerElemtnt.getAttribute('src');
        this.autoplay = this.cplayerElemtnt.getAttribute('autoplay');
        this.artimg = this.cplayerElemtnt.getAttribute('img');
		if(!CAPlay.configured)
		this.pface = playerFace;		
        this.audio = new Audio();        
        this.createPlayer();
        this.init();
        this.playFile( this.src );
        if(this.autoplay){
            this.audio.autoplay = true;            
        }
    }

    createPlayer(){
        var me = this;
        var css = '';
		
        this.player = {};
        this.player.div = document.createElement('div');
        this.player.textnode = document.createTextNode(" / ");
        this.player.pslider = document.createElement('input');
        this.player.seektime = document.createElement('span');
        this.player.pduration = document.createElement('span');
        this.player.timediv = document.createElement('div');
        this.player.volumeDiv = document.createElement('div');
        this.player.playpause = document.createElement('button');
        this.player.volume = document.createElement('input');
        this.player.mutebtn = document.createElement('button');
        this.player.artimg = document.createElement('img');
        this.player.artimg.src = this.artimg;
        this.player.artimg.classList.add("artimg");

        this.player.playpause.classList.add("playerbtn");
        this.player.mutebtn.classList.add("playerbtn");

        this.player.div.classList.add("player"); 
        this.player.div.innerHTML = css;
        
        this.player.pslider.setAttribute('type', 'range');
        this.player.pslider.classList.add("seekslider"); 
        this.player.pslider.min = 0;
        this.player.pslider.max = 100;
        this.player.pslider.step = 0.01;
        this.player.pslider.value = 0;       
        this.player.seektime.innerHTML = '0.00';        
        this.player.pduration.innerHTML = '0.00';      
		
		this.player.timediv.classList.add("divin");
        this.player.timediv.appendChild(this.player.seektime);
        this.player.timediv.appendChild(this.player.textnode);
        this.player.timediv.appendChild(this.player.pduration);
        
        this.player.volume.setAttribute('type', 'range');
        this.player.volume.classList.add("volume"); 
        // this.player.volume.setAttribute('orient', 'vertical');
        this.player.volume.min = 0;
        this.player.volume.max = 1;
        this.player.volume.step = 0.01;
        this.player.volume.value = 0.5;
        
        this.player.playpause.innerHTML = me.pface.play;
        this.player.playpause.addEventListener('click', function() 
        {
            if( me.audio.paused ){
                me.play(); 
            }else{
                me.pause();
            }
        }, false);


        this.player.mutebtn.innerHTML = me.pface.mute;
        this.player.mutebtn.addEventListener('click', function() 
        {
            me.mute();
        }, false);
		
		this.player.volumeDiv.classList.add("divin");
        this.player.volumeDiv.appendChild(this.player.mutebtn);
        this.player.volumeDiv.appendChild(this.player.volume);
        
        this.player.div.appendChild(this.player.pslider);
        if(this.artimg)
        this.player.div.appendChild(this.player.artimg);
        this.player.div.appendChild(this.player.timediv);        
        this.player.div.appendChild(this.player.playpause);
        this.player.div.appendChild(this.player.volumeDiv);
		this.parentEl = this.cplayerElemtnt.parentNode;
		this.parentEl.replaceChild(this.player.div, this.cplayerElemtnt);
    }
    
    init(){
        var me = this;
        this.audio.addEventListener('loadeddata', function() 
        {
            me.loaded = true;
            var duration = me.audio.duration;
            duration = (duration / 60).toFixed(2);
            me.player.pduration.innerHTML = duration;
            me.player.pslider.max = duration;
            me.audio.volume = me.player.volume.value;
        }, false);


        this.audio.addEventListener('timeupdate' , function() 
        {
            var seek = (me.audio.currentTime/60).toFixed(2);
            me.player.seektime.innerHTML = seek;
            me.player.pslider.value = seek ;
        }, false);

        this.audio.addEventListener('error' , function() 
        {
            alert('error loading audio');
        }, false);

        this.audio.onplaying = function() {
            me.player.playpause.innerHTML = me.pface.pause;
        };

        this.audio.onpause = function() {
            me.player.playpause.innerHTML = me.pface.play;
        };
        

        this.audio.onended = function() {
            me.player.playpause.innerHTML = me.pface.play;
        };


        this.player.pslider.oninput =  function(e) 
        {
            me.audio.currentTime = e.target.value*60;
        };

        this.player.volume.oninput = function(e) 
        {
            me.audio.volume = this.value;
        };
    }

    playFile (nfile){
        this.audio.src = nfile;
    }

    play(){
        this.audio.play();
    }

    pause(){
        this.audio.pause();
    }

    mute(){
        this.audio.muted = !this.audio.muted;

            if(this.audio.muted){
                this.player.mutebtn.innerHTML = this.pface.unmute;
            }else{
                this.player.mutebtn.innerHTML = this.pface.mute;
            }

    }
}

var playerFace = {
				play: '<i class="icono-play"></i>',
				pause: '<i class="icono-pause"></i>',
				mute: '<i class="icono-volumeHigh"></i>',
				unmute:'<i class="icono-volumeMute"></i>'
        };


var els = Array.from( document.getElementsByTagName('cplayer') );
var len = els.length ;
cp = [];
els.forEach(function(element, i) {
    cp[i] = new CAPlay( element );
  });
  
    // body of the function
  }());