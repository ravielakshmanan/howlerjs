// Cache references to DOM elements.
var elts = ['station0', 'icon0', 'title0', 'live0', 'playing0', 
            'station1', 'icon1', 'title1', 'live1', 'playing1', 
            'station2', 'icon2', 'title2', 'live2', 'playing2', 
            'station3', 'icon3', 'title3', 'live3', 'playing3', 
            'station4', 'icon4', 'title4', 'live4', 'playing4',
            'station5', 'icon5', 'title5', 'live5', 'playing5',
            'station6', 'icon6', 'title6', 'live6', 'playing6',
            'station7', 'icon7', 'title7', 'live7', 'playing7'];
elts.forEach(function(elt) {
  window[elt] = document.getElementById(elt);
});

/**
 * Radio class containing the state of our stations.
 * Includes all methods for playing, stopping, etc.
 * @param {Array} stations Array of objects with station details ({title, src, howl, ...}).
 */
var Radio = function(stations) {
  var self = this;

  self.stations = stations;
  self.index = 0;
  
  // Setup the display for each station.
  for (var i=0; i<self.stations.length; i++) {
    window['title' + i].innerHTML = '<b>' + self.stations[i].title + '</b> ';
    window['station' + i].addEventListener('click', function(index) {
      var isNotPlaying = (self.stations[index].howl && !self.stations[index].howl.playing());
      
      // Stop other sounds or the current one.
      radio.stop();

      // If the station isn't already playing or it doesn't exist, play it.
      if (isNotPlaying || !self.stations[index].howl) {
        radio.play(index);
      }
    }.bind(self, i));
  }
};
Radio.prototype = {
  /**
   * Play a station with a specific index.
   * @param  {Number} index Index in the array of stations.
   */
  play: function(index) {
    var self = this;
    var sound;

    index = typeof index === 'number' ? index : self.index;
    var data = self.stations[index];

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: data.src,
        html5: true, // A live stream can only be played through HTML5 Audio.
        format: ['mp3', 'aac']
      });
    }

    // Begin playing the sound.
    sound.play();

    // Toggle the display.
    self.toggleStationDisplay(index, true);

    // Keep track of the index we are currently playing.
    self.index = index;
  },

  /**
   * Stop a station's live stream.
   */
  stop: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.stations[self.index].howl;

    // Toggle the display.
    self.toggleStationDisplay(self.index, false);

    // Stop the sound.
    if (sound) {
      sound.stop();
    }
  },

  /**
   * Toggle the display of a station to off/on.
   * @param  {Number} index Index of the station to toggle.
   * @param  {Boolean} state true is on and false is off.
   */
  toggleStationDisplay: function(index, state) {
    var self = this;

    // Highlight/un-highlight the row.
    window['station' + index].style.backgroundColor = state ? 'rgba(255, 255, 255, 0.33)' : '';

    // Show/hide the "live" marker.
    window['live' + index].style.opacity = state ? 1 : 0;

    // Show/hide the "playing" animation.
    window['playing' + index].style.display = state ? 'block' : 'none';
  }
};

// Setup our new radio and pass in the stations.
var radio = new Radio([
  {
    title: "BBC Asian Network",
    src: ['http://bbcmedia.ic.llnwd.net/stream/bbcmedia_asianet_mf_p'],
    howl: null
  },
  {
    title: "BBC Radio 1",
    src: ['http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p'],
    howl: null
  },
  {
    title: "BBC Radio 6",
    src: ['http://bbcmedia.ic.llnwd.net/stream/bbcmedia_6music_mf_p'],
    howl: null
  },
  {
    title: "Indie88",
    src: ['https://cob-ais.leanstream.co/CINDFM?args=web_01'],
    howl: null
  },
  {
    title: "KEXP",
    src: ['http://live-mp3-128.kexp.org/'],
    howl: null
  },
  {
    title: "Power 181",
    src: ['http://listen.livestreamingservice.com/181-power_128k.mp3', 'http://listen.livestreamingservice.com/181-power_64k.aac'],
    howl: null
  },
  {
    title: "Radio HSL",
    src: ['http://50.7.68.251:7064/stream'],
    howl: null
  },
  {
    title: "U.K. Top 40",
    src: ['http://listen.livestreamingservice.com/181-uktop40_128k.mp3', 'http://listen.livestreamingservice.com/181-uktop40_64k.aac'],
    howl: null
  }
]);
