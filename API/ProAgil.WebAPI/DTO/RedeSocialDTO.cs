using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.DTO
{
    public class RedeSocialDTO
    {
        public int Id { get; set; }

        [Required (ErrorMessage="O campo {0} é obrigatorio")]
        public string Nome { get; set; }

        [Required (ErrorMessage="O campo {0} é obrigatorio")]
        public string URL { get; set; }
    }
}