/*!
 * cplayer v0.1.0
 * Copyright 2019 Chanchal Rajbanshi (https://github.com/crajbanshi/cplayer)
 * Licensed under MIT
 */
'use strict';
(function() {
    class CAPlay {

        constructor() {
            this.config = {};
            var cplayer = document.createElement('cplayer');
            document.body.appendChild(cplayer);
            this.cplayerElemtnt = cplayer;
            this.clearButton = { class: '', onclick: 'cplayer.clearPlaylist' }
            if (!this.artimg) {
                this.artimg = this.albumArt()
            }
            if (!CAPlay.configured)
                this.pface = playerFace;
            this.audio = new Audio();
            this.createPlayer();
            this.init();
            if (this.autoplay) {
                this.audio.autoplay = true;
            }
        }

        static singlePlayer() {
            if (!this.instance) {
                this.instance = new CAPlay();
            }
            return this.instance;
        }

        addToPlayList(list) {
            if (!Array.isArray(list)) {
                list = [list];
            }
            list.forEach((item, index) => {
                let found = -1;
                if (Array.isArray(this.playlist) && this.playlist.length > 0)
                    found = this.playlist.findIndex(el => el.src === item.src);
                if (found < 0) {
                    this.playlist.push(item);
                }
            });

            localStorage.setItem(window.location.hostname + "playlist", JSON.stringify(this.playlist));
            this.displayPlayList();
            if (!this.audio.src)
                this.playNow(this.playlist[0])
        }

        getplayList() {
            return this.playlist;
        }

        clearPlaylist() {
            localStorage.removeItem(window.location.hostname + "playlist");
            this.playlist = [];
            this.displayPlayList();
            this.nowPlayingIndex = -1;
        }

        loadCSS() {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = window.location.href + 'src/css/cplayer.css';
            var head = document.getElementsByTagName('HEAD')[0];
            head.appendChild(link);
        }

        createPlayer() {
            var me = this;

            this.player = {};
            this.player.div = document.createElement('div');
            this.player.textnode = document.createTextNode(" / ");
            this.player.pslider = document.createElement('input');
            this.player.seektime = document.createElement('span');
            this.player.pduration = document.createElement('span');
            this.player.sliderdiv = document.createElement('div');
            this.player.timediv = document.createElement('div');
            this.player.controls = document.createElement('div');
            this.player.controlBox = document.createElement('div');
            this.player.volumeDiv = document.createElement('div');
            this.player.prev = document.createElement('button');
            this.player.playpause = document.createElement('button');
            this.player.next = document.createElement('button');
            this.player.volume = document.createElement('input');
            this.player.mutebtn = document.createElement('button');
            this.player.artimg = document.createElement('img');
            this.player.artimg.src = this.artimg;
            this.player.controlBox.classList.add("controlBox");
            this.player.controls.classList.add("controls");
            this.player.artimgdiv = document.createElement('div');
            this.player.artimg.classList.add("artimg");
            this.player.playpause.classList.add("playerbtn");
            this.player.prev.classList.add("playerbtn");
            this.player.next.classList.add("playerbtn");
            this.player.mutebtn.classList.add("playerbtn");
            this.player.sliderdiv.classList.add("slider");

            this.player.div.classList.add("player", "bottomPlayer");
            this.player.title = document.createElement('span');
            this.player.titleMarquee = document.createElement('div');
            this.player.titleDiv = document.createElement('div');
            // this.player.titleMarquee.classList.add("marquee");
            this.player.title.classList.add("title");
            this.player.titleDiv.classList.add("titlediv");
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
            this.player.playpause.addEventListener('click', function() {
                if (!me.audio.src) {
                    me.playNow(me.playlist[0]);
                } else if (me.audio.paused) {
                    me.play();
                } else {
                    me.pause();
                }
            }, false);

            this.player.prev.addEventListener('click', function() {
                me.prev();
            }, false);

            this.player.next.addEventListener('click', function() {
                me.next()
            }, false);


            this.player.mutebtn.innerHTML = me.pface.mute;
            this.player.mutebtn.addEventListener('click', function() {
                me.mute();
            }, false);

            this.player.prev.innerHTML = me.pface.previous;
            this.player.next.innerHTML = me.pface.next;

            this.player.title.innerHTML = "...";
            this.player.titleMarquee.appendChild(this.player.title);
            this.player.titleDiv.appendChild(this.player.titleMarquee);

            this.player.volumeDiv.classList.add("divin");
            this.player.volumeDiv.appendChild(this.player.mutebtn);
            this.player.volumeDiv.appendChild(this.player.volume);
            this.player.sliderdiv.appendChild(this.player.pslider);
            this.player.div.appendChild(this.player.sliderdiv);
            this.player.artimgdiv.appendChild(this.player.artimg)
            this.player.div.appendChild(this.player.artimgdiv);
            this.player.controlBox.appendChild(this.player.timediv);
            this.player.controlBox.appendChild(this.player.prev);
            this.player.controlBox.appendChild(this.player.playpause);
            this.player.controlBox.appendChild(this.player.next);
            this.player.controlBox.appendChild(this.player.volumeDiv);
            this.player.controls.appendChild(this.player.titleDiv);
            this.player.controls.appendChild(this.player.controlBox);
            this.player.div.appendChild(this.player.controls);
            this.parentEl = this.cplayerElemtnt.parentNode;
            this.parentEl.replaceChild(this.player.div, this.cplayerElemtnt);
        }

        init() {
            var me = this;
            this.pageTitle = document.title
            this.playlist = [];
            var oldPlayList = localStorage.getItem(window.location.hostname + "playlist");
            this.listElement = "playlist"; // document.createElement('div');
            oldPlayList = JSON.parse(oldPlayList)
            if (oldPlayList != null) {
                this.playlist = oldPlayList;
            }
            this.audio.addEventListener('loadeddata', function() {
                me.loaded = true;
                var duration = me.timeFormat(me.audio.duration);
                me.player.pduration.innerHTML = duration;
                me.player.pslider.max = me.audio.duration;
                me.audio.volume = me.player.volume.value;
            }, false);


            this.audio.addEventListener('timeupdate', function() {
                me.player.pslider.value = (me.audio.currentTime);
                var seek = me.timeFormat(me.audio.currentTime);
                me.player.seektime.innerHTML = seek;

            }, false);

            this.audio.addEventListener('error', function() {
                // console.log('error loading audio');
                me.addTitle('error loading audio');
                me.next();
            }, false);

            this.audio.onplaying = function() {
                me.player.playpause.innerHTML = me.pface.pause;
            };

            this.audio.onpause = function() {
                me.player.playpause.innerHTML = me.pface.play;
            };

            this.audio.onended = function() {
                me.player.playpause.innerHTML = me.pface.play;
                me.next();
            };


            this.player.pslider.oninput = function(e) {
                me.audio.currentTime = e.target.value;
            };

            this.player.volume.oninput = function(e) {
                me.audio.volume = this.value;
            };
        }

        playFile(nfile) {
            this.audio.src = nfile;
        }

        imageNotFound() {
            this.loadError = 1;
        }

        imageFound() {
            this.loadError = 0;
        }

        addImage(img) {
            var me = this;
            this.player.artimg.src = this.artimg;
            var tester = new Image();
            tester.onload = function() {
                me.player.artimg.src = img;
            }
            tester.onerror = function() {
                me.player.artimg.src = me.artimg;
            };
            tester.src = img;

        }

        addTitle(title) {
            this.player.title.innerHTML = title.toString();
            document.title = title.toString() + " - " + this.pageTitle;
        }

        playNow(obj) {
            this.playFile(obj.src);
            this.addImage(obj.img);
            this.addTitle(obj.title);
            this.addToPlayList(obj);
            this.nowPlayingIndex = this.playlist.findIndex(el => el.src === obj.src);
            this.src = obj.src;
            this.displayPlayList();
            this.play();
        }

        playNowIndex(index) {
            this.playNow(this.playlist[index]);
        }

        play() {
            this.audio.play();
        }

        pause() {
            this.audio.pause();
        }

        next() {
            if (this.playlist.length - 1 > this.nowPlayingIndex) {
                this.playNow(this.playlist[this.nowPlayingIndex + 1]);
            }
        }

        prev() {
            if (this.nowPlayingIndex > 0) {
                this.playNow(this.playlist[this.nowPlayingIndex - 1]);
            }
        }

        mute() {
            this.audio.muted = !this.audio.muted;
            if (this.audio.muted) {
                this.player.mutebtn.innerHTML = this.pface.unmute;
            } else {
                this.player.mutebtn.innerHTML = this.pface.mute;
            }

        }

        timeFormat(timeInSec) {
            var hour = parseInt(timeInSec / (60 * 60));
            var min = parseInt(timeInSec / 60) - hour * 60;
            var sec = parseInt(((timeInSec / 60) - parseInt(timeInSec / 60)) * 60);
            if (hour > 0 && min.toString().length <= 1) {
                min = "0" + min;
            }
            if (sec.toString().length <= 1) {
                sec = "0" + sec;
            }
            timeInSec = min + ":" + sec;
            if (hour > 0) {
                timeInSec = hour + ":" + min + ":" + sec;
            }
            return timeInSec;
        }

        volumeShow(toggle) {
            if (toggle) {
                this.player.volume.value = 1;
                this.player.volume.style.display = 'none';
            }
        }

        displayPlayList() {
            var html = '<div class="btnContainer"><a onclick="' + this.clearButton.onclick + '()" class="' +
                this.clearButton.class + '">Clear</a></div><div class="playlistswert"><table class="table">';
            this.playlist.forEach((item, index) => {
                var nowPlaying = ''
                if (index == this.nowPlayingIndex) {
                    nowPlaying = '<img class="playlistArtImg" src="' + item.img + '" onerror="this.src = cplayer.albumArt();"/>' + '<span class="playlistSpan"><i class="icono-play"></i></span>';
                } else {
                    nowPlaying = '<a href="javascript:" onclick="cplayer.playNowIndex(' + index + ')">' + '<img class="playlistArtImg" src="' + item.img + '" onerror="this.src = cplayer.albumArt();"/>' + '</a>';
                }
                html += '<tr>' +
                    '<td width="40px">' +
                    '<span class="playlistImg">' +
                    nowPlaying +
                    '</span>' +
                    '</td>' +
                    '<td>' +
                    '<a href="javascript:" onclick="cplayer.playNowIndex(' + index + ')">' +
                    item.title + '</a>' +
                    '</td>' +
                    '</tr>';

            });
            html += '</table></div>';

            document.getElementById(this.listElement).innerHTML = html;

        }

        getCurrentTrack() {
            if (this.nowPlayingIndex > -1 && this.playlist.length - 1 > this.nowPlayingIndex) {
                return this.playlist[this.nowPlayingIndex];
            }
            return null;
        }

        settings(options) {
            this.config = options;
            if (this.config.loadCSS) {
                this.loadCSS();
            }
            if (this.config.playlist) {
                this.listElement = this.config.playlist;
            }
            if (this.config.clearButton && this.config.clearButton.class) {
                this.clearButton.class = this.config.clearButton.class;
            }
            if (this.config.volume) {
                this.player.volume.value = this.config.volume / 100;
            }
            this.volumeShow(this.config.volumeHide);

            this.displayPlayList();

        }

        albumArt() {
            // return '/assets/favicons/apple-icon-60x60.png';
            return defaultalbumArt();
        }
    }

    var playerFace = {
        play: '<i class="icono-play"></i>',
        pause: '<i class="icono-pause"></i>',
        next: '<i class="icono-next"></i>',
        previous: '<i class="icono-previous"></i>',
        mute: '<i class="icono-volumeHigh"></i>',
        unmute: '<i class="icono-volumeMute"></i>'
    };

    function multiPlayer() {
        var els = Array.from(document.getElementsByTagName('cplayer'));
        var len = els.length;
        cp = [];
        els.forEach(function(element, i) {
            cp[i] = new CAPlay(element);
        });
    }
    window.cp = CAPlay.singlePlayer();
    // window.cplayer = CAPlay.singlePlayer();

}());

window.cplayer = {};

cplayer.settings = function(options) {
    cp.settings(options);
    cp.displayPlayList();
}

cplayer.playNow = function(obj) {
    cp.playNow(obj)
}

cplayer.playNowIndex = function(index) {
    cp.playNowIndex(index);
}

cplayer.addToPlayList = function(obj) {
    cp.addToPlayList(obj)
}

cplayer.clearPlaylist = function() {
    cp.clearPlaylist();
}

cplayer.getPlayList = function() {
    return cp.getplayList();
}

cplayer.play = function() {
    cp.play();
}

cplayer.pause = function() {
    cp.pause();
}

cplayer.next = function() {
    cp.next();
}

cplayer.prev = function() {
    return cp.prev();
}

cplayer.getCurrentTrack = function() {
    return cp.getCurrentTrack();
}

cplayer.albumArt = function() {
    cp.albumArt();
}

function defaultalbumArt() {
    return 'data:image/png;base64,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'
}