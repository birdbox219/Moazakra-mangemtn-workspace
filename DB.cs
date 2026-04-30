using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
