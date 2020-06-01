<template>
  <div :class="['cabinet']">
    <div class="logo">
      <img
        class="logo__img"
        :src="require(`../assets/images/logo-native.svg`)">
      <h1 :class="['logo__name', 'classic-color']">Demand Response Mobile</h1>
    </div>
    <div class="dashboard">
      <template v-for="it in dashboard">
        <div class="dash-item-wrap" :key="it.name" v-if="it.show">
          <router-link
            :class="['dashboard__item']"
            :to="it.link"
          >
            <div :class="['dashboard__icon-wrap', 'classic-border']">
              <i
                :class="['material-icons', 'dashboard__item-icon', 'classic-color']"
              >{{ it.icon }}</i>
            </div>
          </router-link>
          <span :class="['dashboard__item-name', 'classic-color']">{{ it.name }}</span>

        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import dashboard from '@/schemes/dashboard'
  import permissionsMixin from '@/components/mixins/permissions'
  import { fetchDevices } from '@/api'

  export default {
    mixins: [permissionsMixin],
    data() {
      return {
        dashboard,
        fetchDevices
      }
    },

    created() {
      this.dashboard.forEach(it => {
        this.$set(it, 'show', this.permissions[it.prop].isAllowed)
      })
    },

    methods: {
      ...mapMutations({
        setStyle: 'Style/SET_STYLE',
      }),

      routeTo(it) {
        if (it.link && this.$route.path !== it.link) {
          this.$router.push(it.link)
        }
      }
    }
  }
</script>

<style lang="scss">
  .cabinet {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 15vh;
  }

  .logo {
    width: 100%;
    margin: 20px auto;
    text-align: center;

    &__img {
      width: 200px;

    }

    &__name {
      padding: 15px 0;
      text-align: center;
    }
  }

  .dashboard {
    @include flexAlign(center, space-evenly);
    width: 400px;
    max-width: 90%;
    margin: auto;

    &__icon-wrap {
      @include flexAlign(center, center);
      width: 100px;
      height: 100px;
      border-radius: 15px;
    }

    &__item {
      @include flexAlign(center, center, column);
      width: 80px;
      height: auto;
      border-width: 2px;
      border-color: $white;
      text-decoration: none;
      position: relative;

      &-icon {
        font-size: 40px !important;
      }

      &-name {
        @include fontNun($white, 1em);
        padding: 10px 0;
        text-align: center;
        position: absolute;
        top: 100%;
      }
    }

    &__notify {
      @include fontNun($blue, 12px);
      font-weight: 800;
      position: absolute;
      border-radius: 50px;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 31px;
      top: -15px;
      left: calc(50% - 15px);
      background: $white;
      box-shadow: $boxShadow;
    }
  }

  .dash-item-wrap {
    @include flexAlign(center, center, column);
    position: relative;
  }

  .switch-block {
    @include flexAlign(center, center);
    position: fixed;
    bottom: 15%;
  }

  @media screen and(max-width: 440px) {
    .dashboard {
      width: 320px;

      &__icon-wrap {
        width: calc(100vw / 1920 * 350);
        height: calc(100vw / 1920 * 350);
      }
    }
    .logo {
      width: 150px;

      &__name {
        font-size: 12px;
        padding: 0;
      }
    }
  }
</style>

