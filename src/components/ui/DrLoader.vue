<template>
  <transition name="fadeIn">
    <div class="preload" v-show="show">
      <div class="preload__spinner-wrap">
        <img class="preload__spinner" src="../../assets/images/preloader2.gif" alt="">
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  }

</script>

<style lang="scss" scoped>
  .preload {
    width: 100%;
    position: absolute;
    bottom: 13%;
    left: 0;
    @include flexAlign(center, center);

    &__spinner-wrap {
      position: relative;
      @include flexAlign(center, center);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: $white;
      box-shadow: $boxShadow;
      overflow: hidden;
      animation: loader 1s linear infinite;
    }

    &__spinner {
      position: absolute;
      left: -1%;
      transform: scale(3);
    }
  }
</style>
