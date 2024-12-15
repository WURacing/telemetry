import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('./views/Powertrain.vue') },
        { path: '/suspension', component: () => import('./views/RaceEngineer.vue') },
        ],
    })
    export default router
app.use(pinia)
app.use(router)
app.mount('#app')
