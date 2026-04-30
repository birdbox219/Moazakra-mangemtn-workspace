namespace WindowsFormsApp1
{
    partial class FormReports
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

        private System.Windows.Forms.Label lblTitle;

        private System.Windows.Forms.Button btnPopularWorkspace;
        private System.Windows.Forms.Button btnNoReservations;
        private System.Windows.Forms.Button btnEquipmentUsage;

        private System.Windows.Forms.DataGridView dgvReports;


        private void InitializeComponent()
        {
            this.lblTitle = new System.Windows.Forms.Label();
            this.btnPopularWorkspace = new System.Windows.Forms.Button();
            this.btnNoReservations = new System.Windows.Forms.Button();
            this.btnEquipmentUsage = new System.Windows.Forms.Button();
            this.dgvReports = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvReports)).BeginInit();
            this.SuspendLayout();
            // 
            // lblTitle
            // 
            this.lblTitle.AutoSize = true;
            this.lblTitle.Font = new System.Drawing.Font("Segoe UI", 16F, System.Drawing.FontStyle.Bold);
            this.lblTitle.Location = new System.Drawing.Point(30, 20);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Size = new System.Drawing.Size(200, 30);
            this.lblTitle.TabIndex = 0;
            this.lblTitle.Text = "Reports & Analytics";
            // 
            // btnPopularWorkspace
            // 
            this.btnPopularWorkspace.Location = new System.Drawing.Point(30, 80);
            this.btnPopularWorkspace.Name = "btnPopularWorkspace";
            this.btnPopularWorkspace.Size = new System.Drawing.Size(220, 40);
            this.btnPopularWorkspace.TabIndex = 1;
            this.btnPopularWorkspace.Text = "Most Popular Workspace";
            // 
            // btnNoReservations
            // 
            this.btnNoReservations.Location = new System.Drawing.Point(270, 80);
            this.btnNoReservations.Name = "btnNoReservations";
            this.btnNoReservations.Size = new System.Drawing.Size(260, 40);
            this.btnNoReservations.TabIndex = 2;
            this.btnNoReservations.Text = "Members With No Reservations";
            // 
            // btnEquipmentUsage
            // 
            this.btnEquipmentUsage.Location = new System.Drawing.Point(550, 80);
            this.btnEquipmentUsage.Name = "btnEquipmentUsage";
            this.btnEquipmentUsage.Size = new System.Drawing.Size(200, 40);
            this.btnEquipmentUsage.TabIndex = 3;
            this.btnEquipmentUsage.Text = "Equipment Usage";
            // 
            // dgvReports
            // 
            this.dgvReports.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvReports.Location = new System.Drawing.Point(30, 140);
            this.dgvReports.Name = "dgvReports";
            this.dgvReports.Size = new System.Drawing.Size(1200, 700);
            this.dgvReports.TabIndex = 4;
            // 
            // FormReports
            // 
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1533, 967);
            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.btnPopularWorkspace);
            this.Controls.Add(this.btnNoReservations);
            this.Controls.Add(this.btnEquipmentUsage);
            this.Controls.Add(this.dgvReports);
            this.Name = "FormReports";
            this.Text = "Reports";
            this.Load += new System.EventHandler(this.FormReports_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvReports)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
    }
}