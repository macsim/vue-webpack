<template>
  <div class="page" :class="id ? 'page-' + id : 'page-default'">
    <div class="page-inner">
      <canvas ref="canvas" width="200" height="200" class="canvas"></canvas>

      <div ref="loader" class="page-loader">
        <h1>{{ percentLoaded }}</h1>
      </div>  

      <div ref="content">
        <h2>{{ id || 'All Pages'}}</h2>

        <router-link class="nav-link" to="/">Home</router-link>
        <router-link v-if="$route.path !== '/page'" class="nav-link" to="/page">Pages</router-link>
        <router-link v-if="$route.path !== '/page/number-one'" class="nav-link" to="/page/number-one">Page Number One</router-link>
        <router-link v-if="$route.path !== '/page/number-two'" class="nav-link" to="/page/number-two">Page Number Tow</router-link>

        <portfolio dataJson="portfolio" defaultFilter="web"></portfolio>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Portfolio from '@/components/Portfolio';
  import {TImelineMax, TweenLite} from 'gsap';
  import store from '@/actions/store.js';

  export default {
    name: 'page',
    props: ['id'],
    components: {Portfolio},
    data () {
      return {
        pageLoaded: false,
        percentLoaded: 0
      }
    },
    created () {
      
    },
    mounted () {
      console.log('%cmounted page', 'color: red;');

      this.pageLoad();
    },
    methods: {
      openPopin: function() {
        store.setState('popinIsOpen', true);
      },

      pageLoad: function () {
        console.log('pageLoad', this.pageLoaded, this.$el);
        var loader = {loading: 0};
        var obj = {i: 0.0001, start: 1.5, radius: 90, stroke: 1};
        var tl = new TimelineMax({
          onUpdate: () => {
            if (this.$refs.canvas) {
              this.drawBezier(this.$refs.canvas, bezier);
            }
          },
          ease: Power2.easeInOut
        });

        var bezierStart = {};

        var bezier = {
          stroke: 3,
          sx: window.innerWidth * 0,
          sy: window.innerHeight * 0,
          c1x: window.innerWidth * 0.2,
          c1y: window.innerHeight * 1,
          c2x: window.innerWidth * 0.4,
          c2y: window.innerHeight * 0.4,
          c3x: window.innerWidth * 0.6,
          c3y: window.innerHeight * 0,
          ex: window.innerWidth * 1,
          ey: window.innerHeight * -0.4
        };

        var bezierStep2 = {
          stroke: 3,
          sx: 0,
          sy: window.innerHeight * 0.4,
          c1x: window.innerWidth * 0.2,
          c1y: window.innerHeight * 0.6,
          c2x: window.innerWidth * 0.4,
          c2y: window.innerHeight * 0.5,
          c3x: window.innerWidth * 0.6,
          c3y: window.innerHeight * 0.1,
          ex: window.innerWidth * 1,
          ey: window.innerHeight * 0.4,
          ease: Sine.easeOut
        };

        var bezierEnd = {
          stroke: 1,
          sx: 0,
          sy: window.innerHeight * 1.2,
          c1x: window.innerWidth * 0.1,
          c1y: window.innerHeight * 1.5,
          c2x: window.innerWidth * 0.3,
          c2y: window.innerHeight * 1,
          c3x: window.innerWidth * 0.4,
          c3y: window.innerHeight * 1.7,
          ex: window.innerWidth * 1,
          ey: window.innerHeight * 1.9,
          ease: Sine.easeIn
        };

        Object.assign(bezierStart, bezier);

        this.$refs.canvas.width = window.innerWidth;
        this.$refs.canvas.height = window.innerHeight;

        tl.to(bezier, 0.20, bezierStart);
        tl.to(bezier, 0.50, bezierStep2);
        tl.to(bezier, 0.30, bezierEnd);
        

        tl.to(this.$refs.canvas, 0, {scale: 1.2, autoAlpha: 0, ease: Sine.easeOut}, 1);
        tl.to(this.$refs.loader, 0.1, {autoAlpha: 0, scale: 0, ease: Power4.easeIn}, 0.9);
        tl.pause();

        TweenLite.set(this.$refs.content, {autoAlpha: 0, scale: 0.5});
        TweenLite.set(this.$refs.loader, {autoAlpha: 1, scale: 1});

        TweenLite.to(loader, 3.8, {loading: 100, onUpdate: () => {
          this.percentLoaded = loader.loading.toFixed(0);
          tl.time(loader.loading / 100);
        }, onComplete: () => {
          this.pageLoaded = true;

          if (this.$refs.content) {
            TweenLite.to(this.$refs.content, 0.5, {autoAlpha: 1, scale: 1, delay: 0.1});
          }
          tl.time(100);
        }});
      },

      drawBezier: function(canvas, obj) {
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.moveTo(obj.sx, obj.sy);
        context.quadraticCurveTo(obj.c1x, obj.c1y, obj.c2x, obj.cY);
        context.quadraticCurveTo(obj.c3x, obj.c3y, obj.ex, obj.ey);
        context.lineTo(window.innerWidth, window.innerHeight);
        context.lineTo(0, window.innerHeight);
        context.closePath();

        context.lineWidth = obj.stroke;
        context.fillStyle = "#AAA";
        context.strokeStyle = '#AAA';

        context.fill();
        context.stroke();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    color: #CCC;
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: white;
    margin: 10px;
  }

  .page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #333;
    padding: 100px;
    overflow-y: scroll;
    display: block;

    box-sizing: border-box;
  }

  .page-default {
    background: #DDD;
  }

  .page-default a,
  .page-default h2 {
    color: #666;
  }

  .page-default h1 {
    color: #AAA;
  }

  .page-loader {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    text-align: center;
    line-height: 100px;
  }
  .page-loader h1 {
    margin: 0;
  }

  .page-inner {
    display: inline-block;
    text-align: center;
    vertical-align: middle;
  }

  .nav-link {
    display: inline-block;
    line-height: 2;
  }

  /*.canvas {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -100px 0 0 -100px;
  }*/

  .canvas {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
  }
</style>
