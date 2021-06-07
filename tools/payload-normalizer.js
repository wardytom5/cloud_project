const InputContent = require('../ICT60115.json');
const fs = require('fs');

const OutputContent = {
    name: InputContent.name,
    code: InputContent.code,
    units: InputContent.units.map(u => {
        return {
            name: u.name,
            code: u.code,
            elements: Object.keys(u.EPC).map(eKey => {
                const el = u.EPC[eKey];
                return {
                    id: eKey,
                    name: el.name,
                    criterias: Object.keys(el.pc).map(cKey => {
                        const criteria = el.pc[cKey];
                        return {
                            id: cKey,
                            name: criteria.text
                        }
                    })
                };
            })
        }
    })
}

const contentJson = JSON.stringify(OutputContent);

fs.writeFile('course-unit.json', contentJson, 'utf8', (err) =>{
    if(err) console.error(err);
    else console.log('file created...');
});

console.log(OutputContent);