import Vue from 'vue';
import Vuex from 'vuex';

import {
  fetchBookmarkCountApi,
  fetchTagListApi,
  fetchBookmarkListApi,
} from './api';
import {
  CONTENT_TYPE_TOP,
  CONTENT_TYPE_SEARCH,
  CONTENT_TYPE_TAG,
  CONTENT_TYPE_TAG_AND_SEARCH,
  SEARCH_QUERY_KEY,
  PAGE_QUERY_KEY,
} from './constants';

Vue.use(Vuex);

// テストしやすくするために mutations 単体で export している
export const mutations = {
  setContentType(state, {path, query}) {
    const hasSearchKeyword =
      query[SEARCH_QUERY_KEY] && query[SEARCH_QUERY_KEY].length > 0;
    if (!hasSearchKeyword) {
      switch (true) {
        case path === '/':
          state.contentType = CONTENT_TYPE_TOP;
          break;
        case /^\/tag/.test(path):
          state.contentType = CONTENT_TYPE_TAG;
          break;
        default:
          state.contentType = null;
          break;
      }
      return;
    }
    switch (true) {
      case path === '/':
        state.contentType = CONTENT_TYPE_SEARCH;
        break;
      case /^\/tag/.test(path):
        state.contentType = CONTENT_TYPE_TAG_AND_SEARCH;
        break;
      default:
        state.contentType = null;
        break;
    }
  },
  setBookmarkTotalCount(state, {count}) {
    state.bookmarkTotalCount = count;
  },
  setAllTags(state, {tags}) {
    state.allTags = tags;
  },
  setSearchCondition(state, {path, query}) {
    const keyword =
      query[SEARCH_QUERY_KEY] && query[SEARCH_QUERY_KEY].length > 0
        ? query[SEARCH_QUERY_KEY]
        : null;
    const tags = /^\/tag/.test(path) ? path.split('/').slice(2) : [];
    state.searchCondition = {keyword, tags};
  },
  setBookmarkList(state, {bookmarkList}) {
    state.bookmarkList = bookmarkList;
  },
  setPage(state, {query}) {
    const page =
      query[PAGE_QUERY_KEY] && query[PAGE_QUERY_KEY].length !== ''
        ? Number(query[PAGE_QUERY_KEY])
        : 1;
    if (page === 0) {
      state.page = 1;
      return;
    }
    state.page = Number.isNaN(page) ? 1 : page;
  },
};

// テストしやすくするために actions 単体で export している
export const actions = {
  async fetchBookmarkTotalCount({commit}) {
    const res = await fetchBookmarkCountApi();
    commit('setBookmarkTotalCount', {count: res.result});
  },
  async fetchAllTags({commit}) {
    const res = await fetchTagListApi();
    commit('setAllTags', {tags: res.result});
  },
  async fetchBookmarkList({commit}, {searchCondition, page}) {
    const bookmarkList = await fetchBookmarkListApi(searchCondition, page);
    commit('setBookmarkList', {bookmarkList});
  },
};

export default new Vuex.Store({
  state: {
    contentType: CONTENT_TYPE_TOP,
    bookmarkTotalCount: null,
    allTags: null,
    searchCondition: {
      keyword: null,
      tags: [],
    },
    bookmarkList: {
      displayList: [],
      totalNumber: 0,
      page: {
        total: 1,
        current: 1,
      },
    },
    page: 1,
  },

  mutations,

  actions,
});
