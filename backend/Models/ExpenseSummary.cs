public class ExpenseSummary
{
    public int CategoryId { get; set; }
    public required string CategoryName { get; set; }
    public decimal MonthlyBudget { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal RemainingBudget { get; set; }
}