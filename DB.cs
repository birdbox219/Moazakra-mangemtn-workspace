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



        public DataTable GetReservations()
        {
            SqlDataAdapter da = new SqlDataAdapter(@"
        SELECT R.ReservationID, M.Name AS Member, W.Type AS Workspace,
               R.StartDate, R.EndDate, R.Status
        FROM Reservation R
        JOIN Member M ON R.MemberID = M.MemberID
        JOIN Workspace W ON R.WorkspaceID = W.WorkspaceID", con);

            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }



        public void AddReservation(int memberID, int workspaceID, DateTime start, DateTime end, string status)
        {
            try
            {
                SqlCommand cmd = new SqlCommand(@"
            INSERT INTO Reservation (MemberID, WorkspaceID, StartDate, EndDate, Status)
            VALUES (@m, @w, @s, @e, @st)", con);

                cmd.Parameters.AddWithValue("@m", memberID);
                cmd.Parameters.AddWithValue("@w", workspaceID);
                cmd.Parameters.AddWithValue("@s", start);
                cmd.Parameters.AddWithValue("@e", end);
                cmd.Parameters.AddWithValue("@st", status);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error adding reservation: " + ex.Message);
            }
        }


        public void DeleteReservation(int id)
        {
            SqlCommand cmd = new SqlCommand(
                "DELETE FROM Reservation WHERE ReservationID = @id", con);

            cmd.Parameters.AddWithValue("@id", id);

            con.Open();
            cmd.ExecuteNonQuery();
            con.Close();
        }

        public DataTable GetEquipment()
        {
            SqlDataAdapter da = new SqlDataAdapter("SELECT * FROM Equipment", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            return dt;
        }


        public void AddEquipment(string name, string type)
        {
            try
            {
                SqlCommand cmd = new SqlCommand(
                    "INSERT INTO Equipment (Name, Type) VALUES (@n, @t)", con);

                cmd.Parameters.AddWithValue("@n", name);
                cmd.Parameters.AddWithValue("@t", type);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error adding equipment: " + ex.Message);
            }
        }


        public void DeleteEquipment(int id)
        {
            try
            {
                SqlCommand cmd = new SqlCommand(
                    "DELETE FROM Equipment WHERE EquipmentID = @id", con);

                cmd.Parameters.AddWithValue("@id", id);

                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error deleting equipment: " + ex.Message);
            }
        }









    }
}
