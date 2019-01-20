<template functional>
  <li v-if="props.isLink">
    <router-link
      :to="{
        query: Object.assign({}, props.existQuery, {
          [props.pageQueryKey]: props.page,
        }),
      }"
      :aria-label="
        props.isCurrent ? `Page ${props.page}` : `Goto page ${props.page}`
      "
      :aria-current="props.isCurrent ? 'page' : false"
      :class="{'is-current': props.isCurrent}"
      class="pagination-link"
    >
      {{ props.page }}
    </router-link>
  </li>
  <li v-else><span class="pagination-ellipsis">&hellip;</span></li>
</template>
