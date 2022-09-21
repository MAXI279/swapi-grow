const { sortByString, sortByNumeric, getAllResources } = require('../utils')

const getPeople = async (sortBy) => {
    let people = await getAllResources('people')

    const availableProps = {
        'name': sortByString("name"),
        'height': sortByNumeric("height"),
        'mass': sortByNumeric("mass")
    }

    if(sortBy && availableProps[sortBy]){
        people = people.sort(availableProps[sortBy])
    }

    return people;
}

module.exports = { getPeople }
