// ========================================================================================
// IMPORTS - Importaciones necesarias para las pruebas unitarias
// ========================================================================================

// Herramientas básicas de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';
// ComponentFixture: Wrapper que nos da acceso al componente y su elemento DOM
// TestBed: Utilidad para configurar y crear un módulo de testing

// Módulos para formularios reactivos
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
// ReactiveFormsModule: Necesario para usar formularios reactivos en las pruebas
// FormBuilder: Servicio para crear FormGroups de manera más fácil

// Módulos de Angular Material Dialog
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// MAT_DIALOG_DATA: Token para inyectar datos al diálogo
// MatDialogRef: Referencia al diálogo para cerrarlo o interactuar con él

// Módulos de Angular Material UI necesarios para renderizar el template
import { MatFormFieldModule } from '@angular/material/form-field';  // Para <mat-form-field>
import { MatInputModule } from '@angular/material/input';            // Para inputs dentro de mat-form-field
import { MatSelectModule } from '@angular/material/select';          // Para <mat-select>
import { MatIconModule } from '@angular/material/icon';              // Para <mat-icon>
import { MatButtonModule } from '@angular/material/button';          // Para botones de Material

// Módulo para animaciones (necesario para Material)
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Schema para elementos personalizados no reconocidos
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Operador RxJS para crear Observables de prueba
import { of } from 'rxjs';
// 'of' crea un Observable que emite los valores que le pases y luego se completa

// Importaciones específicas del proyecto
import { CategoryManageComponent } from './category-manage.component';
import { CategoryService } from '../../services/category.service';
import { AlertService } from '@shared/services/alert.service';
import { BaseResponse } from '@shared/models/base-api-response.interface';

// ========================================================================================
// SUITE DE PRUEBAS PRINCIPAL
// ========================================================================================

// 'describe' crea un grupo de pruebas relacionadas. Es como una "carpeta" de tests.
describe('CategoryManageComponent', () => {
  
  // ========================================================================================
  // VARIABLES DE LA SUITE DE PRUEBAS
  // ========================================================================================
  
  // Variables que serán compartidas entre todas las pruebas de este componente
  let component: CategoryManageComponent;                          // Instancia del componente a probar
  let fixture: ComponentFixture<CategoryManageComponent>;          // Wrapper del componente para testing
  let mockCategoryService: jasmine.SpyObj<CategoryService>;       // Mock (falso) del servicio de categorías
  let mockAlertService: jasmine.SpyObj<AlertService>;             // Mock (falso) del servicio de alertas
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CategoryManageComponent>>;  // Mock de la referencia del diálogo

  // ========================================================================================
  // DATOS DE PRUEBA (TEST DATA)
  // ========================================================================================
  
  // Datos simulados de una categoría para usar en las pruebas
  // Estos datos imitan lo que vendría del servidor real
  const mockCategoryData = {
    categoryId: 1,
    name: 'Test Category',
    description: 'Test Description',
    state: 1,
    auditCreateDate: new Date(),
    stateCategory: 'Active',
    badgeColor: 'blue',
    icEdit: true,
    icDelete: true
  };

  // Respuesta simulada exitosa del servidor
  // BaseResponse es la estructura que espera la aplicación
  const mockSuccessResponse: BaseResponse = {
    isSuccess: true,                    // Operación exitosa
    message: 'Operation successful',    // Mensaje de éxito
    data: null,                        // Datos (null en este caso)
    totalRecords: 0,                   // Total de registros
    errors: null                       // Sin errores
  };

  // Respuesta simulada de error del servidor
  const mockErrorResponse: BaseResponse = {
    isSuccess: false,                  // Operación falló
    message: 'Operation failed',       // Mensaje de error
    data: null,                       // Sin datos
    totalRecords: 0,                  // Sin registros
    errors: ['Test error']            // Lista de errores
  };

  // ========================================================================================
  // CONFIGURACIÓN ANTES DE CADA PRUEBA (beforeEach)
  // ========================================================================================
  
  // beforeEach se ejecuta ANTES de cada prueba individual (cada 'it')
  // Esto asegura que cada prueba tenga un entorno limpio y consistente
  beforeEach(async () => {
    
    // ========================================================================================
    // CREACIÓN DE MOCKS (OBJETOS FALSOS)
    // ========================================================================================
    
    // jasmine.createSpyObj crea un objeto "espía" (spy) que simula un servicio real
    // Los spies nos permiten:
    // 1. Controlar qué devuelven los métodos
    // 2. Verificar si fueron llamados y con qué parámetros
    // 3. Aislar nuestro componente de dependencias externas
    
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'CategoryById',      // Método para obtener categoría por ID
      'CategoryRegister',  // Método para registrar nueva categoría
      'CategoryEdit'       // Método para editar categoría existente
    ]);
    
    const alertServiceSpy = jasmine.createSpyObj('AlertService', [
      'success',  // Método para mostrar alertas de éxito
      'warn'      // Método para mostrar alertas de advertencia
    ]);
    
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    // Mock de la referencia del diálogo para simular el cierre

    // ========================================================================================
    // CONFIGURACIÓN DEL MÓDULO DE TESTING
    // ========================================================================================
    
    // TestBed.configureTestingModule crea un módulo de Angular específico para testing
    // Es como crear un "mini Angular" solo para nuestras pruebas
    await TestBed.configureTestingModule({
      
      // declarations: Componentes, directivas y pipes que pertenecen a este módulo
      declarations: [CategoryManageComponent],
      
      // imports: Otros módulos de Angular que necesitamos
      imports: [
        ReactiveFormsModule,      // Para formularios reactivos (FormGroup, FormControl, etc.)
        MatFormFieldModule,       // Para que Angular reconozca <mat-form-field>
        MatInputModule,           // Para que Angular reconozca inputs de Material
        MatSelectModule,          // Para que Angular reconozca <mat-select>
        MatIconModule,            // Para que Angular reconozca <mat-icon>
        MatButtonModule,          // Para botones de Material Design
        BrowserAnimationsModule   // Para animaciones (requerido por Material)
      ],
      
      // providers: Servicios y dependencias que el componente necesita
      providers: [
        FormBuilder,  // Servicio real de Angular para crear formularios
        
        // Aquí reemplazamos los servicios reales con nuestros mocks
        { provide: CategoryService, useValue: categoryServiceSpy },  // Usar nuestro mock en lugar del servicio real
        { provide: AlertService, useValue: alertServiceSpy },        // Usar nuestro mock en lugar del servicio real
        { provide: MatDialogRef, useValue: dialogRefSpy },           // Usar nuestro mock de la referencia del diálogo
        { provide: MAT_DIALOG_DATA, useValue: null }                 // Datos del diálogo (null por defecto)
      ],
      
      // schemas: Permite elementos personalizados o no reconocidos
      schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Para ignorar elementos HTML que Angular no reconoce
    }).compileComponents();  // compileComponents() compila todos los templates y componentes

    // ========================================================================================
    // CREACIÓN DE LA INSTANCIA DEL COMPONENTE PARA TESTING
    // ========================================================================================
    
    // Crear el componente y obtener referencias para las pruebas
    fixture = TestBed.createComponent(CategoryManageComponent);  // Crear instancia del componente
    component = fixture.componentInstance;                       // Obtener referencia al componente
    
    // Obtener referencias a los servicios mock para poder configurarlos en las pruebas
    mockCategoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    mockAlertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CategoryManageComponent>>;
  });

  // ========================================================================================
  // GRUPO DE PRUEBAS: INICIALIZACIÓN DEL COMPONENTE
  // ========================================================================================
  
  // 'describe' agrupa pruebas relacionadas con la inicialización del componente
  describe('Inicialización del componente', () => {
    
    // ========================================================================================
    // PRUEBA BÁSICA: EL COMPONENTE SE CREA CORRECTAMENTE
    // ========================================================================================
    
    // 'it' define una prueba individual. Debe ser descriptiva y específica.
    it('should create', () => {
      // 'expect' es una afirmación (assertion). Verifica que algo sea verdadero.
      // toBeTruthy() verifica que el valor no sea null, undefined, false, 0, "", etc.
      expect(component).toBeTruthy();
      // Esta prueba verifica que el componente se creó exitosamente
    });

    // ========================================================================================
    // PRUEBA: INICIALIZACIÓN DEL FORMULARIO CON VALORES POR DEFECTO
    // ========================================================================================
    
    it('should initialize form with default values', () => {
      // Ejecutar el método que inicializa el formulario
      component.initForm();
      
      // Verificar que cada campo del formulario tiene su valor inicial correcto
      // .get('nombreCampo') obtiene el FormControl de ese campo
      // .value obtiene el valor actual del campo
      // .toBe(valorEsperado) verifica que el valor sea exactamente igual
      expect(component.form.get('categoryId')?.value).toBe(0);
      expect(component.form.get('name')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('state')?.value).toBe('');
    });

    // ========================================================================================
    // PRUEBA: VALIDACIONES REQUERIDAS EN CAMPOS ESPECÍFICOS
    // ========================================================================================
    
    it('should have required validators on name and state fields', () => {
      // Inicializar el formulario
      component.initForm();
      
      // Obtener referencias a los controles específicos
      const nameControl = component.form.get('name');
      const stateControl = component.form.get('state');
      
      // Establecer valores vacíos para probar las validaciones
      nameControl?.setValue('');      // Campo nombre vacío
      stateControl?.setValue('');     // Campo estado vacío
      
      // Verificar que los campos muestran error de "required" (campo requerido)
      // hasError('required') devuelve true si el campo tiene error de validación requerida
      expect(nameControl?.hasError('required')).toBeTruthy();
      expect(stateControl?.hasError('required')).toBeTruthy();
    });
  });

  // ========================================================================================
  // GRUPO DE PRUEBAS: CICLO DE VIDA DEL COMPONENTE (ngOnInit)
  // ========================================================================================
  
  describe('ngOnInit', () => {
    
    // ========================================================================================
    // PRUEBA: NO DEBE LLAMAR CategoryById CUANDO NO HAY DATOS
    // ========================================================================================
    
    it('should not call CategoryById when data is null', () => {
      // spyOn crea un "espía" en un método específico del componente
      // Esto nos permite verificar si el método fue llamado o no
      spyOn(component, 'CategoryById');
      
      // Ejecutar ngOnInit (que se ejecuta automáticamente al inicializar el componente)
      component.ngOnInit();
      
      // Verificar que CategoryById NO fue llamado
      // .not.toHaveBeenCalled() verifica que el método espía nunca fue ejecutado
      expect(component.CategoryById).not.toHaveBeenCalled();
    });

    // ========================================================================================
    // PRUEBA: DEBE LLAMAR CategoryById CUANDO HAY DATOS DISPONIBLES
    // ========================================================================================
    
    it('should call CategoryById when data is provided', () => {
      // Simular que el componente recibió datos (como si viniera de un diálogo)
      component.data = { data: { categoryId: 1 } };
      
      // Crear un espía en el método CategoryById para verificar su llamada
      spyOn(component, 'CategoryById');
      
      // Ejecutar ngOnInit
      component.ngOnInit();
      
      // Verificar que CategoryById fue llamado con el ID correcto (1)
      // toHaveBeenCalledWith(1) verifica que el método fue llamado con el parámetro específico
      expect(component.CategoryById).toHaveBeenCalledWith(1);
    });
  });

  // ========================================================================================
  // GRUPO DE PRUEBAS: MÉTODO CategoryById
  // ========================================================================================
  
  describe('CategoryById', () => {
    
    // ========================================================================================
    // PRUEBA: DEBE CARGAR LOS DATOS DE LA CATEGORÍA EN EL FORMULARIO
    // ========================================================================================
    
    it('should populate form with category data', () => {
      // Configurar el mock del servicio para que devuelva datos específicos
      // .and.returnValue() configura qué debe devolver el método mock
      // of() crea un Observable que emite el valor inmediatamente y se completa
      mockCategoryService.CategoryById.and.returnValue(of(mockCategoryData));
      
      // Llamar al método que queremos probar
      component.CategoryById(1);
      
      // VERIFICACIONES:
      
      // 1. Verificar que el servicio fue llamado con el parámetro correcto
      expect(mockCategoryService.CategoryById).toHaveBeenCalledWith(1);
      
      // 2. Verificar que el formulario se llenó con los datos correctos
      // Cada campo del formulario debe tener el valor que viene del servidor
      expect(component.form.get('categoryId')?.value).toBe(mockCategoryData.categoryId);
      expect(component.form.get('name')?.value).toBe(mockCategoryData.name);
      expect(component.form.get('description')?.value).toBe(mockCategoryData.description);
      expect(component.form.get('state')?.value).toBe(mockCategoryData.state);
    });
  });

  // ========================================================================================
  // GRUPO DE PRUEBAS: MÉTODO CategorySave (LÓGICA DE GUARDADO)
  // ========================================================================================
  
  describe('CategorySave', () => {
    
    // beforeEach se ejecuta antes de cada prueba en este grupo específico
    beforeEach(() => {
      // Inicializar el formulario antes de cada prueba de guardado
      component.initForm();
    });

    // ========================================================================================
    // PRUEBA: NO DEBE GUARDAR CUANDO EL FORMULARIO ES INVÁLIDO
    // ========================================================================================
    
    it('should not save when form is invalid', () => {
      // Crear espías en los métodos de guardado para verificar que no sean llamados
      spyOn(component, 'CategoryRegister');
      spyOn(component, 'CategoryEdit');
      
      // Intentar guardar con formulario inválido (campos requeridos vacíos)
      component.CategorySave();
      
      // Verificar que ningún método de guardado fue llamado
      // Esto es importante porque no debemos guardar datos inválidos
      expect(component.CategoryRegister).not.toHaveBeenCalled();
      expect(component.CategoryEdit).not.toHaveBeenCalled();
    });

    // ========================================================================================
    // PRUEBA: DEBE LLAMAR CategoryRegister PARA NUEVAS CATEGORÍAS (categoryId = 0)
    // ========================================================================================
    
    it('should call CategoryRegister when categoryId is 0', () => {
      // Crear espía en el método de registro
      spyOn(component, 'CategoryRegister');
      
      // Configurar el formulario con datos válidos y categoryId = 0
      // patchValue() actualiza solo los campos especificados del formulario
      component.form.patchValue({
        categoryId: 0,              // 0 indica que es una categoría nueva
        name: 'New Category',       // Nombre válido
        state: 1                    // Estado válido
      });
      
      // Ejecutar el método de guardado
      component.CategorySave();
      
      // Verificar que se llamó al método correcto para registrar una nueva categoría
      expect(component.CategoryRegister).toHaveBeenCalled();
    });

    // ========================================================================================
    // PRUEBA: DEBE LLAMAR CategoryEdit PARA CATEGORÍAS EXISTENTES (categoryId > 0)
    // ========================================================================================
    
    it('should call CategoryEdit when categoryId > 0', () => {
      // Crear espía en el método de edición
      spyOn(component, 'CategoryEdit');
      
      // Configurar el formulario con datos válidos y categoryId > 0
      component.form.patchValue({
        categoryId: 1,              // ID > 0 indica que es una categoría existente
        name: 'Edit Category',      // Nombre válido
        state: 1                    // Estado válido
      });
      
      // Ejecutar el método de guardado
      component.CategorySave();
      
      // Verificar que se llamó al método correcto para editar con el ID correcto
      expect(component.CategoryEdit).toHaveBeenCalledWith(1);
    });
  });

  // ========================================================================================
  // GRUPO DE PRUEBAS: MÉTODO CategoryRegister (REGISTRO DE NUEVAS CATEGORÍAS)
  // ========================================================================================
  
  describe('CategoryRegister', () => {
    
    // Configurar datos válidos antes de cada prueba de registro
    beforeEach(() => {
      component.form.patchValue({
        name: 'New Category',          // Nombre de la nueva categoría
        description: 'New Description', // Descripción
        state: 1                       // Estado activo
      });
    });

    // ========================================================================================
    // PRUEBA: REGISTRO EXITOSO DE CATEGORÍA
    // ========================================================================================
    
    it('should register category successfully', () => {
      // Configurar el mock del servicio para simular una respuesta exitosa
      mockCategoryService.CategoryRegister.and.returnValue(of(mockSuccessResponse));
      
      // Ejecutar el método de registro
      component.CategoryRegister();
      
      // VERIFICACIONES MÚLTIPLES:
      
      // 1. Verificar que el servicio fue llamado con los datos del formulario
      expect(mockCategoryService.CategoryRegister).toHaveBeenCalledWith(component.form.value);
      
      // 2. Verificar que se mostró un mensaje de éxito
      expect(mockAlertService.success).toHaveBeenCalledWith('Nice', mockSuccessResponse.message);
      
      // 3. Verificar que se cerró el diálogo con true (indicando éxito)
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    // ========================================================================================
    // PRUEBA: MANEJO DE ERRORES EN EL REGISTRO
    // ========================================================================================
    
    it('should handle registration error', () => {
      // Configurar el mock del servicio para simular una respuesta de error
      mockCategoryService.CategoryRegister.and.returnValue(of(mockErrorResponse));
      
      // Ejecutar el método de registro
      component.CategoryRegister();
      
      // VERIFICACIONES PARA CASO DE ERROR:
      
      // 1. Verificar que el servicio fue llamado (aunque falló)
      expect(mockCategoryService.CategoryRegister).toHaveBeenCalledWith(component.form.value);
      
      // 2. Verificar que se mostró un mensaje de advertencia (no éxito)
      expect(mockAlertService.warn).toHaveBeenCalledWith('Warning', mockErrorResponse.message);
      
      // 3. Verificar que el diálogo NO se cerró (para que el usuario pueda corregir)
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  // ========================================================================================
  // GRUPO DE PRUEBAS: MÉTODO CategoryEdit (EDICIÓN DE CATEGORÍAS EXISTENTES)
  // ========================================================================================
  
  describe('CategoryEdit', () => {
    
    // Configurar datos de una categoría existente antes de cada prueba
    beforeEach(() => {
      component.form.patchValue({
        categoryId: 1,                      // ID de categoría existente
        name: 'Updated Category',           // Nombre actualizado
        description: 'Updated Description', // Descripción actualizada
        state: 1                           // Estado
      });
    });

    // ========================================================================================
    // PRUEBA: EDICIÓN EXITOSA DE CATEGORÍA
    // ========================================================================================
    
    it('should edit category successfully', () => {
      // Configurar el mock del servicio para simular una respuesta exitosa
      mockCategoryService.CategoryEdit.and.returnValue(of(mockSuccessResponse));
      
      // Ejecutar el método de edición con ID específico
      component.CategoryEdit(1);
      
      // VERIFICACIONES:
      
      // 1. Verificar que el servicio fue llamado con ID y datos del formulario
      expect(mockCategoryService.CategoryEdit).toHaveBeenCalledWith(1, component.form.value);
      
      // 2. Verificar que se mostró mensaje de éxito
      expect(mockAlertService.success).toHaveBeenCalledWith('Nice', mockSuccessResponse.message);
      
      // 3. Verificar que se cerró el diálogo con éxito
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    // ========================================================================================
    // PRUEBA: MANEJO DE ERRORES EN LA EDICIÓN
    // ========================================================================================
    
    it('should handle edit error', () => {
      // Configurar el mock del servicio para simular error
      mockCategoryService.CategoryEdit.and.returnValue(of(mockErrorResponse));
      
      // Ejecutar el método de edición
      component.CategoryEdit(1);
      
      // VERIFICACIONES PARA CASO DE ERROR:
      
      // 1. Verificar que el servicio fue llamado
      expect(mockCategoryService.CategoryEdit).toHaveBeenCalledWith(1, component.form.value);
      
      // 2. Verificar que se mostró advertencia
      expect(mockAlertService.warn).toHaveBeenCalledWith('Warning', mockErrorResponse.message);
      
      // 3. Verificar que el diálogo NO se cerró
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  // ========================================================================================
  // GRUPO DE PRUEBAS: VALIDACIÓN DE FORMULARIOS
  // ========================================================================================
  
  describe('Form validation', () => {
    
    // Inicializar formulario antes de cada prueba de validación
    beforeEach(() => {
      component.initForm();
    });

    // ========================================================================================
    // PRUEBA: MARCAR CAMPOS COMO "TOCADOS" CUANDO EL FORMULARIO ES INVÁLIDO
    // ========================================================================================
    
    it('should mark all fields as touched when form is invalid', () => {
      // Obtener referencias a los controles del formulario
      const nameControl = component.form.get('name');
      const stateControl = component.form.get('state');
      
      // Crear espías en los métodos markAllAsTouched para verificar que se llamen
      spyOn(nameControl!, 'markAllAsTouched');
      spyOn(stateControl!, 'markAllAsTouched');
      
      // Intentar guardar con formulario inválido
      component.CategorySave();
      
      // Verificar que se marcaron los campos como "tocados" para mostrar errores al usuario
      expect(nameControl!.markAllAsTouched).toHaveBeenCalled();
      expect(stateControl!.markAllAsTouched).toHaveBeenCalled();
    });

    // ========================================================================================
    // PRUEBA: FORMULARIO VÁLIDO CUANDO TODOS LOS CAMPOS REQUERIDOS ESTÁN LLENOS
    // ========================================================================================
    
    it('should be valid when all required fields are filled', () => {
      // Llenar todos los campos requeridos con datos válidos
      component.form.patchValue({
        name: 'Valid Name',    // Campo requerido lleno
        state: 1              // Campo requerido lleno
      });
      
      // Verificar que el formulario es válido
      expect(component.form.valid).toBeTruthy();
    });

    // ========================================================================================
    // PRUEBA: FORMULARIO INVÁLIDO CUANDO LOS CAMPOS REQUERIDOS ESTÁN VACÍOS
    // ========================================================================================
    
    it('should be invalid when required fields are empty', () => {
      // Dejar los campos requeridos vacíos
      component.form.patchValue({
        name: '',    // Campo requerido vacío
        state: ''    // Campo requerido vacío
      });
      
      // Verificar que el formulario es inválido
      expect(component.form.invalid).toBeTruthy();
    });
  });

// ========================================================================================
// FIN DEL ARCHIVO DE PRUEBAS
// ========================================================================================
});