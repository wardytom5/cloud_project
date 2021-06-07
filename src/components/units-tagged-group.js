import React from 'react';
import { Card, List, Message, Icon } from 'semantic-ui-react';
import { useOvermind } from '../overmind';

const colours = [
    'yellow',
    'orange',
    'green',
    'teal',
    'blue',
    'purple',
    'pink',
    'red',
    'black'
];

const getRandomColour = (index) => {
    if(index < colours.length) return colours[index];
    const min = 0;
    const max = colours.length - 1;
    return colours[Math.floor(Math.random() * (max - min + 1)) + min];
}

const TagGroup = ({ name, units, color }) => {
    return (<Card color={color}>
        <Card.Content>
            <Card.Header><Icon name='tag' color={color} />{name}</Card.Header>
            <Card.Description>
                <List>
                    {units.map(u => (<List.Item key={u}><Icon name='circle outline' />{u}</List.Item>))}
                </List>
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            {units.length} unit(s)
        </Card.Content>
    </Card>)
}

const UnitsTaggedGroup = () => {

    const { state, actions } = useOvermind();

    React.useEffect(() => {
        actions.refreshCourseTags();
    }, []);

    const courseTags = React.useMemo(() => {
        if(!state.courseTags) return null;
        return Object.keys(state.courseTags).map((name, index) => ({
            name, units: state.courseTags[name], color: getRandomColour(index)
        }));
    }, [ state.courseTags ]);

    if(!courseTags || courseTags.length === 0) {
        return (<Message color='blue'><Icon name='info' />Add tag to at least one unit.</Message>)
    }

    return (<Card.Group>
        {courseTags.map(c => (<TagGroup key={c.name} {...c} />))}
    </Card.Group>);
}

export default UnitsTaggedGroup