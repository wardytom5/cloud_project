import React, { useCallback, useState, useEffect } from 'react';
import { useOvermind } from '../overmind';

import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const parseSelectedTagsOrNull = (tags) => (tags && tags.map(text => ({id: text, text }))) || [];

const CourseTags = (props) => {
    // useWhyDidYouUpdate('[course-tags]', props);
    const { onTagsUpdated } = props;
    const [ tags, setTags ] = useState(parseSelectedTagsOrNull(props.selectedTags));

    useEffect(() => {
        setTags(parseSelectedTagsOrNull(props.selectedTags))
    }, [ setTags, props.selectedTags ] )

    const notifyTagsUpdated = useCallback((tags) => {
        //console.log('should notify with', { onTagsUpdated, tags });
        onTagsUpdated && onTagsUpdated(tags)
    }, [ onTagsUpdated] );

    const handleDelete = useCallback(index => {
        const newTags = tags.filter((tag, i) => i !== index);
        notifyTagsUpdated(newTags);
    }, [ tags, notifyTagsUpdated ]);

    const handleAddition = useCallback(tag => {
        const newTags = [...tags.filter(t => t.id !== tag.id), tag]
        notifyTagsUpdated(newTags);
    }, [ tags, notifyTagsUpdated ]);

    return (
        <div>
            <ReactTags 
                classNames={{
                    tag: 'ui label',
                    tagInput: 'ui input'
                }}
                tags={tags}
                allowDragDrop={false}
                delimiters={delimiters}
                handleDelete={handleDelete}
                handleAddition={handleAddition} />
        </div>
    );
}

export const OvermindedCourseTags = ({ unit }) => {
    const { state, actions } = useOvermind();

    const stateUnit = state.course.units.filter(u => u.code === unit.code);

    const handleTagSelected = useCallback((tags) => {
        //console.log('handle called...');
        actions.updateTag({ unit, tags })
    }, [ actions, unit ]);

    return <CourseTags
                tags={state.tags}
                selectedTags={stateUnit.tags ? [...stateUnit.tags] : []}
                onTagsUpdated={handleTagSelected}
            />
}

export default CourseTags;