import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminSliderService } from 'src/app/pages-admin/admin-sliders/admin-slider.service';
import { AdminTipoplatoService } from 'src/app/pages-admin/admin-tipoplato/admin-tipoplato.service';
import { environment } from 'src/environments/environment';
import { Empresa } from '../modelos/empresa';
import { Slider } from '../modelos/slider';
import { SliderData } from '../modelos/slider-data';
import { Tipoplato } from '../modelos/tipoplato';
import { ImageService } from './image-service';

@Injectable({
  providedIn: 'root'
})
export class ShareEmpresaService {

  private empresaMsg = new ReplaySubject<Empresa>();

  public slider: Slider = new Slider();
  public sliders: Slider [];
  public slidersData: SliderData [] = [];
  public sliderData: SliderData = new SliderData();

  public tipoplatos: Tipoplato [] = [];

  private unsubscribe$ = new Subject();
 
  constructor(
    private sliderService: AdminSliderService,
    private imageService: ImageService,
    private tipoplatoService: AdminTipoplatoService
    ) {
      this.cargaSliders();
      this.cargaTipoplatos();
      console.log('en constructor');

     }

  public getEmpresaMsg(): Observable<Empresa>{
    return this.empresaMsg as Observable<Empresa>;
  }

  public updateEmpresaMsg(empresa: Empresa): void {
    this.empresaMsg.next(empresa);
  }

  cargaTipoplatos(): void {
    this.tipoplatoService.getTipoplatos().pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe (
      response => {
        this.tipoplatos = (response as Tipoplato[]);
        console.log(this.tipoplatos);
      },
      err => {
        console.log('error en carga inicial de tipoplatos');
        console.log(err);
      }
    );
  }

  getIipoplatosInMem(): Tipoplato [] {
    return this.tipoplatos;
  }
  cargaSliders(): void {
    this.sliderService.getSliders().pipe(
        takeUntil(this.unsubscribe$),
      ).subscribe(
        response => {
          this.sliders = (response as Slider[]);
          this.cargaSliderData();
        }
        , err => {
          console.log('error en carga de slider');
          console.log(err);
          // swal.fire('Error carga de sliders', err.message, 'error');
        }
      );
  }

  cargaSliderData(): void {
    this.sliders.forEach( (myObject: Slider, index) => {
      if (myObject.imgFileName) {
        this.getImage (myObject );
      }
    });
  }

  // tslint:disable-next-line: typedef
  getImage(slider: Slider) {
    let urlImg: string;
    urlImg =  environment.urlEndPoint +
              '/api/empresa/uploads/img/sliders/' +
              slider.imgFileName;
    this.slider = slider;
    this.imageService.getData(urlImg)
      .subscribe(
        imgData => {
          const sliderData: SliderData = new SliderData();
          sliderData.imgFileData = imgData;
          sliderData.label = slider.label;
          sliderData.descripcion = slider.descripcion;
          this.slidersData.push (sliderData);
        }
        ,
        err => {
          console.log('error en carga de imagen slider');
          console.log(err);
        }
      );
  }

}
