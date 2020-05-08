<template>
  <div class="v-checkbox" @click="toggleCheckbox">
    <i class="material-icons v-checkbox__icon" :style="{color}">{{`check_box${checked ? '' : '_outline_blank'}`}}</i>
    <span v-if="label" class="v-checkbox__label" :style="{color}">{{label}}</span>
  </div>
</template>

<script>
  export default {
    name: 'VCheckbox',
    props: {
      label: {
        type: String,
        default: ''
      },
      item: {
        type: Object,
        default: () => {
        }
      },
      color: {
        type: String
      },
      isChecked: {
        type: Boolean,
        default: false
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        checked: false,
      }
    },
    created() {
      if (this.isChecked) {
        this.checked = true
      }
    },
    methods: {
      toggleCheckbox() {
        if (!this.disabled) {
          this.checked = !this.checked
          this.$emit('checked', this.item)
        }
      }
    },
    watch: {
      isChecked(to) {
        this.checked = to
      }
    }
  }
</script>

<style lang="scss" scoped>
  .v-checkbox {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    height: 16px;
    user-select: none;
    cursor: pointer;

    &__icon {
      color: $blue;
      font-size: 19px;
      outline: none;
    }

    &__label {
      font-size: 15px;
      margin-left: 8px;
    }
  }
</style>
