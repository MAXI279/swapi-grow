
sortByString = (property) => {
    return (a,b) => ((a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0)
}

sortByNumeric= (property) => {
    return (a,b) => ( Number(a[property]) - Number(b[property]) )
}

module.exports = {
    sortByString,
    sortByNumeric
}