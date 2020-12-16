using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public IProAgilRepository Repo { get; }
        public EventoController(IProAgilRepository repo)
        {
            Repo = repo;

        }

        [HttpGet]

        public async Task<IActionResult> Get() {
            try
            {
                var results = await Repo.GetAllEventoAsync(true);
                
                return Ok(results);
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }
        }

        [HttpGet("{EventoId}")]

        public async Task<IActionResult> Get(int EventoId) {
            try
            {
                var result = await Repo.GetEventoAsyncById(EventoId, true);

                return Ok(result);
            }
            catch (System.Exception)
            {
                
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }
        }
        
        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema) {
            try
            {
                var result = await Repo.GetAllEventoAsyncByTema(tema, true);

                return Ok(result);
            }
            catch (System.Exception){
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Evento model) {
            try
            {
                Repo.Add(model);
                
                if(await Repo.SaveChangesAsync()){
                    return Created($"/api/evento/{model.Id}", model);
                }
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }

            return BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> Put(int EventoId, Evento model){
            try
            {
                var evento = await Repo.GetEventoAsyncById(EventoId, false);

                if(evento == null) return NotFound();

                if(await Repo.SaveChangesAsync()){
                    return Ok();
                    }
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }

            return BadRequest();
        }

        [HttpDelete]

        public async Task<IActionResult> Delete(int EventoId) {
            try
            {
                var evento = await Repo.GetEventoAsyncById(EventoId, false);

            if(evento == null) return NotFound();

            Repo.Delete(evento);

            if(await Repo.SaveChangesAsync()) {
                return Ok();
            }
            }
            catch (System.Exception)
            {
                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }

            return BadRequest();
        }

    }
}