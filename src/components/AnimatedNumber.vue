<template>
  <span>{{ tweeningValue }}</span>
</template>

<script>
export default {
  name: 'animated-number',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      var obj = {
        value: startValue
      };

      TweenLite.to(obj, 1, {value: endValue, ease: Power4.easeInOut, onUpdate: () => {
        console.log('update value', obj.value);

        this.tweeningValue = parseInt(obj.value, 10);
      }});
    }
  }
}
</script>
