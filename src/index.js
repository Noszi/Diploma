const { ipcRenderer } = require('electron');

function openNav() {
	if (document.getElementById('myplaylist').style.width == '0px')
		document.getElementById('myplaylist').style.width = '285px';
	else document.getElementById('myplaylist').style.width = '0px';
}

function openSide() {
	if (document.getElementById('paylistSlidenav').style.width == '0px')
		document.getElementById('paylistSlidenav').style.width = '285px';
	else document.getElementById('paylistSlidenav').style.width = '0px';
}
/*
function openSide() {
  document.getElementById("paylistSlidenav").style.width = "285";
}
function closeSide() {
  document.getElementById("paylistSlidenav").style.width = "0";
}
*/

function initAudioPlayer() {
	var audio,
		playbtn,
		mutebtn,
		seekslider,
		volumeslider,
		seeking = false,
		seekto,
		curtimetext,
		durtimetext,
		openDialog,
		savelast20,
		disc,
		nextSong,
		prevSong,
		check;
	var index = 0;
	var crplaylist = [];

	// Set object references
	playbtn = document.getElementById('playpausebtn');
	mutebtn = document.getElementById('mutebtn');
	seekslider = document.getElementById('seekslider');
	volumeslider = document.getElementById('volumeslider');
	curtimetext = document.getElementById('curtimetext');
	durtimetext = document.getElementById('durtimetext');
	crplaylist = document.getElementById('crplaylist');
	disc = document.getElementsByClassName('center')[0];

	openDialog = document.getElementsByClassName('createpl')[0];
	savelast20 = document.getElementsByClassName('favorit')[0];

	nextSong = document.getElementById('nextBtn');
	prevSong = document.getElementById('prevBtn');

	//check = document.getElementById("checkbox");
	// Audio Object

	audio = new Audio();
	audio.onended = () => {
		playNext();
	};

	// Add Event Handling
	playbtn.addEventListener('click', playPause);
	mutebtn.addEventListener('click', mute);
	seekslider.addEventListener('mousedown', function(event) {
		seeking = true;
		seek(event);
	});
	seekslider.addEventListener('mousemove', function(event) {
		seek(event);
	});
	seekslider.addEventListener('mouseup', function() {
		seeking = false;
	});
	volumeslider.addEventListener('mousemove', setvolume);
	audio.addEventListener('timeupdate', function() {
		seektimeupdate();
	});
	audio.addEventListener('ended', function() {
		switchTrack();
	});

	//Shuffle.addEventListener("click",toggleShuffle);
	//check.addEventListener("checked",function(){ playchecked(); });

	openDialog.addEventListener('click', () => {
		ipcRenderer.send('openDialog');
	});

	ipcRenderer.on('selected-files', (event, args) => {
		crplaylist = args.files;
		args.files.map((path, i) => {
			var name = document.createElement('div');
			name.innerHTML = path.substring(path.lastIndexOf('\\') + 1, path.lastIndexOf('.'));
			var row = document.createElement('div');
			var number = document.createElement('div');
			number.innerHTML = (i + 1).toString();
			var checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			number.classList.add('index');
			name.classList.add('name');

			row.append(number);
			row.append(name);
			row.append(checkbox);

			row.classList.add('element');
			checkbox.classList.add('checkbox');

			//checkbox.className.add('check');
			/*   nem vagom miert nem mukodik
    name.classList.add('songname');
    index.classList.add('index1');
    checkbox.classList.add('check');
*/

			/* jo a kod , de valamiert nem mukodik
$("#bt2").click(function(){
  $('input:checkbox').not(this).prop('checked', this.checked);
});
*/

			row.addEventListener('click', () => {
				audio.src = path;
				index = i;
				playPause();
			});
			document.getElementById('crplaylist').append(row);
		});
	});

	/*function playchecked(){
  if(audio.checked){
  audio.play();
  }
  else{
    audio.pause();
  }
}
*/

	/* play checked
var audio = new Audio();
audio.oncanplay = function() {
  if (document.getElementById("checkbox").checked) this.play()
}
function myfunction(el) {    
  if (el.checked) {
    audio.load();
  }
}


function playNext() {
  audio.src = crplaylist[++index];
  playPause();
}

function toggleShuffle(crplaylist) {
  var ctr = crplaylist.length, temp, index;

// While there are elements in the array
  while (ctr > 0) {
// Pick a random index
      index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
      ctr--;
// And swap the last element with it 
      temp = crplaylist[ctr];
      crplaylist[ctr] = crplaylist[index];
      crplaylist[index] = temp;
  }
  return crplaylist;
}


*/

	// Functions

	//playpause
	function playPause() {
		disc.classList.toggle('rotate');
		if (audio.paused) {
			audio.play();
			playbtn.style.background = 'url(images/pause.png) no-repeat center';
		} else {
			audio.pause();
			playbtn.style.background = 'url(images/play.png) no-repeat center';
		}
	}
	//volume
	function mute() {
		if (audio.muted) {
			audio.muted = false;
			mutebtn.style.background = 'url(images/unmute.png) no-repeat center';
		} else {
			audio.muted = true;
			mutebtn.style.background = 'url(images/mute.png) no-repeat center';
		}
	}

	function seek(event) {
		if (seeking) {
			seekslider.value = event.clientX - seekslider.offsetLeft;
			seekto = audio.duration * (seekslider.value / 100);
			audio.currentTime = seekto;
		}
	}
	function setvolume() {
		audio.volume = volumeslider.value / 100;
	}

	//time
	function seektimeupdate() {
		var nt = audio.currentTime * (100 / audio.duration);
		seekslider.value = nt;
		var curmins = Math.floor(audio.currentTime / 60);
		var cursecs = Math.floor(audio.currentTime - curmins * 60);
		var durmins = Math.floor(audio.duration / 60);
		var dursecs = Math.floor(audio.duration - durmins * 60);
		if (cursecs < 10) {
			cursecs = '0' + cursecs;
		}
		if (dursecs < 10) {
			dursecs = '0' + dursecs;
		}
		if (curmins < 10) {
			curmins = '0' + curmins;
		}
		if (durmins < 10) {
			durmins = '0' + durmins;
		}
		curtimetext.innerHTML = curmins + ':' + cursecs;
		durtimetext.innerHTML = durmins + ':' + dursecs;
	}
}

window.addEventListener('load', initAudioPlayer);
