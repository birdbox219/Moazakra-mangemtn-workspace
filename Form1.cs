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
    }
}
