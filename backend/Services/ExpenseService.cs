using MySql.Data.MySqlClient;
using System.Data;

public class ExpenseService : IExpenseService
{
    private readonly DatabaseHelper _dbHelper;

    public ExpenseService(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    public int AddExpense(Expense expense)
    {
        try
        {
            MySqlParameter[] parameters = new MySqlParameter[]
            {
                new MySqlParameter("@p_UserId", expense.UserId),
                new MySqlParameter("@p_CategoryId", expense.CategoryId),
                new MySqlParameter("@p_Amount", expense.Amount),
                new MySqlParameter("@p_Date", expense.Date),
                new MySqlParameter("@p_Description", expense.Description ?? (object)DBNull.Value)
            };

            var result = _dbHelper.ExecuteScalar("sp_AddExpense", parameters);
            return result != null ? Convert.ToInt32(result) : throw new Exception("Failed to add expense: null result");
        }
        catch (Exception ex)
        {
            throw new Exception("Error adding expense", ex);
        }
    }

    public List<Expense> GetExpensesByDateRange(int userId, DateTime startDate, DateTime endDate)
    {
        try
        {
            MySqlParameter[] parameters = new MySqlParameter[]
            {
                new MySqlParameter("@p_UserId", userId),
                new MySqlParameter("@p_StartDate", startDate),
                new MySqlParameter("@p_EndDate", endDate)
            };

            DataTable dataTable = _dbHelper.ExecuteStoredProcedure("sp_GetExpensesByDateRange", parameters);

            return dataTable.Rows.Cast<DataRow>()
                .Select(row => new Expense
                {
                    ExpenseId = Convert.ToInt32(row["ExpenseId"]),
                    Amount = Convert.ToDecimal(row["Amount"]),
                    Date = Convert.ToDateTime(row["Date"]),
                    Description = row["Description"]?.ToString() ?? string.Empty,
                    CategoryId = Convert.ToInt32(row["CategoryId"]),
                    UserId = userId
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("Error retrieving expenses", ex);
        }
    }

    public List<ExpenseSummary> GetExpenseSummary(int userId, int month, int year)
    {
        try
        {
            MySqlParameter[] parameters = new MySqlParameter[]
            {
                new MySqlParameter("@p_UserId", userId),
                new MySqlParameter("@p_Month", month),
                new MySqlParameter("@p_Year", year)
            };

            DataTable dataTable = _dbHelper.ExecuteStoredProcedure("sp_GetExpenseSummary", parameters);

            return dataTable.Rows.Cast<DataRow>()
                .Select(row => new ExpenseSummary
                {
                    CategoryId = Convert.ToInt32(row["CategoryId"]),
                    CategoryName = row["CategoryName"]?.ToString() ?? "Unknown",
                    MonthlyBudget = Convert.ToDecimal(row["MonthlyBudget"]),
                    TotalExpenses = Convert.ToDecimal(row["TotalExpenses"]),
                    RemainingBudget = Convert.ToDecimal(row["RemainingBudget"])
                }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("Error retrieving expense summary", ex);
        }
    }
}