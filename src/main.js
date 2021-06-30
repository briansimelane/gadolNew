import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
//import 'materialize-css/dist/js/materialize.min'
import '../src/styles/main.css'
import '../src/assets/reset.json'



import { projectAuth } from './firebase/config'

let app

projectAuth.onAuthStateChanged(() => {
    if(!app){
        app = createApp(App)
        .use(router)
        .mount('#app')
    }
})

