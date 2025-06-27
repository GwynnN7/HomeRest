import {Component, inject, OnInit} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {DeviceViewComponent} from '../device-view/device-view.component';
import {DeviceInfo} from '../device-info';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeviceEditorComponent} from '../device-editor/device-editor.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-device-dashboard',
  imports: [
    DeviceViewComponent
],
  templateUrl: './device-dashboard.component.html',
  styleUrl: './device-dashboard.component.css'
})
export class DeviceDashboardComponent implements OnInit {
  private modalService = inject(NgbModal);
  private firebaseService: FirebaseService = inject(FirebaseService);
  router: Router = inject(Router);

  devices: DeviceInfo[] = [];

  ngOnInit(): void {
    this.firebaseService.getDevices("devices").subscribe(devices => {
      this.devices = devices;
    })
  }
  openAddModal() {
    this.modalService.open(DeviceEditorComponent, {
      size: 'lg'
    }).componentInstance.category = "devices";
  }

  openEditModal(device: DeviceInfo): void{
    const editorModal = this.modalService.open(DeviceEditorComponent, {
      size: 'lg'
    });
    editorModal.componentInstance.selectedDevice = device;
    editorModal.componentInstance.category = "devices";
  }
}
