<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" v-for="(person, i) in $store.state.people" :key="i">
        <v-card outlined>
          <v-card-title>{{person.name}}</v-card-title>
          <v-card-text>
            <v-row v-if="Object.keys(person.achievements).length > 1">
              <v-col cols="3" v-for="(progress, title) in person.achievements" :key="title">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="achievement-wrapper"
                        :class="(+progress >= $store.state.achievements[title].max ? 'active' : '')"
                        :style="`background-color: ${$store.state.achievements[title].color}`"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-badge 
                          v-if="+progress >= $store.state.achievements[title].max * 2" 
                          color="red" 
                          :content="`x${Math.floor(+progress / $store.state.achievements[title].max)}`" 
                          bottom overlap bordered>
                          <img :src="$store.state.achievements[title].img" />
                        </v-badge>
                        <div v-else>
                          <img :src="$store.state.achievements[title].img" />
                        </div>
                      </div>
                    </template>
                    <strong>{{$store.state.achievements[title].title}}</strong>
                    <br />
                    <small
                      class="grey--text text--lighten-4"
                    >{{$store.state.achievements[title].description}}</small>
                  </v-tooltip>

                <v-progress-linear
                  v-if="+progress < $store.state.achievements[title].max"
                  :value="progress * 100 / $store.state.achievements[title].max"
                  height="15"
                  color="green accent-2"
                  rounded
                  class="mt-2"
                >
                  <span>{{ Math.ceil( progress * 100 / $store.state.achievements[title].max ) }}%</span>
                </v-progress-linear>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12">Пока пусто ¯\_(ツ)_/¯</v-col>
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
  padding: 14%;
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
    VuetifyLogo,
  },
  mounted() {
    let docId = window.location.search.slice(1);
    this.$store.commit("setDocId", docId);

    if(this.$store.state.table.length == 0) 
      this.$store.commit("getData");
  },
};
</script>
