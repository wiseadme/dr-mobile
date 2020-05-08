<template>
  <div ref="wrap" class="v-select-wrap">
    <label
      :style="{color}"
      class="v-select-label"
    >{{ label }}</label>
    <div
      :class="['v-select', { disabled: disabled, 'v-select-focused': showItems }]"
      :style="{borderColor: color}"
    >
      <span class="v-select__pre-icon" v-if="preIcon">
        <i
          :style="{color}"
          :class="['material-icons icon']"
        >{{preIcon}}</i>
      </span>
      <input
        v-model="selected"
        :class="['v-select__input', {'v-select__input--cutLeft': preIcon}]"
        :placeholder="placeholder"
        :style="{color}"
        type="text"
        readonly="readonly"
      />
      <span class="v-select__drop-icon">
        <i :style="{color}" :class="['material-icons drop']">{{`keyboard_arrow_${showItems? 'up': 'down'}`}}</i>
      </span>
    </div>
    <transition name="dropDown" mode="out-in">
      <div class="list-wrap" v-show="items && showItems">
        <div class="list">
          <span
            v-for="it in items"
            :key="extKey ? it[extKey] : it"
            ref="items"
            class="list__item"
            @click="selectedItem(it)"
          >{{ extKey ? it[extKey] : it }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
      },
      label: {
        type: String,
      },
      placeholder: {
        type: String,
      },
      color: {
        type: String,
        default: () => ''
      },
      preIcon: {
        type: String,
      },
      disabled: {
        type: Boolean,
      },
      value: {
        type: [Object, String],
      },
      extKey: {
        type: String
      }
    },

    data() {
      return {
        showItems: false,
        selected: '',
        isClickedOnDoc: false,
        once: true
      }
    },

    created() {
      if (this.value) {
        this.selectedItem(this.value)
      }
      if (this.items.length === 1) {
        this.selectedItem(this.items[0])
      }
    },

    mounted() {
      this.$refs.wrap.addEventListener('click', this.toggleItemsShow)
      document.addEventListener('click', this.docClickHandle)
    },

    methods: {
      toggleItemsShow() {
        if (!this.disabled && !this.isClickedOnDoc) {
          this.showItems = !this.showItems
          setTimeout(() => (this.isClickedOnDoc = true), 0)
        }
      },

      docClickHandle() {
        if (this.showItems && this.isClickedOnDoc) {
          this.showItems = false
          this.isClickedOnDoc = false
        }
      },

      selectedItem(it) {
        this.selected = this.extKey && it ? it[this.extKey] : it
        this.$emit('input', it)
        this.once = false
      },
    },

    watch: {
      value(to) {
        if (to && this.once || !this.value && !this.selected) {
          this.selectedItem(to)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $blue: #004BC8;
  $white: #ffffff;
  $focused: $blue;
  $success: #22af43;
  $warning: #ffc31e;
  $danger: #ff3c0d;
  $fontColor: #191E32;
  $disFontColor: #9DA0AC;
  $labelFontColor: #737682;
  $disLabelFontColor: #9DA0AC;
  $plhColor: #A3A5AD;
  $borderColor: #cfd2e1;
  $disabledBackColor: #F4F4F5;
  $iconSize: 24px;

  .v-select-wrap {
    position: relative;
  }

  .v-select-label {
    position: absolute;
    /*left: 12px;*/
    font-family: "Exo2-Regular", sans-serif;
    top: 8px;
    z-index: 10;
    color: $labelFontColor;
    font-size: 12px;
    cursor: pointer;
  }

  .v-select {
    height: 52px;
    background: transparent;
    border-bottom: 1px solid #cfd2e1;
    /*border-radius: 3px;*/
    cursor: pointer;
    overflow: hidden;
    transition: border 0.1s linear;

    &-focused {
      border-color: $blue;
    }

    &__input {
      position: relative;
      width: calc(100% - 45px);
      outline: none;
      border: none;
      height: auto;
      font-size: 100%;
      background: transparent;
      cursor: pointer;
      padding: 25px 12px 5px;

      &--cutLeft {
        padding: 24px 12px 5px 35px;
        width: 100%;
      }

      &::placeholder {
        color: $plhColor;
        font-size: 14px;
        font-family: "Exo2-Regular", sans-serif;
      }
    }

    &__pre-icon {
      width: $iconSize;
      height: $iconSize;
      text-align: center;
      line-height: $iconSize;
      position: absolute;
      color: $blue;
      top: 40%;
      /*left: 10px;*/
      /*z-index: 5;*/
      /*border: 1px solid red;*/
    }

    &__drop-icon {
      width: $iconSize;
      height: $iconSize;
      position: absolute;
      text-align: center;
      top: 50%;
      right: 10px;
      color: $white;
      transform: translateY(-50%);
    }
  }

  .list-wrap {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    transform-origin: top;
    overflow: hidden;
    position: absolute;
    z-index: 999;
    top: 105%;
    width: 100%;
    height: auto;
    max-height: 200px;
    background: $white;
  }

  .list {
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;

    &__item {
      display: block;
      width: 100%;
      padding: 10px;
      color: #191e32;
      cursor: pointer;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.2px;

      &:hover {
        background: #f2f7fd;
      }
    }

    &::-webkit-scrollbar-button {
      width: 3px;
      height: 0px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      overflow: hidden;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $blue;
      border-radius: 50px;
    }

    &::-webkit-resizer {
      width: 2px;
      height: 0px;
      overflow: hidden;
    }

    &::-webkit-scrollbar {
      width: 2px;
      overflow: hidden;
    }
  }

  .icon {
    font-size: 18px;
    position: absolute;
    /*line-height: 100%;*/
    /*height: 100%;*/
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*border: 1px solid red;*/
  }

  .drop {
    font-size: 20px;
    position: absolute;
    /*line-height: 100%;*/
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .dropDown-enter,
  .dropDown-leave-to {
    opacity: 0;
    transform: rotateX(-90deg);
  }

  .dropDown-enter-active,
  .dropDown-leave-active {
    transition: all 0.2s linear;
  }
</style>
