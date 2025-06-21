using MySql.Data.MySqlClient;
using System.Data;
public class BudgetService : IBudgetService
{
    private readonly DatabaseHelper _dbHelper;

    public BudgetService(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    public decimal GetMonthlyBudget(int userId, int categoryId)
    {
        MySqlParameter[] parameters = new MySqlParameter[]
        {
            new MySqlParameter("@p_UserId", userId),
            new MySqlParameter("@p_CategoryId", categoryId)
        };

        DataTable dataTable = _dbHelper.ExecuteStoredProcedure("sp_GetMonthlyBudget", parameters);

        if (dataTable.Rows.Count > 0)
        {
            return Convert.ToDecimal(dataTable.Rows[0]["MonthlyBudget"]);
        }

        return 0;
    }

    public void UpdateBudget(Budget budget)
    {
        MySqlParameter[] parameters = new MySqlParameter[]
        {
            new MySqlParameter("@p_UserId", budget.UserId),
            new MySqlParameter("@p_CategoryId", budget.CategoryId),
            new MySqlParameter("@p_NewBudget", budget.MonthlyBudget)
        };

        _dbHelper.ExecuteNonQuery("sp_UpdateBudget", parameters);
    }
}