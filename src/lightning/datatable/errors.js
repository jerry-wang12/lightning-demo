export function getErrorsState() {
    return {
        errors: {
            rows: {},
            table: {},
        },
    };
}

export function getErrors(state) {
    return state.errors;
}

export function setErrors(state, errors) {
    return (state.errors = Object.assign({}, getErrorsState(), errors));
}

export function getRowError(state, rowKey) {
    const rows = getErrors(state).rows;
    return (rows && rows[rowKey]) || {};
}

export function getTableError(state) {
    return getErrors(state).table || {};
}
