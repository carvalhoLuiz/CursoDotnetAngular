import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventoService } from '../services/evento.service';
import { Evento } from '../_models/Evento';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef ;

  filtroLista =  '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService
    ) { }

  ngOnInit(): void {
    this.getEventos();
  }

  get FiltroLista(): string {
    return this.filtroLista;
  }

  set FiltroLista(value: string) {
    this.filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLowerCase();
    return this.eventos.filter( (evento: any) => {
      console.log(evento.tema.toLowerCase().indexOf(filtrarPor));
      return evento.tema.toLowerCase().indexOf(filtrarPor) !== -1;
    });
  }

  alterarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos(): void {
    this.eventoService.getAllEvento().subscribe(
      (prEvento: Evento[]) => {
      this.eventos =  prEvento;
      this.eventosFiltrados = this.eventos;
      console.log(prEvento);
    }, error => {
      console.log(error);
    });
  }
}
