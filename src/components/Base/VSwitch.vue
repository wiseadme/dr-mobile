<template>
  <div :class="['switch', `switch--${on? 'on' : 'off'}`]" @click="toggleSwitch">
    <span :class="['switch__button', `switch__button-${on ? 'on' : 'off'}` ]">
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean
      }
    },
    data() {
      return {
        on: false
      }
    },

    created() {
      this.on = this.value
    },

    methods: {
      toggleSwitch() {
        this.on = !this.on
        this.$emit('switched', this.on)
      }
    },

    watch: {
      value(to) {
        this.on = to
      }
    }
  }
</script>

<style lang="scss">
  .switch {
    width: 60px;
    height: 15px;
    border-radius: 50px;
    position: relative;
    transition: background .2s ease-in;
    box-shadow: inset 0px 0px 6px 1px rgba(0,0,0,.5);

    &--off {
      background: $classicBlue;
    }

    &--on {
      background: #d4d4d4;
    }

    &__button {
      position: absolute;
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 50px;
      background: $classicGold;
      transition: all .2s ease-in;

      &-off {
        transform: translate(0, -2.5px);
      }

      &-on {
        transform: translate(40px, -2.5px);
        background: $blueLight;
      }
    }
  }
</style>
