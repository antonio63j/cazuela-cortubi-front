export class FiltroSugerencia {
    page: string;
    size: string;
    order: string;
    direction: string;
    precioMin: string;
    precioMax: string;
    label: string;
    tipo: string;
    descripcion: string;

    constructor() {
       this.init();
       this.initPage('0', '2', 'label', 'asc');
    }

    init(): void{
        this.precioMin = null;
        this.precioMax = null;
        this.label = null;
        this.tipo = null;
        this.descripcion = null;
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
