using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly DatabaseService _db;

        public MembersController(DatabaseService db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            var members = await _db.GetMembersAsync();
            return Ok(members);
        }

        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] Member member)
        {
            await _db.AddMemberAsync(member);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] Member member)
        {
            member.MemberID = id;
            await _db.UpdateMemberAsync(member);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            await _db.DeleteMemberAsync(id);
            return Ok();
        }

        [HttpGet("{id}/phones")]
        public async Task<IActionResult> GetPhones(int id)
        {
            var memberPhones = await _db.GetMemberPhonesAsync(id);
            return Ok(memberPhones);
        }
        
        [HttpPost("{id}/phones")]
        public async Task<IActionResult> AddPhone(int id, [FromBody] MemberPhone phone)
        {
            phone.MemberID = id;
            await _db.AddMemberPhoneAsync(phone);
            return Ok();
        }

        [HttpDelete("phones/{phoneId}")]
        public async Task<IActionResult> DeletePhone(int phoneId)
        {
            await _db.DeleteMemberPhoneAsync(phoneId);
            return Ok();
        }
    }
}
