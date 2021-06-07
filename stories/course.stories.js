import '../public/styles.css';
import React from 'react';
import { storiesOf } from '@storybook/react';

import CourseUnit from '../src/components/course-unit';
import CourseUnitPayload from '../src/course-unit.json';
import Course from '../src/components/course';
import CourseElement from '../src/components/course-element';

import '../src/App.css';

storiesOf('Course', module)
    .add('All Units', () => <Course {...CourseUnitPayload} />)
    .add('Single Unit', () => {
        const unit = CourseUnitPayload.units[0];
        return <CourseUnit {...unit} />
    })
    .add('Single Element', () => {
        const element = CourseUnitPayload.units[0].elements[0];
        return <CourseElement {...element} />
    })
