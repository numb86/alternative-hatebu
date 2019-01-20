<template functional>
  <article class="message is-medium is-dark">
    <div class="message-header">
      <a
        :href="props.url"
        style="text-decoration: none;"
        target="_blank"
        rel="noopener"
      >
        <p>{{ props.title }}</p>
      </a>
    </div>
    <div class="message-body">
      <h4 class="title is-6">
        <a :href="props.url" target="_blank" rel="noopener">
          {{ props.url }}
        </a>
      </h4>
      <h4 class="title is-spaced">
        <router-link
          v-for="tag in props.tags"
          :key="tag"
          :to="`/tag/${tag}`"
          class="tag is-info"
        >
          {{ tag }}
        </router-link>
      </h4>
      <p class="is-size-6">{{ props.comment }}</p>
      <p class="is-size-7">{{ props.date }}</p>
    </div>
  </article>
</template>
