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
    internal class WorkSpacesController : IDataController
    {
        private DB _db = new DB();

        public DataTable Data { get; private set; }
        public WorkSpacesController()
        {
            // Constructor logic if needed
        }

        public event EventHandler OnDataRefreshed;


        public void RefreshData()
        {
            Data = _db.GetWorkspaces();
            //Data = _db.GetHubs();
            OnDataRefreshed?.Invoke(this, EventArgs.Empty);
        }

        public void Add(BaseData data)
        {
            if (data is WorkSpaceData workspace)
            {
                _db.AddWorkspace(workspace.type, workspace.price, workspace.capacity , workspace.hubID);
            }

            RefreshData();
        }

        public void Delte(int id)
        {


            _db.DeleteWorkspace(id);
            RefreshData();

        }


    }

}

