import {shallowMount, createLocalVue} from '@vue/test-utils';
import VueRouter from 'vue-router';

import {PAGE_QUERY_KEY} from '../../constants';

import Pagination from '../Pagination.vue';
import PaginationItem from '../PaginationItem.vue';

const assert = require('assert');

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

const factory = propsData =>
  shallowMount(Pagination, {
    propsData,
    localVue,
    router,
  });

describe('Pagination', () => {
  describe('previous', () => {
    it('props.current が 1 のときは描画しない', () => {
      let wrapper = factory({current: 2});
      assert(wrapper.find('.pagination-previous').exists());
      wrapper = factory({current: 1});
      assert(!wrapper.find('.pagination-previous').exists());
    });

    it('to 属性は 既存のクエリに PAGE_QUERY_KEY&(props.current - 1) を付加したものになる', () => {
      const wrapper = factory({current: 3, existQuery: {foo: 'bar'}});
      const {query} = wrapper.find('.pagination-previous').props('to');
      assert(query.foo === 'bar' && query[PAGE_QUERY_KEY] === 2);
    });
  });

  describe('next', () => {
    it('props.current === props.end のときは描画しない', () => {
      let wrapper = factory({current: 2, end: 3});
      assert(wrapper.find('.pagination-next').exists());
      wrapper = factory({current: 2, end: 2});
      assert(!wrapper.find('.pagination-next').exists());
    });

    it('to 属性は 既存のクエリに PAGE_QUERY_KEY&(props.current + 1) を付加したものになる', () => {
      const wrapper = factory({current: 3, existQuery: {foo: 'bar'}});
      const {query} = wrapper.find('.pagination-next').props('to');
      assert(query.foo === 'bar' && query[PAGE_QUERY_KEY] === 4);
    });
  });

  describe('PaginationItem', () => {
    it('renderList の返り値に基づいて PaginationItem をリストレンダリングする', () => {
      const wrapper = shallowMount(Pagination, {
        propsData: {
          existQuery: {},
        },
        computed: {
          renderList: () => [
            {id: 1, isLink: false, page: 1, isCurrent: true},
            {id: 2, isLink: true, page: 2, isCurrent: false},
          ],
        },
      });
      const wrapperArray = wrapper.findAll(PaginationItem);
      assert(wrapperArray.length === 2);

      const firstItem = wrapperArray.at(0);
      assert(firstItem.attributes('is-link') === undefined);
      assert(firstItem.attributes('is-current') === 'true');
      assert(firstItem.attributes('page') === '1');
      assert(firstItem.attributes('exist-query') === '[object Object]');
      assert(firstItem.attributes('page-query-key') === PAGE_QUERY_KEY);

      const secondItem = wrapperArray.at(1);
      assert(secondItem.attributes('is-link') === 'true');
      assert(secondItem.attributes('is-current') === undefined);
      assert(secondItem.attributes('page') === '2');
      assert(secondItem.attributes('exist-query') === '[object Object]');
      assert(secondItem.attributes('page-query-key') === PAGE_QUERY_KEY);
    });

    describe('renderList', () => {
      it('アイテムが持つプロパティは id, isLink, page, isCurrent の4つ', () => {
        const wrapper = factory();
        const keys = Object.keys(wrapper.vm.renderList[0]);
        assert(keys.length === 4);
        assert(keys.includes('id'));
        assert(keys.includes('isLink'));
        assert(keys.includes('page'));
        assert(keys.includes('isCurrent'));
      });

      it('props.end が 4 以下のときは props.end の数だけアイテムが作られる', () => {
        const wrapper = factory({end: 4});
        assert(wrapper.vm.renderList.length === 4);
      });

      it('page === props.current のアイテムは isCurrent が true になる', () => {
        const wrapper = factory({current: 2, end: 3});
        const list = wrapper.vm.renderList;
        assert(list.length === 3);
        assert(list[0].page === 1 && list[0].isCurrent === false);
        assert(list[1].page === 2 && list[1].isCurrent === true);
        assert(list[2].page === 3 && list[2].isCurrent === false);
      });

      describe('props.end が 5 以上のとき', () => {
        describe('現在ページより前の要素が 3 未満のときはアイテムが先頭に 3 つ作られる', () => {
          it('isLink は全て true になる', () => {
            const wrapper = factory({current: 3, end: 5});
            const list = wrapper.vm.renderList;
            assert(list[0].isLink === true);
            assert(list[1].isLink === true);
            assert(list[2].isLink === true);
          });

          it('page は 1, 2, 3 が入る', () => {
            const wrapper = factory({current: 2, end: 6});
            const list = wrapper.vm.renderList;
            assert(list[0].page === 1);
            assert(list[1].page === 2);
            assert(list[2].page === 3);
          });
        });

        describe('現在ページより前の要素が 3 以上のときはアイテムが先頭に 4 つ作られる', () => {
          it('isLink は true, false, true, true になる', () => {
            const wrapper = factory({current: 4, end: 5});
            const list = wrapper.vm.renderList;
            assert(list[0].isLink === true);
            assert(list[1].isLink === false);
            assert(list[2].isLink === true);
            assert(list[3].isLink === true);
          });

          it('page は 1, 2, props.current - 1, props.current が入る', () => {
            const wrapper = factory({current: 5, end: 5});
            const list = wrapper.vm.renderList;
            assert(list[0].page === 1);
            assert(list[1].page === 2);
            assert(list[2].page === 4);
            assert(list[3].page === 5);
          });
        });

        describe('現在ページより後の要素が 3 未満のとき', () => {
          it('アイテムが props.end - props.current つ追加される', () => {
            // 現在ページより前の要素が 3 未満なので 3 + (props.end - props.current) 個になる
            const wrapper = factory({current: 3, end: 5});
            assert(wrapper.vm.renderList.length === 5);
          });

          it('page は this.current + 1 から連番で入っていく', () => {
            // 現在ページより前の要素が 3 未満なので 3 + (props.end - props.current) 個になる
            const wrapper = factory({current: 3, end: 5});
            const list = wrapper.vm.renderList;
            assert(list[3].page === 4);
            assert(list[4].page === 5);
          });

          it('isLink は全て true', () => {
            // 現在ページより前の要素が 3 未満なので 3 + (props.end - props.current) 個になる
            const wrapper = factory({current: 3, end: 5});
            const list = wrapper.vm.renderList;
            assert(list[3].isLink === true);
            assert(list[4].isLink === true);
          });
        });

        describe('現在ページより後の要素が 3 以上のとき', () => {
          describe('props.current が 2 以下のとき', () => {
            it('{page: 4, isLink: false},{page: props.end, isLink: true} が追加される', () => {
              const wrapper = factory({current: 2, end: 6});
              const list = wrapper.vm.renderList;
              assert(list.length === 5);
              assert(list[3].page === 4);
              assert(list[3].isLink === false);
              assert(list[4].page === 6);
              assert(list[4].isLink === true);
            });
          });

          describe('props.current が 3 以上のとき', () => {
            it('{page: props.current + 1, isLink: true},{page: props.current + 2, isLink: false},{page: props.end, isLink: true} が追加される', () => {
              const wrapper = factory({current: 3, end: 6});
              const list = wrapper.vm.renderList;
              assert(list.length === 6);
              assert(list[3].page === 4);
              assert(list[3].isLink === true);
              assert(list[4].page === 5);
              assert(list[4].isLink === false);
              assert(list[5].page === 6);
              assert(list[5].isLink === true);
            });
          });
        });
      });
    });
  });
});
