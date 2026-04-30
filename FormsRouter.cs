using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;
using WindowsFormsApp1.Controllers;

namespace WindowsFormsApp1
{

    internal class FormsRouter
    {
        Form1 mainForm;

        private readonly MembersController _membersController = new MembersController();
        private readonly WorkSpacesController _workspacesController = new WorkSpacesController();
        private readonly ReservationController _reservationsController = new ReservationController();
        private readonly EquipmentController _equipmentController = new EquipmentController();
        public FormsRouter(Form1 form)
        {
           mainForm = form;
           mainForm.OnMemberButtonClikced += Form_OnMemberButtonClikced;
           mainForm.OnWorkspacesButtonClicked += MainForm_OnWorkspacesButtonClicked;
            mainForm.OnReservationsButtonClicked += MainForm_OnReservationButtonClicked;
            mainForm.OnEquipmentButtonClicked += MainForm_OnEquipmentButtonClicked;
            mainForm.OnReportsButtonClicked += MainForm_OnReportsButtonClicked;

        }

        private void MainForm_OnReportsButtonClicked(object sender, EventArgs e)
        {
            mainForm.LoadForm(GetForm(FormNames.Reports));
                Console.WriteLine("Reports button clicked");
        }

        private void MainForm_OnEquipmentButtonClicked(object sender, EventArgs e)
        {
            mainForm.LoadForm(GetForm(FormNames.Equipment));
                Console.WriteLine("Equipment button clicked");
        }

        private void MainForm_OnReservationButtonClicked(object sender, EventArgs e)
        {
            mainForm.LoadForm(GetForm(FormNames.Reservations));
                Console.WriteLine("Reservations button clicked");
        }

        private void MainForm_OnWorkspacesButtonClicked(object sender, EventArgs e)
        {
            mainForm.LoadForm(GetForm(FormNames.Workspaces));
            const string message = "Workspaces button clicked";
            Console.WriteLine(message);
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
            { FormNames.Workspaces, typeof(FormWorkspaces) },
            { FormNames.Reservations, typeof(FormReservations) },
            { FormNames.Equipment, typeof(FormEquipment) },
            { FormNames.Reports, typeof(FormReports) }
        };


        private Form GetForm(FormNames formName)
        {
            switch (formName)
            {
                case FormNames.Members:
                    return new MemberForm(_membersController);
                case FormNames.Workspaces:
                    return new FormWorkspaces(_workspacesController);
                case FormNames.Reservations:
                    return new FormReservations(_reservationsController);
                case FormNames.Equipment:
                    return new FormEquipment(_equipmentController);
                case FormNames.Reports:
                    return new FormReports();
                default:
                    throw new ArgumentException("Invalid form name");
            }

        }









    }
}
