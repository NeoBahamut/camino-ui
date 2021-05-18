import {
  administration,
  administrationMetas,
  administrationModifier,
  administrationTitreTypeUpdate,
  administrationTitreTypeTitreStatutUpdate,
  administrationTitreTypeEtapeTypeUpdate,
  administrationActiviteTypeUpdate,
  administrationPermissionsMetas
} from '../api/administrations'

import { oneData } from '../utils'

const state = {
  element: null,
  metas: {
    domaines: [],
    types: [],
    regions: [],
    departements: [],
    titresStatuts: [],
    etapesTypes: [],
    activitesTypes: []
  }
}

const actions = {
  async init({ commit }) {
    try {
      commit('loadingAdd', 'administrationInit', { root: true })

      const data = await administrationMetas()

      commit('metasSet', data)
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'administrationInit', { root: true })
    }
  },

  async permissionsInit({ commit }) {
    try {
      commit('loadingAdd', 'administrationPermissionsInit', {
        root: true
      })

      const data = await administrationPermissionsMetas()
      commit('metasSet', data)
    } catch (e) {
      commit('messageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'administrationPermissionsInit', {
        root: true
      })
    }
  },

  async get({ commit, dispatch }, id) {
    try {
      commit('loadingAdd', 'administration', { root: true })

      const data = oneData(await administration({ id }))

      commit('set', data)
    } catch (e) {
      dispatch('apiError', e, { root: true })
    } finally {
      commit('loadingRemove', 'administration', { root: true })
    }
  },

  async update({ commit, dispatch }, administration) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('popupLoad', null, { root: true })
      commit('loadingAdd', 'administrationUpdate', { root: true })
      const data = oneData(await administrationModifier({ administration }))

      commit('popupClose', null, { root: true })
      await dispatch(
        'reload',
        { name: 'administration', id: data.id },
        { root: true }
      )
      dispatch(
        'messageAdd',
        { value: `l'administration a été mise à jour`, type: 'success' },
        { root: true }
      )
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'administrationUpdate', { root: true })
    }
  },

  async titreTypeUpdate({ commit, dispatch }, administrationTitreType) {
    try {
      commit('loadingAdd', 'administrationTitreTypeUpdate', {
        root: true
      })

      const data = oneData(
        await administrationTitreTypeUpdate({
          administrationTitreType
        })
      )

      await dispatch(
        'reload',
        { name: 'administration', id: data.id },
        { root: true }
      )
      dispatch(
        'messageAdd',
        { value: `l'administration a été mise à jour`, type: 'success' },
        { root: true }
      )
    } catch (e) {
      commit('messageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'administrationTitreTypeUpdate', {
        root: true
      })
    }
  },

  async titreTypeTitreStatutUpdate(
    { commit, dispatch },
    administrationTitreTypeTitreStatut
  ) {
    try {
      commit('loadingAdd', 'administrationTitreTypeTitreStatutUpdate', {
        root: true
      })

      const data = oneData(
        await administrationTitreTypeTitreStatutUpdate({
          administrationTitreTypeTitreStatut
        })
      )

      await dispatch(
        'reload',
        { name: 'administration', id: data.id },
        { root: true }
      )
      dispatch(
        'messageAdd',
        { value: `l'administration a été mise à jour`, type: 'success' },
        { root: true }
      )
    } catch (e) {
      commit('messageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'administrationTitreTypeTitreStatutUpdate', {
        root: true
      })
    }
  },

  async titresTypeEtapeTypeUpdate(
    { commit, dispatch },
    administrationTitreTypeEtapeType
  ) {
    try {
      commit('loadingAdd', 'administrationTitreTypeEtapeTypeUpdate', {
        root: true
      })

      const data = oneData(
        await administrationTitreTypeEtapeTypeUpdate({
          administrationTitreTypeEtapeType
        })
      )

      await dispatch(
        'reload',
        { name: 'administration', id: data.id },
        { root: true }
      )
      dispatch(
        'messageAdd',
        { value: `l'administration a été mise à jour`, type: 'success' },
        { root: true }
      )
    } catch (e) {
      commit('messageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'administrationTitreTypeEtapeTypeUpdate', {
        root: true
      })
    }
  },

  async activiteTypeUpdate({ commit, dispatch }, administrationActiviteType) {
    try {
      commit('loadingAdd', 'administrationActiviteTypeUpdate', {
        root: true
      })

      const data = oneData(
        await administrationActiviteTypeUpdate({
          administrationActiviteType
        })
      )

      await dispatch(
        'reload',
        { name: 'administration', id: data.id },
        { root: true }
      )
      dispatch(
        'messageAdd',
        { value: `l'administration a été mise à jour`, type: 'success' },
        { root: true }
      )
    } catch (e) {
      commit('messageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'administrationActiviteTypeUpdate', {
        root: true
      })
    }
  }
}

const mutations = {
  metasSet(state, data) {
    Object.keys(data).forEach(id => {
      if (id === 'administrationsTypes') {
        state.metas.types = data[id]
      } else if (id === 'statuts') {
        state.metas.titresStatuts = data[id]
      } else {
        state.metas[id] = data[id]
      }
    })
  },

  set(state, administration) {
    state.element = administration
  },

  reset(state) {
    state.element = null
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
