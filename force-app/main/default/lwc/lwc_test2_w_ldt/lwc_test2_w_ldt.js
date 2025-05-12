import { LightningElement, wire, track } from 'lwc';
import getRecords from '@salesforce/apex/RecordController.getRecords';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: '取引先名', fieldName: 'Name', editable: true },
    { label: 'ID', fieldName: 'Id' },
    { label: '都道府県', fieldName: 'MailingState', editable: true },
    { label: '住所', fieldName: 'MailingStreet', editable: true },
    { label: '作成日時', fieldName: 'CreatedDate', type: 'date' },
    { label: '取引先_電話', fieldName: 'Phone', type: 'phone', editable: true },
    { label: 'Webサイト', fieldName: 'Website', type: 'url', editable: true },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: '詳細', name: 'show_details' },
                { label: '編集', name: 'edit' },
            ],
        },
    },
];

export default class RecordVerification extends LightningElement {
    @track records;
    @track columns = COLUMNS;
    @track draftValues = [];
    @track error;

    @wire(getRecords)
    wiredRecords(result) {
        this.wiredRecordsResult = result;
        if (result.data) {
            this.records = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.records = undefined;
        }
    }

    handleSave(event) {
        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { recordId: draft.Id, fields };
        });

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));

        Promise.all(promises)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: '成功',
                        message: 'レコードが更新されました',
                        variant: 'success',
                    })
                );
                this.draftValues = [];
                return refreshApex(this.wiredRecordsResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'エラー',
                        message: 'レコードの更新中にエラーが発生しました',
                        variant: 'error',
                    })
                );
                console.error('レコードの更新エラー:', error);
            });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log(`アクション: ${actionName}, レコード ID: ${row.Id}`);
        switch (actionName) {
            case 'show_details':
                // 詳細表示の処理
                break;
            case 'edit':
                // 編集画面への遷移などの処理
                break;
            default:
        }
    }

    handleApproval() {
        console.log('承認ボタンがクリックされました。');
    }

    handleRejection() {
        console.log('却下ボタンがクリックされました。');
    }
}