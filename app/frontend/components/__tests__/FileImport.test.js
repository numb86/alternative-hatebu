import {shallowMount} from '@vue/test-utils';

import FileImport from '../FileImport.vue';
import Processing from '../Processing.vue';

const assert = require('assert');

describe('FileImport', () => {
  let wrapper;
  let modal;

  beforeEach(() => {
    wrapper = shallowMount(FileImport);
    modal = wrapper.find('.modal');
  });

  it('ファイルをアップロードすると uploadFile が呼び出される', () => {
    const mock = jest.fn();
    wrapper.setMethods({uploadFile: mock});
    expect(mock).not.toHaveBeenCalled();
    wrapper.find('input').trigger('change');
    expect(mock).toHaveBeenCalled();
  });

  describe('Processing', () => {
    it('isProcessing が true なら Processing を描画する', () => {
      wrapper.setData({isProcessing: true});
      assert(wrapper.find(Processing).exists());
    });
    it('isProcessing が false なら Processing を描画しない', () => {
      wrapper.setData({isProcessing: false});
      assert(!wrapper.find(Processing).exists());
    });
  });

  describe('modal', () => {
    it('isActiveModal が true のときはモーダルに .is-active が付加される', () => {
      wrapper.setData({isActiveModal: true});
      assert(modal.classes().includes('is-active'));
    });
    it('isActiveModal が false のときはモーダルに .is-active が付加されない', () => {
      wrapper.setData({isActiveModal: false});
      assert(!modal.classes().includes('is-active'));
    });
    it('モーダルに modalMessage が表示される', () => {
      const TEXT = 'foo';
      wrapper.setData({modalMessage: TEXT});
      assert.deepEqual(modal.find('.section').text(), TEXT);
    });
    it('モーダルのOKボタンを押すとモーダルが閉じる', () => {
      wrapper.setData({isActiveModal: true});
      assert(modal.classes().includes('is-active'));
      const button = modal.find('button');
      assert.deepEqual(button.text(), 'OK');
      button.trigger('click');
      assert(!modal.classes().includes('is-active'));
    });
  });
});
