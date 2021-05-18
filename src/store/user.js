import {
  moi,
  utilisateurTokenCreer,
  utilisateurCerbereTokenCreer,
  utilisateurCerbereUrlObtenir,
  utilisateurCreationMessageEnvoyer,
  utilisateurCreer,
  utilisateurMotDePasseMessageEnvoyer,
  utilisateurMotDePasseInitialiser,
  userMetas
} from '../api/utilisateurs'

import tiles from '../utils/map-tiles'

import router from '../router'

import { oneData } from '../utils'

const state = {
  element: null,
  metas: {
    domaines: [],
    version: null,
    /* global npmVersion */
    // @ts-ignore
    versionUi: `${npmVersion}`,
    tiles,
    entreprisesTitresCreation: []
  },
  preferences: {
    carte: { tilesId: 'osm-fr', markerLayersId: 'clusters' }
  },
  loaded: false
}

const actions = {
  async init({ commit, dispatch }) {
    try {
      commit('loadingAdd', 'userInit', { root: true })

      const data = await userMetas({ titresCreation: true })

      commit('metasSet', data)
    } catch (e) {
      dispatch('apiError', e, { root: true })
    } finally {
      commit('loadingRemove', 'userInit', { root: true })
    }
  },

  async identify({ commit, dispatch }) {
    try {
      commit('loadingAdd', 'userMoi', { root: true })
      const data = oneData(await moi())

      commit('set', data)

      await dispatch('init')
    } catch (e) {
      dispatch('tokensRemove')
      commit('reset')
    } finally {
      commit('loadingRemove', 'userMoi', { root: true })
      commit('load')
    }
  },

  async login({ commit, dispatch }, { email, motDePasse }) {
    try {
      commit('loadingAdd', 'userLogin', { root: true })

      commit('popupMessagesRemove', null, { root: true })

      const data = oneData(await utilisateurTokenCreer({ email, motDePasse }))
      const { utilisateur } = data

      dispatch('tokensSet', data)
      commit('set', utilisateur)
      commit('popupClose', null, { root: true })
      dispatch(
        'messageAdd',
        {
          value: `bienvenue ${utilisateur.prenom} ${utilisateur.nom}`,
          type: 'success'
        },
        { root: true }
      )

      await dispatch('init')
      dispatch('errorRemove', null, { root: true })
    } catch (e) {
      dispatch('tokensRemove')
      commit('reset')
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'userLogin', { root: true })
    }
  },

  async cerbereUrlGet({ commit }, url) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('loadingAdd', 'cerbereUrlGet', { root: true })

      const data = oneData(await utilisateurCerbereUrlObtenir({ url }))

      return data
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'cerbereUrlGet', { root: true })
    }
  },

  async cerbereLogin({ commit, dispatch }, { ticket }) {
    try {
      commit('loadingAdd', 'userCerbereLogin', { root: true })

      const data = oneData(await utilisateurCerbereTokenCreer({ ticket }))

      const { utilisateur } = data

      dispatch('tokensSet', data)
      commit('set', utilisateur)
      dispatch(
        'messageAdd',
        {
          value: `bienvenue ${utilisateur.prenom} ${utilisateur.nom}`,
          type: 'success'
        },
        { root: true }
      )

      await dispatch('init')
      dispatch('errorRemove', null, { root: true })
    } catch (e) {
      dispatch('tokensRemove')
      commit('reset')
    } finally {
      commit('loadingRemove', 'userCerbereLogin', { root: true })
      commit('load')
    }
  },

  async logout({ commit, dispatch }) {
    commit('menuClose', null, { root: true })
    dispatch('tokensRemove')
    commit('reset')
    dispatch(
      'messageAdd',
      { value: `vous êtes déconnecté`, type: 'success' },
      { root: true }
    )
  },

  async addEmail({ commit, dispatch }, email) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('loadingAdd', 'userAddEmail', { root: true })

      await utilisateurCreationMessageEnvoyer({ email })

      commit('popupClose', null, { root: true })
      dispatch(
        'messageAdd',
        {
          value: 'un email pour créer votre compte a été envoyé',
          type: 'success'
        },
        { root: true }
      )
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'userAddEmail', { root: true })
    }
  },

  async add({ commit, dispatch }, utilisateur) {
    try {
      commit('loadingAdd', 'userAdd', { root: true })

      const data = oneData(await utilisateurCreer({ utilisateur }))

      if (data) {
        dispatch(
          'messageAdd',
          {
            value: `utilisateur ${data.prenom} ${data.nom} ajouté`,
            type: 'success'
          },
          { root: true }
        )

        await dispatch('login', {
          email: data.email,
          motDePasse: utilisateur.motDePasse
        })

        router.push({ name: 'titres' })
      }
    } catch (e) {
      dispatch('messageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'userAdd', { root: true })
    }
  },

  async passwordInitEmail({ commit, dispatch }, email) {
    try {
      commit('popupMessagesRemove', null, { root: true })
      commit('loadingAdd', 'utilisateurPasswordInitEmail', { root: true })

      const data = oneData(
        await utilisateurMotDePasseMessageEnvoyer({
          email
        })
      )
      commit('popupClose', null, { root: true })
      dispatch('messageAdd', { value: data, type: 'success' }, { root: true })
    } catch (e) {
      commit('popupMessageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'utilisateurPasswordInitEmail', {
        root: true
      })
    }
  },

  async passwordInit({ commit, dispatch }, { motDePasse1, motDePasse2 }) {
    try {
      commit('loadingAdd', 'utilisateurPasswordInit', { root: true })

      const data = oneData(
        await utilisateurMotDePasseInitialiser({
          motDePasse1,
          motDePasse2
        })
      )

      dispatch(
        'messageAdd',
        {
          value: 'mot de passe mis à jour',
          type: 'success'
        },
        { root: true }
      )

      router.push({ name: 'titres' })

      dispatch('tokensSet', data)
      commit('set', data.utilisateur)
      dispatch(
        'messageAdd',
        {
          value: `bienvenue ${data.utilisateur.prenom} ${data.utilisateur.nom}`,
          type: 'success'
        },
        { root: true }
      )
    } catch (e) {
      dispatch('messageAdd', { value: e, type: 'error' }, { root: true })
    } finally {
      commit('loadingRemove', 'utilisateurPasswordInit', { root: true })
    }
  },

  preferencesSet({ commit }, { section, params }) {
    if (section === 'conditions') {
      localStorage.setItem('conditions', params.value)
    } else {
      commit('preferencesSet', { section, params })
    }
  },

  tokensSet(_, tokens) {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  },

  tokensRemove() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

const getters = {
  tilesActive(state) {
    return state.metas.tiles.find(
      ({ id }) => id === state.preferences.carte.tilesId
    )
  },

  preferencesConditions(state) {
    if (state.element) {
      return true
    }

    const threedays = 1000 * 60 * 60

    if (
      localStorage.getItem('conditions') &&
      Number(localStorage.getItem('conditions')) + threedays >
        new Date().getTime()
    ) {
      return true
    }

    return false
  }
}

const mutations = {
  load(state) {
    state.loaded = true
  },

  preferencesSet(state, { section, params }) {
    Object.keys(params).forEach(id => {
      state.preferences[section][id] = params[id]
    })
  },

  set(state, user) {
    state.element = user
  },

  reset(state) {
    state.element = null
    state.metas.entreprisesTitresCreation = []
    state.metas.domaines = []
  },

  metasSet(state, data) {
    Object.keys(data).forEach(id => {
      state.metas[id] = data[id]
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
