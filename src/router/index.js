import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskAddView from '../views/TaskAddView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
        {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/task/add/:auth',
      name: 'add',
      component: TaskAddView,
    },
  ]
})

export default router
