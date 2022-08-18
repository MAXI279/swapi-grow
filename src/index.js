const express = require('express');
const axios = require('axios').default;

const { sortByString, sortByNumeric, getAllResources } = require('./utils')

const app = express();

app.get('/people', async (req, res) => {
    const { sortBy } = req.query;
    try {

        let people = await getAllResources('people')

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
        let planets = await getAllResources('planets')

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