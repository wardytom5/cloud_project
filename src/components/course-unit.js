import React from 'react';
import PropTypes from 'prop-types';
import CourseElement from './course-element';
import CourseTags from './course-tags';
import { Accordion, Icon, Label } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';

const getDragStyles = (isDragging = false) => isDragging ? ({
    backgroundColor: isDragging ? '#fff8db' : 'white',
    boxShadow: '0 0 0 1px #b58105 inset, 0 0 0 0 transparent'
}) : null;

const CourseUnit = ({ 
    name, 
    code, 
    elements,
    tags,
    onTagsUpdated,
    index
}) =>
{
    const handleTagsUpdated = React.useCallback((tags) => onTagsUpdated(tags), [ onTagsUpdated ]);

    const [ isActive , setActive ] = React.useState(false);

    const toggleActive = React.useCallback(() => {
        setActive(a => !a);
    }, [ setActive ]);

    return (
        <Draggable
            draggableId={code}
            index={index}>
            {(draggableProvided, draggableSnapshot) => (
                <div 
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}>
                        <div style={{paddingBottom: 8}}>
                            <Accordion 
                                active={isActive.toString()} 
                                fluid 
                                style={getDragStyles(draggableSnapshot.isDragging)}
                                styled>
                                <Accordion.Title 
                                    className='disable-selection'
                                    onClick={toggleActive}>
                                    <Icon name="exchange"
                                        flipped='horizontally'
                                        circular
                                        color='blue'
                                        style={{backgroundColor: 'white'}}
                                        rotated="clockwise"
                                        {...draggableProvided.dragHandleProps} />
                                    <Icon name={isActive ? 'caret down' : 'caret right'} />
                                        {`${code} - ${name}`}
                                        {tags ? tags.map(tag => <Label key={tag}>{tag}</Label>) : null}
                                </Accordion.Title>
                                <Accordion.Content active={isActive}>
                                    <CourseTags selectedTags={tags} onTagsUpdated={handleTagsUpdated} />
                                    {elements && elements.map(e => <CourseElement key={e.id} name={e.name} criterias={e.criterias} />)}
                                </Accordion.Content>
                            </Accordion>
                            
                        </div>
                </div>
            )}
        </Draggable>
    )
};

CourseUnit.propTypes = {
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
};

export default CourseUnit;