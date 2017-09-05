<template>
  <div :class="'strate-' + strate.theme">
   
    <div v-if="strate.enterAnimation" class="goto-prev" @click="$parent.gotoPrevLabel">Prev</div>
    <div v-if="strate.leaveAnimation" class="goto-next" @click="$parent.gotoNextLabel">Next</div>
    <div v-if="strate.theme === 'section'" class="logo"/>
    <div class="wording">
        <h1>{{ strate.name }}</h1>

        <h2>{{ strate.theme }}</h2>

        <p v-if="strate.enterAnimation">ENTER animation: <b>{{ strate.enterAnimation }}</b></p>

        <p v-if="strate.leaveAnimation">LEAVE animation: <b>{{ strate.leaveAnimation }}</b></p>

        <router-link class="nav-link" to="/page/number-one">Page Number One</router-link>

        <button @click="openPopin">Open Popin test</button>
      </div>
  </div>
</template>

<script>
  import AnimatedNumber from '@/components/AnimatedNumber';
  import store from '@/actions/store.js';

  export default {
    components: {AnimatedNumber},
    name: 'strate',
    props: ['strate'],

    methods: {
      openPopin: function() {
        store.setState('popinIsOpen', true);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
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
    color: #42b983;
  }
  .strate {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #EFEFEF;
    width: 100%;
    overflow: hidden;
    display: table;

    will-change: transform;
  }

  .strate .logo {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 150px;
    background: transparent;
    display: block;
    transform: rotate(45deg);
    border-radius: 100% 0 0 0;
    border: 3px solid #E5E5E5;
    border-width: 0px 10px 10px 0px;
    box-sizing: border-box;
  }

  .strate.strate-page {
    background: #CCC;
  }
  .strate.strate-section {
    z-index: 2;
  }
  .strate.strate-page img {
    top: auto;
    bottom: 0;
  }
  .strate .wording {
    padding: 200px;
    display: table-cell;
    vertical-align: middle;
    box-sizing: border-box;
  }

  .goto-prev {
    position: fixed;
    z-index: 100;
    left: 100px;
    width: 100px;
    height: 100px;
    background: black;
    color: white;
    line-height: 100px;
    text-align: center;
    cursor: pointer;
    top: 50%;
    margin-top: -50px;
    transform: rotate(-45deg);
    background: transparent;
    border: 1px solid black;
    border-width: 1px 0 0 1px;
    font-size: 0;
    line-height: 0;
  }
  .goto-next {
    position: fixed;
    z-index: 101;
    right: 100px;
    width: 100px;
    height: 100px;
    margin-top: -30px;
    background: black;
    color: white;
    line-height: 100px;
    text-align: center;
    cursor: pointer;
    top: 50%;
    margin-top: -50px;
    transform: rotate(-45deg);
    background: transparent;
    border: 1px solid black;
    border-width: 0 1px 1px 0;
    font-size: 0;
    line-height: 0;
  }

  .strate-page .goto-prev {
    transform: rotate(45deg);
    top: 100px;
    right: auto;
    left: 50%;
    margin-left: -50px;
  }

  .strate-page .goto-next {
    transform: rotate(45deg);
    top: auto;
    bottom: 100px;
    right: 50%;
    margin-right: -50px;
  }
</style>
