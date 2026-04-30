using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        public static Form1 Instance { get; private set; }



        private FormsRouter _formRouter;

        public event EventHandler OnMemberButtonClikced;
        public event EventHandler OnWorkspacesButtonClicked;
        public event EventHandler OnReservationsButtonClicked;
        public event EventHandler OnEquipmentButtonClicked;
        public event EventHandler OnReportsButtonClicked;
        public Form1()
        {
            InitializeComponent();
            Instance = this;


            _formRouter = new FormsRouter(this);
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }
        public void LoadForm(Form f)
        {
            pnlMain.Controls.Clear();
            f.TopLevel = false;
            f.FormBorderStyle = FormBorderStyle.None;
            f.Dock = DockStyle.Fill;
            pnlMain.Controls.Add(f);
            f.Show();
        }

        private void btnMembers_Click(object sender, EventArgs e)
        {
            OnMemberButtonClikced?.Invoke(this, EventArgs.Empty);
        }
        

        private void btnWorkspaces_Click_1(object sender, EventArgs e)
        {
            OnWorkspacesButtonClicked?.Invoke(this, EventArgs.Empty);
        }

        private void btnReservations_Click(object sender, EventArgs e)
        {

            OnReservationsButtonClicked?.Invoke(this, EventArgs.Empty);
        }

        private void pnlMain_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnEquipment_Click(object sender, EventArgs e)
        {
            OnEquipmentButtonClicked?.Invoke(this, EventArgs.Empty);
        }

        private void btnReports_Click(object sender, EventArgs e)
        {
            OnReportsButtonClicked?.Invoke(this, EventArgs.Empty);  
        }
    }
}
