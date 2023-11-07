import { Component, Input } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  providers: [NgbModalConfig, NgbModal],
})

export class SuccessAlertComponent {
  @Input() message:string ='';


  constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
    config.keyboard = false;
	}

	open(content) {
		this.modalService.open(content);
	}

  close(){
    this.modalService.dismissAll();
  }

}
