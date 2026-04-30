using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;

namespace WindowsFormsApp1
{
    internal class FormsRouter
    {
        Form1 mainForm;
        public FormsRouter(Form1 form)
        {
           mainForm = form;
           mainForm.OnMemberButtonClikced += Form_OnMemberButtonClikced;
            
        }

        private void Form_OnMemberButtonClikced(object sender, EventArgs e)
        {
            mainForm.LoadForm(GetForm(FormNames.Members));
            Console.WriteLine("Member button clicked");
        }

        public enum FormNames
        {
            Members,
            Workspaces,
            Reservations,
            Equipment,
            Reports
        }

        private Dictionary<FormNames, Type> routes = new Dictionary<FormNames, Type>()
        {   { FormNames.Members, typeof(MemberForm) },
            //{ FormNames.Workspaces, typeof(FormWorkspaces) },
            //{ FormNames.Reservations, typeof(FormReservations) },
            //{ FormNames.Equipment, typeof(FormEquipment) },
            //{ FormNames.Reports, typeof(FormReports) }
        };


        private Form GetForm(FormNames formName)
        {
            if (routes.ContainsKey(formName))
            {
                return (Form)Activator.CreateInstance(routes[formName]);
            }

            return null;
        }









    }
}
