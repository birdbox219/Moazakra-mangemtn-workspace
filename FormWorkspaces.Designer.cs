namespace WindowsFormsApp1
{
    partial class FormWorkspaces
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
        private System.Windows.Forms.Label lblType;
        private System.Windows.Forms.Label lblPrice;
        private System.Windows.Forms.Label lblCapacity;
        private System.Windows.Forms.Label lblHub;

        private System.Windows.Forms.TextBox txtType;
        private System.Windows.Forms.TextBox txtPrice;
        private System.Windows.Forms.TextBox txtCapacity;

        private System.Windows.Forms.ComboBox cmbHub;

        private System.Windows.Forms.Button btnAdd;
        private System.Windows.Forms.Button btnDelete;

        private System.Windows.Forms.DataGridView dgvWorkspaces;
        private void InitializeComponent()
        {
            this.lblTitle = new System.Windows.Forms.Label();
            this.lblType = new System.Windows.Forms.Label();
            this.lblPrice = new System.Windows.Forms.Label();
            this.lblCapacity = new System.Windows.Forms.Label();
            this.lblHub = new System.Windows.Forms.Label();
            this.txtType = new System.Windows.Forms.TextBox();
            this.txtPrice = new System.Windows.Forms.TextBox();
            this.txtCapacity = new System.Windows.Forms.TextBox();
            this.cmbHub = new System.Windows.Forms.ComboBox();
            this.btnAdd = new System.Windows.Forms.Button();
            this.btnDelete = new System.Windows.Forms.Button();
            this.dgvWorkspaces = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.dgvWorkspaces)).BeginInit();
            this.SuspendLayout();
            // 
            // lblType
            // 
            this.lblType.BackColor = System.Drawing.Color.Transparent;
            this.lblType.ForeColor = System.Drawing.Color.White;
            this.lblType.Location = new System.Drawing.Point(30, 78);
            this.lblType.Name = "lblType";
            this.lblType.Size = new System.Drawing.Size(100, 23);
            this.lblType.TabIndex = 1;
            this.lblType.Text = "Type:";
            // 
            // lblPrice
            // 
            this.lblPrice.BackColor = System.Drawing.Color.Transparent;
            this.lblPrice.ForeColor = System.Drawing.Color.White;
            this.lblPrice.Location = new System.Drawing.Point(30, 118);
            this.lblPrice.Name = "lblPrice";
            this.lblPrice.Size = new System.Drawing.Size(100, 23);
            this.lblPrice.TabIndex = 2;
            this.lblPrice.Text = "Price:";
            // 
            // lblCapacity
            // 
            this.lblCapacity.BackColor = System.Drawing.Color.Transparent;
            this.lblCapacity.ForeColor = System.Drawing.Color.White;
            this.lblCapacity.Location = new System.Drawing.Point(30, 158);
            this.lblCapacity.Name = "lblCapacity";
            this.lblCapacity.Size = new System.Drawing.Size(100, 23);
            this.lblCapacity.TabIndex = 3;
            this.lblCapacity.Text = "Capacity:";
            // 
            // lblHub
            // 
            this.lblHub.BackColor = System.Drawing.Color.Transparent;
            this.lblHub.ForeColor = System.Drawing.Color.White;
            this.lblHub.Location = new System.Drawing.Point(30, 198);
            this.lblHub.Name = "lblHub";
            this.lblHub.Size = new System.Drawing.Size(100, 23);
            this.lblHub.TabIndex = 4;
            this.lblHub.Text = "Hub:";
            // 
            // lblTitle
            // 
            this.lblTitle.AutoSize = true;
            this.lblTitle.BackColor = System.Drawing.Color.Transparent;
            this.lblTitle.ForeColor = System.Drawing.Color.White;
            this.lblTitle.Font = new System.Drawing.Font("Segoe UI", 16F, System.Drawing.FontStyle.Bold);
            this.lblTitle.Location = new System.Drawing.Point(30, 20);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Size = new System.Drawing.Size(271, 30);
            this.lblTitle.TabIndex = 0;
            this.lblTitle.Text = "Workspace Management";
            // 
            // txtType
            // 
            this.txtType.Location = new System.Drawing.Point(140, 75);
            this.txtType.Name = "txtType";
            this.txtType.Size = new System.Drawing.Size(250, 20);
            this.txtType.TabIndex = 5;
            this.txtType.TextChanged += new System.EventHandler(this.txtType_TextChanged);
            // 
            // txtPrice
            // 
            this.txtPrice.Location = new System.Drawing.Point(140, 115);
            this.txtPrice.Name = "txtPrice";
            this.txtPrice.Size = new System.Drawing.Size(250, 20);
            this.txtPrice.TabIndex = 6;
            this.txtPrice.TextChanged += new System.EventHandler(this.txtPrice_TextChanged);
            // 
            // txtCapacity
            // 
            this.txtCapacity.Location = new System.Drawing.Point(140, 155);
            this.txtCapacity.Name = "txtCapacity";
            this.txtCapacity.Size = new System.Drawing.Size(250, 20);
            this.txtCapacity.TabIndex = 7;
            this.txtCapacity.TextChanged += new System.EventHandler(this.txtCapacity_TextChanged);
            // 
            // cmbHub
            // 
            this.cmbHub.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cmbHub.Location = new System.Drawing.Point(140, 195);
            this.cmbHub.Name = "cmbHub";
            this.cmbHub.Size = new System.Drawing.Size(250, 21);
            this.cmbHub.TabIndex = 8;
            this.cmbHub.SelectedIndexChanged += new System.EventHandler(this.cmbHub_SelectedIndexChanged);
            // 
            // btnAdd
            // 
            this.btnAdd.Location = new System.Drawing.Point(140, 240);
            this.btnAdd.Name = "btnAdd";
            this.btnAdd.Size = new System.Drawing.Size(100, 35);
            this.btnAdd.TabIndex = 9;
            this.btnAdd.Text = "Add";
            this.btnAdd.Click += new System.EventHandler(this.btnAdd_Click);
            // 
            // btnDelete
            // 
            this.btnDelete.Location = new System.Drawing.Point(240, 240);
            this.btnDelete.Name = "btnDelete";
            this.btnDelete.Size = new System.Drawing.Size(100, 35);
            this.btnDelete.TabIndex = 10;
            this.btnDelete.Text = "Delete";
            this.btnDelete.Click += new System.EventHandler(this.btnDelete_Click);
            // 
            // dgvWorkspaces
            // 
            this.dgvWorkspaces.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvWorkspaces.Location = new System.Drawing.Point(30, 300);
            this.dgvWorkspaces.Name = "dgvWorkspaces";
            this.dgvWorkspaces.Size = new System.Drawing.Size(1200, 600);
            this.dgvWorkspaces.TabIndex = 11;
            this.dgvWorkspaces.BackgroundColor = System.Drawing.Color.FromArgb(25, 25, 25);
            this.dgvWorkspaces.BorderStyle = System.Windows.Forms.BorderStyle.None;
            // 
            // FormWorkspaces
            // 
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(30)))), ((int)(((byte)(30)))), ((int)(((byte)(30)))));
            this.ClientSize = new System.Drawing.Size(1355, 950);
            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.lblType);
            this.Controls.Add(this.lblPrice);
            this.Controls.Add(this.lblCapacity);
            this.Controls.Add(this.lblHub);
            this.Controls.Add(this.txtType);
            this.Controls.Add(this.txtPrice);
            this.Controls.Add(this.txtCapacity);
            this.Controls.Add(this.cmbHub);
            this.Controls.Add(this.btnAdd);
            this.Controls.Add(this.btnDelete);
            this.Controls.Add(this.dgvWorkspaces);
            this.Name = "FormWorkspaces";
            this.Text = "Workspaces";
            this.Load += new System.EventHandler(this.FormWorkspaces_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvWorkspaces)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
    }
}