using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }

        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities.Include(a => a.Attendees)
                    .Where(x => x.Attendees.Any(u => u.AppUser.UserName == request.Username))
                    .OrderBy(d => d.Date)
                    .AsQueryable();


                var activities = request.Predicate switch
                {
                    "past" => await query.Where(a => a.Date < DateTime.UtcNow)
                                         .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                                         .ToListAsync(),
                    "future" => await query.Where(a => a.Date >= DateTime.UtcNow)
                                           .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                                           .ToListAsync(),
                    "hosting" => await query.Where(a => a.Attendees.Any(u => u.IsHost))
                                            .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                                            .ToListAsync(),
                    _ => null
                };

                return Result<List<UserActivityDto>>.Success(activities);
            }
        }
    }
}