import {shallowMount, createLocalVue} from '@vue/test-utils';
import VueRouter from 'vue-router';

import {SEARCH_QUERY_KEY} from '../../constants';

import SearchBox from '../SearchBox.vue';

const assert = require('assert');

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('SearchBox', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SearchBox, {
      localVue,
      router,
    });
  });

  it('テキストボックスに入力した値が keyword になる', () => {
    assert(wrapper.vm.keyword === '');
    const textInput = wrapper.find('input[type="text"]');
    textInput.setValue('foo');
    assert(wrapper.vm.keyword === 'foo');
  });

  describe('submit したとき', () => {
    it('keyword が空文字のときはトップページ遷移する', () => {
      router.push('/abc');
      assert(wrapper.vm.keyword === '');
      assert(router.currentRoute.fullPath === '/abc');
      wrapper.find('form').trigger('submit');
      assert(router.currentRoute.fullPath === '/');
    });

    it('keyword が入力されているときは検索結果ページに遷移する', () => {
      wrapper.find('input[type="text"]').setValue('foo bar');
      assert(wrapper.vm.keyword === 'foo bar');
      router.push('/abc');
      assert(router.currentRoute.fullPath === '/abc');
      wrapper.find('form').trigger('submit');
      assert(
        router.currentRoute.fullPath === `/abc?${SEARCH_QUERY_KEY}=foo%20bar`
      );
    });
  });
});
