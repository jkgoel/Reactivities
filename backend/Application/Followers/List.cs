using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Presistence;
using Profile = Application.Profiles.Profile;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }

        }

        public class Handler : IRequestHandler<Query, Result<List<Profile>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profile>();

                profiles = request.Predicate switch
                {
                    "followers" => await _context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                                    .Select(u => u.Observer)
                                    .ProjectTo<Profile>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() })
                                    .ToListAsync(),

                    "following" => await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                                    .Select(u => u.Target)
                                    .ProjectTo<Profile>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUserName() })
                                    .ToListAsync(),
                    _ => null
                };

                return Result<List<Profile>>.Success(profiles);

            }
        }
    }
}