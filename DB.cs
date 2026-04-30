using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    internal class DB
    {

        SqlConnection con = new SqlConnection("Server=.;Database=WorkspaceDB;Trusted_Connection=True;");

        public void TestConnection()
        {
            try
            {
                con.Open();
                Console.WriteLine("Connection successful!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Connection failed: " + ex.Message);
            }
            finally
            {
                con.Close();
            }
        }

        public DataTable GetMembers()
        {
            SqlDataAdapter sdp = new SqlDataAdapter("SELECT * FROM Member", con);

            DataTable dt = new DataTable();

            sdp.Fill(dt);

            return dt;
        }

        public void AddMember(string name , string email , string company)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("INSERT INTO Member (Name, Email , Company) VALUES (@n, @e, @C)", con);

                    cmd.Parameters.AddWithValue("@n", name);
                    cmd.Parameters.AddWithValue("@e", email);
                    cmd.Parameters.AddWithValue("@C", company);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();




            }

            catch (Exception ex)
            {
                MessageBox.Show("Error adding member: " + ex.Message);
            }
        }


        public void DeleteMember(int id)
        {
            try
            {
                SqlCommand cmd = new SqlCommand(
                    "DELETE FROM Member WHERE MemberID = @id", con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error deleting member: " + ex.Message);
            }
        }

        public DataTable GetWorkspaces()
        {
            SqlDataAdapter da = new SqlDataAdapter(@"
        SELECT WorkspaceID, Type, Price, Capacity, HubID
        FROM Workspace", con);

            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }

        public DataTable GetHubs()
        {
            SqlDataAdapter da = new SqlDataAdapter(
                "SELECT HubID, Name FROM Hub", con);

            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }

        public void AddWorkspace(string type, decimal price, int capacity, int hubID)
        {
            try
            {
                SqlCommand cmd = new SqlCommand(@"
            INSERT INTO Workspace (Type, Price, Capacity, HubID)
            VALUES (@t, @p, @c, @h)", con);

                cmd.Parameters.AddWithValue("@t", type);
                cmd.Parameters.AddWithValue("@p", price);
                cmd.Parameters.AddWithValue("@c", capacity);
                cmd.Parameters.AddWithValue("@h", hubID);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error adding workspace: " + ex.Message);
            }
        }



        public void DeleteWorkspace(int id)
        {
            try
            {
                SqlCommand cmd = new SqlCommand(
                    "DELETE FROM Workspace WHERE WorkspaceID = @id", con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error deleting workspace: " + ex.Message);
            }
        }






    }
}
