import {shallowMount, createLocalVue} from '@vue/test-utils';
import VueRouter from 'vue-router';

import {PAGE_QUERY_KEY} from '../../constants';

import PaginationItem from '../PaginationItem.vue';

const assert = require('assert');

const PAGE = 1;

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

const defaultProps = {
  isLink: true,
  existQuery: {},
  pageQueryKey: PAGE_QUERY_KEY,
  page: PAGE,
  isCurrent: true,
};

const factory = propsData =>
  shallowMount(PaginationItem, {
    // functional component では propsData ではなく context.props を使う必要がある
    context: {
      props: {
        ...defaultProps,
        ...propsData,
      },
    },
    localVue,
    router,
  });

describe('PaginationItem', () => {
  describe('props.isLink が Falsy のとき', () => {
    it('router-link が描画されない', () => {
      const wrapper = factory({isLink: false});
      assert(!wrapper.find('.pagination-link').exists());
    });

    it('… が描画される', () => {
      const wrapper = factory({isLink: false});
      assert(wrapper.find('.pagination-ellipsis').exists());
    });
  });

  describe('props.isLink が Truthy のとき', () => {
    describe('router-link', () => {
      it('to 属性の query には {props.existQuery, [props.pageQueryKey]: props.page} が渡される', () => {
        const wrapper = factory({isLink: true, existQuery: {foo: 'bar'}}).find(
          '.pagination-link'
        );
        wrapper.trigger('click');
        assert(
          router.currentRoute.fullPath === `/?foo=bar&${PAGE_QUERY_KEY}=${PAGE}`
        );
      });

      describe('aria-label 属性', () => {
        it('props.isCurrent が Truthy なら Page + props.page になる', () => {
          const wrapper = factory({isLink: true, isCurrent: true});
          assert(wrapper.find(`[aria-label="Page ${PAGE}"]`).exists());
        });
        it('props.isCurrent が Falsy なら Goto + page + props.page になる', () => {
          const wrapper = factory({isLink: true, isCurrent: false});
          assert(wrapper.find(`[aria-label="Goto page ${PAGE}"]`).exists());
        });
      });

      describe('aria-current 属性', () => {
        it('props.isCurrent が Truthy なら page になる', () => {
          const wrapper = factory({isLink: true, isCurrent: true});
          assert(wrapper.find('[aria-current="page"]').exists());
        });
        it('props.isCurrent が Falsy なら false になり属性自体が存在しない', () => {
          const wrapper = factory({isLink: true, isCurrent: false});
          assert(
            wrapper.find('.pagination-link').attributes('aria-current') ===
              undefined
          );
        });
      });

      it('props.isCurrent が Truthy なら class 属性の値に is-current が加わる', () => {
        let wrapper = factory({isLink: true, isCurrent: false});
        assert(
          !wrapper
            .find('.pagination-link')
            .classes()
            .includes('is-current')
        );
        wrapper = factory({isLink: true, isCurrent: true});
        assert(
          wrapper
            .find('.pagination-link')
            .classes()
            .includes('is-current')
        );
      });
    });

    it('… が描画されない', () => {
      const wrapper = factory({isLink: true});
      assert(!wrapper.find('.pagination-ellipsis').exists());
    });
  });
});
