<template>
    <div ref="scrollArea" class="scroll-area">
      <div ref="strates" class="home">
          <strate :key="'strate-' + index" :class="strates.class + (strate.class ? ' ' + strate.class : '')" :strate="strate"  v-for="strate, index in strates.list"></strate>
      </div>
    </div>
</template>

<script>
import {TimelineMax, TweenMax} from 'gsap';
import Strate from '@/components/Strate';
export default {
  name: 'home',
  components: {Strate},

  currentIndex: 0,
  currentClass: '',
  lockMove: true,

  data () {
    return {
      index: 0,
      scrollY: 0,
      'msg': 'Welcome to Your Vue.js App',
      'strates': {
        'class': 'strate',
        'list': [
          {
            'name': 'Section 1',
            'theme': 'section',
            'leaveAnimation': 'slideToLeft'
          },
          {
            'name': 'page 1',
            'theme': 'page',
            'enterAnimation': 'slideFromRight',
            'leaveAnimation': 'slideToTop'
          },
          {
            'name': 'page 2',
            'theme': 'page',
            'enterAnimation': 'slideFromBottom',
            'leaveAnimation': 'slideToTop'
          },
          {
            'name': 'page 3',
            'theme': 'page',
            'enterAnimation': 'slideFromBottom',
            'leaveAnimation': 'slideToTop'
          },
          {
            'name': 'page 4',
            'theme': 'page',
            'enterAnimation': 'slideFromBottom',
            'leaveAnimation': 'slideToTop'
          },
          {
            'name': 'Section 2',
            'theme': 'section',
            'enterAnimation': 'slideFromBottom',
            'leaveAnimation': 'slideToLeft'
          },
          {
            'name': 'page 1',
            'theme': 'page',
            'enterAnimation': 'coverFrom',
            'leaveAnimation': 'slideToTop'
          },
          {
            'name': 'page 2',
            'theme': 'page',
            'enterAnimation': 'slideFromBottom'
          }
        ]
      }
    }
  },

  created () {

    this.animations = {
      slideFromRight:        {x: '100%'},
      slideFromLeft:         {x: '-100%'},
      slideFromBottom:       {y: '100%'},
      slideFromTop:          {y: '-100%'},

      slideToRight_50:       {x: '50%', delay: 1},
      slideToLeft_50:        {x: '-50%', delay: 1},
      slideToBottom_50:      {y: '50%', delay: 1},
      slideToTop_50:         {y: '-50%', delay: 1},

      slideToRight:          {x: '100%', delay: 1},
      slideToLeft:           {x: '-100%', delay: 1},
      slideToBottom:         {y: '100%', delay: 1},
      slideToTop:            {y: '-100%', delay: 1},

      cover:                 {x: '0%', delay: 1},
      coverFrom:             {x: '0%', autoAlpha: 0}

    };

  },

  methods: {

    onResize (e) {

      this.resizeViewport();

    },

    onWheel (e) {
      this.$refs.scrollArea.scrollTop += e.deltaY;
      this.onScroll();
    },

    onScroll (e) {
      this.scrollY = this.$refs.scrollArea.scrollTop;
      this.scrolled = this.scrollY > 0;
      this.time = Math.max(0, this.scrollY / this.maxScrollHeight * this.tl.totalDuration());
      this.tl.time(this.time);

    },

    gotoSibling (prev) {

      if (!this.isMoving) {

        var sib = this.tl['getLabel' + (prev ? 'Before' : 'After')](),
            time = this.tl.getLabelTime(sib);

        this.scrollTo(time, (prev ? 'floor' : 'ceil'), sib);
      }

      this.isMoving = true;

    },

    gotoNextLabel () {

      this.gotoSibling(false);

    },

    gotoPrevLabel () {

      this.gotoSibling(true);

    },

    scrollTo (time, mode, sib) {
      var obj = {scrollY: this.scrollY, time: this.time},
          pos = Math.min(this.maxScrollHeight, Math.max(0, Math[mode](time * this.maxScrollHeight / this.tl.totalDuration())));

      TweenMax.to(obj, 1, {scrollY: pos, time: time, onUpdate: () => {

        this.$refs.scrollArea.scrollTop =  obj.scrollY;

      }, onComplete: () => {

        this.isMoving = false;
        this.tl.tweenTo(sib);

      }});

    },

    initTimeline () {

      this.tl = new TimelineMax({align: 'start', onUpdate: () => {
        var label = this.tl.currentLabel();

        this.index = parseInt(label.replace('strate-', ''), 10);

      }});

      this.tl.pause();

      Array.from(this.$refs.strates.children).map((strate, index) => {

        if (strate.classList.contains(this.strates.class)) {

            var keyframes = [],
                theme = this.strates.list[index].theme,
                enter = this.strates.list[index].enterAnimation,
                leave = this.strates.list[index].leaveAnimation;

            if (theme === 'page') {

              keyframes = [
                {y: 300, delay: 0.5},
                {y: 400, delay: 0.5}
              ];

            } else {

              keyframes = [
                {y: -300, delay: 0.2},
                {y: 400, delay: 0.5}
              ];

              if (theme !== 'page' && strate.querySelector('.logo')) {
                TweenMax.set(strate.querySelector('.logo'), {x: '-50%'});
              }
            }


            this.tl.addLabel('strate-' + index, index);

            if (index > 0) {

              if (theme !== 'page' && strate.querySelector('.logo')) {

                this.tl.add(TweenMax.from(strate.querySelector('.logo'), 1, keyframes[0]), 'strate-' + index + '-=1');

              }

              this.tl.add(TweenMax.from(strate.querySelector('.wording'), 0.6, keyframes[1]), 'strate-' + index + '-=1.4');

              if (strate.querySelector('.goto-prev')) {
              
                this.tl.add(TweenMax.from(strate.querySelector('.goto-prev'), 0.5, {scale: 0.001, delay: 0.5}), 'strate-' + index + '-=1');
                this.tl.add(TweenMax.to(strate.querySelector('.goto-prev'), 0.5, {scale: 0.001, delay: 1}), 'strate-' + index + '-=1');

              }

              if (strate.querySelector('.goto-next')) {
              
                this.tl.add(TweenMax.from(strate.querySelector('.goto-next'), 0.5, {scale: 0.001, delay: 0.5}), 'strate-' + index + '-=1');
                this.tl.add(TweenMax.to(strate.querySelector('.goto-next'), 0.5, {scale: 0.001, delay: 1}), 'strate-' + index + '-=1');
              }

            }

            this.animateStrateEnterLeave(strate, index, enter, leave);
        }
      });

    },

    animateStrateEnterLeave (strate, index, enter, leave) {
      var duration = this.strates.list[index].duration || 1;

      if (index > 0) {

        this.tl.add(TweenMax.from(strate, enter === 'coverFrom' ? 0.0001 : duration, this.animations[enter]), 'strate-' + index + '-=' + duration);

      }

      if (index < this.strates.list.length - 1) {

        this.tl.add(TweenMax.to(strate, duration, this.animations[leave]), 'strate-' + index + '-=' + duration);

      }

    },

    resizeViewport () {

      this.scrollHeight = 0;

      Array.from(this.$refs.strates.children).map((strate, index) => {

        if (strate.classList.contains(this.strates.class)) {

          this.scrollHeight += strate.offsetHeight;

        }

      });

      this.$refs.strates.style.height = this.scrollHeight * 2 + 'px';
      this.maxScrollHeight = this.scrollHeight * 2 - window.innerHeight;

    }

  },

  mounted () {

    this.$refs.scrollArea.addEventListener('scroll', this.onScroll);
    this.$refs.scrollArea.addEventListener('wheel', this.onWheel, {passive: true});
    window.addEventListener('resize', this.onResize);

    this.onResize();
    this.initTimeline();
    this.onScroll();

  },

  beforeDestroy() {
    this.$refs.strates.style.height = window.innerHeight + 'px';
    this.$refs.scrollArea.removeEventListener('scroll', this.onScroll);
    this.$refs.scrollArea.removeEventListener('wheel', this.onWheel);
  },

  destroyed () {
    window.removeEventListener('resize', this.onResize);

  },
  watch: {
    'index' (newValue, oldValue) {
      console.log('Page index changed: %c' + this.strates.list[newValue].name + ' %c' + this.strates.list[oldValue].name, 'color: green;', 'color:red;text-decoration:line-through');

    },
    'scrollY' (newValue, oldValue) {
      // console.log('scrollY: %c' + newValue + ' %c' + oldValue, 'color: green;', 'color:red;text-decoration:line-through');

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .scroll-area {
    /*position: absolute;  USE THIS ONLY ON MOBILE */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    /*z-index: 1;*/

    will-change: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
