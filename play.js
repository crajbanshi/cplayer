class CAPlay{
    constructor(cplayer){
        this.cplayerElemtnt = cplayer;
		this.src = this.cplayerElemtnt.getAttribute('src');
		if(!CAPlay.configured)
		this.pface = playerFace;		
        this.audio = new Audio();
        this.createPlayer();
        this.init();
        this.playFile( this.src );
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

        this.player.div.classList.add("player"); 
        this.player.div.innerHTML = css;
        
        this.player.pslider.setAttribute('type', 'range');
        this.player.pslider.classList.add("seekslider"); 
        this.player.pslider.min = 0;
        this.player.pslider.max = 100;
        this.player.pslider.step = 0.01;        
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
        
        this.player.playpause.innerHTML = 'Play';
        this.player.playpause.addEventListener('click', function() 
        {
            if( me.audio.paused ){
                me.audio.play();
                this.innerHTML = me.pface.pause;
            }else{
                me.audio.pause();
                this.innerHTML = me.pface.play;
            }
        }, false);

        this.player.volumebtn = document.createElement('button');
        this.player.volumebtn.innerHTML = 'Mute';
        this.player.volumebtn.addEventListener('click', function() 
        {
			me.audio.muted = !me.audio.muted;
            if(me.audio.muted){
                this.innerHTML = me.pface.unmute;
            }else{
                this.innerHTML = me.pface.mute;
            }
            
        }, false);
		
		this.player.volumeDiv.classList.add("divin");
        this.player.volumeDiv.appendChild(this.player.volumebtn);
        this.player.volumeDiv.appendChild(this.player.volume);
        
        this.player.div.appendChild(this.player.pslider);
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
}

var playerFace = {
				play:'Play',
				pause:'Pause',
				mute:'Mute',
				unmute:'Unmute'
		};
var els = document.getElementsByTagName('cplayer');
cp = [];
for(i=0;i<els.length;i++){
    cp[i] = new CAPlay( els[i] );
}
