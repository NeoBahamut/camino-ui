<template>
  <Table
    ref="table"
    :elements="elements"
    :columns="colonnes"
    @update:page="$emit('update:page', $event)"
    @update:range="$emit('update:range', $event)"
  />
</template>

<script>
import Vue from 'vue'
import Table from '../ui/table.vue'
import PillList from '../ui/pill-list.vue'
import List from '../ui/list.vue'
import CaminoDomaine from './domaine.vue'
import TitreActivitesPills from './titre-activites-pills.vue'
import TitreStatut from './titre-statut.vue'

export default {
  name: 'Titres',

  components: {
    Table
  },

  props: {
    titres: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    activitesCol() {
      return this.titres.some(
        t => t.activitesAbsentes || t.activitesEnConstruction
      )
    },

    colonnes() {
      const colonnes = [
        {
          id: 'nom',
          name: 'Nom',
          class: ['min-width-8']
        },
        {
          id: 'domaine',
          name: ''
        },
        {
          id: 'type',
          name: 'Type',
          class: ['min-width-8']
        },
        {
          id: 'statut',
          name: 'Statut',
          class: ['nowrap']
        },
        {
          id: 'activites',
          name: 'Activités'
        },
        {
          id: 'substances',
          name: 'Substances',
          class: ['min-width-6']
        },
        {
          id: 'titulaires',
          name: 'Titulaires',
          class: ['min-width-10']
        }
      ]

      return colonnes.filter(({ id }) =>
        this.activitesCol ? true : id !== 'activites'
      )
    },

    elements() {
      return this.titres.map(titre => {
        const columns = {
          nom: {
            component: Vue.component('TitreNom', {
              render(h) {
                return h('p', { class: ['bold', 'mb-0'] }, titre.nom)
              }
            }),
            value: titre.nom
          },
          domaine: {
            component: CaminoDomaine,
            props: { domaineId: titre.domaine.id },
            value: titre.domaine.id
          },
          type: {
            component: Vue.component('TitreTypeNom', {
              render(h) {
                return h(
                  'p',
                  { class: ['h5', 'bold', 'cap-first', 'mb-0'] },
                  titre.type.nom
                )
              }
            }),
            value: titre.type.nom
          },
          statut: {
            component: TitreStatut,
            props: {
              color: `bg-${titre.statut.couleur}`,
              nom: titre.statut.nom,
              mini: true
            },
            value: titre.statut.nom
          },
          substances: {
            component: PillList,
            props: { elements: titre.substances.map(s => s.nom) },
            class: 'mb--xs',
            value: titre.substances.map(s => s.nom).join(', ')
          },
          titulaires: {
            component: List,
            props: {
              elements: titre.titulaires.map(({ nom }) => nom),
              mini: true
            },
            class: 'mb--xs',
            value: titre.titulaires.map(({ nom }) => nom).join(', ')
          }
        }

        if (this.activitesCol) {
          columns.activites = {
            component: TitreActivitesPills,
            props: {
              activitesAbsentes: titre.activitesAbsentes,
              activitesEnConstruction: titre.activitesEnConstruction
            },
            value: titre.activitesAbsentes + titre.activitesEnConstruction
          }
        }

        return {
          id: titre.id,
          link: { name: 'titre', params: { id: titre.id } },
          columns
        }
      })
    }
  },

  methods: {
    pageUpdate(page) {
      // called from parent component
      this.$refs.table.pageUpdate(page)
    },

    rangeUpdate(range) {
      // called from parent component
      this.$refs.table.rangeUpdate(range)
    }
  }
}
</script>
