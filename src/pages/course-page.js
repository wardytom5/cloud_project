import React from 'react';
import Course from '../components/course';
import {useOvermind} from '../overmind';
import { Dimmer, Loader } from 'semantic-ui-react';

const Page = () => {
    const { state } = useOvermind();

    return (
        <div>
            <Dimmer active={state.ui.isLoadingCourse}>
                <Loader />
            </Dimmer>
            <Course />
        </div>
    );
};

export default Page;