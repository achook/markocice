<template lang="pug">
.map--map-wrapper
  .map--map(ref="chartMap", :center="center", :zoom="3")
</template>

<script>
import initGMaps from '@/helpers/initGMaps.js'

function setMapHeight () {
  let screenHeight = window.innerHeight
  let nav = document.getElementById('nav')
  let navMargins = parseFloat(window.getComputedStyle(nav)['marginBottom']) + parseFloat(window.getComputedStyle(nav)['marginTop'])
  let navHeight = nav.offsetHeight + navMargins
  let mapHeight = `${screenHeight - navHeight}px`

  document.getElementsByClassName('map--map-wrapper')[0].style.height = mapHeight
}

export default {
  name: 'stats',

  created () {
    fetch(__APIHOST__ + 'coords') // eslint-disable-line no-undef
      .then(data => data.json())
      .then(data => {
        let heatMapData = []

        let interval = setInterval(() => {
          if (!this.isMapInitialized) return
          clearInterval(interval)

          for (let key in data) {
            let coords = key.split(',')
            let lat = parseFloat(coords[0])
            let lng = parseFloat(coords[1])
            let amount = data[key].length

            let marker = new this.google.maps.Marker({
              position: {
                lat,
                lng
              },
              map: this.map,
              title: `Pamiątki: ${amount}`,
              visible: false
            })

            marker.addListener('click', () => {
              this.toggleInfo(marker)
            })

            this.markers.push(marker)

            heatMapData.push({
              location: new this.google.maps.LatLng(lat, lng),
              weight: amount
            })
          }

          const heatmap = new this.google.maps.visualization.HeatmapLayer({
            map: this.map,
            data: heatMapData,
            dissipating: true,
            opacity: 0.6,
            radius: 15
          })

          this.heatmap = heatmap
        }, 10)
      })
  },

  async mounted () {
    setMapHeight()
    window.addEventListener('resize', setMapHeight)

    const google = await initGMaps()

    const map = new google.maps.Map(this.$refs['chartMap'], {
      zoom: 3,
      center: this.center
    })

    google.maps.event.addListener(map, 'zoom_changed', () => {
      let zoom = map.getZoom()

      if (zoom > 6 && !this.areMarkersVisible) {
        this.areMarkersVisible = true
        this.heatmap.setMap(null)

        for (let marker of this.markers) {
          marker.setVisible(true)
        }
      } else if (zoom <= 6 && this.areMarkersVisible) {
        this.areMarkersVisible = false
        this.heatmap.setMap(this.map)

        for (let marker of this.markers) {
          marker.setVisible(false)
        }
      }
    })

    const infowindow = new google.maps.InfoWindow()

    this.info = infowindow
    this.google = google
    this.map = map
    this.isMapInitialized = true
  },

  data () {
    return {
      markers: [],
      areMarkersVisible: false,

      center: { lat: 40, lng: 25 },

      heatMapData: [],
      isMapInitialized: false
    }
  },

  methods: {
    toggleInfo (marker) {
      this.map.setCenter(marker.position)

      this.info.open(
        this.map,
        marker
      )

      this.info.setContent(
        marker.getTitle()
      )
    }
  }

}
</script>

<style lang="scss" scoped>
.map--map-wrapper {
  width: 100%;

  display:flex;
  justify-content: center;
  align-items: center;
}

.map--map {
  width: 90%;
  height: 90%;
}
</style>
