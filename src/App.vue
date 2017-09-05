<template>
  <div id="app">
    <transition
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:enter-cancelled="enterCancelled"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
      v-on:leave-cancelled="leaveCancelled"
    >
      <router-view :key='$route.fullPath'></router-view>
    </transition>

    <popin-list v-if="popinIsOpen" defaultIndex="3" dataJson="popin-list">
    </popin-list>
  </div>
</template>

<script>
import {TweenMax} from 'gsap';
import Popin from '@/components/Popin';
import PopinList from '@/components/PopinList';
import store from '@/actions/store.js';

export default {
  name: 'app',

  components: {Popin, PopinList},

  data () {
    return {
      store: store.state
    }
  },

  created() {
    this.duration = 0.8;
  },

  computed: {
    popinIsOpen: function() {
      return store.getState('popinIsOpen');
    }
  },

  methods: {
    // --------
    // ENTERING
    // --------
    beforeEnter: function (el) {
      if (this.transitionName === 'slide-right') {
        TweenMax.set(el, {zIndex: -1});
      } else {
        TweenMax.set(el, {zIndex: 1});
      }
    },

    enter: function (el, done) {

      var multi = (this.transitionName === 'slide-right') ? 1 : -1;

      if (this.transitionName === 'slide-right') {
        TweenMax.from(el, this.duration, {
          x: '0%',
          onComplete: done
        });
      } else if (this.transitionName === 'slide-from-top') {
        TweenMax.from(el, this.duration, {
          y: '100%',
          onComplete: done
        });
      } else {
        TweenMax.from(el, this.duration, {
          x: (100 * multi) + '%',
          onComplete: done
        });
      }

    },

    afterEnter: function (el) {

      // Need to clean props not remove on transition end
      TweenMax.set(el, {clearProps: 'all'});

    },

    enterCancelled: function (el) {

    },

    // --------
    // LEAVING
    // --------
    beforeLeave: function (el, a, b, c) {
      console.log('beforeLeave', el, a, b, c);
      if (this.transitionName === 'slide-right') {
        TweenMax.set(el, {zIndex: 1});
      } else {
        TweenMax.set(el, {zIndex: 0});
      }

    },

    leave: function (el, done) {

      var multi = (this.transitionName === 'slide-right') ? 1 : -1;

      if (this.transitionName === 'slide-right') {
        TweenMax.to(el, this.duration, {
          x: '-100%',
          onComplete: done
        });
      } else if (this.transitionName === 'slide-from-top') {
        TweenMax.to(el, this.duration, {
          y: '-150%',
          css: {
            top: '-50%',
            backgroundColor: '#666'
          }, 
          onComplete: done
        });
      } else {
        TweenMax.to(el, this.duration, {
          x: (100 * !multi) + '%',
          onComplete: done
        });
      }

    },

    afterLeave: function (el) {
      TweenMax.set(el, {clearProps: 'all'});
    },

    leaveCancelled: function (el) {

    }
  },

  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/');
      const fromDepth = from.path.split('/');
      const route = toDepth[1] + '=>' + fromDepth[1];

      console.log('Route', route, this);

      if (route === 'page=>') {

        this.transitionName = 'slide-right';

      } else if (route === 'page=>page') {

        this.transitionName = 'slide-from-top';

      } else {

        this.transitionName = 'slide-left';

      }

      this.transitionDuration = 10000;
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>
