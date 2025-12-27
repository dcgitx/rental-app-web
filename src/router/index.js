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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/faqs',
      name: 'FAQs',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
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
