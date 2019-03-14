/*
 * The name of the type of the item that represents the advanced search option.
 * @type {String}
 */
export const ACTION_ADVANCED_SEARCH = 'actionAdvancedSearch';

/*
* The name of the type of the item that represents the create new action.
* @type {String}
*/
export const ACTION_CREATE_NEW = 'actionCreateNew';

/*
 * GroupId used during advanced search.
 * The groupId indicates the group to which advancedSearch component belongs.
 * Typically only components with identical groupId values will interact.
 * @type {String}
 */
export const ADVANCED_SEARCH_GROUP_ID = 'LOOKUP';

/*
 * The max number of values a user can select in advanced search.
 * @type {Number}
 */
export const ADVANCED_SEARCH_MAX_VALUES = 1;

/**
 * The debounce period for handling input change.
 * @type {Number}
 */
export const DEBOUNCE_PERIOD = 200;

/**
 * The UI API default page value.
 * @type {Number}
 */
export const DEFAULT_PAGE = 1;

/**
 * The UI API default pageSize value.
 * @type {Number}
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * The default count of items to display in combobox.
 * @type {Number}
 */
export const DEFAULT_LIST_SIZE = 5;

/**
 * An event indicating a change in lookup value.
 * @type {String}
 */
export const EVENT_CHANGE = 'change';

/**
 * An event indicating a create new option was selected.
 * @type {String}
 */
export const EVENT_CREATE_NEW = 'createnew';

/**
 * An event indicating an error.
 * @type {String}
 */
export const EVENT_ERROR = 'error';

/**
 * An event indicating an error from lds wire adapter.
 * @type {String}
 */
export const EVENT_LDS_ERROR = 'ldserror';

/**
 * The default entity icon.
 * @type {String}
 */
export const ICON_DEFAULT = 'standard:default';

/**
 * The add utility icon name.
 * @type {String}
 */
export const ICON_ADD = 'utility:add';

/**
 * The check utility icon name.
 * @type {String}
 */
export const ICON_CHECK = 'utility:check';

/**
 * The search utility icon name.
 * @type {String}
 */
export const ICON_SEARCH = 'utility:search';

/**
 * The utility icon with small size.
 * @type {String}
 */
export const ICON_SIZE_SMALL = 'small';

/**
 * The utility icon with extra small size.
 * Typically used with search, and add icons.
 * @type {String}
 */
export const ICON_SIZE_X_SMALL = 'x-small';

/**
 * The max length for combobox input.
 * @type {Number}
 */
export const INPUT_MAX_LENGTH = 255;

/**
 * The layout type for record-ui wire request.
 * @type {String}
 */
export const LAYOUT_TYPE_FULL = 'Full';

/**
 * The lightning combobox component name.
 * @type {String}
 */
export const LIGHTNING_COMBOBOX = 'lightning-grouped-combobox';

/**
 * The ailtn transaction MRU action type for create new.
 * @type {String}
 */
export const LOG_ACTION_CREATE_NEW_OPTION = 'CREATE_OPTION';

/**
 * The ailtn transaction MRU action type for advanced search.
 * @type {String}
 */
export const LOG_ACTION_SEARCH_OPTION = 'SEARCH_OPTION';

/**
 * The ailtn transaction context query type for MRU.
 * @type {String}
 */
export const LOG_CONTEXT_Q_TYPE_MRU = 'MRU';

/**
 * The ailtn transaction context query type for TypeAhead.
 * @type {String}
 */
export const LOG_CONTEXT_Q_TYPE_TYPEAHEAD = 'Typeahead';

/**
 * The ailtn transaction event source for click interaction.
 * @type {String}
 */
export const LOG_EVENT_CLICK = 'click';

/**
 * The ailtn transaction event source for pill removal.
 * @type {String}
 */
export const LOG_EVENT_PILL_REMOVE = 'synthetic-pill-remove';

/**
 * The ailtn transaction scope for lookup desktop.
 * @type {String}
 */
export const LOG_SCOPE_INPUT_LOOKUP_DESKTOP = 'search-input-lookup-desktop';

/**
 * The ailtn transaction scope for the entiy selector for the lookup desktop.
 * @type {String}
 */
export const LOG_SCOPE_ENTITY_SELECTOR = 'search-entity-selector';

/**
 * The ailtn transaction target for lookup input.
 * @type {String}
 */
export const LOG_TARGET_INPUT = 'search-input';

/**
 * The ailtn transaction target for action items like advanced search.
 * @type {String}
 */
export const LOG_TARGET_MRU_ACTION_ITEM = 'search-mru-action-item';

/**
 * The ailtn transaction target for MRU record items.
 * @type {String}
 */
export const LOG_TARGET_MRU_ITEM = 'search-mru-item';

/**
 * The ailtn transaction target for the record pill.
 * @type {String}
 */
export const LOG_TARGET_RECORD_PILL_ITEM = 'search-record-pill-item';

/**
 * The ailtn transaction target for the entity filter item..
 * @type {String}
 */
export const LOG_TARGET_FILTER_ITEM = 'search-filter-item';

/**
 * The mode view for record-ui wire request.
 * @type {String}
 */
export const MODE_VIEW = 'View';

/**
 * The combo-box action type to show record.
 * @type {String}
 */
export const OPTION_TYPE_CARD = 'option-card';

/**
 * The combo-box option type to show an action.
 * @type {String}
 */
export const OPTION_TYPE_INLINE = 'option-inline';

/**
 * The combo-box pill item type to show icons.
 * @type {String}
 */
export const PILL_TYPE_ICON = 'icon';

/**
 * UI API query parameter for the dependent field bindings.
 * @type {String}
 */
export const QUERY_PARAMS_DEPENDENT_FIELD_BINDINGS = 'dependentFieldBindings';

/**
 * UI API query parameter for the page.
 * @type {String}
 */
export const QUERY_PARAMS_PAGE = 'page';

/**
 * UI API query parameter for the page size.
 * @type {String}
 */
export const QUERY_PARAMS_PAGE_SIZE = 'pageSize';

/**
 * UI API query parameter for the search term.
 * @type {String}
 */
export const QUERY_PARAMS_Q = 'q';

/**
 * UI API query parameter for the search type like Recent or TypeAhead.
 * @type {String}
 */
export const QUERY_PARAMS_SEARCH_TYPE = 'searchType';

/**
 * The UI API searchType value for Recent records.
 * @type {String}
 */
export const SEARCH_TYPE_RECENT = 'Recent';

/**
 * The UI API searchType value for TypeAhead records.
 * @type {String}
 */
export const SEARCH_TYPE_TYPEAHEAD = 'TypeAhead';
