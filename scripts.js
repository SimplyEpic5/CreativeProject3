var app = new Vue({
  el: '#app',
  data: {
    TBArtist: '',
    TBSong: '',
    current: {
      song: '',
      artist: '',
      lyrics: [],
    },
    notes: {},
    loading: false,
  },
  computed: {
    artistDisplay(){
      if (this.current.artist == ''){
        return this.current.artist
      } else {
        return 'by ' + this.current.artist
      }
    }
  },
  methods: {
    addItem(lyric) {
      if (!(this.current.artist in this.notes)){
        Vue.set(this.notes, this.current.artist, new Array);
      }
      if (!(this.current.song in this.notes[this.current.artist])){
        Vue.set(this.notes[this.current.artist], this.current.song, new Array);
      }
      if (!(lyric.lyric in this.notes[this.current.artist][this.current.song])){
        Vue.set(this.notes[this.current.artist][this.current.song], lyric.lyric, new String);
      }

      //console.log("Adding: " + lyric.addedNote);
      //console.log("Currently Equals: " + this.notes[this.current.artist][this.current.song][lyric.lyric]);
      this.notes[this.current.artist][this.current.song][lyric.lyric] = lyric.addedNote;
      //console.log("Now equals: " + this.notes[this.current.artist][this.current.song][lyric.lyric]);
      lyric.edit = false;
    },
    showAddNoteClear(lyric){
      lyric.addedNote = '';
      if (lyric.edit){
        lyric.edit = false;
      } else {
        lyric.edit = true;
      }
    },
    showAddNote(lyric) {
      if (lyric.edit){
        lyric.edit = false;
      } else {
        lyric.edit = true;
      }
    },
    async getLyrics() {
      try {
        this.loading = true;
        const response = await axios.get("https://api.lyrics.ovh/v1/" + this.TBArtist + "/" + this.TBSong)
        this.loading = false
        this.current.song = this.TBSong.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
        this.current.artist = this.TBArtist.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')

        let allLyrics = [];
        let count = 1000;

        if ('lyrics' in response.data && response.data.lyrics != ""){
          if (response.data.lyrics.split(" ")[0] == "Paroles") {
            let blocks = response.data.lyrics.split("\n\n\n\n\n");
            for (let i = 0; i < blocks.length; i++) {
              let block = [];
              let lyrics = blocks[i].split("\n");
              for (let i = 1; i < lyrics.length; i++) {
                if (lyrics[i] != "") {
                  block.push({lyric: count + " " + lyrics[i], edit: false, addedNote: ''});
                  count++;
                }
              }
              allLyrics.push(block);
            }
          } else {
            let blocks = response.data.lyrics.split("\n\n");
            for (let i = 0; i < blocks.length; i++) {
              let block = [];
              let lyrics = blocks[i].split("\n");
              for (let i = 0; i < lyrics.length; i++) {
                if (lyrics[i] != "") {
                  block.push({lyric: count + " " + lyrics[i], edit: false, addedNote: ''});
                  count++;
                }
              }
              allLyrics.push(block);
            }
          }
        } else {
          let block = []
          block.push({lyric: count + " " + "No Lyrics Found", edit: false, addedNote: ''});
          allLyrics.push(block);
        }

        this.current.lyrics = allLyrics;
        if (!(this.current.artist in this.notes)){
          Vue.set(this.notes, this.current.artist, new Array);
        }
        if (!(this.current.song in this.notes[this.current.artist])){
          Vue.set(this.notes[this.current.artist], this.current.song, new Array);
        }
      } catch (e) {
        console.log(e)
        this.loading = false
        this.current.song = this.TBSong.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
        this.current.artist = this.TBArtist.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')

        let allLyrics = [];
        let count = 1000;
        let block = []
        block.push({lyric: count + " " + "No Lyrics Found", edit: false, addedNote: ''});
        allLyrics.push(block);

        this.current.lyrics = allLyrics;
        if (!(this.current.artist in this.notes)){
          Vue.set(this.notes, this.current.artist, new Array);
        }
        if (!(this.current.song in this.notes[this.current.artist])){
          Vue.set(this.notes[this.current.artist], this.current.song, new Array);
        }
      }


    },
    lyricFix(str){
      return str.substring(5);
    }
  }
});
