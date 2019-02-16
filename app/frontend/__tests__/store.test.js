import {mutations, actions} from '../store';

import {
  CONTENT_TYPE_TOP,
  CONTENT_TYPE_SEARCH,
  CONTENT_TYPE_TAG,
  CONTENT_TYPE_TAG_AND_SEARCH,
  SEARCH_QUERY_KEY,
  PAGE_QUERY_KEY,
} from '../constants';

const assert = require('assert');

const createState = props => ({
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
  ...props,
});

describe('store', () => {
  describe('mutations', () => {
    describe('setContentType', () => {
      describe('検索クエリがついていない場合', () => {
        it('path が / なら state.contentType が CONTENT_TYPE_TOP になる', () => {
          const state = createState({contentType: null});
          assert(state.contentType === null);
          mutations.setContentType(state, {path: '/', query: {}});
          assert(state.contentType === CONTENT_TYPE_TOP);
        });

        it('path が /^/tag/ にマッチするなら state.contentType が CONTENT_TYPE_TAG になる', () => {
          const state = createState();
          assert(state.contentType === CONTENT_TYPE_TOP);
          mutations.setContentType(state, {path: '/tag', query: {}});
          assert(state.contentType === CONTENT_TYPE_TAG);
        });

        it('path が上記いずれのケースにも当てはまらないなら state.contentType が null になる', () => {
          const state = createState();
          assert(state.contentType === CONTENT_TYPE_TOP);
          mutations.setContentType(state, {path: '/ta', query: {}});
          assert(state.contentType === null);
        });
      });

      describe('検索クエリがついている場合', () => {
        it('path が / なら state.contentType が CONTENT_TYPE_SEARCH になる', () => {
          const state = createState();
          assert(state.contentType === CONTENT_TYPE_TOP);
          mutations.setContentType(state, {
            path: '/',
            query: {[SEARCH_QUERY_KEY]: 'foo'},
          });
          assert(state.contentType === CONTENT_TYPE_SEARCH);
        });

        it('path が /^/tag/ にマッチするなら state.contentType が CONTENT_TYPE_TAG_AND_SEARCH になる', () => {
          const state = createState();
          assert(state.contentType === CONTENT_TYPE_TOP);
          mutations.setContentType(state, {
            path: '/tag',
            query: {[SEARCH_QUERY_KEY]: 'foo'},
          });
          assert(state.contentType === CONTENT_TYPE_TAG_AND_SEARCH);
        });

        it('path が上記いずれのケースにも当てはまらないなら state.contentType が null になる', () => {
          const state = createState();
          assert(state.contentType === CONTENT_TYPE_TOP);
          mutations.setContentType(state, {
            path: '/ta',
            query: {[SEARCH_QUERY_KEY]: 'foo'},
          });
          assert(state.contentType === null);
        });
      });
    });

    describe('setBookmarkTotalCount', () => {
      it('引数に渡された count が state.bookmarkTotalCount に代入される', () => {
        const state = createState();
        mutations.setBookmarkTotalCount(state, {count: 9});
        assert(state.bookmarkTotalCount === 9);
      });
    });

    describe('setAllTags', () => {
      it('引数に渡された tags が state.allTags に代入される', () => {
        const state = createState();
        mutations.setAllTags(state, {tags: ['foo', 'bar']});
        assert(state.allTags[0] === 'foo' && state.allTags[1] === 'bar');
      });
    });

    describe('setSearchCondition', () => {
      describe('検索クエリがついていない場合', () => {
        describe('path が /^/tag/ にマッチする場合', () => {
          it('state.searchCondition が {keyword: null, tags: タグのリストが入った配列} になる', () => {
            const state = createState({searchCondition: {keyword: 1, tags: 2}});
            mutations.setSearchCondition(state, {
              path: '/tag/hoge/fuga',
              query: {},
            });
            const {keyword, tags} = state.searchCondition;
            assert(
              keyword === null && tags[0] === 'hoge' && tags[1] === 'fuga'
            );
          });
        });

        describe('path が /^/tag/ にマッチしない場合', () => {
          it('state.searchCondition が {keyword: null, tags: []} になる', () => {
            const state = createState({searchCondition: {keyword: 1, tags: 2}});
            mutations.setSearchCondition(state, {
              path: '/ta/hoge/fuga',
              query: {},
            });
            const {keyword, tags} = state.searchCondition;
            assert(
              keyword === null && Array.isArray(tags) && tags.length === 0
            );
          });
        });
      });

      describe('検索クエリがついている場合', () => {
        describe('path が /^/tag/ にマッチする場合', () => {
          it('state.searchCondition が {keyword: 検索ワード, tags: タグのリストが入った配列} になる', () => {
            const state = createState({searchCondition: {keyword: 1, tags: 2}});
            mutations.setSearchCondition(state, {
              path: '/tag/hoge/fuga',
              query: {[SEARCH_QUERY_KEY]: 'foo'},
            });
            const {keyword, tags} = state.searchCondition;
            assert(
              keyword === 'foo' && tags[0] === 'hoge' && tags[1] === 'fuga'
            );
          });
        });

        describe('path が /^/tag/ にマッチしない場合', () => {
          it('state.searchCondition が {keyword: 検索ワード, tags: []} になる', () => {
            const state = createState({searchCondition: {keyword: 1, tags: 2}});
            mutations.setSearchCondition(state, {
              path: '/ta/hoge/fuga',
              query: {[SEARCH_QUERY_KEY]: 'foo'},
            });
            const {keyword, tags} = state.searchCondition;
            assert(
              keyword === 'foo' && Array.isArray(tags) && tags.length === 0
            );
          });
        });
      });
    });

    describe('setBookmarkList', () => {
      it('引数に渡された bookmarkList が state.bookmarkList に代入される', () => {
        const state = createState();
        mutations.setBookmarkList(state, {
          bookmarkList: {page: {total: 5, current: 3}},
        });
        const {total, current} = state.bookmarkList.page;
        assert(total === 5 && current === 3);
      });
    });

    describe('setPage', () => {
      it('page が 1 以上の数字なら、その値の数値型が state.page に代入される', () => {
        const state = createState({page: 2});
        mutations.setPage(state, {query: {[PAGE_QUERY_KEY]: '9'}});
        assert(state.page === 9);
      });

      it('page が 0 なら、 1 が state.page に代入される', () => {
        const state = createState({page: 2});
        assert(state.page !== 1);
        mutations.setPage(state, {query: {[PAGE_QUERY_KEY]: '0'}});
        assert(state.page === 1);
      });

      it('page が渡されなかったなら、 1 が state.page に代入される', () => {
        const state = createState({page: 2});
        assert(state.page !== 1);
        mutations.setPage(state, {query: {}});
        assert(state.page === 1);
      });

      it('page が数字以外なら、 1 が state.page に代入される', () => {
        const state = createState({page: 2});
        assert(state.page !== 1);
        mutations.setPage(state, {query: {[PAGE_QUERY_KEY]: 'foo'}});
        assert(state.page === 1);
      });
    });
  });

  describe('actions', () => {
    const API_RESPONSE = 'api response';

    beforeEach(() => {
      // CSRFトークンの取得処理でエラーにならないようにするためだけの処理
      // 1 という値に意味はない
      document.getElementsByName = () => [{content: 1}];

      global.fetch = () => ({
        state: 200,
        json: () => ({result: API_RESPONSE}),
      });
    });

    describe('fetchBookmarkTotalCount', () => {
      it('commit(setBookmarkTotalCount, {count: fetchBookmarkCountApi().result}) を実行する', async done => {
        const commit = jest.fn();
        await actions.fetchBookmarkTotalCount({commit});
        expect(commit).toHaveBeenCalledWith('setBookmarkTotalCount', {
          count: API_RESPONSE,
        });
        done();
      });
    });

    describe('fetchAllTags', () => {
      it('commit(setAllTags, {tags: fetchTagListApi().result}) を実行する', async done => {
        const commit = jest.fn();
        await actions.fetchAllTags({commit});
        expect(commit).toHaveBeenCalledWith('setAllTags', {
          tags: API_RESPONSE,
        });
        done();
      });
    });

    describe('fetchBookmarkList', () => {
      it('commit(setBookmarkList, {bookmarkList: fetchBookmarkListApi(searchCondition, page)}) を実行する', async done => {
        const commit = jest.fn();
        await actions.fetchBookmarkList(
          {commit},
          {searchCondition: {keyword: null, tags: []}, page: 1}
        );
        expect(commit).toHaveBeenCalledWith('setBookmarkList', {
          bookmarkList: {result: API_RESPONSE},
        });
        done();
      });
    });
  });
});
