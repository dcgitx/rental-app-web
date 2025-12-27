import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    if (to.meta.preserveScroll && savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/faqs',
      name: 'FAQs',
      component: () => import('../views/FaqsView.vue'),
    },
    {
      path: '/items/:slug',
      name: 'rental-items',
      //component: RentalItemsView,
      props: true,
    },
  ],
})

router.afterEach((to) => {
  const baseTitle = 'Your App Name'
  const pageTitle = to.meta.title

  document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle
})

export default router
