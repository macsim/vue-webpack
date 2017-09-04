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
      <div class="popin-next" @click="onNext">next</div>
      <div class="popin-prev" @click="onPrevious">previous</div>
    </div>

    <ul class="popin-bullet-list">
      <li v-for="popin, index in datas">
        <button @click="onByIndex( index )">
          {{ index + 1 }}
        </button>
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

    data () {
      return {
        current: 1,
        popinIsOpen: false
      }
    },

    created () {
      console.log('%cCreated PopinList:', 'color: gray', this.dataJson);
    },

    methods: {
      onTogglePopin(e) {
        this.popinIsOpen = !this.popinIsOpen;
        this.$parent.popinIsOpen = !this.$parent.popinIsOpen;
      },

      onOpenPopin(e) {
        this.popinIsOpen = true;
      },

      onClosePopin(e) {
        this.popinIsOpen = false;
      },

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

        console.log('Load ' + value + ' Popin', this.current, input);

        this.current = input;

        this.onOpenPopin();
      },

      onPrevious() {
        this.navigate('prev');
      },

      onNext() {
        this.navigate('next');
      },

      onByIndex(index) {
        if (index === this.current) return;

        console.log('Load Popin by index: ', index);

        this.current = index;

        this.onOpenPopin();
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
<style scoped>

.popin-list {
  position: fixed;
  top: 0;
  left: 50%;
  background: red;
  z-index: 100;
}

  .popin-nav {
    position: fixed;
    z-index: 300;
  }
    .popin-next {}
    .popin-prev {}

  .popin-bullet-list {
    position: fixed;
    z-index: 200;
  }
    .popin-bullet {}
</style>
