import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuService } from 'src/app/shared/services/utils/menu-service/menu.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DespesasComponent } from './despesas.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AlertComponent } from 'src/app/shared/components/alert-component/alert.component';
import { ModalFormComponent } from 'src/app/shared/components/modal-form/modal.form.component';
import { DespesaService } from 'src/app/shared/services/api/despesas/despesa.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal.confirm.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IDespesa } from 'src/app/shared/interfaces/IDespesa';
import * as dayjs from 'dayjs';
import { from, throwError } from 'rxjs';
import { DespesaDataSet } from 'src/app/shared/datatable-config/despesas/despesas.dataSet';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { DespesasFormComponent } from './despesas-form/despesas.form.component';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';

describe('Unit Test DespesasComponent', () => {
  let component: DespesasComponent;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let fixture: ComponentFixture<DespesasComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let despesaService: DespesaService;
  let mockDespesas: IDespesa[] = [
    { id: 1, idUsuario: 1, idCategoria: 1, data: dayjs(), descricao: 'Teste Despesas 1', valor: 1.05, dataVencimento: dayjs() },
    { id: 2, idUsuario: 2, idCategoria: 2, data: dayjs(), descricao: 'Teste Despesas 2', valor: 2.05, dataVencimento: dayjs() },
    { id: 3, idUsuario: 1, idCategoria: 4, data: dayjs(), descricao: 'Teste Despesas 3', valor: 3.05, dataVencimento: dayjs() },
  ];
  let mockDespesasData: DespesaDataSet[] = [
    { id: 1, data: dayjs().format('DD/MM/YYYY'), descricao: 'Teste Despesas 1', valor: 'R$ 1.05', dataVencimento: dayjs().format('DD/MM/YYY') },
    { id: 2, data: dayjs().format('DD/MM/YYYY'), descricao: 'Teste Despesas 2', valor: 'R$ 2.05', dataVencimento: dayjs().format('DD/MM/YYY') },
    { id: 3, data: dayjs().format('DD/MM/YYYY'), descricao: 'Teste Despesas 3', valor: 'R$ 3.05', dataVencimento: dayjs().format('DD/MM/YYY') }
  ];

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    mockAuthService.isAuthenticated.and.returnValue(true);
    TestBed.configureTestingModule({
      declarations: [DespesasComponent, DespesasFormComponent, MatDatepicker, MatSelect],
      imports: [CommonModule, RouterTestingModule, SharedModule, HttpClientTestingModule, MatSelectModule , MatDatepickerModule, MatNativeDateModule],
      providers: [MenuService, AlertComponent, ModalFormComponent, ModalConfirmComponent, NgbActiveModal, DespesaService,
        { provide: Storage, useValue: localStorageSpy },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    fixture = TestBed.createComponent(DespesasComponent);
    component = fixture.componentInstance;
    localStorage.setItem('idUsuario', '1');
    component.dataTable = TestBed.inject(DataTableComponent);
    despesaService = TestBed.inject(DespesaService);
    localStorageSpy.getItem.and.callFake((key: string) => localStorageSpy[key]);
    localStorageSpy.setItem.and.callFake((key: string, value: string) => localStorageSpy[key] = value);
    localStorageSpy.removeItem.and.callFake((key: string) => delete localStorageSpy[key]);
    localStorageSpy.clear.and.callFake(() => {
      for (const key in localStorageSpy) {
        if (localStorageSpy.hasOwnProperty(key)) {
          delete localStorageSpy[key];
        }
      }
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initializeDataTable', fakeAsync(() => {
    // Arrange
    let mockIdUsuario = 1;
    let despesas = mockDespesas.filter(despesa => despesa.idUsuario === mockIdUsuario);
    const getDespesasByIdUsuarioSpy = spyOn(despesaService, 'getDespesaByIdUsuario').and.returnValue(from(Promise.resolve(despesas)));
    spyOn(component, 'getDespesasData').and.returnValue(mockDespesasData);
    localStorageSpy['idUsuario'] = mockIdUsuario.toString();

    // Act
    component.initializeDataTable();
    flush();

    // Assert
    expect(getDespesasByIdUsuarioSpy).toHaveBeenCalled();
    expect(component.despesasData.length).toBeGreaterThan(1);
  }));

  it('should initializeDataTable and return empty Datatable', fakeAsync(() => {
    // Arrange
    const errorMessage = { message: 'Fake Error Message'};
    const getDespesasByIdUsuarioSpy = spyOn(despesaService, 'getDespesaByIdUsuario').and.returnValue(throwError(errorMessage));
    spyOn(component, 'getDespesasData').and.returnValue(mockDespesasData);
    const alertOpenSpy = spyOn(TestBed.inject(AlertComponent), 'open');
    localStorageSpy['idUsuario'] = '2';

    // Act
    component.initializeDataTable();
    flush();

    // Assert
    expect(getDespesasByIdUsuarioSpy).toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalledWith(AlertComponent, errorMessage.message, 'Warning');
  }));


  it('should throw error when try to initializeDataTable', () => {
    // Arrange
    const errorMessage = { message: 'Fake Error Message'};
    const getDespesasByIdUsuarioSpy = spyOn(despesaService, 'getDespesaByIdUsuario').and.returnValue(throwError(errorMessage));
    const alertOpenSpy = spyOn(TestBed.inject(AlertComponent), 'open');
    localStorageSpy['idUsuario'] = '4';

    // Act
    component.initializeDataTable();

    // Assert
    expect(getDespesasByIdUsuarioSpy).toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalledWith(AlertComponent, errorMessage.message, 'Warning');
  });

  it('should return despesaData when call getDespesasData', () => {
    // Arrange
    localStorageSpy['idUsuario'] = '1';
    component.despesasData = mockDespesasData;

    // Act
    let despesasData =  component.getDespesasData();

    // Assert
    expect(despesasData).not.toBeNull();
    expect(despesasData.length).toBeGreaterThan(0);
  });


  it('should updateDatatable when is called', fakeAsync(() => {
    // Arrange
    let mockIdUsuario = 2;
    let despesas = mockDespesas.filter(despesa => despesa.idUsuario === mockIdUsuario);
    const getDespesasByIdUsuarioSpy = spyOn(despesaService, 'getDespesaByIdUsuario').and.returnValue(from(Promise.resolve(despesas)));
    spyOn(component, 'getDespesasData').and.returnValue(mockDespesasData);
    localStorageSpy['idUsuario'] = mockIdUsuario.toString();

    // Act
    component.updateDatatable();
    flush();

    // Assert
    expect(getDespesasByIdUsuarioSpy).toHaveBeenCalled();
    expect(component.despesasData.length).toBeGreaterThan(0);

  }));

  it('should throw error when try to updateDataTable', () => {
    // Arrange
    const errorMessage = { message: 'Fake Error Message'};
    const getDespesasByIdUsuarioSpy = spyOn(despesaService, 'getDespesaByIdUsuario').and.returnValue(throwError(errorMessage));
    const alertOpenSpy = spyOn(TestBed.inject(AlertComponent), 'open');
    localStorageSpy['idUsuario'] = '4';

    // Act
    component.updateDatatable();

    // Assert
    expect(getDespesasByIdUsuarioSpy).toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalledWith(AlertComponent, errorMessage.message, 'Warning');
  });

  it('should open modalForm on onClickNovo', fakeAsync(() => {
    // Arrange
    spyOn(component.modalForm.modalService, 'open').and.callThrough();

    // Act
    component.onClickNovo();
    flush();

    // Assert
    expect(component.modalForm.modalService.open).toHaveBeenCalled();
  }));

  it('should open call editDespesa onClickEdit', fakeAsync(() => {
    // Arrange
    const mockDespesa: IDespesa = mockDespesas[0];
    const mockResponse: any = { message: true, despesa: mockDespesa };
    const getDespesasById = spyOn(despesaService, 'getDespesaById').and.returnValue(from(Promise.resolve(mockResponse)));
    const editDespesa = spyOn(component, 'editDespesa').and.callThrough();

    // Act
    component.onClickEdit(mockDespesa.idUsuario);
    flush();

    // Assert
    expect(getDespesasById).toHaveBeenCalled();
    expect(editDespesa).toHaveBeenCalled();
    expect(editDespesa).toHaveBeenCalledWith(mockDespesa);
  }));

  it('should throws error in onClickEdit', fakeAsync(() => {
    // Arrange
    const errorMessage = { message: 'Fake Error Message'};
    const mockDespesa: IDespesa = mockDespesas[1];
    const getDespesasById = spyOn(despesaService, 'getDespesaById').and.returnValue(throwError(errorMessage));
    const editDespesa = spyOn(component, 'editDespesa').and.callThrough();
    const alertOpenSpy = spyOn(TestBed.inject(AlertComponent), 'open');

    // Act
    component.onClickEdit(mockDespesa.idUsuario);
    flush();

    // Assert
    expect(getDespesasById).toHaveBeenCalled();
    expect(editDespesa).not.toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalled();
    expect(alertOpenSpy).toHaveBeenCalledWith(AlertComponent, errorMessage.message, 'Warning');
  }));


  it('should open call editDespesa ', () => {
    // Arrange
    const mockDespesa: IDespesa = mockDespesas[2];
    const editDespesa = spyOn(component, 'editDespesa').and.callThrough();
    spyOn(component.modalForm.modalService, 'open').and.callThrough();

    // Act
    component.editDespesa(mockDespesa);

    // Assert
    expect(editDespesa).toHaveBeenCalled();
    expect(editDespesa).toHaveBeenCalledWith(mockDespesa);
    expect(component.modalForm.modalService.open).toHaveBeenCalled();
  });

});
