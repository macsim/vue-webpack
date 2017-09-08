<template>
  <div  class="portfolio-wrapper">
    <div v-if="datasReady" class="portfolio">

      <div class="filter-list">
        <div>
          {{ currentFilterDatas.title }}
        </div>

        <div class="filter-item" @click="sortDirectionReverse">
          direction
        </div>

        <div class="filter-item" @click="toggleGridSize">
          toggle size
        </div>
      </div>

      <div class="filter-list">

        <div class="filter-item" @click="shuffle()">
          shuffle
        </div>

        <div class="filter-item" @click="sortBy('title')">
          Titre
        </div>

        <div class="filter-item" @click="sortBy('order')">
          Ordre
        </div>

        <div class="filter-item" @click="sortBy('year')">
          Année
        </div>
      </div>

      <div class="filter-list">
        <div v-for="item, index in datas.filters" class="filter-item" @click="setCurrentFilter(item.id)" :class="{current: isCurrentFilter(item.id)}">
          {{ item.title }}
        </div>
      </div>

      <transition-group name="portfolio-list" :class="{small: isGridSmall}" class="portfolio-list" tag="div">
        <div :key="item.id" v-for="item, index in itemsInSelectedCategorie(items, currentFilter)" class="portfolio-item" :class="item.className">
          <image-loader src="/static/assets/logo.png"></image-loader>
          {{ item.title }} - {{ item.year }} - {{ item.order }}
          <ul class="categorie-list">
            <li v-for="cat, index in item.categories" class="categorie-item"  :class="{current: isCurrentFilter(cat)}">{{ getCategorieById(cat).title }}</li>
          </ul>
        </div>
      </transition-group>
    </div>
    <div v-else class="portfolio-loading">
      LOADING...
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';
  import DataLoader from '@/components/DataLoader';
  import ImageLoader from '@/components/ImageLoader';
  import {findKey, shuffle, sortBy} from 'lodash';

  Vue.use(VueResource);

  export default {
    name: 'portfolio',
    extends: DataLoader,
    components: { ImageLoader },
    props: [ 'defaultFilter' ],

    data () {
      return {
        currentFilter: this.defaultFilter || 0,
        sortDirection: 0,
        gridSmall: 0,
        items: []
      }
    },

    created () {
      console.log('%cCreated Portfolio:', 'color: gray', this.dataJson, this.defaultFilter);
    },

    computed: {
      currentFilterDatas: function() {
        this.items = this.datas.items;
        return this.getCategorieById( this.currentFilter );
      },
      isGridSmall: function() {
        console.log('isGridSmall', this.gridSmall);
        return this.gridSmall;
      }
    },

    methods: {
      isCurrentFilter(index) {
        return this.currentFilter === index;
      },

      toggleGridSize: function() {
        this.gridSmall = !this.gridSmall;
      },

      shuffle () {
        this.items = this.datas.items;
        this.items = shuffle(this.items);
      },

      sortBy(properties) {
        this.items = this.datas.items;
        this.items = sortBy(this.items, properties).reverse();
      },

      sortDirectionReverse() {
        this.sortDirection = !this.sortDirection;

        this.items = this.items.reverse();
      },

      setCurrentFilter(newValue) {
        this.currentFilter = newValue;
      },

      getCategorieById(id) {
        return this.datas.filters[findKey(this.datas.filters, {id: id})];
      },

      itemsInSelectedCategorie(array, cat) {
        return array.filter(function (item) {
          return item.categories.indexOf(cat) !== -1;
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.portfolio {
  display: inline-block;
  line-height: 2;
  width: 930px;
  text-align: left;


  &-item {
    display: block;
    float: left;
    width: 300px;
    margin: 5px;
    height: auto;
    background: #EEE;
    box-sizing: border-box;
    vertical-align: top;
    transition: all 0.8s ease-in-out;
    text-align: center;

    &.col1on3 {
      width: 300px;
    }

    &.col2on3 {
      width: 610px;
    }

    &.col3on3 {
      width: 920px;
    }

    .portfolio-list.small & {
      width: 920px;
    }
  }
}

.portfolio-list-enter, .portfolio-list-leave-to
/* .portfolio-list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(1000px) scale(0.3);
}
.portfolio-list-leave-active {
  position: absolute;
}

.categorie,
.filter {
  &-list {
    text-align: center;
  }

  &-item {
    display: inline-block;
    font-size: 10px;
  }
}

.filter {
  &-list {
  
  }

  &-item {
    display: inline-block;
    font-size: 10px;
    padding: 6px 10px 0px;
    background: #EFEFEF;
    margin: 0 5px;
    border-radius: 3px;

    &.current {
      background: white;
    }
  }
}

.categorie {
  &-list {
    text-align: center;
    margin: 0;
    padding: 0;
  }

  &-item {
    display: inline-block;
    font-size: 10px;
    line-height: 10px;
    padding: 10px 10px 4px;
    background: #DDD;
    margin: 0 2px;
    border-radius: 3px;

    &.current {
      background: #CCC;
    }
  }
}

</style>
