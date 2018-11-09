
import Vue from 'vue';

window.Event = new Vue();

Vue.component('records', {

   template: `

   <div>

      <section v-for="self in records" class="tune">

         <transition name="player" tag="div">
   
            <player class="player" v-show="self.showPlayer">
            
               <h2>{{ self.title }}</h2>

               <audio :id="self.id" :src="self.src"></audio>
               <div class="controls">
                  <i data-skip="-3" class="fas fa-fast-backward"></i>
                  <i class="fas fa-stop"></i>
                  <i class="fas pp fa-play"></i>
                  <i data-skip="2" class="fas fa-fast-forward"></i>
               </div>


             </player>
         
         </transition>

         <div class="tune-list">
            <i class="far pp fa-play-circle" @click="showPlayer(self, $event)"></i>
            <h2>{{ self.title }}</h2>
            <!-- <p>{{ self.description }}</p> --> 
            <div class="waveform">
               <!-- <progress class="progress progress-striped" value="0" max="100"></progress> --> 
            </div>
         </div> <!-- tune-list -->

      </section> <!-- tune -->

   </div>

   `,

   data() {

      return {

         records: [
            { 
               title: 'Tune1',
               description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
               src: './files/tune1.mp3',
               playing: '',
               showPlayer:'' 
            },
            { 
               title: 'Tune2',
               description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
               src: './files/tune2.mp3',
               playing: '',
               showPlayer:'' 
            },
            { 
               title: 'Tune3',
               description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
               src: './files/tune3.mp3',
               playing: '',
               showPlayer:'' 
            }
         ]

      }

   },

   created() {

      this.reset();

      Event.$on('close', this.reset );

      // // let $this = this;
      // window.addEventListener('keydown', function(e) {
      //    if (e.keyCode === 32) {
      //       let activePlayer = document.querySelector('.player.active');
      //       if(!activePlayer) return;
      //       let activeAudio = activePlayer.querySelector('audio');

      //       activeAudio.paused ?  activeAudio.play() : activeAudio.pause();
      //       
      //       // console.log(this);
      //       // console.log($this);
      //    }
      // });
      // 
   },

   methods: {

      reset() {
         this.records.forEach( self => {
            self.showPlayer = false;
         });
      },

      // audio(e) {
      //    let audio = e.target.closest('.tune').querySelector('audio');
      //    return audio;
      // },

      showPlayer(self, e) {

         // let audio = this.audio(e);

            if(!self.showPlayer) {
               // Array.from(document.querySelectorAll('audio'))
               //    .filter((anotherAudio) => anotherAudio !== audio)
               //    .forEach( anotherAudio => {
               //       anotherAudio.pause();
               //       anotherAudio.currentTime = 0;
               //    });
               this.reset();
               self.showPlayer = true;
            }

      },

      // stop(self, e) {
      //    let audio = this.audio(e);
      //    audio.pause();
      //    audio.currentTime = 0;
      //    self.playing = false;
      // },
      
   }

});

Vue.component('player', {

   template: `
   
      <div :id=this.id>

             <div class="container">

                <slot></slot>

               <div class="progress-wrap">
                     <div class="progress-bar"></div>
               </div>
   
               <div class="volume">
                   <i class="fas fa-volume-up"></i>
                   <input type="range" name="volume" min="0" max="1" step="0.05" value="1" autocomplete="off">
               </div>

                <span class="close" @click="closePlayer">x</span>

            </div>

      </div>

   `,

   data() {
      return {
         id : ''
      }
   },

   mounted() {
      this.id = this._uid;
   },

   methods: {

      closePlayer(e) {
         Event.$emit('close');

         let audio = e.target.parentNode.querySelector('audio');
         audio.pause();
         audio.currentTime = 0;
      }

   }

});

new Vue({

   el: '#root'

});




let wavesurfers = [];

document.querySelectorAll('.tune').forEach(tune => {

   let player = tune.querySelector('.player');
   let progress = player.querySelector('.progress-wrap');
   let audio = player.querySelector('audio');
   let ranges = player.querySelectorAll('input[type="range"]');
   let skipButtons = player.querySelectorAll('[data-skip]');

   let pp = tune.querySelectorAll('.pp');
   let pp1 = tune.querySelector('.player .pp');
   let pp2 = tune.querySelector('.tune-list .pp');
   let stop = tune.querySelectorAll('.fa-stop');
   let src = audio['src'];
   let waveform = tune.querySelector('.waveform');

   // audio.ontimeupdate = function(){
   //    player.querySelector('.progress-bar').style.width = audio.currentTime / audio.duration * 100 + '%';
   // }
   
   // progress.addEventListener('click', function(e) {
   //    audio.currentTime = (e.offsetX / progress.offsetWidth ) * audio.duration;
   // });

   
   // console.log(WaveSurfer);
   var wavesurfer = WaveSurfer.create({
       container: waveform,
       // waveColor: linGrad,
      progressColor: 'hsla(200, 100%, 30%, 0.5)',
      cursorColor: '#fff',
      barWidth: 2,
      barHeight: 5,
      height: 70
      // hideScrollbar: true
   });

   wavesurfer.load(src);

   wavesurfers.push(wavesurfer);

   pp.forEach(button => button.addEventListener('click', function() {
      wavesurfers.forEach( eachwave => {
         if(eachwave!==wavesurfer) {
            eachwave.pause();
            // eachwave.setCurrentTime(0);
            // handleProgress();
         }
      });
      wavesurfer.playPause();
   }));


   function togglePp() {
      pp1.className = wavesurfer.isPlaying() ? 'fas pp fa-pause' : 'fas pp fa-play';
      pp2.className = wavesurfer.isPlaying() ? 'far pp fa-pause-circle' : 'far pp fa-play-circle';
   }
   wavesurfer.on('play', togglePp );
   wavesurfer.on('pause', togglePp );


   function handleProgress() {
      player.querySelector('.progress-bar').style.width = wavesurfer.getCurrentTime() / wavesurfer.getDuration() * 100 + '%';
      // player.querySelector('.progress-bar').style.width = `${wavesurfer.getCurrentTime() / wavesurfer.getDuration() * 100}%`;
   }

   wavesurfer.on('audioprocess', handleProgress );

   function scrub(e) {
      wavesurfer.setCurrentTime( (e.offsetX / progress.offsetWidth ) * wavesurfer.getDuration() );
   }

   progress.addEventListener('click', function(e) {
      scrub(e);
      handleProgress();
   });

   let mousedown = false;
   progress.addEventListener('mousedown', () => mousedown = true);
   progress.addEventListener('mouseup', () => mousedown = false);
   progress.addEventListener('mouseleave', () => mousedown = false);
   progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
   

   waveform.addEventListener('click', function() {
      setTimeout(handleProgress, 10);
   });


   stop.forEach(button => button.addEventListener('click', function() {
      wavesurfer.pause();
      wavesurfer.setCurrentTime(0);
      handleProgress();
   }));

   function skip() {
      wavesurfer.setCurrentTime( wavesurfer.getCurrentTime() + parseFloat(this.dataset.skip));
      // console.log(audio.currentTime);
      handleProgress();
   }

   skipButtons.forEach(button => button.addEventListener('click', skip));


   function handleRangeUpdate() {
      wavesurfer.setVolume( this.value );
   }

   ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
   ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

   // // let $this = this;
   // window.addEventListener('keydown', function(e) {
   //    if (e.keyCode === 32) {
   //       wavesurfers.forEach( eachwave => {
   //          if( eachwave === wavesurfer ) {
   //             wavesurfer.isPlaying() ?  wavesurfer.pause() : wavesurfer.play();
   //          }
   //       });

   //    }
   // });

   // wavesurfer.on('loading', function (percents) {
   //    player.parentNode.querySelector('.progress').value = percents;
   // });
   //  wavesurfer.on('ready', function (percents) {
   //    player.parentNode.querySelector('.progress').style.display = 'none';
   //  });

   // wavesurfer.on('ready', function () {
   //     wavesurfer.play();
   // });

      
})

// console.log(wavesurfers);



