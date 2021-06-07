import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CourseTags from '../src/components/course-tags';

storiesOf('Course Tags', module)
    .add('Default', () => <CourseTags onTagsUpdated={action('on-tags-updated')} />)
    .add('With Selected tags', () => <CourseTags selectedTags={[ "rubens", "gomes" ]} onTagsUpdated={action('on-tags-updated')} />)