import {shallowMount} from '@vue/test-utils';

import Login from '../Login.vue';

const assert = require('assert');

describe('Login', () => {
  let wrapper;
  let mock;

  beforeEach(() => {
    mock = jest.fn();
    wrapper = shallowMount(Login, {
      attachToDocument: true,
    });
    wrapper.setMethods({login: mock});
  });

  // https://stackoverflow.com/questions/53382235/trigger-form-submit-on-button-click-in-vue-unit-test
  // https://github.com/vuejs/vue-test-utils/issues/1030
  afterEach(() => {
    wrapper.destroy();
  });

  it('Username フィールドに入力した値が userName になる', () => {
    assert.deepEqual(wrapper.vm.userName, '');
    const textInput = wrapper.find('input[type="text"]');
    textInput.setValue('abc');
    assert.deepEqual(wrapper.vm.userName, 'abc');
  });

  it('Password フィールドに入力した値が password になる', () => {
    assert.deepEqual(wrapper.vm.password, '');
    const textInput = wrapper.find('input[type="password"]');
    textInput.setValue('xyz');
    assert.deepEqual(wrapper.vm.password, 'xyz');
  });

  it('ログインボタンを押下すると login が呼び出される', () => {
    const loginButton = wrapper.find('input[type="submit"]');
    assert(loginButton.attributes('value') === 'Login');
    expect(mock).not.toHaveBeenCalled();
    loginButton.trigger('click');
    expect(mock).toHaveBeenCalled();
  });

  it('errorMessage に値が入っていればそれがテキストとして描画される', () => {
    const MSG = 'error occurr';

    wrapper.setData({errorMessage: null});
    let array = wrapper.findAll('div');
    let result = array.filter(w => w.text() === MSG);
    assert(result.length === 0);

    wrapper.setData({errorMessage: MSG});
    array = wrapper.findAll('div');
    result = array.filter(w => w.text() === MSG);
    assert(result.length !== 0);
  });
});
