import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
    selector: 'btn-cell-renderer',
    template: `
      <button (click)="onClick($event)" class="{{cls}}"></button>
    `,
})
export class BtnCellRenderer implements ICellRendererAngularComp, OnDestroy {
    private params: any;
    label: string = '';
    cls: string = '';

    agInit(params: any): void {
        this.params = params;
        this.label = this.params.label;
        this.cls = this.params.cls;
    }

    refresh(params?: any): boolean {
        return true;
    }

    onClick($event: any) {
        if (this.params.onClick instanceof Function) {
            // put anything into params u want pass into parents component
            const params = {
                event: $event,
                rowData: this.params.node.data
                // ...something
            }
            this.params.onClick(this.params);

        }
    }
    // btnClickedHandler($event : any) {
    //     debugger;
    //   this.params.clicked(this.params.value);
    // }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}