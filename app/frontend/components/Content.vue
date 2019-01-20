<template>
  <div class="columns">
    <Nav :bookmark-total-count="bookmarkTotalCount" :tags="tags" />
    <Main
      :content-type="contentType"
      :bookmark-total-count="bookmarkTotalCount"
      :search-condition="searchCondition"
      :bookmark-list="bookmarkList"
    />
  </div>
</template>

<script>
import Nav from './Nav.vue';
import Main from './Main.vue';

export default {
  components: {
    Nav,
    Main,
  },
  props: {
    contentType: {
      type: String,
      default: '',
    },
    bookmarkTotalCount: {
      type: [Number, null],
      default: null,
    },
    tags: {
      type: [Array, null],
      default: null,
    },
    searchCondition: {
      type: Object,
      default: () => ({keyword: null, tags: []}),
    },
    bookmarkList: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
