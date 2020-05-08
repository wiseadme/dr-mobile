export default {
  computed: {
    ...mapState({
      userObject: state => state.Auth.user
    }),

    calendar() {
      return this.userObject?.permissions?.calendar
    },

    cabinet() {
      return this.userObject?.permissions?.cabinet
    },

    user() {
      return this.userObject?.permissions?.user
    },

    messages() {
      return this.userObject?.permissions?.messages
    },

    notifications() {
      return this.userObject?.permissions?.notifications
    },

    permissions() {
      return this.userObject?.permissions
    }
  }
}
