namespace WindowsFormsApp1
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        /// 
        private System.Windows.Forms.Panel pnlSidebar;
        private System.Windows.Forms.Panel pnlMain;
        private System.Windows.Forms.FlowLayoutPanel menu;
        private System.Windows.Forms.Button btnMembers;
        private System.Windows.Forms.Button btnWorkspaces;
        private System.Windows.Forms.Button btnReservations;
        private System.Windows.Forms.Button btnEquipment;
        private System.Windows.Forms.Button btnReports;
        private void InitializeComponent()
        {
            this.pnlSidebar = new System.Windows.Forms.Panel();
            this.menu = new System.Windows.Forms.FlowLayoutPanel();
            this.btnMembers = new System.Windows.Forms.Button();
            this.btnWorkspaces = new System.Windows.Forms.Button();
            this.btnReservations = new System.Windows.Forms.Button();
            this.btnEquipment = new System.Windows.Forms.Button();
            this.btnReports = new System.Windows.Forms.Button();
            this.pnlMain = new System.Windows.Forms.Panel();
            this.pnlSidebar.SuspendLayout();
            this.menu.SuspendLayout();
            this.SuspendLayout();
            // 
            // pnlSidebar
            // 
            this.pnlSidebar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(44)))), ((int)(((byte)(62)))), ((int)(((byte)(80)))));
            this.pnlSidebar.Controls.Add(this.menu);
            this.pnlSidebar.Dock = System.Windows.Forms.DockStyle.Left;
            this.pnlSidebar.Location = new System.Drawing.Point(0, 0);
            this.pnlSidebar.Name = "pnlSidebar";
            this.pnlSidebar.Size = new System.Drawing.Size(220, 1080);
            this.pnlSidebar.TabIndex = 1;
            // 
            // menu
            // 
            this.menu.Controls.Add(this.btnMembers);
            this.menu.Controls.Add(this.btnWorkspaces);
            this.menu.Controls.Add(this.btnReservations);
            this.menu.Controls.Add(this.btnEquipment);
            this.menu.Controls.Add(this.btnReports);
            this.menu.Dock = System.Windows.Forms.DockStyle.Fill;
            this.menu.FlowDirection = System.Windows.Forms.FlowDirection.TopDown;
            this.menu.Location = new System.Drawing.Point(0, 0);
            this.menu.Name = "menu";
            this.menu.Padding = new System.Windows.Forms.Padding(0, 30, 0, 0);
            this.menu.Size = new System.Drawing.Size(220, 1080);
            this.menu.TabIndex = 0;
            this.menu.WrapContents = false;
            // 
            // btnMembers
            // 
            this.btnMembers.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(44)))), ((int)(((byte)(62)))), ((int)(((byte)(80)))));
            this.btnMembers.FlatAppearance.BorderSize = 0;
            this.btnMembers.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnMembers.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.btnMembers.ForeColor = System.Drawing.Color.White;
            this.btnMembers.Location = new System.Drawing.Point(10, 35);
            this.btnMembers.Margin = new System.Windows.Forms.Padding(10, 5, 10, 5);
            this.btnMembers.Name = "btnMembers";
            this.btnMembers.Size = new System.Drawing.Size(200, 50);
            this.btnMembers.TabIndex = 0;
            this.btnMembers.Text = "Members";
            this.btnMembers.UseVisualStyleBackColor = false;
            this.btnMembers.Click += new System.EventHandler(this.btnMembers_Click);
            // 
            // btnWorkspaces
            // 
            this.btnWorkspaces.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(44)))), ((int)(((byte)(62)))), ((int)(((byte)(80)))));
            this.btnWorkspaces.FlatAppearance.BorderSize = 0;
            this.btnWorkspaces.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnWorkspaces.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.btnWorkspaces.ForeColor = System.Drawing.Color.White;
            this.btnWorkspaces.Location = new System.Drawing.Point(10, 95);
            this.btnWorkspaces.Margin = new System.Windows.Forms.Padding(10, 5, 10, 5);
            this.btnWorkspaces.Name = "btnWorkspaces";
            this.btnWorkspaces.Size = new System.Drawing.Size(200, 50);
            this.btnWorkspaces.TabIndex = 1;
            this.btnWorkspaces.Text = "Workspaces";
            this.btnWorkspaces.UseVisualStyleBackColor = false;
            // 
            // btnReservations
            // 
            this.btnReservations.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(44)))), ((int)(((byte)(62)))), ((int)(((byte)(80)))));
            this.btnReservations.FlatAppearance.BorderSize = 0;
            this.btnReservations.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnReservations.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.btnReservations.ForeColor = System.Drawing.Color.White;
            this.btnReservations.Location = new System.Drawing.Point(10, 155);
            this.btnReservations.Margin = new System.Windows.Forms.Padding(10, 5, 10, 5);
            this.btnReservations.Name = "btnReservations";
            this.btnReservations.Size = new System.Drawing.Size(200, 50);
            this.btnReservations.TabIndex = 2;
            this.btnReservations.Text = "Reservations";
            this.btnReservations.UseVisualStyleBackColor = false;
            // 
            // btnEquipment
            // 
            this.btnEquipment.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(44)))), ((int)(((byte)(62)))), ((int)(((byte)(80)))));
            this.btnEquipment.FlatAppearance.BorderSize = 0;
            this.btnEquipment.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEquipment.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.btnEquipment.ForeColor = System.Drawing.Color.White;
            this.btnEquipment.Location = new System.Drawing.Point(10, 215);
            this.btnEquipment.Margin = new System.Windows.Forms.Padding(10, 5, 10, 5);
            this.btnEquipment.Name = "btnEquipment";
            this.btnEquipment.Size = new System.Drawing.Size(200, 50);
            this.btnEquipment.TabIndex = 3;
            this.btnEquipment.Text = "Equipment";
            this.btnEquipment.UseVisualStyleBackColor = false;
            // 
            // btnReports
            // 
            this.btnReports.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(44)))), ((int)(((byte)(62)))), ((int)(((byte)(80)))));
            this.btnReports.FlatAppearance.BorderSize = 0;
            this.btnReports.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnReports.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.btnReports.ForeColor = System.Drawing.Color.White;
            this.btnReports.Location = new System.Drawing.Point(10, 275);
            this.btnReports.Margin = new System.Windows.Forms.Padding(10, 5, 10, 5);
            this.btnReports.Name = "btnReports";
            this.btnReports.Size = new System.Drawing.Size(200, 50);
            this.btnReports.TabIndex = 4;
            this.btnReports.Text = "Reports";
            this.btnReports.UseVisualStyleBackColor = false;
            // 
            // pnlMain
            // 
            this.pnlMain.BackColor = System.Drawing.Color.White;
            this.pnlMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlMain.Location = new System.Drawing.Point(220, 0);
            this.pnlMain.Name = "pnlMain";
            this.pnlMain.Size = new System.Drawing.Size(1700, 1080);
            this.pnlMain.TabIndex = 0;
            // 
            // Form1
            // 
            this.ClientSize = new System.Drawing.Size(1920, 1080);
            this.Controls.Add(this.pnlMain);
            this.Controls.Add(this.pnlSidebar);
            this.Name = "Form1";
            this.Text = "Workspace Hub";
            this.pnlSidebar.ResumeLayout(false);
            this.menu.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
    }
}