// diviisble by 2 and 3, easy for arranging rows with
// [1/2 field + 1/2 field] and [1/3 field + 2/3 field]
const MAX_ROW_WIDTH = 6;

const FIELD_WIDTHS = {
    street: {
        width: 6,
    },
    city: {
        width: 4,
    },
    province: {
        width: 2,
    },
    postalCode: {
        width: 4,
    },
    country: {
        width: 2,
    },
};

export function getFieldWidth(fieldName) {
    return FIELD_WIDTHS[fieldName];
}

export function getFieldWidthClass(field) {
    return `slds-size_${field.width}-of-${MAX_ROW_WIDTH}`;
}

export function distributeFieldWidth(row) {
    if (row.length === 1) {
        row[0].width = MAX_ROW_WIDTH;
    } else if (row.length > 1) {
        const totalRowWidth = row.reduce((sum, field) => {
            return sum + field.width;
        }, 0);
        if (totalRowWidth < MAX_ROW_WIDTH) {
            row.forEach(field => {
                field.width = MAX_ROW_WIDTH / row.length;
            });
        }
    }
}

export function getTransformedFieldsMetaForLayout(fieldsMeta, inputOrder) {
    const layoutMetadata = [];

    // distribute fields to different rows
    let row = [];
    let rowWidth = 0;
    inputOrder.forEach(name => {
        const field = fieldsMeta[name];
        rowWidth += field.width;
        if (rowWidth > MAX_ROW_WIDTH) {
            layoutMetadata.push(row);
            row = [];
            rowWidth = field.width;
        }
        row.push(field);
    });
    layoutMetadata.push(row);

    // distribute width evenly
    layoutMetadata.forEach(rowFields => {
        distributeFieldWidth(rowFields);
    });

    return layoutMetadata;
}
