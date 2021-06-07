import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, Segment, Container, Message } from 'semantic-ui-react'

const CourseElement = ({name, criterias}) => {
    const [ isActive, setActive ] = React.useState(false);

    const toggleActive = React.useCallback(() => {
        setActive(a => !a);
    }, [ setActive ]);

    return (
        <Accordion>
            <Accordion.Title active={isActive} onClick={toggleActive}>
                <Icon name="dropdown" />
                {name}
            </Accordion.Title>
            <Accordion.Content active={isActive}>
                <div style={{padding: '0 10px 10px 10px'}}>
                    {criterias && criterias.map(c => <Message key={c.id}>{c.name}</Message>)}
                </div>
            </Accordion.Content>
        </Accordion>

        // <div>
        //     <h3>{name}</h3>
        //     <ul>
        //         {criterias && criterias.map(c => <li key={c.id}>{c.name}</li>)}
        //     </ul>
        // </div>
    );
};

CourseElement.propTypes = {
    name: PropTypes.string.isRequired,
    criterias: PropTypes.array.isRequired
}

export default CourseElement;
