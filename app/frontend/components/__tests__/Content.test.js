import {shallowMount} from '@vue/test-utils';

import Content from '../Content.vue';
import Nav from '../Nav.vue';
import Main from '../Main.vue';

const assert = require('assert');

describe('Content', () => {
  const EXAMPLE_CONTENT_TYPE = 'contentType';
  const EXAMPLE_BOOKMARK_TOTAL_COUNT = 2;
  const EXAMPLE_TAGS = ['foo', 'bar'];
  const EXAMPLE_SEARCH_CONDITION_KEYWORD = 'keyword';
  const EXAMPLE_SEARCH_CONDITION_TAGS = ['aaa', 'bbb'];
  const EXAMPLE_BOOKMARK_LIST = {};

  const wrapper = shallowMount(Content, {
    propsData: {
      contentType: EXAMPLE_CONTENT_TYPE,
      bookmarkTotalCount: EXAMPLE_BOOKMARK_TOTAL_COUNT,
      tags: EXAMPLE_TAGS,
      searchCondition: {
        keyword: EXAMPLE_SEARCH_CONDITION_KEYWORD,
        tags: EXAMPLE_SEARCH_CONDITION_TAGS,
      },
      bookmarkList: EXAMPLE_BOOKMARK_LIST,
    },
  });

  it('Nav に props の内容が渡される', () => {
    const nav = wrapper.find(Nav);
    assert.deepEqual(
      nav.attributes('bookmark-total-count'),
      EXAMPLE_BOOKMARK_TOTAL_COUNT
    );
    assert.equal(nav.attributes('tags'), EXAMPLE_TAGS);
  });

  it('Main に props の内容が渡される', () => {
    const main = wrapper.find(Main);
    assert.deepEqual(main.props('contentType'), EXAMPLE_CONTENT_TYPE);
    assert.deepEqual(
      main.props('bookmarkTotalCount'),
      EXAMPLE_BOOKMARK_TOTAL_COUNT
    );
    assert.deepEqual(
      main.props('searchCondition').keyword,
      EXAMPLE_SEARCH_CONDITION_KEYWORD
    );
    assert.deepEqual(
      main.props('searchCondition').tags,
      EXAMPLE_SEARCH_CONDITION_TAGS
    );
    assert.deepEqual(main.props('bookmarkList'), EXAMPLE_BOOKMARK_LIST);
  });
});
