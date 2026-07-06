const branches = {
  'beta.forge.creditchain.org': 'beta',
  'alpha.forge.creditchain.org': 'alpha',
  'forge.creditchain.org': 'live'
}

const getBaseUrl = () => {
  const branch = branches[window.location.hostname] || 'live'
  return `https://raw.githubusercontent.com/openibank/forge-dynamics/refs/heads/${branch}/`
}

export const HOME_TAB_BASE_URL = getBaseUrl()
export const HOME_TAB_NEW_UPDATES = HOME_TAB_BASE_URL + 'hometab/new-updates.json'
export const HOME_TAB_PLUGIN_LIST = HOME_TAB_BASE_URL + 'hometab/plugin-list.json'
