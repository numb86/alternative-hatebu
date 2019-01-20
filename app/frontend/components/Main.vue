<template>
  <div class="column section">
    <SearchBox v-if="bookmarkTotalCount" />
    <h2 v-if="bookmarkTotalCount">
      <span class="icon has-text-info"><i class="fas fa-search"/></span>
      <strong>{{ headlineText }} {{ bookmarkList.totalNumber }}件</strong>
    </h2>
    <h2 v-else>
      <strong>
        ブックマークが存在しません。ファイルをインポートしてださい。
      </strong>
    </h2>

    <BookmarkList :bookmark-list="bookmarkList" />
    <Pagination
      v-if="bookmarkList.totalNumber > 0"
      :exist-query="
        searchCondition.keyword
          ? {[SEARCH_QUERY_KEY]: searchCondition.keyword}
          : {}
      "
      :current="bookmarkList.page.current"
      :end="bookmarkList.page.total"
    />
  </div>
</template>

<script>
import {
  CONTENT_TYPE_TOP,
  CONTENT_TYPE_SEARCH,
  CONTENT_TYPE_TAG,
  CONTENT_TYPE_TAG_AND_SEARCH,
  SEARCH_QUERY_KEY,
} from '../constants';

import SearchBox from './SearchBox.vue';
import BookmarkList from './BookmarkList.vue';
import Pagination from './Pagination.vue';

export default {
  components: {
    SearchBox,
    BookmarkList,
    Pagination,
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
    searchCondition: {
      type: Object,
      default: () => ({keyword: null, tags: []}),
    },
    bookmarkList: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      SEARCH_QUERY_KEY,
    };
  },
  computed: {
    headlineText() {
      switch (this.contentType) {
        case CONTENT_TYPE_TOP: {
          return 'ブックマーク総数';
        }
        case CONTENT_TYPE_SEARCH: {
          return `「${this.searchCondition.keyword}」の検索結果`;
        }
        case CONTENT_TYPE_TAG: {
          const {tags} = this.searchCondition;
          return `「${tags.join()}」が設定されたブックマーク`;
        }
        case CONTENT_TYPE_TAG_AND_SEARCH: {
          const {keyword, tags} = this.searchCondition;
          return `タグ「${tags.join()}」キーワード「${keyword}」の検索結果`;
        }
        default:
          throw new Error('headlineText of Main.vue');
      }
    },
  },
};
</script>
