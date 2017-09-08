<template>
</template>

<script>
  import Vue from 'vue';
  import VueResource from 'vue-resource';

  Vue.use(VueResource);

  export default {
    name: 'data-loader',
    props: ['dataJson'],
    datas: [],

    data () {
      return {
        datasReady: false,
      }
    },

    created () {
      console.log('%cLoad Datas:', 'color: gray;', this.dataJson);
      this.getDatas('/static/datas/' + this.dataJson + '.json');
    },

    mounted () {
    },

    methods: {
      reloadDatas(json) {
        this.datasReady = false;
        this.getDatas('/static/datas/' + json + '.json');
      },

      onDatasLoaded(to, from) {
        console.log('%conDatasLoaded', 'color:green',  this.datas, to, from);
      },

      getDatas(file) {
        this.$http.get(file).then(response => {
 
          this.datas = response.body;
          this.datasReady = true;
       
        }, response => {
          console.warn('WARNING', response);
        });
      }
    },

    watch: {
      datasReady: function ( to, from ) {
        if (to === true)
          this.onDatasLoaded( to, from );
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
