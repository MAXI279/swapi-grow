const {
    getPeople
} = require('../../src/use-cases/get-people')

jest.setTimeout(30000);
describe('PEOPLE', () => {

    beforeEach(() => {
    })
    test('should be able to show all people', async () => {
        //arrange
        //act
        const result = await getPeople();
        //assert
        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.anything(),
                    height: expect.anything(),
                    mass: expect.anything(),
                })
            ])
        )
    })

    test('should return all people sorted by height ASC', async () => {
        //act
        const people = await getPeople('height');
        const checkOrderByHeight = people.every((p, i, { [i-1]: b }) =>  !b || (Number(p.height) >= Number(b.height) || p.height === 'unknown') )
        //assert
        expect(checkOrderByHeight).toBeTruthy()
    })

    test('should return all people sorted by mass ASC', async () => {
        //act
        const people = await getPeople('mass');
        const checkOrderByMass = people.every((p, i, { [i-1]: b }) =>  !b || (Number(p.mass.replaceAll(',', '')) >= Number(b.mass.replaceAll(',', '')) || p.mass === 'unknown') )
        //assert
        expect(people).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    mass: expect.anything(),
                })
            ])
        )
        expect(checkOrderByMass).toBeTruthy()
    })

    test('should return all people sorted by name ASC', async () => {
        //act
        const people = await getPeople('name');
        const checkOrderByName = people.every((p, i, { [i-1]: b }) =>  !b || (p.name >= b.name) )
        //assert
        expect(checkOrderByName).toBeTruthy()
    })
});