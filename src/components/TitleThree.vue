<template>
  <div class="container" ref="container">
  </div>
</template>

<script>
import * as THREE from 'three';
import {
  FontLoader,
  PerspectiveCamera,
  Scene,
  Color,
  TextGeometry,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Mesh,
  WebGLRenderer
} from 'three';

import TrackballControls from '@/three/controls/TrackballControls';
import TessellateModifier from '@/three/modifiers/TessellateModifier';
import ExplodeModifier from '@/three/modifiers/ExplodeModifier';

import Detector from 'three/examples/js/Detector';
import vertexShader from '@/shaders/vertex.vs';
import fragmentShader from '@/shaders/fragment.fs';

import { TweenMax } from 'gsap';

var WIDTH, HEIGHT;
var renderer, scene, camera, stats, mesh, uniforms, controls, textGeometry, geometry;

var windowHalfX = 0;
var windowHalfY = 0;

export default {
  name: 'title-three',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
    }
  },
  watch: {
    text: function(a, b) {
      scene.remove(mesh);

      this.addItemToScene();
      this.animate();
    } 
  },
  mounted: function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var loader = new THREE.FontLoader();

    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;

    loader.load( '/static/fonts/helvetiker_bold.typeface.json', ( font ) => {

      this.font = font;
      this.init();
      this.animate();

    });
  },

  beforeDestroy() {
    window.removeEventListener( 'resize', this.onWindowResize, false );
  },

  methods: {
    init: function() {

      camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
      camera.position.set( 300, 200, 200 );

      controls = new TrackballControls( camera );

      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xEFEFEF );

      this.addItemToScene();

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( WIDTH, HEIGHT );

      var container = this.$refs.container;
      container.appendChild( renderer.domElement );

      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      window.addEventListener( 'resize', this.onWindowResize, false );
    },

    addItemToScene( ) {
      textGeometry = new THREE.TextGeometry( this.text, {

        font: this.font,

        size: 40,
        height: 1,
        curveSegments: 6,

        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: false

      });

      console.log('Geometry', textGeometry);

      textGeometry.center();

      var tessellateModifier = new TessellateModifier( 4 );

      for ( var i = 0; i < 6; i ++ ) {

        tessellateModifier.modify( textGeometry );

      }

      var explodeModifier = new ExplodeModifier();
      explodeModifier.modify( textGeometry );

      var numFaces = textGeometry.faces.length;

      //

      geometry = new THREE.BufferGeometry().fromGeometry( textGeometry );

      var colors = new Float32Array( numFaces * 3 * 3 );
      var displacement = new Float32Array( numFaces * 3 * 3 );

      var color = new THREE.Color();

      for ( var f = 0; f < numFaces; f ++ ) {

        var index = 9 * f;

        var h = 0.5 + (numFaces / index * 0.5 );
        var s = 0.5 + (numFaces / index * 0.5 );
        var l = 0.5 + (numFaces / index * 0.5 );

        // console.log(numFaces / index)

        color.setHSL( h, s, l );

        var d = 10 * ( 0.5 - Math.random() );

        for ( var i = 0; i < 3; i ++ ) {

          colors[ index + ( 3 * i )     ] = color.r;
          colors[ index + ( 3 * i ) + 1 ] = color.g;
          colors[ index + ( 3 * i ) + 2 ] = color.b;

          displacement[ index + ( 3 * i )     ] = d;
          displacement[ index + ( 3 * i ) + 1 ] = d;
          displacement[ index + ( 3 * i ) + 2 ] = d;

        }

      }

      geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
      geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );

      //

      uniforms = {

        amplitude: { value: 0.0 }

      };

      var shaderMaterial = new THREE.ShaderMaterial( {

        uniforms:       uniforms,
        vertexShader:   vertexShader,
        fragmentShader: fragmentShader

      });

      //

      mesh = new THREE.Mesh( geometry, shaderMaterial );

      scene.add( mesh );

      camera.lookAt(mesh.position);
    },

    onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    },

    animate() {
      var obj = {
        value: 1.0,
        x: -100,
        y: 200,
        z: -1000
      }
      TweenMax.to(obj, 2, {value: 0.0, x: -200, y: 350, z: 400, onUpdate: () => {
        camera.position.set(obj.x, obj.y, obj.z);
        
        uniforms.amplitude.value = obj.value * 1000;

        this.render();
      }, onComplete: () => {
        this.enterFrame();
      }});
    },

    enterFrame() {
      requestAnimationFrame( this.enterFrame );
      this.render();
    },

    render() {
      controls.update();

      renderer.render( scene, camera );

    }
  }
}
</script>

<style type="scss" scoped>
  .container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
