import {shallowMount, createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';

import {LOGIN_PAGE_PATH} from '../../constants';

import Container from '../Container.vue';
import Header from '../Header.vue';
import Content from '../Content.vue';
import Login from '../Login.vue';

// https://vue-test-utils.vuejs.org/ja/guides/using-with-vuex.html
const localVue = createLocalVue();
localVue.use(Vuex);

const assert = require('assert');

const CONTENT_TYPE = null;
const BOOKMARK_TOTAL_COUNT = 2;
const ALL_TAGS = ['foo', 'bar'];
const SEARCH_CONDITION = {};
const BOOKMARK_LIST = {};

const factory = path => {
  const store = new Vuex.Store({
    state: {
      contentType: CONTENT_TYPE,
      bookmarkTotalCount: BOOKMARK_TOTAL_COUNT,
      allTags: ALL_TAGS,
      searchCondition: SEARCH_CONDITION,
      bookmarkList: BOOKMARK_LIST,
    },
  });
  const propsData = {
    path,
    query: {},
  };
  return shallowMount(Container, {
    propsData,
    store,
    localVue,
  });
};

describe('Container', () => {
  let wrapper;

  describe('props.path がログイン画面であるとき', () => {
    beforeEach(() => {
      wrapper = factory(LOGIN_PAGE_PATH);
    });

    it('Header の authenticated 属性の値が false', () => {
      assert.deepEqual(wrapper.find(Header).props('authenticated'), false);
    });
    it('Login コンポーネントが表示され、 Content コンポーネントは表示されない', () => {
      assert(wrapper.find(Login).exists());
      assert(!wrapper.find(Content).exists());
    });
    it('Login コンポーネントの props に空のオブジェクトを渡す', () => {
      assert.deepEqual(Object.keys(wrapper.find(Login).props()).length, 0);
    });
    it('footer が表示される', () => {
      assert(wrapper.find('footer').exists());
    });
  });

  describe('props.path がログイン画面でないとき', () => {
    beforeEach(() => {
      wrapper = factory('/');
    });

    it('Header の authenticated 属性の値が true', () => {
      assert.deepEqual(wrapper.find(Header).props('authenticated'), true);
    });
    it('Content コンポーネントが表示され、 Login コンポーネントは表示されない', () => {
      assert(wrapper.find(Content).exists());
      assert(!wrapper.find(Login).exists());
    });
    it('Content コンポーネントの props にコンテンツに関する情報を渡す', () => {
      const props = wrapper.find(Content).props();
      assert.deepEqual(props.contentType, CONTENT_TYPE);
      assert.deepEqual(props.bookmarkTotalCount, BOOKMARK_TOTAL_COUNT);
      assert.deepEqual(props.tags, ALL_TAGS);
      assert.deepEqual(props.searchCondition, SEARCH_CONDITION);
      assert.deepEqual(props.bookmarkList, BOOKMARK_LIST);
    });
    it('footer が表示される', () => {
      assert(wrapper.find('footer').exists());
    });
  });
});
