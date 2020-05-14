<template>
  <div class="v-area-wrap">
    <span class="v-area-label">{{ label }}</span>
    <textarea
      @input="inputHandler"
      class="v-area"
      :placeholder="placeholder"
    ></textarea>
    <span
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
        this.text = e.target.value
        this.counter()
        if (this.symbolsCount) {
          this.$emit('input', this.text)
        }
      },

      counter() {
        this.symbolsCount = this.limit - this.text.length
        if (this.symbolsCount <= 0) {
          return this.symbolsCount = 0
        }
      }
    }
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
    }
  }

  .limit {
    color: $red;
  }
</style>
