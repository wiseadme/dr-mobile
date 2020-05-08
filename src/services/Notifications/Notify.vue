<template>
  <transition-group mode="out-in" tag="div" move-class="move" class="notify-wrap" name="fadeIn">
    <template v-for="(it, i) in all">
      <div :class="['notify', it.type]" :data-id="it.id" :key="it.type + i" v-if="it.show">
        <div class="notify__icon">
          <i :class="['material-icons', 'notify__icon-font', `notify__icon-${it.type}`]">
            {{
            it.type === 'success' ? 'check_circle' : it.type === 'warning' ? 'report_problem' : it.type === 'danger' ?
            'error': 'info'
            }}
          </i>
        </div>
        <div class="notify__message">
          <span :class="['notify__message-text', `notify__message-text--${it.type}`]">{{ it.message }}</span>
        </div>
      </div>
    </template>
  </transition-group>
</template>

<script>
  import { events } from './index'

  export default {
    data() {
      return {
        all: [],
      }
    },
    mounted() {
      events.$on('add', (params) => {
        this.all.push(params)
        setTimeout(() => this.destroyNotify(params.id), params.duration)
      })
    },
    methods: {
      destroyNotify(id) {
        let found = this.all.findIndex(it => it.id === id)
        this.all[found].show = false
        let flag = this.all.every(it => !it.show)
        if (flag) {
          setTimeout(() => this.all = [], 0)
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
  $bcgWhite: #f4f4f4;
  $white: #fefefe;
  $red: #ff3851;
  $black: #272727;
  $green: #23a051;
  $blue: #1349ff;
  $orange: #dd9400;
  $darkBlue: #040424;

  .notify-wrap {
    position: fixed;
    z-index: 9999;
    width: 290px;
    bottom: 5%;
    left: calc(50% - 145px);
    padding: 0 10px;

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

  .notify {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 10px 0;
    width: 270px;
    height: 90px;
    border: 4px solid rgba(0, 0, 0, 0.2);
    border-radius: 7px;
    box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.3);

    &__icon {
      position: relative;
      width: 35px;
      height: 35px;
      border-radius: 50%;

      &-font {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, - 50%);
        font-size: 2em;
        line-height: 10px;
        color: $white;
      }
    }

    &__message {
      width: 80%;

      &-text {
        @include fontExo($white, 12px);
      }
    }
  }

  .warning {
    background: $orange;
  }

  .info {
    background: $blue;
  }

  .success {
    background-color: $green;
  }

  .danger {
    background: $red;
  }

  .fadeIn-enter, .fadeIn-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }

  .fadeIn-enter-active, .fadeIn-leave-active {
    transition: all .3s ease-in-out;
  }

  .fadeIn-move, .move {
    transition: transform .3s ease-in-out;
  }
</style>
