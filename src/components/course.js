import React from 'react';
import CourseUnit from './course-unit';
import { useOvermind } from '../overmind';
import { Menu, Icon, Message, Tab } from 'semantic-ui-react';
import DownloadCourseModal from './download-course-modal';
import UploadCourseModal from './upload-course-modal';
import UnitsTaggedGroup from './units-tagged-group';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const CourseUnits = ({units, onTagsUpdated}) => {

    return (
            <Droppable 
                droppableId="droppable"
            >
                {(droppableProvided, droppableSnapshot) => {
                    return (<div ref={droppableProvided.innerRef}>
                        {units.map((u, index) => (<CourseUnit
                                            key={u.code}
                                            onTagsUpdated={onTagsUpdated(u)}
                                            tags={u.tags}
                                            name={u.name} 
                                            code={u.code} 
                                            index={index}
                                            elements={u.elements} />))}
                        {droppableProvided.placeholder}
                    </div>)
                }}
            </Droppable>
    )
};

const Course = () => {

    const { state, actions } = useOvermind();

    const { name, code, units } = state.course || {};

    const handleTagsUpdated = React.useCallback((unit) => (tags) => actions.updateTag({ unit, tags }), [ actions ]);

    const handleDragEnd = React.useCallback((result) => {
        if(!result.destination) {
            return;
        }

        // console.log('onDragEnd', { result });

        actions.reorderCourse({
            sourceIndex: result.source.index,
            destinationIndex: result.destination.index
        });
    }, [ actions ]);

    if(!state.course) 
    {
        return (<Message color='yellow'><Icon name='warning'></Icon>No course uploaded...</Message>);
    }

    const panes = [
        { 
            menuItem: { key: 'course-units', icon: 'list', content: 'Units' },
            render: () => (<Tab.Pane>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <CourseUnits units={units} onTagsUpdated={handleTagsUpdated} />
                </DragDropContext>
            </Tab.Pane>)
        },
        {
            menuItem: { key: 'course-group', icon: 'sitemap', content: 'Units Grouped by Tag'},
            render: () => <Tab.Pane><UnitsTaggedGroup /></Tab.Pane>
        }
    ]

    return (
        <div>
            <Menu>
                <h2 style={{padding: '5px 20px'}}>{code} - {name}</h2>
                <Menu.Menu position='right'>
                    <UploadCourseModal modalTrigger={<Menu.Item color='violet' active={true}>
                        <Icon name='upload'></Icon>
                        <strong>Upload JSON</strong>
                    </Menu.Item>} />
                    
                    <DownloadCourseModal
                        modalTrigger={(
                            <Menu.Item color='green' active={true}>
                                <Icon name="download"></Icon>
                                <strong>Download JSON</strong>
                            </Menu.Item>
                        )}
                    />
                </Menu.Menu>
            </Menu>

            <Tab panes={panes} />
        </div>
    );
}

export default Course;