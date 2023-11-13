import { Component, Input, NgModule } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-component',
  templateUrl: './alert.component.html'
})

export class AlertComponent {
  @Input() header:string = 'Mensagem';
  @Input() message:string ='';
  alertTypeClass : string = 'alert alert-success mt-2';

  constructor(config: NgbModalConfig, public modalService: NgbModal, public activeModal: NgbActiveModal) {
		config.backdrop = 'static';
    config.keyboard = false;
	}

	open(content, _message: string, typeAlert: AlertType ) {
		const modalRef = this.modalService.open(content);
    modalRef.componentInstance.alertTypeClass = AlertTypeClass[typeAlert];
    modalRef.componentInstance.message = _message;
	}

  close(){
    this.activeModal.close();
  }

}

type AlertType = 'Success' | 'Warning';
const AlertTypeClass: Record<AlertType, string> = {
  Success: 'alert alert-success mt-2',
  Warning: 'alert alert-danger mt-2',
};
