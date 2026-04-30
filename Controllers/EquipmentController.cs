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
    internal class EquipmentController : IDataController
    {
        private DB _db = new DB();

        public DataTable Data { get; private set; }

        public event EventHandler OnDataRefreshed;

        
        public void RefreshData()
        {
            Data = _db.GetEquipment();
            OnDataRefreshed?.Invoke(this, EventArgs.Empty);
        }

        
        public void Add(BaseData data)
        {
            if (data is EquipmentData eq)
            {
                _db.AddEquipment(eq.Name, eq.EquipmentType);
            }

            RefreshData();
        }

        
        public void Delte(int id)
        {
            _db.DeleteEquipment(id);
            RefreshData();
        }
    }
}
