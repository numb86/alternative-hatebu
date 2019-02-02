<template>
  <nav
    class="pagination is-centered is-rounded"
    role="navigation"
    aria-label="pagination"
  >
    <router-link
      v-if="current !== 1"
      :to="previousButtonPath"
      class="pagination-previous"
    >
      前へ
    </router-link>
    <router-link
      v-if="current !== end"
      :to="nextButtonPath"
      class="pagination-next"
    >
      次へ
    </router-link>
    <ul class="pagination-list">
      <PaginationItem
        v-for="item in renderList"
        :key="item.id"
        :is-link="item.isLink"
        :is-current="item.isCurrent"
        :page="item.page"
        :exist-query="existQuery"
        :page-query-key="PAGE_QUERY_KEY"
      />
    </ul>
  </nav>
</template>

<script>
import {PAGE_QUERY_KEY} from '../constants';

import PaginationItem from './PaginationItem.vue';

export default {
  components: {
    PaginationItem,
  },
  props: {
    existQuery: {
      type: Object,
      default: () => ({}),
    },
    current: {
      type: Number,
      default: 1,
    },
    end: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      PAGE_QUERY_KEY,
    };
  },
  computed: {
    previousButtonPath() {
      // スプレッド演算子を使えば Object.assign を使わなくて済むはず
      return {
        query: Object.assign({}, this.existQuery, {
          [PAGE_QUERY_KEY]: this.current - 1,
        }),
      };
    },
    nextButtonPath() {
      // スプレッド演算子を使えば Object.assign を使わなくて済むはず
      return {
        query: Object.assign({}, this.existQuery, {
          [PAGE_QUERY_KEY]: this.current + 1,
        }),
      };
    },
    renderList() {
      const createItem = (page, isLink) => ({
        id: page,
        isLink,
        page,
        isCurrent: page === this.current,
      });
      const result = [];
      if (this.end <= 4) {
        for (let i = 1; i <= this.end; i += 1) {
          result.push(createItem(i, true));
        }
        return result;
      }
      const firstHalfItemAmount = this.current - 1;
      const secondHalfItemAmount = this.end - this.current;
      if (firstHalfItemAmount < 3) {
        result.push(createItem(1, true));
        result.push(createItem(2, true));
        result.push(createItem(3, true));
      } else {
        result.push(createItem(1, true));
        result.push(createItem(2, false));
        result.push(createItem(this.current - 1, true));
        result.push(createItem(this.current, true));
      }
      if (secondHalfItemAmount < 3) {
        for (let i = this.current + 1; i <= this.end; i += 1) {
          result.push(createItem(i, true));
        }
      } else {
        if (this.current <= 2) {
          result.push(createItem(4, false));
          result.push(createItem(this.end, true));
          return result;
        }
        result.push(createItem(this.current + 1, true));
        result.push(createItem(this.current + 2, false));
        result.push(createItem(this.end, true));
      }
      return result;
    },
  },
};
</script>
