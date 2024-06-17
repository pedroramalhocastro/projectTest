import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RFID } from 'src/app/core/models/rfid';
import { EnvironmentService } from 'src/app/core/services/api/environments.service';
import { PoeService } from 'src/app/core/services/api/poe.service';
import { QueueService } from 'src/app/core/services/api/queue.service';

import { RFIDService } from 'src/app/core/services/api/rfid.service';
import { RFIDStatusService } from 'src/app/core/services/api/rfidStatus.service';
import { SectorService } from 'src/app/core/services/api/sector.service';
import { FormService } from 'src/app/core/services/form.service';
import { UtilsService } from 'src/app/core/services/utils.service';

interface FormData {
  poeId: FormControl;
  environmentId: FormControl;
  type: FormControl;
  serviceStationId: FormControl;
  sectorId: FormControl;
  antenna: FormControl;
  statusId: FormControl;
  queueId:FormControl,
  items: FormArray<FormGroup<ItemFormData>>;
}

interface ItemFormData {
  locale1: FormControl;
  locale2: FormControl;
  shortName: FormControl;
  base: FormControl;
}

@Component({
  selector: 'app-rfid-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class RFIDFormComponent implements OnInit {
  loading = true;
  submitted = false;
  submitting = false;
  submittedItem = false;
  selectedEnvironment!: string;

  data = new RFID();
  form: FormGroup<FormData>;
  formItem: FormGroup<ItemFormData>;
  type!: string;
  breadcrumbs: { name: string; url: string }[] = [
    { name: 'Integração', url: '/' },
    { name: 'RFID', url: `/integracao/rfid` },
    { name: 'Novo RFID', url: `/integracao/rfid/formulario` },
  ];
  types = [
    { id: 'serviceStation', name: 'Pátio' },
    { id: 'sector', name: 'Setor' },
    { id: 'queue', name: 'Fila' },
  ];

  sectors: { id: number; name: string }[] = [];
  environments: { id: number; name: string }[] = [];
  queues:{ id: number; name: string }[] = [];
  servicesStations: { id: number; name: string }[] = [];
  environmentsPoe: { id: number; name: string }[] = [];
  rfidStatus: { id: number; name: string }[] = [];

  private id?: number;

  constructor(
    private _rfid: RFIDService,
    private _location: Location,
    private _utils: UtilsService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _form: FormService,
    private _environment: EnvironmentService,
    private _queue: QueueService,
    private _sector: SectorService,
    private _poe: PoeService,
    private _rfidStatus: RFIDStatusService,
    private cdr: ChangeDetectorRef
  ) {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id);
      this.breadcrumbs[this.breadcrumbs.length - 1].name = 'Editar RFID';
      this.breadcrumbs[this.breadcrumbs.length - 1].url += '/' + id;
    }

    this.form = this._fb.group({
      environmentId: [''],
      type: ['', Validators.required],
      sectorId: [''],
      queueId:[''],
      serviceStationId: [''],
      poeId:['',Validators.required],
      antenna:['',Validators.required],
      statusId:[''],
      items: this._fb.array<FormGroup>([]),
    });

    this.formItem = this.itemformGroup;
  }

  async ngOnInit() {
    try {
      this.loading = true;

      this.environments = await this._environment.getAll();
      this.queues = await this._queue.getAll();
      this.sectors = await this._sector.getAll();
      this.environmentsPoe = await this._poe.getAll();
      this.rfidStatus = await this._rfidStatus.getAll();

      if (this.id) {
        this.data = await this._rfid.getById(this.id);

        this.form.controls.sectorId.setValue(this.data.sector?.id);
        this.controls.serviceStationId.setValue(this.data.serviceStation?.id!);
        this.form.controls.environmentId.setValue(this.data.environment?.id);
      }
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }

  get controls() {
    return this.form.controls;
  }

  get itemControls() {
    return this.formItem.controls;
  }

  get itemformGroup() {
    return this._fb.group({
      locale1: ['', Validators.required],
      locale2: ['', Validators.required],
      shortName: ['', Validators.required],
      base: ['', Validators.required],
    });
  }

  onItemDetail(index: number) {}

  onItemDelete(index: number) {
    this.controls.items.removeAt(index);
  }

  updateSelect(value:any) {
    let ambienteSelecionado:any;
    const selectedValue = this.form.get(value)?.value;
    if(value == 'serviceStationId') ambienteSelecionado = this.environments.find(environment => environment.id === selectedValue);
    if(value == 'sectorId') ambienteSelecionado = this.sectors.find(sector => sector.id === selectedValue);
    if(value == 'queueId') ambienteSelecionado = this.queues.find(queue => queue.id === selectedValue);
    this.selectedEnvironment = ambienteSelecionado?.name ?? '';
    this.cdr.detectChanges();
  }

  updateType(){
    const selectedValue = this.form.get('type')?.value;
    this.type = selectedValue;
    this.selectedEnvironment = '';
  }

  onItemSubmit() {
    this.submittedItem = true;
    if (this.formItem.valid) {
      const form = this.itemformGroup;
      form.patchValue(this.formItem.value);
      this.controls.items.push(form);

      this.formItem.reset();
      this.submittedItem = false;
    } else
      this._utils.message('Verifique os campos antes de continuar!', 'warning');
  }

  async onSubmit() {
    this.submitted = true;
    this.submitting = true;
    this.form.patchValue({ statusId: this.rfidStatus[0].id });
    await this._form
      .submission<RFID>(
        this.form,
        this._rfid,
        this.id,
        'O RFID foi cadastrado com sucesso!'
      )
      .finally(() => {
        this.submitting = false;
      });
  }

  goToBack() {
    this._location.back();
  }
}
