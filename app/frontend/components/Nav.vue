<template functional>
  <nav class="column is-one-quarter section is-hidden-mobile">
    <h2 class="title is-6"><strong>ブックマーク数</strong></h2>
    <p class="subtitle is-spaced">{{ props.bookmarkTotalCount || '-' }}</p>
    <h2 v-if="props.tags" class="title is-6"><strong>タグ一覧</strong></h2>
    <ul v-if="props.tags">
      <li v-for="tag in props.tags" :key="tag">
        <router-link :to="`/tag/${tag}`" data-test="tag-link">{{
          tag
        }}</router-link>
      </li>
    </ul>
  </nav>
</template>
