<template>
  <div class="image-wrapper">
    <div v-show="!imageLoaded" ref="loader" class="image-loader">
      <canvas ref="canvas" width="200" height="200" class="canvas"></canvas>
      <p ref="loading">{{ percentLoaded }}</p>
    </div>

    <div v-show="imageLoaded" ref="image">
      <img class="image" ref="img" :src="src" :alt="alt"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {TImelineMax, TweenLite} from 'gsap';
  export default {
    name: 'image-loader',
    props: ['src', 'alt'],
    data () {
      return {
        imageLoaded: false,
        percentLoaded: 0
      }
    },
    created () {
      
    },
    mounted () {
      console.log('%cmounted image : ' + this.src, 'color: orange;');
      var duration = 0.8;
      var img = document.createElement('img');

      img.onload = (data) => {
          this.imageLoad(data, duration);
      };

      img.src = this.$refs.img.src;
    },
    methods: {
      imageLoad: function (data, duration) {
        console.log('imageLoad', this.imageLoaded, this.$el, data);

        this.canvasContext = this.$refs.canvas.getContext('2d');
        this.$refs.canvas.width = this.$refs.image.width || 200;
        this.$refs.canvas.height = this.$refs.image.height || 200;

        var loader = {loading: 0};
        var obj = {i: 0.0001, start: 1.5, radius: 40, stroke: 1};

        var first = 0;
        var tl = new TimelineMax({
          onUpdate: () => {
            console.log('update', this.percentLoaded, this.$refs.canvas.width, this.$refs.canvas.height);
          },
          ease: Elastic.easeOut
        });

        tl.from(obj, 1, {i: 1, start: 5, radius: 80, stroke: 40, ease: Sine.easeOut, onUpdate: (self) => {
          this.drawCanvas(this.$refs.canvas, obj.i, obj.start, obj.radius, obj.stroke);
        }, onUpdateParams: ['{self}']});
        tl.fromTo(this.$refs.loading, 0.2, {autoAlpha: 0, scale: 0, x: '-50%', y: '-50%'}, {autoAlpha: 1, scale: 1, x: '-50%', y: '-50%', ease: Power4.easeIn}, 0);
        tl.to(this.$refs.canvas, 0.2, {scale: 1.2, autoAlpha: 0, ease: Sine.easeOut}, 0.8);
        tl.to(this.$refs.loader, 0.1, {autoAlpha: 0, scale: 1, ease: Power4.easeIn}, 0.9);
        tl.pause();

        TweenLite.set(this.$refs.image, {autoAlpha: 0, scale: 0.5});
        TweenLite.set(this.$refs.loader, {autoAlpha: 1, scale: 1});

        TweenLite.to(loader, 0.8, {loading: 100, onUpdate: () => {
          this.percentLoaded = loader.loading.toFixed(0);
          tl.time(loader.loading / 100);
        }, onComplete: () => {
          this.imageLoaded = true;
          TweenLite.to(this.$refs.image, 0.5, {autoAlpha: 1, scale: 1, delay: 0.1});
          tl.time(100);
        }});
      },

      drawCanvas: function(canvas, interval, start, radius, stroke) {
        var context = this.canvasContext;
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var end = start - (interval * 2);
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(centerX, centerY, radius, start * Math.PI, end * Math.PI, false);
        context.lineWidth = stroke;
        context.strokeStyle = '#CCC';
        context.stroke();
      },

      drawBezier: function(canvas, obj) {
        var context = this.canvasContext;
        var ch = this.$refs.canvas.height;

        context.beginPath();
        context.moveTo(obj.sx, obj.sy);
        context.quadraticCurveTo(obj.c1x, obj.c1y, obj.c2x, obj.cY);
        context.quadraticCurveTo(obj.c3x, obj.c3y, obj.ex, obj.ey);
        context.lineTo(cw, ch);
        context.lineTo(0, ch);
        context.closePath();

        context.lineWidth = obj.stroke;
        context.fillStyle = "#CCC";
        context.strokeStyle = '#CCC';

        context.fill();
        context.stroke();
      }
    },
    watch: {
      'imageLoaded' (newImage, oldImage) {
        if (newImage !== oldImage) {
          console.log('image has changed - new Image laded: %c' + newImage + ' %c' + oldImage, 'color:green;font-weight:bold;', 'color:red;text-decoration: line-through;');
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.image-wrapper {
  position: relative;
    width: 200px;  
    height: 200px;
  display: block;
  margin: 20px auto;
  background-color: rgba(255,255,255, 0.2);
}
.image-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.image-loader p {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  color: #CCC;
  font-size: 18px;
}
</style>
