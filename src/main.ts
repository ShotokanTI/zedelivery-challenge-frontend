import { createApp } from 'vue'
import { createPinia } from 'pinia'

import "leaflet"
import "leaflet-draw"
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'

import App from './App.vue'
import router from './router'

import vSelect from "vue-select";

import Toast, { type PluginOptions } from "vue-toastification";
const options:PluginOptions  = {

}
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import 'vue-select/dist/vue-select.css';
import '@/style.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

import { faTwitter, faFacebook, faStackOverflow, faGithub,faLinkedin} from '@fortawesome/free-brands-svg-icons'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret,faTruck} from '@fortawesome/free-solid-svg-icons'


library.add(faTwitter, faFacebook, faStackOverflow, faGithub ,faUserSecret,faLinkedin,faTruck)

const app = createApp(App)


app.use(createPinia())
app.use(router)

app.use(Toast,options)

app.component('L',L)
app.component('font-awesome-icon', FontAwesomeIcon)
app.component("v-select", vSelect)

app.mount('#app')
