import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'
// import Form from '@/containers/form/form'

// Views
import Dashboard from '@/views/Dashboard'

// Views - Components
import Form from '@/views/forms/testForm'
import Collapses from '@/views/base/Collapses'
import Tooltips from '@/views/base/Tooltips'
import users from '@/views/admin/users'
import roles from '@/views/admin/roles'

// Views - Pages
import Page404 from '@/views/pages/Page404'
import Page500 from '@/views/pages/Page500'
import Login from '@/views/pages/Login'
import Register from '@/views/pages/Register'

Vue.use(Router)

export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      meta: { requiresAuth: true },
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/form/:id?',
          name: 'form',
          component: Form
        },
        {
          path: 'base',
          redirect: '/base/collapses',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'admin',
          redirect: '/admin/roles',
          name: 'Admin',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'roles',
              name: 'Roles',
              component: roles
            },
            {
              path: 'users',
              name: 'Users',
              component: users
            }
          ]
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      meta: { requiresAuth: false },
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          meta: { requiresAuth: false },
          component: Register
        }
      ]
    }
  ]
})
