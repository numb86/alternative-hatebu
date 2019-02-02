import {shallowMount} from '@vue/test-utils';

import Header from '../Header.vue';
import FileImport from '../FileImport.vue';

const assert = require('assert');

describe('Header', () => {
  let wrapper;
  let navbarBurger;
  let navbarMenu;

  beforeEach(() => {
    wrapper = shallowMount(Header, {stubs: ['router-link']});
    navbarBurger = wrapper.find('.navbar-burger');
    navbarMenu = wrapper.find('.navbar-menu');
  });

  describe('ハンバーガーメニュー', () => {
    it('.navbar-burger を押下すると isActiveBurger が切り替わる', () => {
      assert(!wrapper.vm.isActiveBurger);
      navbarBurger.trigger('click');
      assert(wrapper.vm.isActiveBurger);
      navbarBurger.trigger('click');
      assert(!wrapper.vm.isActiveBurger);
    });
    it('isActiveBurger が true のときは .navbar-burger の要素に .is-active が付加される', () => {
      wrapper.setData({isActiveBurger: true});
      assert(navbarBurger.classes().includes('is-active'));
    });
    it('isActiveBurger が false のときは .navbar-burger の要素に .is-active が付加されない', () => {
      wrapper.setData({isActiveBurger: false});
      assert(!navbarBurger.classes().includes('is-active'));
    });
    it('isActiveBurger が true のときは .navbar-menu の要素に .is-active が付加される', () => {
      wrapper.setData({isActiveBurger: true});
      assert(navbarMenu.classes().includes('is-active'));
    });
    it('isActiveBurger が false のときは .navbar-menu の要素に .is-active が付加されない', () => {
      wrapper.setData({isActiveBurger: false});
      assert(!navbarMenu.classes().includes('is-active'));
    });
  });

  describe('認証', () => {
    it('props.authenticated が true のときは FileImport が描画される', () => {
      wrapper.setProps({authenticated: true});
      assert(wrapper.find(FileImport).exists());
    });
    it('props.authenticated が false のときは FileImport が描画されない', () => {
      wrapper.setProps({authenticated: false});
      assert(!wrapper.find(FileImport).exists());
    });
    it('props.authenticated が true のときはログアウトボタンが描画される', () => {
      wrapper.setProps({authenticated: true});
      assert(wrapper.find('button').exists());
    });
    it('props.authenticated が false のときはログアウトボタンが描画されない', () => {
      wrapper.setProps({authenticated: false});
      assert(!wrapper.find('button').exists());
    });
    it('ログアウトボタンを押下すると logout が呼び出される', () => {
      const mock = jest.fn();
      wrapper.setMethods({logout: mock});
      wrapper.setProps({authenticated: true});
      expect(mock).not.toHaveBeenCalled();
      wrapper
        .find('button')
        .find('strong')
        .trigger('click');
      expect(mock).toHaveBeenCalled();
    });
  });
});
