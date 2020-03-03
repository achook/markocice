<template lang="pug">
.home--wrapper
  link(v-if="isImageAvailible", :href="imageLink", rel="prefetch")
  .home--search-box
    input.home--search-box-input(placeholder="ID", type="number", id="id", min="1", :max="lastID" v-model="id", @keyup.enter="handleChange")
  .home--table
    .home--table-row(v-for="(v,k) in table")
      .home--table-cell.home--table-cell__name {{ k }}
      .home--table-cell.home--table-cell__value.isActive(v-if="k==='Opis' && isImageAvailible", @click="toggleImage") {{ v }}
      .home--table-cell.home--table-cell__value(v-else) {{ v }}
    .home--table-row()
      router-link.home--table-cell.isActive(v-if="tripID", :to="{name: 'trips', params: {id: tripID}}") Inne pamiątki z tej podróży
  image-view(:url="imageLink", v-if="isImageShown", @close="toggleImage")
  .home--map(ref="map", v-show="isMapAvailable")
</template>

<script>
import ImageView from '@/components/ImageView.vue'
import initGMaps from '@/helpers/initGMaps.js'

function setMapHeight () {
  let screenHeight = window.innerHeight
  let nav = document.getElementById('nav')
  let navMargins = parseFloat(window.getComputedStyle(nav)['marginBottom']) + parseFloat(window.getComputedStyle(nav)['marginTop'])
  let navHeight = nav.offsetHeight + navMargins
  let mapHeight = `${screenHeight - navHeight}px`

  document.getElementsByClassName('home--wrapper')[0].style.height = mapHeight
}

const mappings = {
  year: 'Rok',
  country: 'Kraj',
  region: 'Region',
  desc: 'Opis',
  from: 'Od'
}

export default {
  name: 'home',

  components: {
    ImageView
  },

  beforeCreate () {
    (async () => {
      if (!self.createImageBitmap) {
        this.supportsWebp = false
        return
      }

      const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
      const blob = await fetch(webpData).then(r => r.blob())

      await createImageBitmap(blob)
        .then(() => { this.supportsWebp = true })
        .catch(() => { this.supportsWebp = false })
    })()
  },

  created () {
    this.getLastID()
  },

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
      center: this.mapMarker
    })

    this.map = map
  },

  data () {
    return {
      table: {},
      tripID: null,
      lastID: null,

      isMapAvailable: false,

      isImageAvailible: false,
      isImageShown: false,
      imageLink: ''
    }
  },

  methods: {
    handleChange () {
      let id = this.id
      if (isNaN(id) || parseInt(id) < 1) id = 1
      this.$router.push({ name: 'home', params: { id } })
    },

    getLastID () {
      fetch(__APIHOST__ + 'last') // eslint-disable-line no-undef
        .then(data => data.json())
        .then(data => data.lastID)
        .then(lastID => { this.lastID = lastID })
    },

    setImageLink (id) {
      let width = window.innerWidth
      let extension = this.supportsWebp ? 'webp' : 'jpeg'
      let imageWidth = 2500

      if (width < 480) {
        imageWidth = 480
      } else if (width < 720) {
        imageWidth = 720
      } else if (width < 1200) {
        imageWidth = 1200
      }

      this.imageLink = `/images/${id}/${imageWidth}.${extension}`
    },

    getData (id) {
      this.setImageLink(id)

      fetch(__APIHOST__ + 'souvenir/' + id) // eslint-disable-line no-undef
        .then(data => data.json())
        .then(data => {
          this.isImageAvailible = !!data['image']
          this.table = {}

          for (let key in mappings) {
            if (data.hasOwnProperty(key) && data[key] !== null) {
              this.$set(this.table, mappings[key], data[key])
            }
          }

          this.tripID = data.tripID ? data.tripID : null

          return {
            lat: data.lat,
            lon: data.lon
          }
        })
        .then((data) => {
          let lon = data.lon
          let lat = data.lat

          let interval = setInterval(() => {
            if (!this.map) return
            clearInterval(interval)

            if (lat && lon) {
              this.isMapAvailable = true
              let position = new this.google.maps.LatLng(lat, lon)

              if (this.marker) this.marker.setMap(null)

              this.marker = new this.google.maps.Marker({ // eslint-disable-line no-new
                position,
                map: this.map
              })

              this.map.setCenter(position)
            } else {
              this.isMapAvailable = false
            }
          }, 10)
        })
    },

    toggleImage () {
      this.isImageShown = !this.isImageShown
    }
  },

  props: ['id']
}
</script>

<style lang="scss" scoped>

.home--wrapper {
  min-height: 400px;

  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  font-size: 105%;
}

.home--search-box {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.home--search-box-label {
  font-weight: bold;
}

.home--search-box-input {
  width: 70%;
  max-width: 500px;

  margin-bottom: 10px;

  border-radius: 10px;
  border: 1px solid #b2bec3;

  padding: 5px;

  font-size: 100%;
  text-align: center;
  font-weight: bold;

  -moz-appearance: textfield;

  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:invalid {
    color: #d63031;
    border: 2px solid #d63031;
  }
}

.home--table {
  width: 100%;
  max-width: 800px;

  box-sizing: border-box;

  padding: 0 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.home--table-row {
  width: 100%;

  padding: 5px 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.home--table-cell {
  flex: 1;
}

@media screen and (max-width: 1200px) {
  .home--table-row {
    width: 80%
  }

  .home--table-cell__name {
    flex: 2;
  }

  .home--table-cell__value {
    flex: 3;
  }

}

.home--table-cell__name {
  font-weight: bold;
}

.isActive {
  cursor: pointer;

  text-decoration: underline;
  color: #00b894;
}

.home--map{
  width: 90%;
  height: 100%;

  margin-top: 2vh;
  margin-bottom: 3vh;

  flex: 1;
}
</style>
