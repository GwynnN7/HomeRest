import {Component, inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {DeviceInfo} from '../device-info';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FirebaseService} from '../firebase.service';
import * as devicesIcons from '../../icons.json'
import {ToastService} from '../toast.service';
import {DeviceCallerService} from '../device-caller.service';

@Component({
  selector: 'app-device-editor',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './device-editor.component.html',
  styleUrl: './device-editor.component.css'
})
export class DeviceEditorComponent implements OnInit {
  @Input() selectedDevice: DeviceInfo | undefined;
  @Input() category!: string;

  firebaseService: FirebaseService = inject(FirebaseService);
  deviceCaller: DeviceCallerService = inject(DeviceCallerService);
  toastService: ToastService = inject(ToastService);
  activeModal = inject(NgbActiveModal)

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListOff: string[] = devicesIcons['switch_off'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  selectedIconIndex: number = 0;

  deviceForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    endpoint: new FormControl('', [Validators.required]),
    type: new FormControl('digital', [Validators.required])
  })

  ngOnInit(): void {
    if (this.selectedDevice != undefined) {
      this.deviceForm.setValue(
        {
          name: this.selectedDevice.name,
          endpoint: this.selectedDevice.endpoint,
          type: this.selectedDevice.type,
        }
      );
      this.selectIcon(this.selectedDevice.iconId);
    }
  }

  selectIcon(iconIndex: number): void {
    this.selectedIconIndex = iconIndex;
  }

  addDevice(): void {
    const editMode = this.selectedDevice != undefined;
    let newDevice: DeviceInfo = {
      id: editMode ? this.selectedDevice!.id : crypto.randomUUID(),
      name: this.deviceForm.value.name,
      type: this.deviceForm.value.type,
      endpoint: this.deviceForm.value.endpoint,
      iconId: this.selectedIconIndex
    };

    if(newDevice.endpoint !== this.selectedDevice?.endpoint && this.selectedDevice !== undefined){
      this.deviceCaller.subscribeDevice(this.selectedDevice.endpoint, "unsubscribe")
        .then()
        .catch();
    }

    this.firebaseService.addDevice(newDevice, this.category, editMode).then( result => {
        if(result) this.activeModal.close();
        else this.toastService.show("There was an error while creating the device");
      }
    )
  }

  deleteDevice(): void {
    if(!this.selectedDevice)
    {
      this.activeModal.dismiss();
      return;
    }
    this.firebaseService.deleteDevice(this.selectedDevice!, this.category).then( result => {
      if(result) {
        this.deviceCaller.subscribeDevice(this.selectedDevice!.endpoint, "unsubscribe")
          .then()
          .catch();
        this.activeModal.close();
      }
      else{
        this.toastService.show("There was an error while deleting the device.");
        this.activeModal.dismiss();
      }
    })
  }
}
