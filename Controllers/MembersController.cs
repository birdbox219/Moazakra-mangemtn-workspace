using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFormsApp1.Data;
using WindowsFormsApp1.Interface;

namespace WindowsFormsApp1.Controllers
{
    internal class MembersController : IDataController
    {
        private DB _db = new DB();

        public DataTable Data { get; private set; }
        public MembersController()
        {
            // Constructor logic if needed
        }

        public event EventHandler OnDataRefreshed;


        public void RefreshData()
        {
            Data= _db.GetMembers();
            OnDataRefreshed?.Invoke(this, EventArgs.Empty);
        }

        public void Add(BaseData data)
        {
            if(data is MemberData member )
            {
                _db.AddMember(member.Name, member.Email, member.Company);
            }

            RefreshData();
        }

        public void Delte(int id)
        {

            
            _db.DeleteMember(id);
            RefreshData();

        }


    }
}
