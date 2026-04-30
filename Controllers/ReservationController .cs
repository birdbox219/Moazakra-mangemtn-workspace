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
    internal class ReservationController : IDataController
    {

        private DB _db = new DB();
        public DataTable Data { get; private set; }

        public event EventHandler OnDataRefreshed;


        public DataTable GetMemberList() => _db.GetMembers();
        public DataTable GetWorkspaceList() => _db.GetWorkspaces();

        public void RefreshData()
        {
            Data = _db.GetReservations();
            OnDataRefreshed?.Invoke(this, EventArgs.Empty);
        }

        public void Add(BaseData data)
        {
            if (data is ReservationData r)
            {
                _db.AddReservation(r.memberID, r.workspaceID, r.startDate, r.endDate, r.status);
            }

            RefreshData();
        }

        public void Delte(int id)
        {
            _db.DeleteReservation(id);
            RefreshData();
        }
    }
}
