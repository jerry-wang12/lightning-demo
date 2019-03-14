export default function fetchDataHelper({ amountOfRecords }) {
    return fetch(
        'https://my.api.mockaroo.com/datatable_books.json?key=3aad8770&numRecords=' +
            amountOfRecords,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        }
    ).then(response => response.json());
}
