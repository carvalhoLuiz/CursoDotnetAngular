import { RedeSocial } from "./RedeSocial";
import { Evento } from './Evento';

export interface Palestrante {
      id: number;
      nome: string;
      minicurriculo: string;
      imgurl: string;
      email: string;
      redeSocial: RedeSocial[];
      palestranteEventos: Evento[];
}
