import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {DeviceInfo} from '../device-info';
import {SensorViewComponent} from '../sensor-view/sensor-view.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {DeviceEditorComponent} from '../device-editor/device-editor.component';

@Component({
  selector: 'app-sensor-dashboard',
  imports: [
    SensorViewComponent
],
  templateUrl: './sensor-dashboard.component.html',
  styleUrl: './sensor-dashboard.component.css'
})
export class SensorDashboardComponent implements OnInit{
  private modalService = inject(NgbModal);
  private firebaseService: FirebaseService = inject(FirebaseService);
  router: Router = inject(Router);

  sensors: DeviceInfo[] = [];

  ngOnInit(): void {
    this.firebaseService.getDevices("sensors").subscribe(sensors => {
      this.sensors = sensors;
    })
  }

  openAddModal() {
    this.modalService.open(DeviceEditorComponent, {
      size: 'lg'
    }).componentInstance.category = "sensors";
  }

  openEditModal(sensor: DeviceInfo) {
    const editorModal = this.modalService.open(DeviceEditorComponent, {
      size: 'lg'
    });
    editorModal.componentInstance.selectedDevice = sensor;
    editorModal.componentInstance.category = "sensors";
  }
}
