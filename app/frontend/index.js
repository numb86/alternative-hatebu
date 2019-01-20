import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';

import App from './components/App.vue';
import Container from './components/Container.vue';

import './sass/customize-bulma.sass';

import {LOGIN_PAGE_PATH} from './constants';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: Container,
      props: route => ({path: route.path, query: route.query}),
    },
  ],
  scrollBehavior: () => ({x: 0, y: 0}),
});

router.beforeEach(async (to, from, next) => {
  // URLが変わった際に必ず行う処理をここに書く

  if (to.path === LOGIN_PAGE_PATH) {
    next();
    return;
  }

  try {
    if (store.state.bookmarkTotalCount === null) {
      await store.dispatch('fetchBookmarkTotalCount');
      if (store.state.bookmarkTotalCount > 0) {
        await store.dispatch('fetchAllTags');
      }
    }

    const {path, query} = to;
    store.commit('setContentType', {path, query});
    if (store.state.contentType) {
      store.commit('setSearchCondition', {path, query});
      store.commit('setPage', {query});
      if (store.state.bookmarkTotalCount > 0) {
        await store.dispatch('fetchBookmarkList', {
          searchCondition: store.state.searchCondition,
          page: store.state.page,
        });
      }
      next();
    } else {
      next('/');
    }
  } catch (e) {
    if (e.message === '401') next(LOGIN_PAGE_PATH);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
});
