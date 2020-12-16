import { Lote } from './Lote';
import { RedeSocial } from './RedeSocial';
import { Palestrante } from './Palestrante';


export interface Evento {
    id: number;
    local: string;
    dataEvento: Date;
    tema: string;
    qtdPessoas: number;
    imgUrl: string;
    telefone: string;
    email: string;
    lote: string;
    lotes: Lote[];
    redesocial: RedeSocial[];
    palestranteeventos: Palestrante[];
}