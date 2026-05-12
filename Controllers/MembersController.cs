using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Interfaces;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly IMemberService _memberService;

        public MembersController(IMemberService memberService)
        {
            _memberService = memberService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> GetMembers()
        {
            var members = await _memberService.GetMembersAsync();
            return Ok(members);
        }

        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] Member member)
        {
            await _memberService.AddMemberAsync(member);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] Member member)
        {
            member.MemberID = id;
            await _memberService.UpdateMemberAsync(member);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            await _memberService.DeleteMemberAsync(id);
            return Ok();
        }

        [HttpGet("{id}/phones")]
        public async Task<IActionResult> GetPhones(int id)
        {
            var memberPhones = await _memberService.GetMemberPhonesAsync(id);
            return Ok(memberPhones);
        }
        
        [HttpPost("{id}/phones")]
        public async Task<IActionResult> AddPhone(int id, [FromBody] MemberPhone phone)
        {
            phone.MemberID = id;
            await _memberService.AddMemberPhoneAsync(phone);
            return Ok();
        }

        [HttpDelete("phones/{phoneId}")]
        public async Task<IActionResult> DeletePhone(int phoneId)
        {
            await _memberService.DeleteMemberPhoneAsync(phoneId);
            return Ok();
        }
    }
}
