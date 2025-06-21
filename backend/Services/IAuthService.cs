public interface IAuthService
{
    AuthResponse? Authenticate(LoginRequest model);
    bool Register(RegisterRequest model);
}