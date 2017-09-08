<template>
  <div class="nav">
    <div class="nav-wrapper">
      <div class="nav-close" @click="closeNav">
        close
        <span></span><span></span>
      </div>

      <div class="nav-header">
        <div v-if="datas.parent" @click="updateNav(datas.parent)">Return</div>
      </div>
      <ul class="nav-items">
        <li class="nav-item" v-for="item, index in datas.items">
          <span v-if="item.children" @click="updateNav(item.children)">{{ item.title }} - {{ index }}</span>
          <router-link v-else :to="item.url">{{ item.title }} - {{ index }}</router-link>
        </li>
      </ul>
    </div>
    <div class="nav-overlay" @click="closeNav"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';
  import DataLoader from '@/components/DataLoader';
  import store from '@/actions/store.js';

  Vue.use(VueResource);

  export default {
    name: 'navigation',
    extends: DataLoader,

    data () {
      return {
        datas: []
      }
    },

    created () {
      console.log('%Created Popin:', 'color: gray', this.dataJson);
    },

    methods: {
      closeNav(e) {
        store.setState('navIsOpen', false);
      },
      updateNav(data) {
        this.reloadDatas(data);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 200px;
  height: 100%;
}

</style>