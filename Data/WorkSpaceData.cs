using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFormsApp1.Data
{
    public class WorkSpaceData : BaseData
    {

        public string type { get; set; }
        public decimal price { get; set; }

        public int capacity { get; set; }

        public int hubID { get; set; }
    }
}
