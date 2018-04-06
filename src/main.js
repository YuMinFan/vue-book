// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 导入轮播图插件
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)
import 'swiper/dist/css/swiper.css'

// 导入懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
        preLoad: 1.3,
        error: 'http://img5.imgtn.bdimg.com/it/u=4051829985,3623121798&fm=27&gp=0.jpg',
        loading: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522857896451&di=3d5d063389cbe4619fa2a7058e52c938&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01f9a1597707f5a8012193a35c6531.gif',
        attempt: 1
    })
    /* eslint-disable no-new */

// 在进入路由之前 每一次都会执行此方法 全局钩子
router.beforeEach(function(to, from, next) {
    document.title = to.meta.title;
    next();
})

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})