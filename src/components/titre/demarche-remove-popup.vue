<template>
  <Popup>
    <template slot="header">
      <div>
        <h5>
          <span class="cap-first">
            {{ titreNom }}
          </span><span class="color-neutral">
            |
          </span><span class="cap-first">
            {{ typeNom }}
          </span>
        </h5>
        <h2 class="cap-first mb-0">
          Suppression d'une démarche
        </h2>
      </div>
    </template>

    <p class="bold">
      Souhaitez vous supprimer la démarche <span class="color-inverse">{{ demarcheTypeNom }}</span> du titre <span class="color-inverse">{{ titreNom }}</span> (<span class="color-inverse">{{ typeNom }}</span>) ?
    </p>
    <div class="bg-warning color-bg p-s mb-l">
      <span class="bold">
        Attention
      </span>: cette opération est définitive et ne peut pas être annulée.
    </div>

    <template slot="footer">
      <Messages :messages="messages" />
      <div class="tablet-blobs">
        <div class="mb tablet-mb-0 tablet-blob-1-3">
          <button
            class="btn-border rnd-xs p-s full-x"
            @click="cancel"
          >
            Annuler
          </button>
        </div>
        <div class="tablet-blob-2-3">
          <button
            class="btn-flash rnd-xs p-s full-x"
            @click="remove"
          >
            Supprimer
          </button>
        </div>
      </div>
    </template>
  </Popup>
</template>

<script>
import Popup from '../ui/popup.vue'
import Messages from '../ui/messages.vue'

export default {
  name: 'CaminoDemarcheDeletePopup',

  components: {
    Popup,
    Messages
  },

  props: {
    demarcheTypeNom: {
      type: String,
      default: ''
    },

    titreNom: {
      type: String,
      default: ''
    },

    demarcheId: {
      type: String,
      default: ''
    },

    typeNom: {
      type: String,
      default: ''
    }
  },

  computed: {
    messages() {
      return this.$store.state.popup.messages
    }
  },

  created() {
    document.addEventListener('keyup', this.keyup)
  },

  beforeDestroy() {
    document.removeEventListener('keyup', this.keyup)
  },

  methods: {
    remove() {
      this.$store.dispatch('titre/demarcheDelete', this.demarcheId)
    },

    cancel() {
      this.errorsRemove()
      this.$store.commit('popupClose')
    },

    keyup(e) {
      if ((e.which || e.keyCode) === 27) {
        this.cancel()
      } else if ((e.which || e.keyCode) === 13) {
        this.remove()
      }
    },

    errorsRemove() {
      // this.$store.commit('utilisateur/loginMessagesRemove')
    }
  }
}
</script>
