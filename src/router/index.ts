import { createRouter, createWebHistory } from 'vue-router'
import ProductSelectionView from '../views/ProductSelectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'product-selection',
      component: ProductSelectionView
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/selection',
      name: 'selection',
      component: ProductSelectionView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/local',
      name: 'local-stores',
      component: () => import('../views/LocalStoresView.vue')
    },
    {
      path: '/local/product/:id',
      name: 'local-product-detail',
      component: () => import('../views/LocalProductDetail.vue'),
      props: true
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetail.vue'),
      props: true
    },
    // Redirigir rutas no encontradas a la página de inicio
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
