import { LightningElement, track } from 'lwc';

export default class BreadcrumbsWithIteration extends LightningElement {
    @track
    myBreadcrumbs = [
        { label: 'Account', name: 'parent', id: 'account1' },
        { label: 'Child Account', name: 'child', id: 'account2' },
    ];
    breadCrumbsMap = {
        parent: 'http://www.example.com/account1',
        child: 'http://www.example.com/account2',
    };

    handleNavigateTo(event) {
        // prevent default navigation by href
        event.preventDefault();

        const name = event.target.name;

        if (this.breadCrumbsMap[name]) {
            window.location.assign(this.breadCrumbsMap[name]);
        }
    }
}
