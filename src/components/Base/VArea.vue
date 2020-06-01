<template>
  <div class="v-area-wrap">
    <span :style="{color}" class="v-area-label">{{ label }}</span>
    <textarea
      @input="inputHandler"
      class="v-area"
      :placeholder="placeholder"
      :value="text || value"
    ></textarea>
    <span
      :style="{color: symbolsCount ? color: '' }"
      :class="['v-area-counter', {limit: !symbolsCount}]"
    >{{ `осталось символов ${symbolsCount}` }}</span>
  </div>
</template>

<script>
  export default {
    name: 'VArea',
    props: {
      placeholder: {
        type: String
      },
      limit: {
        type: [String, Number],
        default: 100
      },
      label: {
        type: String
      },
      value: {
        type: String
      },
      color: {
        type: String
      }
    },
    data() {
      return {
        text: '',
        symbolsCount: null
      }
    },

    created() {
      this.symbolsCount = +this.limit
    },

    methods: {
      inputHandler(e) {
        this.counter(e.target.value)
        if (e.target.value.length <= this.limit) {
          this.text = e.target.value
          return this.$emit('input', this.text)
        }
      },

      counter(text) {
        this.symbolsCount = this.limit - text.length
        if (this.symbolsCount < 0) {
          this.symbolsCount = 0
        }
      }
    },

    computed: {}
  }
</script>

<style lang="scss">
  .v-area-wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .v-area {
    @include fontNun($classicBlue, 14px);
    width: 100%;
    height: 100%;
    border: 1px solid $classicBlue;
    border-radius: 5px;
    padding: 5px;

    &::placeholder {
      color: #848c91;
      font-size: 12px;
    }

    &-counter {
      font-size: 12px;
      color: $classicBlue;
    }

    &-label {
      display: block;
      font-size: 12px;
      color: $classicBlue;
      padding: 5px 0;
      position: absolute;
      top: -20px;
    }
  }

  .limit {
    color: $red;
  }
</style>
