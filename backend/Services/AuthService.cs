using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.Data;
using System.Security.Cryptography;

public class AuthService : IAuthService
{
    private readonly DatabaseHelper _dbHelper;
    private readonly IConfiguration _configuration;

    public AuthService(DatabaseHelper dbHelper, IConfiguration configuration)
    {
        _dbHelper = dbHelper;
        _configuration = configuration;
    }

    public AuthResponse? Authenticate(LoginRequest model)
    {
        MySqlParameter[] parameters = new MySqlParameter[]
        {
            new MySqlParameter("@p_Email", model.Email)
        };

        DataTable dataTable = _dbHelper.ExecuteStoredProcedure("sp_GetUserByEmail", parameters);
        
        if (dataTable.Rows.Count == 0)
            return null;

        var user = dataTable.Rows.Cast<DataRow>()
            .Select(row => new User
            {
                UserId = Convert.ToInt32(row["UserId"]),
                UserName = row["UserName"].ToString() ?? string.Empty,
                Email = row["Email"].ToString() ?? string.Empty,
                PasswordHash = row["PasswordHash"].ToString() ?? string.Empty
            }).First();

        if (!VerifyPassword(model.Password, user.PasswordHash))
            return null;

        var token = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = token,
            UserId = user.UserId,
            UserName = user.UserName
        };
    }

    public bool Register(RegisterRequest model)
    {
        try
        {
            string passwordHash = HashPassword(model.Password);

            MySqlParameter[] parameters = new MySqlParameter[]
            {
                new MySqlParameter("@p_UserName", model.UserName),
                new MySqlParameter("@p_Email", model.Email),
                new MySqlParameter("@p_PasswordHash", passwordHash)
            };

            _dbHelper.ExecuteNonQuery("sp_AddUser", parameters);
            return true;
        }
        catch (Exception ex)
        {
            // Log the error
            Console.WriteLine($"Registration failed: {ex.Message}");
            return false;
        }
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] 
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key), 
                SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string HashPassword(string password)
    {
        // Generate a 16-byte salt using RandomNumberGenerator
        byte[] salt = RandomNumberGenerator.GetBytes(16);
        
        // Create the hash with 100,000 iterations using SHA-256
        using var pbkdf2 = new Rfc2898DeriveBytes(
            password, 
            salt, 
            100000, 
            HashAlgorithmName.SHA256);
        
        byte[] hash = pbkdf2.GetBytes(20);
        
        // Combine salt and hash
        byte[] hashBytes = new byte[36];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 20);
        
        return Convert.ToBase64String(hashBytes);
    }

    private bool VerifyPassword(string password, string storedHash)
{
    byte[] hashBytes = Convert.FromBase64String(storedHash);
    byte[] salt = new byte[16];
    Array.Copy(hashBytes, 0, salt, 0, 16);
    
    using var pbkdf2 = new Rfc2898DeriveBytes(
        password, 
        salt, 
        100000, 
        HashAlgorithmName.SHA256);
    
    byte[] hash = pbkdf2.GetBytes(20);
    
    for (int i = 0; i < 20; i++)
    {
        if (hashBytes[i + 16] != hash[i])
            return false;
    }
    return true;
}
}