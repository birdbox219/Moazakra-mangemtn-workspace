using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WindowsFormsApp1.Controllers;
using WindowsFormsApp1.Data;
using WindowsFormsApp1.Interface;

namespace WindowsFormsApp1
{
    public partial class FormReservations : Form
    {
        private readonly IDataController _controller;
        public FormReservations(IDataController controller)
        {
            InitializeComponent();

            _controller = controller;

            _controller.OnDataRefreshed += _controller_OnDataRefreshed;
        }

        private void _controller_OnDataRefreshed(object sender, EventArgs e)
        {
            dgvReservations.DataSource = _controller.Data;
        }

        private void FormReservations_Load(object sender, EventArgs e)
        {
            if(_controller is ReservationController reservationController)
            {
                
                cmbMember.DataSource = reservationController.GetMemberList();
                cmbMember.DisplayMember = "Name";
                cmbMember.ValueMember = "MemberID";

                
                cmbWorkspace.DataSource = reservationController.GetWorkspaceList();
                cmbWorkspace.DisplayMember = "Type";
                cmbWorkspace.ValueMember = "WorkspaceID";
            }



            _controller.RefreshData();
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            if (cmbMember.SelectedValue == null || cmbWorkspace.SelectedValue == null)
            {
                MessageBox.Show("Select Member and Workspace!");
                return;
            }

            if (dtEnd.Value <= dtStart.Value)
            {
                MessageBox.Show("End date must be after start date!");
                return;
            }

            var reservation = new ReservationData
            {
                memberID = (int)cmbMember.SelectedValue,
                workspaceID = (int)cmbWorkspace.SelectedValue,
                startDate = dtStart.Value,
                endDate = dtEnd.Value,
                status = cmbStatus.Text
            };

            _controller.Add(reservation);
        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            if (dgvReservations.CurrentRow != null)
            {
                int id = Convert.ToInt32(dgvReservations.CurrentRow.Cells[0].Value);
                _controller.Delte(id);
            }
        }
    }
}
