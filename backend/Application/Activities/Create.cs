using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Presistence;

namespace Application.Activities
{
    public class Create
    {

        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity.Title).NotEmpty();
                RuleFor(x => x.Activity.Description).NotEmpty();
                RuleFor(x => x.Activity.Category).NotEmpty();
                RuleFor(x => x.Activity.Date).NotEmpty();
                RuleFor(x => x.Activity.City).NotEmpty();
                RuleFor(x => x.Activity.Venue).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {


                _context.Activities.Add(request.Activity);
                var success = await _context.SaveChangesAsync() > 0;

                return success ? Unit.Value : throw new Exception("Problem creating new activity");


            }
        }
    }

}