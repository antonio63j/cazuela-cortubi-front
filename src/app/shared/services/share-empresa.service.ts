import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminSliderService } from 'src/app/pages-admin/admin-sliders/admin-slider.service';
import { AdminTipoplatoService } from 'src/app/pages-admin/admin-tipoplato/admin-tipoplato.service';
import { EmpresaService } from 'src/app/pages-admin/empresa/empresa.service';
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
  private observ$: Subscription = null;
  private empresa: Empresa;
  public erroresValidacion: string[];

  constructor(
    private sliderService: AdminSliderService,
    private imageService: ImageService,
    private tipoplatoService: AdminTipoplatoService,
    private empresaService: EmpresaService
    ) {
      this.cargaSliders();
      this.cargaTipoplatos();
      this.cargaEmpresa(1);

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

  public copiaEmpresa(): Empresa {
    return this.empresa;
  }

  cargaEmpresa(id: number): void {
    this.observ$ = this.empresaService.get(id).pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(
        json => {
          this.empresa = json;
          if (this.empresa == null) {
            this.empresa = new Empresa();
          }
        }
        , err => {
          if (err.status === 400) {
            console.log('error 400');
            this.erroresValidacion = err.error.errors as string[];
            console.log(this.erroresValidacion);
          } else {
            console.log('nook');
            console.log(`error=${JSON.stringify(err)}`);
          }
        }
      );
  }

}
