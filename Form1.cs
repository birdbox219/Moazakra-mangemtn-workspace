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

        // Navigation Events
        public event EventHandler OnMemberButtonClikced;
        public event EventHandler OnWorkspacesButtonClicked;
        public event EventHandler OnReservationsButtonClicked;
        public event EventHandler OnEquipmentButtonClicked;
        public event EventHandler OnReportsButtonClicked;

        private bool _backgroundEnabled = true;
        private Image _cachedBgImage = null;

        public Form1()
        {
            InitializeComponent();
            Instance = this;
            
            // Enable double-buffering to prevent flicker
            var prop = typeof(Control).GetProperty("DoubleBuffered", 
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            prop?.SetValue(pnlMain, true, null);

            LoadBgAsset();

            // Show background on pnlMain for the initial load screen
            pnlMain.BackColor = Color.FromArgb(30, 30, 30);
            if (_cachedBgImage != null)
            {
                pnlMain.BackgroundImage = _cachedBgImage;
                pnlMain.BackgroundImageLayout = ImageLayout.Stretch;
            }

            _formRouter = new FormsRouter(this);
        }

        private void LoadBgAsset()
        {
            try
            {
                string[] possiblePaths = {
                    System.IO.Path.Combine(Application.StartupPath, "Assets", "ameen.png"),
                    System.IO.Path.Combine(Application.StartupPath, "..", "..", "Assets", "ameen.png"),
                    System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Assets", "ameen.png")
                };

                foreach (var path in possiblePaths)
                {
                    if (System.IO.File.Exists(path))
                    {
                        _cachedBgImage = Image.FromFile(path);
                        break;
                    }
                }
            }
            catch { }
        }

        public void LoadForm(Form f)
        {
            // Remove toggle button from its current parent before clearing
            if (btnToggleBackground.Parent != null)
            {
                btnToggleBackground.Parent.Controls.Remove(btnToggleBackground);
            }


            // Clear pnlMain's background so it doesn't double-render with the child form's
            pnlMain.BackgroundImage = null;
            pnlMain.Controls.Clear();
            
            f.TopLevel = false;
            f.FormBorderStyle = FormBorderStyle.None;
            f.Dock = DockStyle.Fill;

            // Enable double buffering on child form
            var dbProp = typeof(Control).GetProperty("DoubleBuffered",
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            dbProp?.SetValue(f, true, null);

            // Apply background image to the child form (NOT pnlMain — avoids double-rendering)
            ApplyBackgroundToForm(f);

            pnlMain.Controls.Add(f);
            pnlMain.PerformLayout(); // Force layout so Dock=Fill resizes the form
            
            // Add the toggle button to the child form so it renders on top
            f.Controls.Add(btnToggleBackground);
            // Position at top-RIGHT (Anchor = Top|Right keeps it there on resize)
            btnToggleBackground.Location = new Point(f.ClientSize.Width - btnToggleBackground.Width - 10, 10);
            btnToggleBackground.BringToFront();
            
            f.Show();
        }

        /// <summary>
        /// Applies or removes the background image on a child form.
        /// </summary>
        private void ApplyBackgroundToForm(Form f)
        {
            if (_backgroundEnabled && _cachedBgImage != null)
            {
                f.BackgroundImage = _cachedBgImage;
                f.BackgroundImageLayout = ImageLayout.Stretch;
            }
            else
            {
                f.BackgroundImage = null;
            }
            f.BackColor = Color.FromArgb(30, 30, 30);
        }

        private void btnToggleBackground_Click(object sender, EventArgs e)
        {
            _backgroundEnabled = !_backgroundEnabled;

            // Update only the child form(s) inside pnlMain
            foreach (Control c in pnlMain.Controls)
            {
                if (c is Form f)
                {
                    ApplyBackgroundToForm(f);
                }
            }
        }

        private void btnMembers_Click(object sender, EventArgs e) => OnMemberButtonClikced?.Invoke(this, EventArgs.Empty);
        private void btnWorkspaces_Click_1(object sender, EventArgs e) => OnWorkspacesButtonClicked?.Invoke(this, EventArgs.Empty);
        private void btnReservations_Click(object sender, EventArgs e) => OnReservationsButtonClicked?.Invoke(this, EventArgs.Empty);
        private void btnEquipment_Click(object sender, EventArgs e) => OnEquipmentButtonClicked?.Invoke(this, EventArgs.Empty);
        private void btnReports_Click(object sender, EventArgs e) => OnReportsButtonClicked?.Invoke(this, EventArgs.Empty);
        private void pnlMain_Paint(object sender, PaintEventArgs e) { }
        private void Form1_Load(object sender, EventArgs e) { }
    }
}
