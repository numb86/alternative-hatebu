import {shallowMount} from '@vue/test-utils';

import BookmarkList from '../BookmarkList.vue';
import Bookmark from '../Bookmark.vue';

const assert = require('assert');

describe('Bookmark', () => {
  it('props.bookmarkList.displayList に基づいて Bookmark をリストレンダリングする', () => {
    const wrapper = shallowMount(BookmarkList, {
      propsData: {
        bookmarkList: {
          displayList: [
            {
              id: 1,
              url: 'https://example.com/1',
              title: 'title1',
              tags: ['foo', 'bar'],
              comment: 'comment1',
              date: 'date1',
            },
            {
              id: 2,
              url: 'https://example.com/2',
              title: 'title2',
              tags: ['bar'],
              comment: 'comment2',
              date: 'date2',
            },
          ],
        },
      },
    });

    const array = wrapper.findAll(Bookmark);
    assert.deepEqual(array.length, 2);

    const firstBookmark = array.at(0);
    assert.deepEqual(firstBookmark.attributes('url'), 'https://example.com/1');
    assert.deepEqual(firstBookmark.attributes('title'), 'title1');
    assert.equal(firstBookmark.attributes('tags'), ['foo', 'bar']);
    assert.deepEqual(firstBookmark.attributes('comment'), 'comment1');
    assert.deepEqual(firstBookmark.attributes('date'), 'date1');

    const secondBookmark = array.at(1);
    assert.deepEqual(secondBookmark.attributes('url'), 'https://example.com/2');
    assert.deepEqual(secondBookmark.attributes('title'), 'title2');
    assert.equal(secondBookmark.attributes('tags'), ['bar']);
    assert.deepEqual(secondBookmark.attributes('comment'), 'comment2');
    assert.deepEqual(secondBookmark.attributes('date'), 'date2');
  });
});
