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
using WindowsFormsApp1.Interface;
using WindowsFormsApp1.Data;

namespace WindowsFormsApp1
{
    public partial class MemberForm : Form
    {
        private readonly IDataController _controller;
        

        public MemberForm(IDataController controller)
        {
            InitializeComponent();
            _controller = controller;

            _controller.OnDataRefreshed += _contrller_OnDataRefreshed;
        }

        private void _contrller_OnDataRefreshed(object sender, EventArgs e)
        {
            dgvMembers.DataSource = _controller.Data;
        }

        private void MemberForm_Load(object sender, EventArgs e)
        {
            _controller.RefreshData();

        }

        private void dgvMembers_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
           var newMember = new MemberData
            {
                Name = txtName.Text,
                Email = txtEmail.Text,
                Company = txtCompany.Text
            };
            _controller.Add(newMember);

            txtName.Clear();
            txtEmail.Clear();   
            txtCompany.Clear();
        }

        private void txtName_TextChanged(object sender, EventArgs e)
        {

        }

        private void txtEmail_TextChanged(object sender, EventArgs e)
        {

        }

        private void txtCompany_TextChanged(object sender, EventArgs e)
        {

        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            if (dgvMembers.CurrentRow != null)
            {
                int id = Convert.ToInt32(dgvMembers.CurrentRow.Cells[0].Value);
                _controller.Delte(id);
            }
                
                

        }
    }
}
