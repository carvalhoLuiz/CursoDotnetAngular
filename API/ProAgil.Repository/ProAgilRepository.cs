using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private ProAgilContext Context { get; }
        public ProAgilRepository(ProAgilContext contexto)
        {
            Context = contexto;
            Context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }
        //Geral
        public void Add<T>(T entity) where T : class
        {
            Context.Add(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            Context.Update(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            Context.Remove(entity);
        }
        public async Task<bool> SaveChangesAsync()
        {
           return (await Context.SaveChangesAsync()) > 0;
        }

        //EVENTO
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = Context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSocial);

            if(includePalestrantes) {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            }
            query = query
                .OrderBy(c => c.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes)
        {
            IQueryable<Evento> query = Context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSocial);

            if(includePalestrantes) {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderByDescending(c => c.DataEvento)
                .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }
        public async Task<Evento> GetEventoAsyncById(int eventoId, bool includePalestrantes)
        {
            IQueryable<Evento> query = Context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedeSocial);

            if(includePalestrantes) {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderByDescending(c => c.DataEvento)
                .Where(c => c.Id == eventoId);

            return await query.FirstOrDefaultAsync();
        }
        //PALESTRANTE
        public async Task<Palestrante> GetPalestranteAsync(int palestranteId, bool includeEventos = false)
        {
           IQueryable<Palestrante> query = Context.Palestrantes
                .Include(c => c.RedeSocial);

            if(includeEventos) {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Evento);
            }
            query = query.OrderBy(c => c.Nome)
            .Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestranteAsyncByName(string name, bool includeEventos)
        {
            IQueryable<Palestrante> query = Context.Palestrantes
                .Include(c => c.RedeSocial);

            if(includeEventos) {
                query = query
                    .Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Evento);
            }
            query = query.Where(p => p.Nome.ToLower().Contains(name.ToLower()));

            return await query.ToArrayAsync();
        }
    }
}