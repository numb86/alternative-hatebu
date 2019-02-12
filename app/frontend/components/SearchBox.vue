<template>
  <div class="field">
    <div class="control">
      <form @submit.prevent="search">
        <!-- vue/html-self-closing と prettier/prettier が衝突してしまうので回避している -->
        <!-- eslint-disable prettier/prettier -->
        <input
          v-model="keyword"
          class="input"
          type="text"
          placeholder="検索したいキーワードを入力"
        >
        <!-- eslint-enable prettier/prettier -->
      </form>
    </div>
  </div>
</template>

<script>
import {SEARCH_QUERY_KEY} from '../constants';

export default {
  data() {
    return {
      keyword: '',
    };
  },
  methods: {
    search() {
      const keyword = this.keyword.trim();
      if (keyword.length === 0) {
        this.$router.push('/');
        return;
      }
      this.$router.push(`?${SEARCH_QUERY_KEY}=${keyword}`);
    },
  },
};
</script>
