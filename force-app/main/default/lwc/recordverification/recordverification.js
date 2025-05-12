import { LightningElement, wire, track } from 'lwc';
import getRecords from '@salesforce/apex/RecordController.getRecords';

const columns = [
    { label: '取引先名', fieldName: 'Name' },
    { label: 'ID', fieldName: 'Id' },
    { label: '都道府県', fieldName: 'MailingState' },
    { label: '住所', fieldName: 'MailingStreet' },
    { label: '作成日時', fieldName: 'CreatedDate', type: 'date' },
    { label: '取引先_電話', fieldName: 'Phone', type: 'number' },
    { label: 'Webサイト', fieldName: 'Website', },
];

export default class recordverification extends LightningElement {
    @track records;
    columns = columns;

    @wire(getRecords)
    wiredRecords({ error, data }) {
        if (data) {
            this.records = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleRowAction(event) {
        const recordId = event.target.dataset.id;
        const actionName = event.target.label;
        console.log(`アクション: ${actionName}, レコード ID: ${recordId}`);
        // ここに各ボタンに対応する処理を記述します
        if (actionName === '詳細') {
            // 詳細表示の処理
        } else if (actionName === '編集') {
            // 編集画面への遷移などの処理
        }
    }

    handleApproval() {
        console.log('承認ボタンがクリックされました。');
    }

    handleRejection() {
        console.log('却下ボタンがクリックされました。');
    }
}