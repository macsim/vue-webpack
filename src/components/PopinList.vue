<template>
  <div  v-if="datasReady" class="popin-list">
    <keep-alive>>
      <popin v-if="isCurrent( index )" v-for="popin, index in datas" :key="popin.id" :dataJson="('popin-' + popin.id)">

        <template slot="header" scope="props">
          <!-- {{  props.datas.title }} -->
          &nbsp;
        </template>

        <template slot="content" scope="props">

          <image-loader v-if="props.datas.img" :src="props.datas.img.src"></image-loader>

        </template>

        <template slot="footer" scope="props">
          <!-- {{  props.datas.title }} -->
          &nbsp;
        </template>
      </popin>
    </keep-alive>

    <div class="popin-nav">
      <div v-if="!isLast" class="popin-next" @click="onNext">next</div>
      <div v-if="!isFirst" class="popin-prev" @click="onPrevious">previous</div>
    </div>

    <ul class="popin-bullet-list">
      <li class="popin-bullet" :class="{current: isCurrent(index)}" v-for="popin, index in datas">
        <div class="button" @click="onByIndex( index )">
          {{ index + 1 }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';
  import DataLoader from '@/components/DataLoader';
  import Popin from '@/components/Popin';
  import ImageLoader from '@/components/ImageLoader';

  Vue.use(VueResource);

  export default {
    name: 'popin-list',
    extends: DataLoader,
    components: {Popin, ImageLoader},
    props: ['defaultIndex'],

    data () {
      return {
        current: parseInt(this.defaultIndex, 10) || 0
      }
    },

    created () {
      console.log('%cCreated PopinList:', 'color: gray', this.dataJson, this.defaultIndex);
    },

    computed: {
      isFirst() {
        return this.current === 0;
      },
      isLast() {
        return this.current === this.datas.length - 1;
      }
    },

    methods: {
      isCurrent(index) {
        return this.current === index;
      },
      currentId(index) {
        return this.datas[ index ].id;
      },

      currentLimited(v) {
        return Math.max(0, Math.min(this.datas.length - 1, v));
      },

      navigate(value) {
        const current = this.current;
        const input = this.currentLimited(current + (value === 'prev' ? -1 : 1));

        if (this.current === input) return;

        console.log('navigate ' + value + ' Popin', this.current, input);

        this.current = input;
      },

      onPrevious() {
        this.navigate('prev');
      },

      onNext() {
        this.navigate('next');
      },

      onByIndex(index) {
        if (index === this.current) return;

        console.log('onByIndex: ', index);

        this.current = index;
      },

      onChangeCurrent(to, from) {
        console.log('%conChangeCurrent from', 'color:orange', from, 'to', to);
      }
    },

    watch: {
      currentDatasReady: function ( to, from ) {
        // if (to === true)
          this.onDatasLoaded( to, from );
      },

      current: function ( to, from ) {
        this.onChangeCurrent( to, from );
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.popin-list {
  position: fixed;
  top: 0;
  left: 50%;
  background: red;
  z-index: 100;
}

.popin-prev,
.popin-next {
  position: fixed;
  width: 60px;
  height: 60px;
  top: 50%;
  z-index: 300;
  overflow: hidden;
  text-indent: 300px;
  cursor: pointer;

  &:before {
    position: absolute;
    width: 50%;
    height: 50%;
    display: block;
    content: " ";
    transform-origin: left top;
    transform: rotate(-45deg) translateX(-50%) translateY(-50%);
    top: 50%;
    border: 2px solid white;
  }
}
.popin-prev {
  left: 50%;
  margin-left: -550px;

  &:before {
    left: 60%;
    border-width: 2px 0 0 2px;
  }
}
.popin-next {
  right: 50%;
  margin-right: -550px;

  &:before {
    left: 40%;
    border-width: 0 2px 2px 0;
  }
}

.popin-bullet-list {
  position: fixed;
  z-index: 200;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  display: inline-block;
  margin: 0;
  padding: 0;
}

.popin-bullet {
  display: inline-block;
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;

  .button {
    display: block;
    position: relative;
    text-indent: 100px;
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding: 0;
    cursor: pointer;
    border: 0;
    border-radius: 50%;
    background: transparent;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;

      width: 50%;
      height: 50%;
      padding: 0;
      border-radius: 50%;
      border: 0;
      background: #CCC;
      cursor: pointer;
      border-radius: 50%;

      transform: translate(-50%, -50%);
    }
  }

  &.current .button:before {
    background: white;
  }
}
</style>
