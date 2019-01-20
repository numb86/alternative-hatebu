<template>
  <section class="section">
    <Bookmark
      v-for="bookmark in bookmarkList.displayList"
      :key="bookmark.id"
      :url="bookmark.url"
      :title="bookmark.title"
      :tags="bookmark.tags"
      :comment="bookmark.comment"
      :date="bookmark.date"
    />
  </section>
</template>

<script>
import Bookmark from './Bookmark.vue';

export default {
  components: {
    Bookmark,
  },
  props: {
    bookmarkList: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
