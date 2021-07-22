import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: { MusicList },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      pic() {
        const computedData = this.computedData
        return computedData && computedData.pic
      },
      title() {
        const computedData = this.computedData
        return computedData && (computedData.name || computedData.title)
      }
    },
    async created() {
      if (!this.computedData) {
        const path = this.$route.matched[0].path
        this.$router.push(path)
        return
      }
      const result = await fetch(this.computedData)
      const songs = await processSongs(result.songs)
      this.songs = songs
      this.loading = false
    }
  }
}
