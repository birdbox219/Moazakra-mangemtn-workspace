using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsFormsApp1.Data;

namespace WindowsFormsApp1.Interface
{
    public interface IDataController
    {

        DataTable Data { get; }
        event EventHandler OnDataRefreshed;
        void Add(BaseData data);
        void Delte(int id);
        void RefreshData();
    }
}
