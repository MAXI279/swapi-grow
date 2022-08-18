const axios = require('axios').default;
const { SWAPI_BASE_URL, RESULTS_PER_PAGE } = require('../config/constants')

sortByString = (property) => {
    return (a,b) => ((a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0)
}

sortByNumeric= (property) => {
    return (a,b) => {
      const aValue = Number(a[property].replaceAll(',', ''))
      const bValue = Number(b[property].replaceAll(',', ''))

      if(!isNaN(aValue) && !isNaN(bValue)){
        return (aValue - bValue)
      }else{
        return isNaN(aValue) ? 1 : -1
      }
    }
}

const getAllResources = async (resource) => {
    const firstPage = (await axios.get(`${SWAPI_BASE_URL}${resource}?page=1`)).data;

    const pages = Math.ceil(firstPage.count / RESULTS_PER_PAGE)

    const repeats = Array.from(Array(pages-1).keys()).map(i => 2 + i);

    const promises = repeats.map( (promisePage) => axios.get(`${SWAPI_BASE_URL}${resource}?page=${promisePage}`))

    const results = await Promise.all(promises)

    return [...firstPage.results, ...results.map( res => res.data.results ).flat()]
}

module.exports = {
    sortByString,
    sortByNumeric,
    getAllResources
}