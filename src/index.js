const express = require('express');
const axios = require('axios').default;

const validateQueryParams = require('./middlewares/validate-query-params')
const { sortByString, sortByNumeric, getAllResources } = require('./utils')
const { getPeople } = require('./use-cases/get-people');
const ErrorHandler = require('./utils/ErrorHandler');
const HttpResponse = require('./utils/HttpResponse');
const Logger = require('./utils/Logger');

const app = express();

const logger = new Logger();
const requestHandler = new HttpResponse(logger);

app.get('/people', validateQueryParams('sortBy', ['height', 'name', 'mass']), async (req, res, next) => {
    const { sortBy } = req.query;
    try {

        const people = await getPeople(sortBy)

        return requestHandler.sendSuccess(res,200)({ length: people.length, people })

    } catch (error) {
        next(error)
    }

})

app.get('/planets', async (req, res, next) => {

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
        next(error)
    }
})

app.use(ErrorHandler)

app.listen(4000, () => {
    console.log('Listening on port 4000')
})