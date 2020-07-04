<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" v-for="(person, i) in people" :key="i">
        <v-card>
          <v-card-title>{{person.name}}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="3" v-for="(progress, title) in person.achievements" :key="title">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="achievement-wrapper"
                      :class="(+progress >= achievements[title].max ? 'active' : '')"
                      :style="`background-color: ${achievements[title].color}`"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <img :src="achievements[title].img" />
                    </div>
                  </template>
                  <strong>{{achievements[title].title}}</strong>
                  <br />
                  <small class="grey--text text--lighten-4">{{achievements[title].description}}</small>
                </v-tooltip>
                
                <v-progress-linear
                  v-if="+progress < achievements[title].max"
                  :value="progress * 100 / achievements[title].max"
                  height="15"
                  color="green accent-2"
                  rounded
                  class="mt-2"
                >
                  <span>{{ Math.ceil( progress * 100 / achievements[title].max ) }}%</span>
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style>
.achievement-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 10px;
  margin-right: 10px;
  filter: grayscale(100%);
  transition: filter 0.3s;
}
.achievement-wrapper:hover {
  filter: grayscale(0%);
}
.achievement-wrapper.active {
  filter: grayscale(0%);
}
.achievement-wrapper img {
  max-width: 100%;
  height: auto;
}
</style>

<script>
import Logo from "~/components/Logo.vue";
import VuetifyLogo from "~/components/VuetifyLogo.vue";

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data() {
    return {
      docId: "",
      table: [],
      achievesInfoRows: 5,
      achievements: {},
      people: []
    };
  },
  methods: {
    getData() {
      this.$axios
        .get(
          `https://spreadsheets.google.com/feeds/list/${this.docId}/od6/public/basic?alt=json`
        )
        .then(response => {
          // Парсим строки таблицы в виде объектов,
          // где ключ - название столбца, значение - значение ячейки
          for (let el of response.data.feed.entry) {
            let rowContent = JSON.parse(
              `{"${el.content.$t
                .split(": ")
                .join('": "')
                .split(", ")
                .join('", "')}"}`
            );
            this.table.push(rowContent);
          }

          // Парсим инфо об ачивках
          for (let key in this.table[0]) {
            if (key != "name") {
              let achievement = {};
              achievement.title = this.table[0][key];
              achievement.description = this.table[1][key];
              achievement.img = this.table[2][key];
              achievement.color = this.table[3][key];
              achievement.max = this.table[4][key];

              this.achievements[key] = achievement;
            }
          }

          // Парсим данные о людях и представляем в удобной форме
          let peoplePart = this.table.slice(this.achievesInfoRows);
          for (let row of peoplePart) {
            let person = {
              name: row.name,
              achievements: {}
            };
            for (let key in row) {
              if (key != "name") {
                person.achievements[key] = row[key];
              }
            }
            this.people.push(person);
          }
        });
    }
  },
  mounted() {
    this.docId = window.location.search.slice(1);
    this.getData();
  }
};
</script>
