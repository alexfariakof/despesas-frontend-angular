import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertComponent } from 'src/app/shared/components/alert-component/alert.component';
import { MenuService } from 'src/app/shared/services/menu-service/menu.service';

@Component({
  selector: 'app-lancamentos',
  templateUrl: './lancamentos.component.html',
  styleUrls: ['./lancamentos.component.scss']
})
export class LancamentosComponent {

  constructor(public menuService: MenuService, public formBuilder: FormBuilder, public modalAlert: AlertComponent) {
  }

  ngOnInit() {
    this.menuService.menuSelecionado = 5;
  }

  onClickNovo = () => {
    this.modalAlert.open(AlertComponent, "Clicou em Novo da Lançamentos", 'Success');
  }

  onClickExcluir = () =>  {
    this.modalAlert.open(AlertComponent, "Clicou em Excluir da Lançamentos", 'Warning');
  }

  onClickCancelar = () => {
    this.modalAlert.open(AlertComponent, "Clicou em Cancelar da Lançamentos", 'Warning');
  }


}
