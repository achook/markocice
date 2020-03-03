<template lang="pug">
.trips--wrapper
  .trips--table
    .trips--table-column
      .trips--table-cell.trips--table-cell__name Pamiątki
      router-link.trips--table-cell.trips--table-cell__value.isActive(v-for="souvenir in trip.souvenirs", :to="{name: 'home', params: {id: souvenir}}") {{ souvenir }}

    .trips--table-column
      .trips--table-cell.trips--table-cell__name Kraje
      router-link.trips--table-cell.trips--table-cell__value.isActive(v-for="country in trip.countries", :to="{name: 'search', query: {q: country}}") {{ country }}

  .home--map(ref="map", v-show="isMapAvailable")
</template>

<script>
import initGMaps from '@/helpers/initGMaps.js'
import { setInterval, clearInterval } from 'timers'

function setMapHeight () {
  let screenHeight = window.innerHeight
  let nav = document.getElementById('nav')
  let navMargins = parseFloat(window.getComputedStyle(nav)['marginBottom']) + parseFloat(window.getComputedStyle(nav)['marginTop'])
  let navHeight = nav.offsetHeight + navMargins
  let mapHeight = `${screenHeight - navHeight}px`

  document.getElementsByClassName('trips--wrapper')[0].style.height = mapHeight
}

export default {
  name: 'trips',

  beforeRouteEnter (to, from, next) {
    let id = parseInt(to.params.id)
    if (id < 1 || isNaN(id)) id = 1

    next(vm => vm.getData(id))
  },

  beforeRouteUpdate (to, from, next) {
    let id = parseInt(to.params.id)
    this.getData(id)

    next()
  },

  async mounted () {
    setMapHeight()
    window.addEventListener('resize', setMapHeight)

    const google = await initGMaps()
    this.google = google

    const map = new google.maps.Map(this.$refs['map'], {
      zoom: 4,
      center: { lat: 0, lng: 0 }
    })

    this.map = map
  },

  data () {
    return {
      trip: {},
      markers: [],
      isMapAvailable: false
    }
  },

  methods: {
    getData (id) {
      fetch(__APIHOST__ + 'trip/' + id) // eslint-disable-line no-undef
        .then(data => data.json())
        .then(data => {
          this.trip = data
          this.isMapAvailable = (this.trip.coords && this.trip.coords.length > 0)
        })
        .then(() => {
          let interval = setInterval(() => {
            if (!this.map) return
            clearInterval(interval)

            let mapBounds = new this.google.maps.LatLngBounds()

            for (let element of this.trip.coords) {
              let position = new this.google.maps.LatLng(element.lat, element.lon)

              new this.google.maps.Marker({ // eslint-disable-line no-new
                position,
                map: this.map
              })

              mapBounds.extend(position)
            }

            this.map.panToBounds(mapBounds)
            this.google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
              this.map.fitBounds(mapBounds)
              this.google.maps.event.addListenerOnce(this.map, 'bounds_changed', () => {
                if (this.map.getZoom() > 7) {
                  this.map.setZoom(7)
                }
              })
            })
          }, 10)
        })
    }
  },

  props: ['id']
}
</script>

<style lang="scss" scoped>

.trips--wrapper {
  min-height: 400px;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  font-size: 105%;
}

.trips--table {
  width: 100%;
  max-width: 800px;

  box-sizing: border-box;

  padding: 0 10px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
}

.trips--table-column {
  width: 100%;

  flex: 1;

  padding: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.home--table-cell {
  flex: 1;
}

.trips--table-cell__name {
  font-weight: bold;
  padding-bottom: 5px;
  font-size: 100%;
}

.home--map{
  width: 90%;
  height: 100%;

  margin-top: 2vh;
  margin-bottom: 3vh;

  flex: 1;
}

.isActive {
  text-decoration: underline;
  color: #00b894;
}

</style>
