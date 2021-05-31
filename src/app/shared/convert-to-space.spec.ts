import { ConvertToSpacesPipes } from "./convert-to-spaces.pipe"

describe('ConvertToSapce', () => {
    it('should remove symbol by sapce', () => {

        let pipe = new ConvertToSpacesPipes();

        const value = 'GD-789';
        const expectedResult = 'GD 789';

        expect(pipe.transform(value,"-")).toEqual(expectedResult);

    })

    it('should remove symbol by sapce', () => {
        let pipe = new ConvertToSpacesPipes();
        expect(pipe.transform('GD-789',"-")).toEqual('GD 789');
    })
})