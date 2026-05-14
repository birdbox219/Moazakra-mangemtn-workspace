using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Interfaces
{
    public interface IMemberService
    {
        Task<IEnumerable<Member>> GetMembersAsync();
        Task AddMemberAsync(Member member);
        Task UpdateMemberAsync(Member member);
        Task DeleteMemberAsync(int id);
        
        Task<IEnumerable<MemberPhone>> GetMemberPhonesAsync(int memberId);
        Task AddMemberPhoneAsync(MemberPhone phone);
        Task DeleteMemberPhoneAsync(int phoneId);
    }
}
