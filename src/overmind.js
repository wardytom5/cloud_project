import { createOvermind } from 'overmind';
import { createHook } from 'overmind-react';
import CoursePayload from './course-unit.json';
import { unnormalizeCourseJson, normalizeCourseJson } from './utils';

const FETCH_COURSE_URL = 'https://c2d51dfc-1802-45cb-bcc0-51a3737725f5.mock.pstmn.io/courses/advance-diploma-it';
const COURSE_STORAGE_KEY = 'cti-course-key';

const state = {
    ui: {
        isLoadingCourse: false,
        isLoadingJson: false,
        showSaveJsonModal: false,
        isProcessingJson: false,
        processJsonError: null
    },
    course: null,
    outputJson: null,
    tags: [],
    courseTags: null
}

const actions = {
    init: async ({ state, actions, effects }) => {
        state.ui.isLoadingCourse = true;
        try {
            let course = effects.loadCourseFromStorage();

            if(course) {
                state.course = course;
            } else {
                const course = await effects.fetchCourse();
                state.course = await normalizeCourseJson(course);
            }
        } catch(e) {
            state.course = CoursePayload;
            console.error(e);
        } finally {
            state.ui.isLoadingCourse = false;
        }
    },
    updateTag: ({ state, actions }, { tags, unit }) => {
        const tagValues = tags.map(t => t.id);

        state.tags = [...tagValues];
        
        state.course.units = state.course.units.map(u => {
            if(u.code !== unit.code) {
                return u;
            } else {
                return { ...u, tags: [...state.tags]}
            }
        });
        actions.saveJsonToLocalStorage();
    },
    displaySaveModal: ({state}) => {
        state.ui.showSaveJsonModal = true;
        state.ui.isLoadingJson = true;
        setTimeout(() => {
            state.outputJson = unnormalizeCourseJson(state.course);
            state.ui.isLoadingJson = false;
        }, 0);
    },
    uploadCourse: ({ state, actions }, courseContent) => {
        actions.resetJsonProcessState();
        state.ui.isProcessingJson = true;
        setTimeout(async () => {
            try {
                const json = JSON.parse(courseContent);
                if(json) {
                    state.course = await normalizeCourseJson(json);
                    state.ui.processJsonResult = 'success';
                } else {
                    state.ui.processJsonResult = 'fail';
                    state.ui.processJsonError = 'Be smart and set a proper JSON format 🤪'
                }
            } catch (e) {
                state.ui.processJsonResult = 'fail';
                state.ui.processJsonError = e.message;
                console.error(e);
            } finally {
                state.ui.isProcessingJson = false;
            } 
        }, 1000);
    },
    resetJsonProcessState: ({state}) => {
        state.ui.isProcessingJson = false;
        state.ui.processJsonError = null;
        state.ui.processJsonResult = null;
    },
    saveJsonToLocalStorage: ({state}) => {
        localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(state.course));
    },
    refreshCourseTags: ({state}) => {
        if(!state.course) return;

        state.ui.isLoadingCourse = true;
        setTimeout(() => {
            try {
                state.courseTags = state.course.units.reduce((prev, current) => { 
                    const unitName = current.name;
    
                    for(let tag of current.tags || []) {
                        prev = {
                            ...prev,
                            [tag]: [
                                ...(prev[tag] || []),
                                ...[unitName]
                            ]
                        }
                    }
                    return prev;
                }, {});
            } 
            catch(e) { console.error(e) }
            finally { state.ui.isLoadingCourse = false; }
        }, 0);
    },
    reorderCourse: ({state, actions}, {sourceIndex, destinationIndex}) => {
        const result = [...state.course.units];
        const [ removed ] = result.splice(sourceIndex, 1);
        result.splice(destinationIndex, 0, removed);
        state.course.units = result;
        actions.saveJsonToLocalStorage();
    }
}

const effects = {
    fetchCourse: async () => {
        const resp = await fetch(FETCH_COURSE_URL);
        return await resp.json();
    },
    loadCourseFromStorage: () => {
        const storeItem = localStorage.getItem(COURSE_STORAGE_KEY);
        return storeItem && JSON.parse(storeItem);
    }
}

export const overmind = createOvermind({
    state,
    actions,
    effects
});

export const useOvermind = createHook();