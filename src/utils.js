

const reduceCourseCriterias = (criterias) => {
    return criterias.reduce((previous, current) => {
        return {
            ...previous,
            [current.id]: { text: current.name }
        }
    }, {});
}

const reduceCourseElements = (elements) => {
    return elements.reduce((previous, current) => {
        return {
            ...previous,
            [current.id]: {
                name: current.name,
                pc: reduceCourseCriterias(current.criterias)
            }
        }
    }, {});
}

export const unnormalizeCourseJson = (input) => {
    const output = {
        name: input.name,
        code: input.code,
        units: input.units.map(unit => {
            return {
                name: unit.name,
                code: unit.code,
                tags: unit.tags,
                EPC: reduceCourseElements(unit.elements)
            }
        })
    }
    return output;
}

export const normalizeCourseJson = (input) => new Promise((resolve, reject) => setTimeout(() => {
    try {
        resolve({
            name: input.name,
            code: input.code,
            units: input.units.map(u => {
                return {
                    name: u.name,
                    code: u.code,
                    tags: u.tags || [],
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
        });
    } catch {
        reject(new Error('Invalid JSON format.'));
    }
}, 0));