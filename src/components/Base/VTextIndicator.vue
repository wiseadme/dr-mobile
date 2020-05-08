<template>
  <div class="indicator">
    <span :class="[`indicator__circle indicator__circle--${type}`]"></span>
    <span :class="['indicator__text', customClass]">{{ text }}</span>
  </div>
</template>
<script>
  export default {
    props: {
      text: {
        type: String
      },
      type: {
        type: String,
        default: 'scs'
      },

      customClass: {
        type: String
      }
    },
  }
</script>

<style lang="scss" scoped>
  .indicator {
    @include flexAlign(center, flex-start);
    width: 100%;
    padding: 5px;

    &__circle {
      flex: 0 0 15px;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin: 0 5px;

      &--dng {
        background: $red;
      }

      &--scs {
        background: $greenLight;
      }

      &--wrn {
        background: $orange;
      }
    }

    &__text {
      font-family: "Exo2-Regular", sans-serif;
      font-size: 14px;
      padding: 3px;
    }
  }


  .indicator {

    &-red {
      background: $red;
    }

    &-green {
      background: $greenLight;
    }

    &-orange {
      background: $orange;
    }
  }

</style>
