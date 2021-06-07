import React, { useCallback } from 'react';
import { useOvermind } from '../overmind';
import { Modal, Button, Form, TextArea, Message,
    Header,
    Dimmer, Loader, Segment, Icon } from 'semantic-ui-react';

const UploadCourseModal = ({modalTrigger}) => {
    const { state, actions } = useOvermind();
    
    const [ courseContent, setCourseContent ] = React.useState(null);

    const modalRef = React.useRef(null);

    React.useEffect(() => {
        if(state.ui.processJsonResult === 'success') {
            const timeoutId = setTimeout(() => modalRef.current.handleClose(), 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [ state.ui.processJsonResult ]);

    const handleTextChanged = useCallback(event => {
        const textContent = event.target.value;
        setCourseContent(textContent);
    }, [ setCourseContent ]);

    const handleUploadCourse = useCallback(() => {
        actions.uploadCourse(courseContent);
    }, [ courseContent, actions ]);

    const handleModalClosed = useCallback(() => {
        actions.resetJsonProcessState();
    }, [ actions ]);

    return (
        <Modal
            ref={modalRef}
            trigger={modalTrigger}
            onClose={handleModalClosed}
            closeOnEscape={state.ui.isProcessingJson === false}
            closeOnDimmerClick={state.ui.isProcessingJson === false}>
            <Modal.Header>Course Upload</Modal.Header>
            <Modal.Content>
                <Dimmer active={state.ui.isProcessingJson}>
                    <Loader />
                </Dimmer>
                {state.ui.processJsonError 
                    ? (<Message color='red'>
                            <Icon name='bug' color='red' size='large' />
                            {state.ui.processJsonError}
                        </Message>)
                    : null }

                {state.ui.processJsonResult === 'success'
                    ? <Segment textAlign='center'>
                        <Icon size='massive' color='green' name='hand peace outline' />
                        <Header color='green' as="h2">Course JSON uploaded</Header>
                    </Segment>
                    : (<Form>
                        <TextArea 
                            rows={10}
                            onChange={handleTextChanged}
                            placeholder='Paste the JSON content here' />
                    </Form>)}
            </Modal.Content>
            <Modal.Actions>
                {state.ui.processJsonResult === 'success' 
                    ? null
                    : (<Button
                        disabled={Boolean(courseContent) === false}
                        positive
                        labelPosition='right'
                        icon='upload'
                        content='Upload'
                        onClick={handleUploadCourse}
                    />)}
            </Modal.Actions>
        </Modal>
    );
};

export default UploadCourseModal;