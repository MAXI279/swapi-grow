const express = require('express');
const axios = require('axios').default;
const { SWAPI_BASE_URL, RESULTS_PER_PAGE } = require('./config/constants')

const { sortByString, sortByNumeric } = require('./utils')

const app = express();

app.get('/people', async (req, res) => {
    const { sortBy } = req.query;
    try {
        const firstPage = (await axios.get(`${SWAPI_BASE_URL}people?page=1`)).data;

        const pages = Math.ceil(firstPage.count / RESULTS_PER_PAGE)

        const repeats = Array.from(Array(pages-1).keys()).map(i => 2 + i);

        const promises = repeats.map( (promisePage) => axios.get(`${SWAPI_BASE_URL}people?page=${promisePage}`))

        const results = await Promise.all(promises)

        let people = [...firstPage.results, ...results.map( res => res.data.results ).flat()]

        const availableProps = {
            'name': sortByString("name"),
            'height': sortByNumeric("height"),
            'mass': sortByNumeric("mass")
        }

        if(sortBy && availableProps[sortBy]){
            people = people.sort(availableProps[sortBy])
        }

        return res.status(200).json({
            length: people.length,
            people
        })
    } catch (error) {
        console.error(error)
    }

})

app.get('/planets', async (req, res) => {

    try {
        const firstPage = (await axios.get(`${SWAPI_BASE_URL}planets?page=1`)).data;

        const pages = Math.ceil(firstPage.count / RESULTS_PER_PAGE)

        const repeats = Array.from(Array(pages-1).keys()).map(i => 2 + i);

        const promises = repeats.map( (promisePage) => axios.get(`${SWAPI_BASE_URL}planets?page=${promisePage}`))

        const results = await Promise.all(promises)

        let planets = [ ...firstPage.results, ...results.map( res => res.data.results ).flat() ]

        residents = [...new Set(planets.map((planet) => (planet.residents)).flat())]
        //console.log(residents)
        const residentsResults = await Promise.allSettled(residents.map(resident => axios.get(resident)))

        const residentsData =  residentsResults.map( res => ( res.status === 'fulfilled' ? {...res.value.data} : {} ))

        planets = planets.map((planet) => {
            return {
                ...planet,
                residents: planet.residents.map((resid) => {
                    const findResident = residentsData.find((resident) => resident.url === resid)
                    return findResident ? findResident.name : resid
                } )
            }

        })

        return res.status(200).json({
            length: planets.length,
            planets,
        })
    } catch (error) {
        console.error(error)
    }
})

app.listen(4000, () => {
    console.log('Listening on port 4000')
})