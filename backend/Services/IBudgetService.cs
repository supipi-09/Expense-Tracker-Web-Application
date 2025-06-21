public interface IBudgetService
{
    decimal GetMonthlyBudget(int userId, int categoryId);
    void UpdateBudget(Budget budget);
}