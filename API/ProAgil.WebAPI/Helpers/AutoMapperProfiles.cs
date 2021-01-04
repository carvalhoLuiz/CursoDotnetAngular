using System.Linq;
using AutoMapper;
using ProAgil.Domain;
using ProAgil.Domain.Identity;
using ProAgil.WebAPI.DTO;

namespace ProAgil.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDTO>()
                .ForMember(dest => dest.Palestrantes, opt => {
                    opt.MapFrom(src => src.PalestranteEventos.Select(x => x.Palestrante).ToList());
                });
                CreateMap<EventoDTO, Evento>();

                CreateMap<Palestrante, PalestranteDTO>()
                    .ForMember(dest => dest.Eventos, opt => {
                        opt.MapFrom(src => src.PalestranteEventos.Select(x => x.Evento).ToList());
                    });

            CreateMap<Lote, LoteDTO>();
            CreateMap<LoteDTO, Lote>();

            CreateMap<RedeSocial, RedeSocialDTO>();   
            CreateMap<RedeSocialDTO, RedeSocial>();  

            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, UserLoginDTO>().ReverseMap();
        }
    }
}