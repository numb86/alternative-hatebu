import {shallowMount} from '@vue/test-utils';

import Bookmark from '../Bookmark.vue';

const assert = require('assert');

describe('Bookmark', () => {
  let wrapper;
  let header;
  let body;
  let tags;

  const EXAMPLE_URL = 'https://example.com';
  const EXAMPLE_TITLE = 'pageTitle';
  const EXAMPLE_TAGS = ['foo', 'bar'];
  const EXAMPLE_COMMENT = 'This is example comment.';
  const EXAMPLE_DATE = '2019/01/29';

  beforeEach(() => {
    wrapper = shallowMount(Bookmark, {
      // functional component では propsData ではなく context.props を使う必要がある
      context: {
        props: {
          url: EXAMPLE_URL,
          title: EXAMPLE_TITLE,
          tags: EXAMPLE_TAGS,
          comment: EXAMPLE_COMMENT,
          date: EXAMPLE_DATE,
        },
      },
      stubs: ['router-link'],
    });
    header = wrapper.find('div.message-header');
    body = wrapper.find('div.message-body');
    tags = body.findAll('.tag');
  });

  it('props.title に基づいたタイトルが描画される', () => {
    assert.deepEqual(header.text(), EXAMPLE_TITLE);
  });
  it('タイトルをクリックすると props.url に基づいたリンクが開かれる', () => {
    const link = header.find('a');
    assert.deepEqual(link.attributes('href'), EXAMPLE_URL);
  });
  it('props.url の内容がテキストとして描画される', () => {
    assert.deepEqual(body.find('h4').text(), EXAMPLE_URL);
  });
  it('描画されたURLをクリックするとそのURLが開かれる', () => {
    const link = body.find('a');
    assert.deepEqual(link.attributes('href'), EXAMPLE_URL);
  });
  it('props.tags に基づいたタグが表示される', () => {
    assert.deepEqual(tags.length, EXAMPLE_TAGS.length);
    assert.deepEqual(tags.at(0).text(), EXAMPLE_TAGS[0]);
    assert.deepEqual(tags.at(1).text(), EXAMPLE_TAGS[1]);
  });
  it('タグをクリックすると router-link によるページ遷移が発生する', () => {
    const firstTag = tags.at(0);
    assert.deepEqual(firstTag.attributes('to'), `/tag/${EXAMPLE_TAGS[0]}`);
  });
  it('props.comment に基づいたコメントが描画される', () => {
    const array = wrapper
      .findAll('p')
      .filter(w => w.text() === EXAMPLE_COMMENT);
    assert(array.exists());
  });
  it('props.date に基づいた日付が描画される', () => {
    const array = wrapper.findAll('p').filter(w => w.text() === EXAMPLE_DATE);
    assert(array.exists());
  });
});
