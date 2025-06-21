using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpensesController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpPost]
    public IActionResult AddExpense([FromBody] Expense expense)
    {
        try
        {
            var expenseId = _expenseService.AddExpense(expense);
            return Ok(new { ExpenseId = expenseId });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("history")]
    public IActionResult GetExpenseHistory([FromQuery] int userId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var expenses = _expenseService.GetExpensesByDateRange(userId, startDate, endDate);
            return Ok(expenses);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("summary")]
    public IActionResult GetSummary([FromQuery] int userId, [FromQuery] int month, [FromQuery] int year)
    {
        try
        {
            var summary = _expenseService.GetExpenseSummary(userId, month, year);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}