export class FiltroPedido {

        page: string;
        size: string;
        order: string;
        direction: string;

        estado: string;
        diaRegistroIni: Date;
        diaRegistroFin: Date;
        diaRecogidaIni: Date;
        diaRecogidaFin: Date;
        usuario: string;

        constructor() {
           this.init();
           this.initPage('0', '10', 'fechaRecogida', 'asc');
        }

        init(): void{
            this.diaRegistroIni = null;
            this.diaRegistroFin = null;
            this.diaRecogidaIni = null;
            this.diaRecogidaFin = null;
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
