<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item is-size-4">
        <router-link to="/" class="has-text-dark">MyBookmark</router-link>
      </span>

      <!-- TODO: navbarBasicExample はサンプルコードからコピペしたものなので、修正する -->
      <a
        :class="{'is-active': isActiveBurger}"
        role="button"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click.prevent="toggleBurger"
      >
        <span aria-hidden="true" /> <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <!-- TODO: navbarBasicExample はサンプルコードからコピペしたものなので、修正する -->
    <div
      id="navbarBasicExample"
      :class="{'is-active': isActiveBurger}"
      class="navbar-menu"
    >
      <div v-if="authenticated" class="navbar-start">
        <!-- TODO: @closeBurger="closeBurger" は使わなくなったので削除してよいはず -->
        <a class="navbar-item"> <FileImport @closeBurger="closeBurger" /> </a>
      </div>

      <div v-if="authenticated" class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button is-danger">
              <strong @click="logout">ログアウト</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import {logoutApi} from '../api';
import {LOGIN_PAGE_PATH} from '../constants';

import FileImport from './FileImport.vue';

export default {
  components: {
    FileImport,
  },
  props: {
    authenticated: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isActiveBurger: false,
    };
  },
  methods: {
    toggleBurger() {
      this.isActiveBurger = !this.isActiveBurger;
    },
    closeBurger() {
      this.isActiveBurger = false;
    },
    async logout() {
      await logoutApi();
      window.location.href = LOGIN_PAGE_PATH;
    },
  },
};
</script>
