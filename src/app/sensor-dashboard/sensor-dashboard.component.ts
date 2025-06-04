import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {DeviceInfo} from '../device-info';
import {NgForOf} from '@angular/common';
import {SensorViewComponent} from '../sensor-view/sensor-view.component';
import {SensorEditorComponent} from '../sensor-editor/sensor-editor.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sensor-dashboard',
  imports: [
    SensorViewComponent,
    NgForOf
  ],
  templateUrl: './sensor-dashboard.component.html',
  styleUrl: './sensor-dashboard.component.css'
})
export class SensorDashboardComponent implements OnInit{
  modalService = inject(NgbModal);
  firebaseService: FirebaseService = inject(FirebaseService);
  sensors: DeviceInfo[] = [];

  ngOnInit(): void {
    this.firebaseService.getDevices("sensors").subscribe(sensors => {
      this.sensors = sensors;
    })
  }

  openAddModal() {
    this.modalService.open(SensorEditorComponent, {
      size: 'lg'
    });
  }

  openEditModal(sensor: DeviceInfo) {
    const editorModal = this.modalService.open(SensorEditorComponent, {
      size: 'lg'
    });
    editorModal.componentInstance.selectedSensor = sensor;
  }
}
