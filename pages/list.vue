<template>
  <div>
    <v-row>
      <v-col cols="12" md="4" v-for="(achievement, i) in $store.state.achievements" :key="i">
        <v-card>
          <v-card-title class="text-center">{{achievement.title}}</v-card-title>
          <v-card-text>
            <img :src="achievement.img" class="achievementImg">
            <p class="mt-4">
              {{achievement.description}}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style>
.achievementImg {
  width: 80px;
  height: auto;
  max-width: 100%;
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
