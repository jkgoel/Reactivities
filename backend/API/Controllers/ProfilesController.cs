using System.Reflection.Metadata;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            var query = new Details.Query
            {
                Username = username
            };
            return HandleResult(await Mediator.Send(query));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, [FromQuery] string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query { Username = username, Predicate = predicate }));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}