export class FiltroPedido {

        page: string;
        size: string;
        order: string;
        direction: string;

        estado: string;
        diaRegistroIni: Date;
        diaRegistroFin: Date;
        diaRecogidaIni: Date;
        horaRecogidaIni: string;
        diaRecogidaFin: Date;
        horaRecogidaFin: string;
        usuario: string;

        constructor() {
           this.init();
           this.initPage('0', '10', 'fechaRecogida', 'asc');
        }

        init(): void{
            this.diaRegistroIni = null;
            this.diaRegistroFin = null;
            this.diaRecogidaIni = new Date();
            this.diaRecogidaIni.setHours(0, 0, 0);
            this.horaRecogidaIni = '00:00';
            this.diaRecogidaFin = new Date();
            this.diaRecogidaFin.setHours(23 , 59, 59);
            this.horaRecogidaFin = '23:59';
            this.estado = null;
            this.usuario = null;

        }
    
        initPage(page: string,
                 size: string,
                 order: string,
                 direction: string): void{
          this.page = page;
          this.size = size;
          this.order = order;
          this.direction = direction;
        }
    }
