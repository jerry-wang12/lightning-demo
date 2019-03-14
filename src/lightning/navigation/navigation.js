/**
 * `CurrentPageReference` gets a reference to the current page in Salesforce. Page URL formats can change in future releases. To future proof your apps, use page references instead of URLs. Use the page reference to create a deep link to the page. `NavigationMixin` gets a reference to the navigation service. Use the navigation service to navigate to another page in the application and generate a URL for a page.
 */
export { CurrentPageReference, NavigationMixin } from 'force/navigation';
