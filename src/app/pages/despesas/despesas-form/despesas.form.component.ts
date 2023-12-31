import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { AlertComponent, AlertType } from 'src/app/shared/components';
import { IDespesa, ICategoria, IAction } from 'src/app/shared/interfaces';
import { DespesaService } from 'src/app/shared/services/api';
import { CustomValidators } from 'src/app/shared/validators';

@Component({
  selector: 'app-despesas-form',
  templateUrl: './despesas.form.component.html',
  styleUrls: ['./despesas.form.component.scss']
})

export class DespesasFormComponent {
  categorias: ICategoria[] = [];
  despesaForm: FormGroup & IDespesa;
  action: IAction = IAction.Create;
  refresh: Function = () => { };
  setRefresh(_refresh: Function): void {
    this.refresh = _refresh;
  }

  constructor(
    public formbuilder: FormBuilder,
    public modalAlert: AlertComponent,
    public activeModal: NgbActiveModal,
    public despesaService: DespesaService
  ) { }

  ngOnInit(): void {
    this.getCatgeoriasFromDespesas();
    this.despesaForm = this.formbuilder.group({
      id: [0],
      categoria: [null, Validators.required],
      data: [dayjs().format('YYYY-MM-DD'), Validators.required],
      descricao: ['', Validators.required],
      valor: [0, [Validators.required, CustomValidators.isGreaterThanZero]],
      dataVencimento: null
    }) as FormGroup & IDespesa;
  }

  getCatgeoriasFromDespesas = () => {
    this.despesaService.getDespesasCategorias()
      .subscribe({
        next: (result: ICategoria[]) => {
          if (result)
            this.categorias = result;
        },
        error: (response: any) => {
          this.modalAlert.open(AlertComponent, response.message, AlertType.Warning);
        }
      });
  }

  onSaveClick = () => {
    switch (this.action) {
      case IAction.Create:
        this.saveCreateDespesa();
        break;
      case IAction.Edit:
        this.saveEditDespesa();
        break;
      default:
        this.modalAlert.open(AlertComponent, 'Ação não pode ser realizada.', AlertType.Warning);
    }
  }

  saveCreateDespesa = () => {
    this.despesaService.postDespesa(this.despesaForm.getRawValue() as IDespesa)
      .subscribe({
        next: (result: any) => {
          if (result.message === true) {
            this.activeModal.close();
            this.refresh();
            this.modalAlert.open(AlertComponent, 'Despesa cadastrada com Sucesso.', AlertType.Success);
          }
        },
        error: (error: any) => {
          this.modalAlert.open(AlertComponent, error.message, AlertType.Warning);
        }
      });
  }

  saveEditDespesa = () => {
    const despesa = this.despesaForm.getRawValue() as IDespesa;
    this.despesaService.putDespesa(despesa)
      .subscribe({
        next: (response: any) => {
          if (response !== undefined && response !== null && response.message === true) {
            this.activeModal.close();
            this.refresh();
            this.modalAlert.open(AlertComponent, 'Despesa alterada com Sucesso.', AlertType.Success);
          }
        },
        error: (error: any) => {
          this.modalAlert.open(AlertComponent, error.message, AlertType.Warning);
        }
      });

  }

  editDespesa = (idDespesa: number) => {
    this.despesaService.getDespesaById(idDespesa)
      .subscribe({
        next: (response: any) => {
          if (response.message === true && response.despesa !== undefined && response.despesa !== null){
            const despesaData = response.despesa;
            this.despesaForm.patchValue(despesaData);
            const categoriaSelecionada = this.categorias.find(c => c.id === despesaData.categoria.id);
            if (categoriaSelecionada) {
              this.despesaForm.get('categoria')?.setValue(categoriaSelecionada);
            }
          }

        },
        error: (response: any) => {
          this.modalAlert.open(AlertComponent, response.message, AlertType.Warning);
        }
      });
  }

  deleteDespesa = (idDespesa: number, callBack: Function) => {
    this.despesaService.deleteDespesa(idDespesa)
      .subscribe({
        next: (response: any) => {
          if (response.message === true) {
            callBack();
            this.modalAlert.open(AlertComponent, 'Despesa excluída com sucesso', AlertType.Success);
          }
          else {
            this.modalAlert.open(AlertComponent, 'Erro ao excluír despesa', AlertType.Warning);
          }
        },
        error: (response: any) => {
          this.modalAlert.open(AlertComponent, response.message, AlertType.Warning);
        }
      });
  }
}
