import HomeView from '@/views/HomeView.vue'
import { onAuthStateChanged } from 'firebase/auth';
import { createRouter, createWebHistory } from 'vue-router'
import { useFirebaseAuth } from 'vuefire';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/admin/propiedades',
          name: 'admin-propiedades',
          component: () => import('@/views/admin/AdminView.vue'),
        },
        {
          path: '/admin/nueva',
          name: 'admin-nueva',
          component: () => import('@/views/admin/NuevaPropiedadView.vue'),
        },
        {
          path: '/admin/editar/:id',
          name: 'admin-editar',
          component: () => import('@/views/admin/EditarPropiedadView.vue'),
        },
      ]
    }
  ],
})

// Guard de navegacion
router.beforeEach( async (to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth);
  if (requiresAuth) {
    // Comprobar si el usuario está autenticado
    try {
      await authenticateUser();
      next();
    } catch (error) {
      console.log(error);
      next({ name: 'login' });
    }

  } else {
    // Si la ruta no requiere autenticación, simplemente continuamos
    next();
  }
  
});

function authenticateUser() {
  const auth = useFirebaseAuth();

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      unsubscribe(); // Detener la escucha una vez que se ha verificado el estado de autenticación

      if(user) {
        resolve(user);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  });
}

export default router
