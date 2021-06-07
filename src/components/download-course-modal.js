import React from 'react';
import { Modal, Segment, Dimmer, Loader, Button } from 'semantic-ui-react';
import { useOvermind } from '../overmind';
import ReactJson from 'react-json-view';
import FileSaver from 'file-saver';

const saveJsonContent = (json) => {
    var blob = new Blob([JSON.stringify(json)], { type: 'application.json;charset=utf-8'});
    FileSaver.saveAs(blob, 'course-content.json');
}

const DownloadCourseModal = ({ modalTrigger }) => {
    const { state, actions } = useOvermind();

    const handleOnModalOpen = React.useCallback(() => {
        actions.displaySaveModal();
    }, [ actions ]);

    const handleSave = React.useCallback(() => {
        saveJsonContent(state.outputJson);
    }, [state.outputJson]);

    return (
        <Modal trigger={modalTrigger} onOpen={handleOnModalOpen}>
            <Modal.Header>Download Course</Modal.Header>
            <Modal.Content>
                <Segment style={{height: 500, overflow: 'auto'}}>
                    <Dimmer active={state.ui.isLoadingJson}>
                        <Loader />
                    </Dimmer>
                    {state.outputJson && state.ui.isLoadingJson === false
                    ? <ReactJson 
                        name={false}
                        style={{overflow: 'auto'}}
                        onEdit={false} onAdd={false} onDelete={false}
                        src={state.outputJson} /> 
                    : null}
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button 
                    loading={state.ui.isLoadingJson}
                    positive
                    labelPosition='right'
                    icon='download'
                    content='Download'
                    onClick={handleSave}
                />
            </Modal.Actions>
        </Modal>
    );
}

export default DownloadCourseModal;