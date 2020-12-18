using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.DTO
{
    public class EventoDTO
    {
        public int Id { get; set; }

        [Required (ErrorMessage="Campo Obrigatório")]
        [StringLength(100, MinimumLength=3, ErrorMessage="Local é entre 3 e 100 caracteres")]
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required (ErrorMessage="O tema deve ser preenchido")]
        public string Tema { get; set; }

        [Range(2, 120000, ErrorMessage="Quantidade de pessoas é entre 2 e 120000" )]
        public int QtdPessoas { get; set; }
        public string ImgUrl{ get; set; }
        public string Telefone { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public string Lote { get; set; }
        public List<LoteDTO> Lotes { get; set; }
        public List<RedeSocialDTO> RedeSocial { get; set; }
        public List<PalestranteDTO> Palestrantes { get; set; }
    }
}