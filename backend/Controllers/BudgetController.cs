using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public IActionResult GetMonthlyBudget([FromQuery] int userId, [FromQuery] int categoryId)
    {
        try
        {
            var budget = _budgetService.GetMonthlyBudget(userId, categoryId);
            return Ok(new { MonthlyBudget = budget });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public IActionResult UpdateBudget([FromBody] Budget budget)
    {
        try
        {
            _budgetService.UpdateBudget(budget);
            return Ok(new { message = "Budget updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}