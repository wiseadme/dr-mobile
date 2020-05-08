import Vue from 'vue'
import Router from 'vue-router'
import CabinetLayout from '@/layouts/CabinetLayout.vue'
import AuthPage from '@/pages/AuthPage'
import authState from '@/store/modules/Auth/state'
import { lStorage } from '@/utils'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/auth/login'
    },
    {
      path: '/auth',
      redirect: '/auth/login'
    },
    {
      path: '/auth/login',
      component: AuthPage
    },
    {
      path: '/auth/registration/:id',
      component: AuthPage
    },
    {
      path: '/auth/registration',
      component: AuthPage
    },
    {
      path: '/auth/password',
      component: AuthPage
    },
    {
      path: '/cabinet',
      component: CabinetLayout,
      children: [
        {
          path: '/',
          name: 'cabinet',
          component: () => import('@/pages/CabinetPage')
        },
        {
          path: '/cabinet/events',
          name: 'calendar',
          component: () => import('@/pages/CalendarPage')
        },
        {
          path: '/cabinet/events/:event',
          name: 'event',
          component: () => import('@/pages/CalendarPage')
        },
        {
          path: '/cabinet/profile',
          name: 'profile',
          component: () => import('@/pages/ProfilePage')
        },
        {
          path: '/cabinet/profile/users',
          name: 'users-list',
          component: () => import('@/pages/UsersPage')
        },
        {
          path: '/cabinet/notifications',
          name: 'notifications',
          component: () => import('@/pages/NotifyPage')

        },
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.path.includes('/auth')) {
    next(true)
  } else {
    setTimeout(() => {
      if (authState.token && lStorage('tokens')) {
        next(true)
      } else {
        next('/auth/login')
      }
    })
  }
})

export default router
