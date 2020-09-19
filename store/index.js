import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
    state: {
        achievesInfoRows: 5,
        docId: "",
        table: [],
        achievements: {},
        people: []
    },
    mutations: {
        setDocId(state, id) {
            state.docId = id;
        },
        setTableContent(state, table) {
            state.table = table;
        },
        setAchievements(state, achievements) {
            state.achievements = achievements;
        },
        setPeople(state, people) {
            state.people = people;
        },
        getData(state) {
            this.$axios
              .get(`https://spreadsheets.google.com/feeds/list/${state.docId}/od6/public/basic?alt=json`)
              .then((response) => {
                // Парсим строки таблицы в виде объектов,
                // где ключ - название столбца, значение - значение ячейки
                let table = [];
                for (let el of response.data.feed.entry) {
                  let rowContent = JSON.parse(
                    `{"${el.content.$t
                      .split(": ")
                      .join('": "')
                      .split(", ")
                      .join('", "')}"}`
                  );
                  table.push(rowContent);
                }
                this.commit("setTableContent", table);
      
                // Парсим инфо об ачивках
                let achievements = {};
                for (let key in state.table[0]) {
                  if (key != "name") {
                    let achievement = {};
                    achievement.title = state.table[0][key];
                    achievement.description = state.table[1][key];
                    achievement.img = state.table[2][key];
                    achievement.color = state.table[3][key];
                    achievement.max = state.table[4][key];
      
                    achievements[key] = achievement;
                  }
                }
                this.commit("setAchievements", achievements);
      
                // Парсим данные о людях и представляем в удобной форме
                let peoplePart = state.table.slice(state.achievesInfoRows);
                let people = [];
                for (let row of peoplePart) {
                  let person = {
                    name: row.name,
                    achievements: {},
                  };
                  for (let key in row) {
                    if (key != "name") {
                      person.achievements[key] = row[key];
                    }
                  }
                  people.push(person);
                }
                this.commit("setPeople", people);
              });
          }
    }
})

export default store