<template lang="pug">
.error--message
  | Niestety, strona
  span.error--path  {{ $route.fullPath }}
  |  nie została znaleziona 😞
</template>

<style lang="scss" scoped>

.error--message {
  margin-top: 5vh;

  font-size: 150%;
  font-weight: bold;
}

.error--path {
  font-style: italic;
  color: #00b894;
}

</style>

<script>

export default {
  name: 'error-404'
}
</script>
