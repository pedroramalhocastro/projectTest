import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CheckList } from 'src/app/core/models/checklist/checklist';
import { BrandService } from 'src/app/core/services/api/brand.service';
import { CheckListService } from 'src/app/core/services/api/checklist/checklist.service';
import { CheckListItemService } from 'src/app/core/services/api/checklist/item.service';
import { ClientService } from 'src/app/core/services/api/client.service';
import { ModelService } from 'src/app/core/services/api/model.service';
import { OccurrenceCategoryService } from 'src/app/core/services/api/occurrence/category.service';
import { ServiceStationService } from 'src/app/core/services/api/service-station.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ClassificationService } from '../../occurrence/classification/classification.service';
import { EnvironmentService } from 'src/app/core/services/api/environments.service';
import { SectorService } from 'src/app/core/services/api/sector.service';
import { QueueService } from 'src/app/core/services/api/queue.service';

interface FormData {
  name: FormControl;
  categoryId: FormControl;
  classificationId: FormControl;
  clientId: FormControl;
  brandId: FormControl;
  modelId: FormControl;
  checklistItemIds: FormArray;
  serviceStationId: FormControl;
  environmentId: FormControl;
  sectorId: FormControl;
  queueId: FormControl;
  generateOccurrence: FormControl;
  moveSector: FormControl;
  items: FormControl;
}

@Component({
  selector: 'app-checklist-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class CheckListFormComponent implements OnInit {
  loading = true;
  submitted = false;
  submitting = false;
  data = new CheckList();
  form: FormGroup<FormData>;
  breadcrumbs = [
    { name: 'Cadastro', url: '/' },
    { name: 'Checklist', url: '/checklist' },
    { name: 'Novo checklist', url: '/checklist/formulario' },
  ];

  categories: { id: number; name: string }[] = [];
  classifications: { id: number; name: string }[] = [];
  clients: { id: number; name: string }[] = [];
  brands: { id: number; name: string }[] = [];
  models: { id: number; name: string }[] = [];
  checklistItems: { id: number; name: string; checked?: boolean }[] = [];
  serviceStations: { id: number; name: string }[] = [];
  environments: { id: number; name: string }[] = [];
  sectors: { id: number; name: string }[] = [];
  queues: { id: number; name: string }[] = [];
  selectedItems: { id: number; name: string }[] = [];
  selected: string | null = null;

  private id?: number;

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    private _route: ActivatedRoute,
    private _utilsService: UtilsService,
    private _categoriesService: OccurrenceCategoryService,
    private _classificationsService: ClassificationService,
    private _clientService: ClientService,
    private _brandService: BrandService,
    private _modelService: ModelService,
    private _checkListService: CheckListService,
    private _checkListItem: CheckListItemService,
    private _serviceStationsService: ServiceStationService,
    private _environmentService: EnvironmentService,
    private _sectorService: SectorService,
    private _queueService: QueueService
  ) {
    this.form = this._fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      classificationId: [0, Validators.required],
      clientId: ['', Validators.required],
      brandId: ['', Validators.required],
      modelId: ['', Validators.required],
      checklistItemIds: this._fb.array([]),
      serviceStationId: [''],
      environmentId: [''],
      sectorId: [''],
      queueId: [''],
      generateOccurrence: [false],
      items: [''],
      moveSector:[false]
    });

    const id = this._route.snapshot.paramMap.get('id');

    if (id) {
      this.id = parseInt(id);
      this.breadcrumbs[this.breadcrumbs.length - 1].name = 'Editar checklist';
      this.breadcrumbs[this.breadcrumbs.length - 1].url += '/' + id;
    }
  }

  async ngOnInit() {

    try {

      this.loading = true;

      this.categories = await this._categoriesService.getAll();
       this.classifications = await this._classificationsService.getAll();
      const clients = await this._clientService.getAll();
      this.clients = clients.map((x) => {
        return { id: x.id, name: x.companyName };
      });
      this.brands = await this._brandService.getAll();
      this.checklistItems = await this._checkListItem.getAll();
      this.serviceStations = await this._serviceStationsService.getAll();
      this.environments = await this._environmentService.getAll();
      this.sectors = await this._sectorService.getAll();
      this.queues = await this._queueService.getAll();

      if (this.id) {
        const data = await this._checkListService.getById(this.id);

        this.data.id = data.id;
        this.data.modelId = data.modelId;
        this.data.clientId = data.clientId;

        this.form.patchValue({
          modelId: this.data.modelId,
          clientId: this.data.clientId,
          brandId: this.data.model?.brandId,
        });
      }

      this.onBrand();

    } catch (error) {
      this._utilsService.message(
        'Ocorreu um erro ao carregar os dados. Atualize a página e tente novamente.',
        'warning'
      );
    } finally {
      this.loading = false;

    }
  }

  defineFormArrayFields(value: any, control: string) {
    const formArray = this.form.get(control) as FormArray;
    value?.forEach((el: any) => {
      const formGroup = this._fb.group({
        id: [el.id],
        name: new FormControl({ value: el.name, disabled: true }),
        checked: new FormControl({ value: el.checked, disabled: true }),
      });
      formGroup.patchValue(el);
      formArray.push(formGroup);
    });
  }

  get controls() {
    return this.form.controls;
  }

  get validateItems() {
    return !this.checklistItems.some((x) => x.checked);
  }

  get checklistItemsArray(): FormArray {
    return this.controls.checklistItemIds as FormArray;
  }

  async onBrand() {
    const brandId = this.controls.brandId.value;
    if (brandId) {
      this.models = await this._modelService.getAll(brandId);
      this.controls.modelId.enable();
    } else this.controls.modelId.disable();
  }

  async onSubmit() {

    this.submitted = true;

    if (this.form.valid) {
      try {
        this.submitting = true;
        const value = this.form.getRawValue();
        Object.assign(this.data, value);

        // this.data.itens = value.items.map((id: number) => {
        //   return { id };
        // });

        await this._checkListService.save(this.data);

        if (this.id) {
          this._utilsService.message(
            'As alterações foram salvas com sucesso!',
            'success'
          );
        } else {
          this._utilsService.message(
            'A checklist foi cadastrada com sucesso!',
            'success'
          );
        }
      } catch (error) {
        this._utilsService.message(
          'Ocorreu um erro ao salvar as alterações.',
          'error'
        );
      } finally {
        this.goToBack();
        this.submitting = false;
      }
    } else {
      this._utilsService.message(
        'Verifique os campos antes de continuar!',
        'warning'
      );
    }
  }

  goToBack() {
    this._location.back();
  }

  getChecklistItems() {
    return this.form.get('items') as FormArray;
  }

  addItem() {
    const selectedItem = this.controls.items.value;
    if (selectedItem) {
      const isItemAlreadySelected = this.selectedItems.some(item => item.id === selectedItem);
      if (isItemAlreadySelected) {
        this._utilsService.message('Item já está na lista!', 'warning');
      } else {
        const itemToAdd = this.checklistItems.find(x => x.id === selectedItem);
        if (itemToAdd) {
          this.selectedItems.push(itemToAdd);
          this.checklistItemsArray.push(this._fb.control(selectedItem));
        }
      }
    } else {
      this._utilsService.message('Escolha uma opção!', 'warning');
    }
  }

  onSelectChange(item: any) {
    console.log(item);
    this.selected = item;
  }

  removeItem(itemId: any) {
    this.selectedItems = this.selectedItems.filter((item) => item !== itemId);
    this.checklistItemsArray.removeAt(itemId);
  }

}
