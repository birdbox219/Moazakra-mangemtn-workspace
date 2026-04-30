using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WindowsFormsApp1.Interface;
using WindowsFormsApp1.Data;

namespace WindowsFormsApp1
{
    public partial class FormWorkspaces : Form
    {
        private readonly IDataController _controller;
        public FormWorkspaces(IDataController controller)
        {
            InitializeComponent();

            _controller = controller;

            _controller.OnDataRefreshed += _controller_OnDataRefreshed;



        }

        private void _controller_OnDataRefreshed(object sender, EventArgs e)
        {
            dgvWorkspaces.DataSource = _controller.Data;
        }

        private void FormWorkspaces_Load(object sender, EventArgs e)
        {
            _controller.RefreshData();

            cmbHub.DataSource = new DB().GetHubs();
            cmbHub.DisplayMember = "Name";
            cmbHub.ValueMember = "HubID";
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            if (cmbHub.SelectedValue == null)
            {
                MessageBox.Show("Please select a Hub!");
                return;
            }

            var newWorkspace = new WorkSpaceData
            {
                type = txtType.Text,
                price = decimal.TryParse(txtPrice.Text, out var price) ? price : 0,
                capacity = int.TryParse(txtCapacity.Text, out var capacity) ? capacity : 0,
                hubID = (int)cmbHub.SelectedValue

            };

            _controller.Add(newWorkspace);


            txtType.Clear();
            txtPrice.Clear();
            txtCapacity.Clear();
            cmbHub.SelectedIndex = -1;




        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            if (dgvWorkspaces.CurrentRow != null)
            {
                int id = Convert.ToInt32(dgvWorkspaces.CurrentRow.Cells[0].Value);

                _controller.Delte(id);
            }
        }

        private void txtType_TextChanged(object sender, EventArgs e)
        {

        }

        private void txtPrice_TextChanged(object sender, EventArgs e)
        {

        }

        private void txtCapacity_TextChanged(object sender, EventArgs e)
        {

        }

        private void cmbHub_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        
    }
}
