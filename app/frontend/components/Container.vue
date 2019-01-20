<template>
  <div>
    <Header :authenticated="path !== LOGIN_PAGE_PATH" />
    <component :is="contentComponentName" v-bind="contentComponentProps" />
    <footer class="footer has-background-light">
      <div class="content has-text-centered">
        <p>
          Author
          <!-- eslint-disable prettier/prettier -->
          <a href="https://github.com/numb86" target="_blank" rel="noopener">@numb86</a>
          <!-- eslint-enable prettier/prettier -->
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import {mapState} from 'vuex';

import Header from './Header.vue';
import Content from './Content.vue';
import Login from './Login.vue';

import {LOGIN_PAGE_PATH} from '../constants';

export default {
  components: {
    Header,
    Content,
    Login,
  },
  props: {
    path: {type: String, default: ''},
    query: {type: Object, default: () => ({})},
  },
  data() {
    return {
      LOGIN_PAGE_PATH,
    };
  },
  computed: {
    ...mapState([
      'contentType',
      'bookmarkTotalCount',
      'allTags',
      'searchCondition',
      'bookmarkList',
    ]),
    contentComponentName() {
      return this.path === LOGIN_PAGE_PATH ? 'Login' : 'Content';
    },
    contentComponentProps() {
      if (this.path === LOGIN_PAGE_PATH) return {};
      return {
        'content-type': this.contentType,
        'bookmark-total-count': this.bookmarkTotalCount,
        tags: this.allTags,
        'search-condition': this.searchCondition,
        'bookmark-list': this.bookmarkList,
      };
    },
  },
};
</script>
