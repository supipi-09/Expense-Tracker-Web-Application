public interface IExpenseService
{
    int AddExpense(Expense expense);
    List<Expense> GetExpensesByDateRange(int userId, DateTime startDate, DateTime endDate);
    List<ExpenseSummary> GetExpenseSummary(int userId, int month, int year);
}