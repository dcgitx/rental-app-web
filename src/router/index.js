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
      meta: {
        title: 'About',
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: {
        title: 'Privacy',
      },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
      meta: {
        title: 'Terms',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        title: 'Login',
      },
    },
    {
      path: '/oauth/google/callback',
      name: 'GoogleOAuthCallback',
      component: () => import('@/views/OAuthCallback.vue'),
    },
    {
      path: '/faqs',
      name: 'FAQs',
      component: () => import('../views/FaqsView.vue'),
      meta: {
        title: 'FAQs',
      },
    },
    {
      path: '/rentals',
      name: 'rentals',
      component: () => import('../views/rentals/Rentals.vue'),
      meta: {
        title: 'Rentals',
      },
    },
    {
      path: '/rental/:id',
      name: 'rental.show',
      component: () => import('@/views/rentals/RentalShow.vue'),
    },
    {
      path: '/items/:slug',
      name: 'item.show',
      component: () => import('@/views/rentalItems/ShowRentalItem.vue'),
    },
    {
      path: '/categories/:slug',
      name: 'rental-items',
      component: () => import('@/views/Placeholder.vue'),
    },
  ],
})

router.afterEach((to) => {
  const baseTitle = 'Rent Locally'
  const pageTitle = to.meta.title

  document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle
})

export default router
