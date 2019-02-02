import {shallowMount} from '@vue/test-utils';

import {CONTENT_TYPE_TOP, SEARCH_QUERY_KEY} from '../../constants';

import Main from '../Main.vue';
import SearchBox from '../SearchBox.vue';
import BookmarkList from '../BookmarkList.vue';
import Pagination from '../Pagination.vue';

const assert = require('assert');

const TOTAL_COUNT = 20;
const TOTAL_NUMBER = 11;
const PAGE_CURRENT = 1;
const PAGE_END = 2;
const defaultProps = {
  contentType: CONTENT_TYPE_TOP,
  bookmarkTotalCount: TOTAL_COUNT,
  bookmarkList: {
    totalNumber: TOTAL_NUMBER,
    page: {
      current: PAGE_CURRENT,
      end: PAGE_END,
    },
  },
};

const factory = propsData =>
  shallowMount(Main, {
    propsData: {
      ...defaultProps,
      ...propsData,
    },
  });

describe('Main', () => {
  describe('SearchBox', () => {
    it('props.bookmarkTotalCount が Truthy のときは描画する', () => {
      const wrapper = factory({bookmarkTotalCount: 1});
      assert(wrapper.find(SearchBox).exists());
    });

    it('props.bookmarkTotalCount が Falsy のときは描画しない', () => {
      let wrapper = factory({bookmarkTotalCount: null});
      assert(!wrapper.find(SearchBox).exists());
      wrapper = factory({bookmarkTotalCount: 0});
      assert(!wrapper.find(SearchBox).exists());
    });
  });

  describe('headline', () => {
    it('props.bookmarkTotalCount が Falsy のときはブックマークが存在しない旨を表示する', () => {
      const NOT_EXIST_BOOKMARK_MESSAGE =
        'ブックマークが存在しません。ファイルをインポートしてださい。';
      let wrapper = factory({bookmarkTotalCount: null});
      assert(wrapper.find('h2').text() === NOT_EXIST_BOOKMARK_MESSAGE);
      wrapper = factory({bookmarkTotalCount: 0});
      assert(wrapper.find('h2').text() === NOT_EXIST_BOOKMARK_MESSAGE);
    });

    describe('props.bookmarkTotalCount が Truthy のとき', () => {
      it('headlineText が表示される', () => {
        const wrapper = factory({bookmarkTotalCount: 1});
        assert(
          wrapper
            .find('h2')
            .text()
            .includes(wrapper.vm.headlineText)
        );
      });

      it('props.bookmarkList.totalNumber が表示される', () => {
        const wrapper = factory({bookmarkTotalCount: 1});
        assert(
          wrapper
            .find('h2')
            .text()
            .includes(`${TOTAL_NUMBER}件`)
        );
      });
    });
  });

  describe('BookmarkList', () => {
    it('props.bookmarkList が渡される', () => {
      const propsBookmarkList = factory()
        .find(BookmarkList)
        .props('bookmarkList');
      assert(propsBookmarkList.totalNumber === TOTAL_NUMBER);
      assert(propsBookmarkList.page.current === PAGE_CURRENT);
      assert(propsBookmarkList.page.end === PAGE_END);
    });
  });

  describe('Pagination', () => {
    it('bookmarkList.totalNumber が 0 のときは描画されない', () => {
      const wrapper = factory({bookmarkList: {totalNumber: 0}});
      assert(!wrapper.find(Pagination).exists());
    });

    describe('exist-query', () => {
      it('searchCondition.keyword が Truthly のときはその値が渡される', () => {
        const wrapper = factory({searchCondition: {keyword: 'abc', tags: []}});
        assert(
          wrapper.find(Pagination).props('existQuery')[SEARCH_QUERY_KEY] ===
            'abc'
        );
      });

      it('searchCondition.keyword が Falsy のときは空のオブジェクトが渡される', () => {
        const wrapper = factory({searchCondition: {keyword: null, tags: []}});
        assert(
          Object.keys(wrapper.find(Pagination).props('existQuery')).length === 0
        );
      });
    });

    it('current には bookmarkList.page.current が渡される', () => {
      const propsCurrent = factory()
        .find(Pagination)
        .props('current');
      assert(propsCurrent === PAGE_CURRENT);
    });

    it('end には bookmarkList.page.total が渡される', () => {
      const propsEnd = factory()
        .find(Pagination)
        .props('end');
      assert(propsEnd === PAGE_CURRENT);
    });
  });
});
