using MySql.Data.MySqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;

public class DatabaseHelper
{
    private readonly IConfiguration _configuration;

    public DatabaseHelper(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private MySqlConnection GetConnection()
    {
        return new MySqlConnection(_configuration.GetConnectionString("BudgetDbConnection"));
    }

    public DataTable ExecuteStoredProcedure(string procedureName, MySqlParameter[] parameters)
    {
        DataTable dataTable = new DataTable();

        using (var connection = GetConnection())
        {
            var command = new MySqlCommand(procedureName, connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
                command.Parameters.AddRange(parameters);

            var adapter = new MySqlDataAdapter(command);
            adapter.Fill(dataTable);
        }

        return dataTable;
    }

    public int ExecuteNonQuery(string procedureName, MySqlParameter[] parameters)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            var command = new MySqlCommand(procedureName, connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
                command.Parameters.AddRange(parameters);

            return command.ExecuteNonQuery();
        }
    }

    public object ExecuteScalar(string procedureName, MySqlParameter[] parameters)
    {
        using (var connection = GetConnection())
        {
            connection.Open();
            var command = new MySqlCommand(procedureName, connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
            {
                command.Parameters.AddRange(parameters);
            }

            var result = command.ExecuteScalar();
            return result ?? throw new Exception("Database operation returned null");
        }
    }
}