<template>
  <div class="columns is-centered">
    <div class="column section is-half">
      <form @submit.prevent="login">
        <div class="field">
          <label class="label">Username</label>
          <!-- vue/html-self-closing と prettier/prettier が衝突してしまうので回避している -->
          <!-- eslint-disable prettier/prettier -->
          <div class="control"><input v-model="userName" class="input" type="text" ></div>
          <!-- eslint-ensable prettier/prettier -->
        </div>

        <div class="field">
          <label class="label">Password</label>
          <!-- vue/html-self-closing と prettier/prettier が衝突してしまうので回避している -->
          <!-- eslint-disable prettier/prettier -->
          <div class="control"><input v-model="password" class="input" type="password" ></div>
          <!-- eslint-ensable prettier/prettier -->
        </div>

        <div class="has-text-centered">
          <input type="submit" class="button" value="Login" >
          <div v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</div>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import {loginApi} from '../api';

export default {
  data() {
    return {
      userName: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async login() {
      try {
        await loginApi(this.userName, this.password);
        this.errorMessage = null;
        this.$router.push('/');
      } catch (e) {
        if (e.message === '401') {
          this.errorMessage = '認証に失敗しました。';
          return;
        }
        this.errorMessage = e.message;
      }
    },
  },
};
</script>
