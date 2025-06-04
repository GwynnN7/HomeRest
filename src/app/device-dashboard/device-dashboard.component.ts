import {Component, effect, inject, OnInit} from '@angular/core';
import {FirebaseService} from '../firebase.service';
import {DeviceViewComponent} from '../device-view/device-view.component';
import {NgForOf} from '@angular/common';
import {DeviceInfo} from '../device-info';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeviceEditorComponent} from '../device-editor/device-editor.component';

@Component({
  selector: 'app-device-dashboard',
  imports: [
    DeviceViewComponent,
    NgForOf
  ],
  templateUrl: './device-dashboard.component.html',
  styleUrl: './device-dashboard.component.css'
})
export class DeviceDashboardComponent implements OnInit {
  modalService = inject(NgbModal);
  firebaseService: FirebaseService = inject(FirebaseService);
  devices: DeviceInfo[] = [];

  ngOnInit(): void {
    this.firebaseService.getDevices("devices").subscribe(devices => {
      this.devices = devices;
    })
  }
  openAddModal() {
    this.modalService.open(DeviceEditorComponent, {
      size: 'lg'
    });
  }

  openEditModal(device: DeviceInfo): void{
    const editorModal = this.modalService.open(DeviceEditorComponent, {
      size: 'lg'
    });
    editorModal.componentInstance.selectedDevice = device;
  }
}
