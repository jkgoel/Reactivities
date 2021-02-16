using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using MediatR;
using Presistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null) return null;

                _context.Remove(activity);

                var success = await _context.SaveChangesAsync() > 0;

                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete activity");


            }
        }
    }
}