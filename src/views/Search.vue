<template lang="pug">
.search
  input.search--input(type="text", placeholder="Czego szukasz?", v-model="query", @keyup.enter="handleChange")
  .search--results
    .search--results-row.search--results-row__header
      .search--results-cell.search--results-cell__id.search--results-cell-header__id ID
      .search--results-cell.search--results-cell__year Rok
      .search--results-cell.search--results-cell__place Miejsce
      .search--results-cell.search--results-cell__desc Opis
    .search--results-row.search--results-row__value(v-for="row in searchResults")
      router-link.search--results-cell.search--results-cell__id.search--results-cell-value__id(:to="{name: 'home', params: {id: row.id}}") {{ row.id }}
      .search--results-cell.search--results-cell__year {{ row.year }}
      .search--results-cell.search--results-cell__place(v-if="row.region && row.country") {{ `${row.region}, ${row.country}` }}
      .search--results-cell.search--results-cell__place(v-else-if="row.region && !row.country") {{ row.region }}
      .search--results-cell.search--results-cell__place(v-else-if="!row.region && row.country") {{ row.country }}
      .search--results-cell.search--results-cell__place(v-else)
      .search--results-cell.search--results-cell__desc {{ row.desc }}
</template>

<script>
export default {
  name: 'search',

  beforeRouteEnter (to, from, next) {
    let query = to.query.q

    next(vm => vm.getData(query))
  },

  beforeRouteUpdate (to, from, next) {
    let query = to.query.q
    this.getData(query)

    next()
  },

  methods: {
    handleChange () {
      let query = this.query
      this.$router.push({ name: 'search', query: { q: query } })
    },

    getData (query) {
      fetch(__APIHOST__ + 'search?q=' + query) // eslint-disable-line no-undef
        .then(data => data.json())
        .then(data => { this.searchResults = data })
        .then(() => {

        })
    }
  },

  data () {
    return {
      searchResults: []
    }
  },

  props: ['query']
}
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
}

.search--input {
  width: 90%;
  max-width: 500px;

  margin-bottom: 15px;

  border-radius: 10px;
  border: 1px solid #b2bec3;

  padding: 5px 5px 5px 10px;

  font-size: 100%;
}

.search--results {
  width: 95%;

  display: flex;
  flex-direction: column;

  margin: 0 auto;
}

.search--results-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding-bottom: 20px;
}

.search--results-row__header {
  padding-bottom: 7px;

  font-size: 105%;
  font-weight: bold;
}

.search--results-cell-value__id {
  color: #00b894;
}

.search--results-cell__id, .search--results-cell__year {
  flex: 2;
}

.search--results-cell__place {
  flex: 4;
}

.search--results-cell__desc {
  flex: 7;
}

@media screen and (max-width: 1200px) {
  .search--results-cell {
    padding: 0 2px;
  }

  .search--results-cell__id {
    flex: 2;
  }

  .search--results-cell__year {
    display: none;
  }

  .search--results-cell__place {
    flex: 5;
  }

  .search--results-cell__desc {
    flex: 8;
  }
}

</style>
