import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  filtroLista =  '';

  get FiltroLista(): string {
    return this.filtroLista;
  }

  set FiltroLista(value: string) {
    this.filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;

  }

  eventos: any = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  eventosFiltrados: any = [];

  constructor(private http: HttpClient ) { }

  ngOnInit(): void {
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): any {
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
   this.http.get('http://localhost:3001/api/values/').subscribe(response => {
     this.eventos = response;
     console.log(this.eventos);
    }, error => {
      console.log(error);
    }
    );
  }

}
