import {Component, inject, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DeviceInfo} from '../device-info';
import {FirebaseService} from '../firebase.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as devicesIcons from '../../../devices/icons.json';

@Component({
  selector: 'app-sensor-editor',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './sensor-editor.component.html',
  styleUrl: './sensor-editor.component.css'
})
export class SensorEditorComponent implements OnInit {
  @Input() selectedSensor: DeviceInfo | undefined;

  firebaseService: FirebaseService = inject(FirebaseService);
  activeModal = inject(NgbActiveModal)

  iconListOn: string[] = devicesIcons['switch_on'];
  iconListOff: string[] = devicesIcons['switch_off'];
  iconListNeutral: string[] = devicesIcons['neutral'];
  selectedIconIndex: number = 0;

  sensorForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    endpoint: new FormControl('', [Validators.required]),
    type: new FormControl('digital', [Validators.required])
  })

  ngOnInit(): void {
    if (this.selectedSensor != undefined) {
      this.sensorForm.setValue(
        {
          name: this.selectedSensor.name,
          endpoint: this.selectedSensor.endpoint,
          type: this.selectedSensor.type,
        }
      );
      this.selectIcon(this.selectedSensor.iconId);
    }
  }

  selectIcon(iconIndex: number): void {
    this.selectedIconIndex = iconIndex;
  }

  addSensor(): void {
    const editMode = this.selectedSensor != undefined;
    let newDevice: DeviceInfo = {
      id: editMode ? this.selectedSensor!.id : crypto.randomUUID(),
      name: this.sensorForm.value.name,
      type: this.sensorForm.value.type,
      endpoint: this.sensorForm.value.endpoint,
      iconId: this.selectedIconIndex
    };

    this.firebaseService.addDevice(newDevice, "sensors", editMode).then( result => {
        if(result) this.activeModal.close();
        else alert("There was an error while creating the device.");
      }
    )
  }

  deleteSensor(): void {
    if(!this.selectedSensor)
    {
      this.activeModal.dismiss();
      return;
    }
    this.firebaseService.deleteDevice(this.selectedSensor!, "sensors").then( result => {
      if(result) this.activeModal.close();
      else{
        alert("There was an error while deleting the device.");
        this.activeModal.dismiss();
      }
    })
  }
}
