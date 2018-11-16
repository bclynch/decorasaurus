import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorComponent } from './generator/generator.component';
import { Routes, RouterModule } from '@angular/router';

import { AngularCropperjsModule } from 'angular-cropperjs';
import { FileDropModule } from 'ngx-file-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { ENV } from '../../../environments/environment';
import { MapBasicOptionsComponent } from './basic-options/map-basic-options/map-basic-options.component';
import { UploadCropComponent } from './upload-crop/upload-crop.component';
import { PatentBasicOptionsComponent, PatentInfoDialogue } from './basic-options/patent-basic-options/patent-basic-options.component';
import { ColorsPickerComponent } from './colors-picker/colors-picker.component';
import { OptionsContainerComponent } from './options-container/options-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { PatentExpandDialogueComponent } from './patent-expand-dialogue/patent-expand-dialogue.component';
import { CropperComponent } from './cropper/cropper.component';
import { PrintMapComponent } from './print-map/print-map.component';
import { PosterOverlayComponent } from './poster-overlay/poster-overlay.component';
import { FusionBasicOptionsComponent } from './basic-options/fusion-basic-options/fusion-basic-options.component';
import { TraceBasicOptionsComponent } from './basic-options/trace-basic-options/trace-basic-options.component';

const routes: Routes = [
  { path: ':type', component: GeneratorComponent }
];

@NgModule({
  entryComponents: [
    PatentInfoDialogue,
    PatentExpandDialogueComponent,
    PrintMapComponent
  ],
  imports: [
    CommonModule,
    AngularCropperjsModule,
    FileDropModule,
    ColorPickerModule,
    RouterModule.forChild(routes),
    NgxMapboxGLModule.withConfig({
      accessToken: ENV.mapboxAPIKey,
    }),
    AgmCoreModule.forRoot({
      apiKey: ENV.googleAPIKey,
      libraries: ['places']
    }),
    SharedModule,
    FormsModule
  ],
  declarations: [
    GeneratorComponent,
    MapBasicOptionsComponent,
    UploadCropComponent,
    PatentBasicOptionsComponent,
    ColorsPickerComponent,
    OptionsContainerComponent,
    PatentInfoDialogue,
    PatentExpandDialogueComponent,
    CropperComponent,
    PrintMapComponent,
    PosterOverlayComponent,
    FusionBasicOptionsComponent,
    TraceBasicOptionsComponent
  ]
})
export class GeneratorModule { }
