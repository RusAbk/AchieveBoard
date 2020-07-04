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
        }
    }
})

export default store