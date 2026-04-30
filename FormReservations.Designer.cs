namespace WindowsFormsApp1
{
    partial class FormReservations
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
        private System.Windows.Forms.Label lblTitle;
        private System.Windows.Forms.Label lblMember;
        private System.Windows.Forms.Label lblWorkspace;
        private System.Windows.Forms.Label lblStart;
        private System.Windows.Forms.Label lblEnd;
        private System.Windows.Forms.Label lblStatus;

        private System.Windows.Forms.ComboBox cmbMember;
        private System.Windows.Forms.ComboBox cmbWorkspace;
        private System.Windows.Forms.ComboBox cmbStatus;

        private System.Windows.Forms.DateTimePicker dtStart;
        private System.Windows.Forms.DateTimePicker dtEnd;

        private System.Windows.Forms.Button btnAdd;
        private System.Windows.Forms.Button btnDelete;

        private System.Windows.Forms.DataGridView dgvReservations;
        private void InitializeComponent()
        {
            this.lblTitle = new System.Windows.Forms.Label();
            this.lblMember = new System.Windows.Forms.Label();
            this.lblWorkspace = new System.Windows.Forms.Label();
            this.lblStart = new System.Windows.Forms.Label();
            this.lblEnd = new System.Windows.Forms.Label();
            this.lblStatus = new System.Windows.Forms.Label();
            this.cmbMember = new System.Windows.Forms.ComboBox();
            this.cmbWorkspace = new System.Windows.Forms.ComboBox();
            this.cmbStatus = new System.Windows.Forms.ComboBox();
            this.dtStart = new System.Windows.Forms.DateTimePicker();
            this.dtEnd = new System.Windows.Forms.DateTimePicker();
            this.btnAdd = new System.Windows.Forms.Button();
            this.btnDelete = new System.Windows.Forms.Button();
            this.dgvReservations = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvReservations)).BeginInit();
            this.SuspendLayout();
            // 
            // lblTitle
            // 
            this.lblTitle.AutoSize = true;
            this.lblTitle.Font = new System.Drawing.Font("Segoe UI", 16F, System.Drawing.FontStyle.Bold);
            this.lblTitle.Location = new System.Drawing.Point(30, 20);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Size = new System.Drawing.Size(279, 30);
            this.lblTitle.TabIndex = 0;
            this.lblTitle.Text = "Reservation Management";
            // 
            // lblMember
            // 
            this.lblMember.Location = new System.Drawing.Point(30, 80);
            this.lblMember.Name = "lblMember";
            this.lblMember.Size = new System.Drawing.Size(100, 23);
            this.lblMember.TabIndex = 1;
            this.lblMember.Text = "Member:";
            // 
            // lblWorkspace
            // 
            this.lblWorkspace.Location = new System.Drawing.Point(30, 120);
            this.lblWorkspace.Name = "lblWorkspace";
            this.lblWorkspace.Size = new System.Drawing.Size(100, 23);
            this.lblWorkspace.TabIndex = 2;
            this.lblWorkspace.Text = "Workspace:";
            // 
            // lblStart
            // 
            this.lblStart.Location = new System.Drawing.Point(30, 160);
            this.lblStart.Name = "lblStart";
            this.lblStart.Size = new System.Drawing.Size(100, 23);
            this.lblStart.TabIndex = 3;
            this.lblStart.Text = "Start:";
            // 
            // lblEnd
            // 
            this.lblEnd.Location = new System.Drawing.Point(30, 200);
            this.lblEnd.Name = "lblEnd";
            this.lblEnd.Size = new System.Drawing.Size(100, 23);
            this.lblEnd.TabIndex = 4;
            this.lblEnd.Text = "End:";
            // 
            // lblStatus
            // 
            this.lblStatus.Location = new System.Drawing.Point(30, 240);
            this.lblStatus.Name = "lblStatus";
            this.lblStatus.Size = new System.Drawing.Size(100, 23);
            this.lblStatus.TabIndex = 5;
            this.lblStatus.Text = "Status:";
            // 
            // cmbMember
            // 
            this.cmbMember.Location = new System.Drawing.Point(130, 75);
            this.cmbMember.Name = "cmbMember";
            this.cmbMember.Size = new System.Drawing.Size(250, 21);
            this.cmbMember.TabIndex = 6;
            // 
            // cmbWorkspace
            // 
            this.cmbWorkspace.Location = new System.Drawing.Point(130, 115);
            this.cmbWorkspace.Name = "cmbWorkspace";
            this.cmbWorkspace.Size = new System.Drawing.Size(250, 21);
            this.cmbWorkspace.TabIndex = 7;
            // 
            // cmbStatus
            // 
            this.cmbStatus.Items.AddRange(new object[] {
            "Pending",
            "Confirmed",
            "Cancelled"});
            this.cmbStatus.Location = new System.Drawing.Point(130, 235);
            this.cmbStatus.Name = "cmbStatus";
            this.cmbStatus.Size = new System.Drawing.Size(250, 21);
            this.cmbStatus.TabIndex = 10;
            // 
            // dtStart
            // 
            this.dtStart.Location = new System.Drawing.Point(130, 155);
            this.dtStart.Name = "dtStart";
            this.dtStart.Size = new System.Drawing.Size(250, 20);
            this.dtStart.TabIndex = 8;
            // 
            // dtEnd
            // 
            this.dtEnd.Location = new System.Drawing.Point(130, 195);
            this.dtEnd.Name = "dtEnd";
            this.dtEnd.Size = new System.Drawing.Size(250, 20);
            this.dtEnd.TabIndex = 9;
            // 
            // btnAdd
            // 
            this.btnAdd.Location = new System.Drawing.Point(130, 280);
            this.btnAdd.Name = "btnAdd";
            this.btnAdd.Size = new System.Drawing.Size(100, 35);
            this.btnAdd.TabIndex = 11;
            this.btnAdd.Text = "Add";
            this.btnAdd.Click += new System.EventHandler(this.btnAdd_Click);
            // 
            // btnDelete
            // 
            this.btnDelete.Location = new System.Drawing.Point(250, 280);
            this.btnDelete.Name = "btnDelete";
            this.btnDelete.Size = new System.Drawing.Size(100, 35);
            this.btnDelete.TabIndex = 12;
            this.btnDelete.Text = "Delete";
            this.btnDelete.Click += new System.EventHandler(this.btnDelete_Click);
            // 
            // dgvReservations
            // 
            this.dgvReservations.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvReservations.Location = new System.Drawing.Point(30, 350);
            this.dgvReservations.Name = "dgvReservations";
            this.dgvReservations.Size = new System.Drawing.Size(1200, 550);
            this.dgvReservations.TabIndex = 13;
            // 
            // FormReservations
            // 
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1530, 972);
            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.lblMember);
            this.Controls.Add(this.lblWorkspace);
            this.Controls.Add(this.lblStart);
            this.Controls.Add(this.lblEnd);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.cmbMember);
            this.Controls.Add(this.cmbWorkspace);
            this.Controls.Add(this.dtStart);
            this.Controls.Add(this.dtEnd);
            this.Controls.Add(this.cmbStatus);
            this.Controls.Add(this.btnAdd);
            this.Controls.Add(this.btnDelete);
            this.Controls.Add(this.dgvReservations);
            this.Name = "FormReservations";
            this.Text = "Reservations";
            this.Load += new System.EventHandler(this.FormReservations_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvReservations)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
    }
}