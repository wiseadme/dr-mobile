<template>
  <div :class="['cabinet-layout', 'classic']">
    <Notify/>
    <DrNavigation
      v-if="showNav"
      :nav="nav"
    />
    <div v-else class="logout" @click="logout">
      <i class="material-icons">directions_run</i>
    </div>
    <div class="cabinet-route">
      <transition name="fadeIn" mode="out-in">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
  import DrNavigation from '@/components/DrNavigation'
  import Notify from '@/services/Notifications/Notify'
  import nav from '@/schemes/nav'

  export default {
    components: { Notify, DrNavigation },
    mixins: [],
    data() {
      return {
        nav
      }
    },

    methods: {
      ...mapActions({
        logoutUser: `Auth/${ action.LOGOUT_USER }`
      }),

      logout() {
        this.logoutUser().then(() => {
          this.$router.replace('/auth/login')
        })
      },
    },

    computed: {
      showNav() {
        return this.$route.path !== '/cabinet'
      }
    }
  }
</script>

<style lang="scss">
  .cabinet-layout {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .cabinet-route {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .logout {
    @include flexAlign(center, center);
    position: fixed;
    bottom: 7%;
    right: 5%;
    height: 50px;
    width: 50px;
    background: $classicBlue;
    border-radius: 50px;
    box-shadow: $boxShadow;
    z-index: 9999;

    .material-icons {
      color: $white;
    }
  }
</style>
