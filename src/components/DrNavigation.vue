<template>
  <nav :class="['nav']">
    <div class="nav__btn" @click="show = !show">
      <span class="nav__btn-icon"></span>
    </div>
    <template v-for="it in nav">
      <div
        v-if="it.show"
        :key="it.name"
        :class="['nav__item', {show}, {active: it.active}]"
        @click="routeTo(it)"
      >
        <i :class="['material-icons', 'nav__item-icon', {'active__icon': it.active}]">{{ it.icon }}</i>
      </div>
    </template>
  </nav>
</template>

<script>
  import permissionsMixin from './mixins/permissions'

  export default {
    props: {
      nav: {
        type: Array
      },
      role: {
        type: Object
      }
    },

    mixins: [permissionsMixin],

    data() {
      return {
        show: false
      }
    },

    created() {
      this.nav.forEach(it => {
        if (this.permissions[it.prop]?.isAllowed) {
          this.$set(it, 'show', true)
        }
      })
    },

    methods: {
      ...mapActions({
        logoutUser: `Auth/${ action.LOGOUT_USER }`
      }),

      routeTo(it) {
        this.nav.map(it => it.active = false)
        if (it.link && this.$route.path !== it.link) {
          this.$router.push(it.link)
        }
        if (!it.link) {
          this.logoutUser().then(() => {
            this.$router.replace('/auth/login')
          })
        }
        this.show = false
      }
    },

    watch: {
      '$route': {
        handler(to) {
          const key = to.path.split('/')[2]
          this.nav.forEach(it => {
            this.$set(it, 'active', !!(it.link && it.link.indexOf(key) >= 0))
          })
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss">
  .nav {
    @include flexAlign(center, center);
    height: 50px;
    width: 50px;
    position: fixed;
    z-index: 1000;
    bottom: 7%;
    right: 5%;
    border-radius: 50px;
    transition: all .2s;

    &__btn {
      @include flexAlign(center, center);
      position: absolute;
      z-index: 10;
      flex: 0 0 50px;
      width: 50px;
      height: 50px;
      border-radius: 50px;
      background: $white;
      box-shadow: $boxShadow;

      &-icon {
        display: block;
        width: 25px;
        height: 25px;
        background-image: url('../assets/images/logo.svg');
        background-size: cover;
        background-position: center center;
      }
    }

    &__item {
      @include flexAlign(center, center);
      position: absolute;
      top: 0;
      flex: 0 0 50px;
      width: 50px;
      height: 50px;
      border-radius: 50px;
      background: $white;
      opacity: 0;
      box-shadow: $boxShadow;
      transform: translateY(0);
      transition: all .2s ease-in;

      &-icon {
        color: $classicBlue;
      }
    }
  }

  .show {
    opacity: 1;

    &:nth-child(2) {
      z-index: 9;
      transform: translateY(-120%);
    }

    &:nth-child(3) {
      z-index: 8;
      transform: translateY(-240%);
    }

    &:nth-child(4) {
      z-index: 7;
      transform: translateY(-360%);
    }

    &:nth-child(5) {
      z-index: 7;
      transform: translateY(-480%);
    }

    &:nth-child(6) {
      z-index: 7;
      transform: translateY(-600%);
    }
  }

  .active {
    background: $blue !important;

    &__icon {
      color: $white;
    }
  }
</style>
