<template>
  <button @click.prevent="clickHandler" :class="['v-button', type, btnClass, {disabled}]">
    {{ text }}
  </button>
</template>

<script>
  export default {
    name: 'VButton',
    props: {
      text: {
        type: String
      },
      type: {
        type: String,
        default: 'info'
      },
      btnClass: {
        type: String
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      clickHandler() {
        if (this.disabled) return
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  $bcgWhite: #f4f4f4;
  $white: #fefefe;
  $red: #ff3851;
  $black: #171717;
  $green: #23a051;
  $blue: #063B87;
  $orange: #ff601e;

  .danger {
    background: $red;
  }

  .success {
    background: $green;
  }

  .info {
    background: $blue;
  }

  .warning {
    background-color: $orange;
  }

  .disabled {
    background: $grey;
    box-shadow: none !important;
  }

  .v-button {
    position: relative;
    height: 7.5vw;
    max-height: 40px;
    width: 100%;
    min-width: 120px;
    font-size: 0.8em;
    text-transform: uppercase;
    color: $white;
    cursor: pointer;
    border-radius: 3px;
    border: none;
    outline: none;
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.5);
    transition: box-shadow 0.3s ease;

    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    &:hover {
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.5);
    }

    &:hover:after {
      height: 100%;
      opacity: 0;
    }
  }
</style>
© 2020 GitHub, Inc.
