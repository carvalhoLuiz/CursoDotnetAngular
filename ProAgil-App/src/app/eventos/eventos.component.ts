import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventoService } from '../services/evento.service';
import { Evento } from '../_models/Evento';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];

  evento: Evento;
  modoSalvar = 'post';
  bodyDeletarEvento = '';

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;

  file: File;

  filtroLista =  '';
  fileNameToUpdate: string;

  dataAtual: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
    ) {
      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');
     }

  ngOnInit(): void {
    this.validation();
    this.getEventos();
  }

  get FiltroLista(): string {
    return this.filtroLista;
  }

  set FiltroLista(value: string) {
    this.filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  novoEvento(template: any): void {
    this.modoSalvar = 'post';
    this.openModal(template);
  }
  editarEvento(evento: Evento, template: any): void {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imgUrl.toString();
    this.evento.imgUrl = '';
    this.registerForm.patchValue(this.evento);
  }
  excluirEvento(evento: Evento, template: any): void {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }
  confirmeDelete(template: any): void {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com sucesso!');
        }, (error: any) => {
          this.toastr.error('Erro ao tentar deletar!');
          console.log(error);
        }
    );
  }
  openModal(template: any): void {
    this.registerForm.reset();
    template.show();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLowerCase();
    return this.eventos.filter( (evento: any) => {
    return evento.tema.toLowerCase().indexOf(filtrarPor) !== -1;
    });
  }

  alterarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(): void {
    this.registerForm = this.fb.group({
      tema: ['',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['',
        [Validators.required, Validators.maxLength(120000)]],
      imgUrl: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['',
        [Validators.required, Validators.email]],
    });
  }

  onFileChange(event: any): void {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  uploadImagem(): void {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imgUrl.split('\\', 3);
      this.evento.imgUrl = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(() => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      });
    } else {
      this.evento.imgUrl = this.fileNameToUpdate;

      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(() => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      });
    }
  }

  salvarAlteracao(template: any): void {
    if (this.registerForm.valid){
      if (this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
        (novoEvento: Evento) => {
          template.hide();
          this.getEventos();
          this.toastr.success('Inserido com sucesso!');
        }, (error: any) => {
          this.toastr.error(`Erro ao inserir: ${error}`);
          console.log(error);
        }
      );
      }
      else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com sucesso!');
          }, (error: any) => {
            this.toastr.error(`Erro ao editar: ${error}`);
            console.log(error);
        }
      );
      }
}
  }

  getEventos(): void {
    this.dataAtual = new Date().getMilliseconds().toString();
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


