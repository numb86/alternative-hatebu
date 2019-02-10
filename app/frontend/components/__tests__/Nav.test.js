import {shallowMount} from '@vue/test-utils';

import Nav from '../Nav.vue';

const assert = require('assert');

const TAG_LIST = ['foo', 'bar', 'piyo'];

const factory = propsData =>
  shallowMount(Nav, {
    // functional component では propsData ではなく context.props を使う必要がある
    context: {
      props: {
        ...propsData,
      },
    },
    stubs: ['router-link'],
  });

describe('Nav', () => {
  it('props.bookmarkTotalCount に基づいたブックマーク数が描画される', () => {
    const wrapper = factory({bookmarkTotalCount: 3});
    assert(wrapper.find('p').text() === '3');
  });

  it('props.bookmarkTotalCount が Falsy のときは - が描画される', () => {
    let wrapper = factory({bookmarkTotalCount: null});
    assert(wrapper.find('p').text() === '-');
    wrapper = factory({bookmarkTotalCount: 0});
    assert(wrapper.find('p').text() === '-');
  });

  it('props.tags が Truthy のときだけ「タグ一覧」が描画される', () => {
    let wrapper = factory({tags: null});
    assert(!wrapper.text().includes('タグ一覧'));
    wrapper = factory({tags: TAG_LIST});
    assert(wrapper.text().includes('タグ一覧'));
  });

  describe('props.tags の内容に基づいて router-link のリストが描画されるとき', () => {
    it('to 属性は /tag/{TAG} になる', () => {
      const wrapperArray = factory({tags: TAG_LIST}).findAll(
        '[data-test="tag-link"]'
      );
      assert(wrapperArray.at(0).attributes('to') === `/tag/${TAG_LIST[0]}`);
      assert(wrapperArray.at(1).attributes('to') === `/tag/${TAG_LIST[1]}`);
      assert(wrapperArray.at(2).attributes('to') === `/tag/${TAG_LIST[2]}`);
    });

    it('tag がテキスト要素になる', () => {
      const wrapperArray = factory({tags: TAG_LIST}).findAll(
        '[data-test="tag-link"]'
      );
      assert(wrapperArray.at(0).text() === TAG_LIST[0]);
      assert(wrapperArray.at(1).text() === TAG_LIST[1]);
      assert(wrapperArray.at(2).text() === TAG_LIST[2]);
    });
  });
});
