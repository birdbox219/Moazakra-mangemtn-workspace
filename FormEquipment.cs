using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using WindowsFormsApp1.Data;
using WindowsFormsApp1.Interface;

namespace WindowsFormsApp1
{
    public partial class FormEquipment : Form
    {
        private readonly IDataController _controller;

        public FormEquipment(IDataController controller)
        {
            InitializeComponent();

            _controller = controller;
            _controller.OnDataRefreshed += _controller_OnDataRefreshed;
        }

        private void _controller_OnDataRefreshed(object sender, EventArgs e)
        {
            dgvEquipment.DataSource = _controller.Data;
        }

        private void FormEquipment_Load(object sender, EventArgs e)
        {

            _controller.RefreshData();
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtName.Text) ||
        string.IsNullOrWhiteSpace(txtType.Text))
            {
                MessageBox.Show("Enter all fields!");
                return;
            }

            var eq = new EquipmentData
            {
                Name = txtName.Text,
                EquipmentType = txtType.Text
            };

            _controller.Add(eq);

            txtName.Clear();
            txtType.Clear();
        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            if (dgvEquipment.CurrentRow != null)
            {
                int id = Convert.ToInt32(dgvEquipment.CurrentRow.Cells[0].Value);
                _controller.Delte(id);
            }
        }
    }
}
