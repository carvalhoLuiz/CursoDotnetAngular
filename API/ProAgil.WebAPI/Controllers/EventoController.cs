using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.DTO;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public IProAgilRepository Repo { get; }
        public IMapper Mapper { get; }
        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            this.Mapper = mapper;
            Repo = repo;
        }

        [HttpGet]

        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await Repo.GetAllEventoAsync(true);
                
                var results = Mapper.Map<IEnumerable<EventoDTO>>(eventos);

                return Ok(results);
            }
            catch (System.Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro no banco de dados! {ex.Message}");
            }
        }

        [HttpGet("{EventoId}")]

        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await Repo.GetEventoAsyncById(EventoId, true);

                var result = Mapper.Map<EventoDTO>(evento);
                return Ok(result);
            }
            catch (System.Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var result = await Repo.GetAllEventoAsyncByTema(tema, true);

                return Ok(result);
            }
            catch (System.Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDTO model)
        {
            try
            {
                var evento = Mapper.Map<Evento>(model);

                Repo.Add(evento);

                if (await Repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", Mapper.Map<EventoDTO>(evento));
                }
            }
            catch (System.Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro no banco de dados! {ex.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDTO model)
        {
            try
            {
                var evento = await Repo.GetEventoAsyncById(EventoId, false);

                if (evento == null) return NotFound();

                Mapper.Map(model, evento);

                Repo.Update(evento);

                if (await Repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", Mapper.Map<EventoDTO>(evento));
                }
            }
            catch (System.Exception)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, "Erro no banco de dados!");
            }

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]

        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await Repo.GetEventoAsyncById(EventoId, false);

                if (evento == null) return NotFound();

                Repo.Delete(evento);

                if (await Repo.SaveChangesAsync())
                {
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