using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest model)
    {
        var response = _authService.Authenticate(model);
        if (response == null)
            return BadRequest(new { message = "Email or password is incorrect" });

        return Ok(response);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest model)
    {
        var success = _authService.Register(model);
        if (!success)
            return BadRequest(new { message = "Registration failed. Email may already exist." });

        return Ok(new { message = "Registration successful" });
    }
}