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

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}