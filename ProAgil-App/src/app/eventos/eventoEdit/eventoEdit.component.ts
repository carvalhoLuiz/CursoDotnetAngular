import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/_models/Evento';

@Component({
  selector: 'app-eventoEdit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {
  titulo = 'Editar evento';
  evento: Evento = new Evento();
  registerForm: FormGroup;
  imagemUrl = 'assets/img/upload.png';
  dataEvento: any;
  fileNameToUpdate: string;
  dataAtual = '';
  file: File;

  get lotes(): FormArray {
    return <FormArray> this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray> this.registerForm.get('redesSociais');
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: ActivatedRoute
    ) {
      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');
     }

     ngOnInit(): void {
      this.validation();
      this.carregarEvento();
    }

    carregarEvento(): void {
      this.dataAtual = new Date().getMilliseconds().toString();
      const idEvento = Number(this.router.snapshot.paramMap.get('id'));

      this.eventoService.getEventoById(idEvento).subscribe((evento: Evento) => {
        this.evento = Object.assign({}, evento);

        this.fileNameToUpdate = evento.imgUrl.toString();
        this.imagemUrl = `http://localhost:3001/resources/images/${this.evento.imgUrl}?_ts=${this.dataAtual}`;

        this.registerForm.patchValue(this.evento);

        this.evento.lotes.forEach((lote: any) => {
          console.log('teste');
          this.lotes.push(this.criaLote(lote));
        });
        this.evento.redesocial.forEach((redeSocial: any) => {
          this.redesSociais.push(this.criaRedeSocial(redeSocial));
        });
      });

    }
    

    validation(): void {
      this.registerForm = this.fb.group({
        id: [],
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.maxLength(120000)]],
        imgUrl: [''],
        telefone: ['', Validators.required],
        email: ['',
          [Validators.required, Validators.email]],
        lotes: this.fb.array([this.criaLote({ id: 0 })]),
        redesSociais: this.fb.array([this.criaRedeSocial({ id: 0 })])
      });
    }



    criaLote(lote: any): FormGroup {
      return this.fb.group({
        id: [lote.id],
        nome: [lote.nome, Validators.required],
        quantidade: [lote.quantidade, Validators.required],
        preco: [lote.preco, Validators.required],
        dataInicio: [lote.dataInicio],
        dataFim: [lote.dataFim],
      });
    }

    criaRedeSocial(redeSocial: any): FormGroup {
      return  this.fb.group({
        id: [redeSocial.id],
        nome: [redeSocial.nome, Validators.required],
        url: [redeSocial.url, Validators.required],
      });
    }

    adicionarLote(): void {
      this.lotes.push(this.criaLote({ id: 0 }));
    }

    adicionarRede(): void {
      this.redesSociais.push(this.criaRedeSocial({ id: 0 }));
    }

    removeLote(id: number): void {
      this.lotes.removeAt(id);
    }

    removeRede(id: number): void {
      this.redesSociais.removeAt(id);
    }

    onFileChange(file: any): void {
      const reader = new FileReader();

      reader.onload = (event: any) => this.imagemUrl = event.target.result;
      this.file = file.target.files;
      reader.readAsDataURL(file.target.files[0]);
    }

    uploadImagem(): void {
      this.evento.imgUrl = this.fileNameToUpdate;
      console.log(this.file);
      if (this.registerForm.get('imgUrl')?.value !== ''){
      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(() => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.imagemUrl = `http://localhost:3001/resources/images/${this.evento.imgUrl}?_ts=${this.dataAtual}`;
      });
      }
    }

    salvarEvento(): void {
      this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
      this.evento.imgUrl = this.fileNameToUpdate;
      this.uploadImagem();

      this.eventoService.putEvento(this.evento).subscribe(
        () => {
          this.toastr.success('Editado com sucesso!');
        }, (error: any) => {
          this.toastr.error(`Erro ao editar: ${error}`);
          console.log(error);
      }
    );
    }
}
