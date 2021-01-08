import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, take, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Slider } from 'src/shared/modelos/slider';
import { ModalConModeloService } from 'src/shared/services/modal-con-modelo.service';
import { ModalService } from 'src/shared/services/modal.service';
import { AdminSliderService } from './admin-slider.service';
import swal from 'sweetalert2';
import { SliderFormComponent } from './slider-form/slider-form.component';
import { environment } from 'src/environments/environment';

const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
  allowOutsideClick: false
});

@Component({
  selector: 'app-admin-sliders',
  templateUrl: './admin-sliders.component.html',
  styleUrls: ['./admin-sliders.component.scss']
})
export class AdminSlidersComponent implements OnInit, OnDestroy {
  sliders: Slider[];
  slider: Slider = new Slider();

  private unsubscribe$ = new Subject();
  private observ$: Subscription = null;

  public tituloBody: string;
  host: string = environment.urlEndPoint;
  public sliderVacio: Slider = new Slider();

  constructor(
    private adminSliderService: AdminSliderService,
    private modalService: ModalService,
    private modalConModeloService: ModalConModeloService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.subcripcionSliders();
  }

  subcripcionSliders(): void {
    this.adminSliderService.getSliders().pipe(
      takeUntil(this.unsubscribe$),
      tap((response: any) => {
        console.log(response);
      }),
      // map((response: any) => {

      //   ( 
      //     response as Slider[]).map(slider => {
      //     slider.label = slider.label.toLowerCase();
      //     return slider;
      //   });
      //   return response;
      // }),
    ).subscribe(
      response => {
        this.sliders = (response as Slider[]);
        // this.paginador = response;
      }
      , err => {
        console.log(err);
        swal.fire('Error carga de sliders', err.message, 'error');
      }
    );
  }

  public create(): void {
    this.openModal(new Slider());
  }

  public delete(slider: Slider): void {
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás esta foto de la portada ${slider.label}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.adminSliderService.delete(slider.id).subscribe(
          response => {
            this.adminSliderService.getSliders().subscribe(respon => {
              this.sliders = (respon as Slider[]);
            });
          }
          , err => {
            console.log(err);
            swal.fire('Error al eliminar slider', '', 'error');
          }
        );
      }
    });

  }

  public update(slider: Slider): void {
    this.openModal(slider);
  }

  public openModal(slider: Slider): void {

    this.modalConModeloService.openModalScrollable(
      SliderFormComponent,
      { size: 'lg', backdrop: 'static', scrollable: true },
      slider,
      'slider',
      'Los campos con * son obligatorios',
      'Datos del slider'
    ).pipe(
      take(1) // take() manages unsubscription for us
    ).subscribe(result => {
      console.log({ confirmedResult: result });
      this.adminSliderService.getSliders().subscribe(respon => {
        this.sliders = respon as Slider[];
        // this.paginador = respon;
      });
    });
  }

  subscripcioneventoCerrarModalScrollable(): void {
    this.modalService.eventoCerrarModalScrollable.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      () => {
        console.log('recibido evento para cerrar modal');
        this.modalConModeloService.closeModalScrollable();
      }
    );
  }

  subscripcioneventoNotificacionUpload(): void {
    this.modalService.eventoNotificacionUpload.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(
      slider => {
        console.log('recibido evento fin Upload');
        this.sliders.map(sliderOriginal => {
          if (sliderOriginal.id === slider.id) {
            sliderOriginal.imgFileName = slider.imgFileName;
          }
          return sliderOriginal;
        }); // map
      }
    );
  }


  ngOnDestroy(): void {
    console.log('ngOnDestroy (), realizando unsubscribes');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}